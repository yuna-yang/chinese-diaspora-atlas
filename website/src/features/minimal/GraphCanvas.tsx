'use client';
import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { MapSnapshot, GraphMemory, GeoMemory, Point } from './contracts';
import type { Locale } from '../../lib/contracts';
import { labels, textOf } from './ui';
import { seedPositions } from './graph-seed';
import { fitCamera, screenToWorld, zoomAt } from './camera';
export default function GraphCanvas({
  data,
  locale,
  selected,
  onSelect,
  onBlank,
  memory,
  geo,
}: {
  data: MapSnapshot;
  locale: Locale;
  selected: string | null;
  onSelect: (id: string) => void;
  onBlank: () => void;
  memory: RefObject<GraphMemory>;
  geo: RefObject<GeoMemory>;
}) {
  const host = useRef<HTMLDivElement>(null),
    scene = useRef<HTMLDivElement>(null),
    edgeGroup = useRef<SVGGElement>(null),
    [points, setPoints] = useState<Point[]>(() =>
      memory.current.version === data.datasetVersion
        ? memory.current.positions
        : seedPositions(data.nodes),
    ),
    [reset, setReset] = useState(0);
  const gestures = useRef(new Map<number, { x: number; y: number }>()),
    drag = useRef<{
      id: string | null;
      x: number;
      y: number;
      lastX: number;
      lastY: number;
      moved: boolean;
    } | null>(null),
    worker = useRef<Worker | null>(null);
  const arriving = useRef(true);
  const apply = () => {
    const c = memory.current.camera;
    if (scene.current) {
      scene.current.style.transform = `translate(${c.x}px,${c.y}px) scale(${c.k})`;
      scene.current.style.setProperty('--inverse', String(1 / c.k));
    }
    edgeGroup.current?.setAttribute(
      'transform',
      `translate(${c.x},${c.y}) scale(${c.k})`,
    );
  };
  useEffect(() => {
    const h = host.current!;
    const size = () => {
      if (!memory.current.moved)
        memory.current.camera = fitCamera(
          memory.current.positions,
          h.clientWidth,
          h.clientHeight,
        );
      apply();
    };
    if (memory.current.version !== data.datasetVersion) {
      memory.current = {
        version: data.datasetVersion,
        positions: seedPositions(data.nodes),
        camera: fitCamera(
          seedPositions(data.nodes),
          h.clientWidth,
          h.clientHeight,
        ),
        dragged: new Set(),
        moved: false,
      };
    }
    setPoints([...memory.current.positions]);
    apply();
    let live = true;
    let w: Worker | null = null;
    if (!memory.current.settled) {
      try {
        w = new Worker(new URL('./graph.worker.ts', import.meta.url), {
          type: 'module',
        });
      } catch {
        /* Deterministic seed layout remains usable without workers. */
      }
    }
    worker.current = w;
    if (w)
      w.onmessage = (e: MessageEvent<Point[]>) => {
        if (!live) return;
        const retained = new Map(
          memory.current.positions
            .filter((p) => memory.current.dragged.has(p.id))
            .map((p) => [p.id, p]),
        );
        memory.current.positions = e.data.map((p) => retained.get(p.id) ?? p);
        memory.current.settled = true;
        size();
        setPoints([...memory.current.positions]);
      };
    w?.postMessage({
      nodes: data.nodes.map((n) => ({ id: n.id })),
      links: data.links.map((l) => ({
        sourceId: l.sourceId,
        targetId: l.targetId,
      })),
    });
    const ro = new ResizeObserver(size);
    ro.observe(h);
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = h.getBoundingClientRect();
      memory.current.camera = zoomAt(
        memory.current.camera,
        {
          x: e.clientX - r.left - r.width / 2,
          y: e.clientY - r.top - r.height / 2,
        },
        Math.exp(-e.deltaY * 0.001),
      );
      memory.current.moved = true;
      apply();
    };
    h.addEventListener('wheel', wheel, { passive: false });
    return () => {
      live = false;
      w?.terminate();
      memory.current.origins = Object.fromEntries(
        memory.current.positions.map((p) => [
          p.id,
          {
            x:
              h.clientWidth / 2 +
              memory.current.camera.x +
              p.x * memory.current.camera.k,
            y:
              h.clientHeight / 2 +
              memory.current.camera.y +
              p.y * memory.current.camera.k,
          },
        ]),
      );
      ro.disconnect();
      h.removeEventListener('wheel', wheel);
    };
    // Layout depends on dataset/reset; locale and selection must not restart it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.datasetVersion, reset]);
  useEffect(() => {
    apply();
    if (!arriving.current) return;
    arriving.current = false;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const h = host.current!,
      c = memory.current.camera;
    h.querySelectorAll<HTMLElement>('[data-node]').forEach((el) => {
      const p = memory.current.positions.find((p) => p.id === el.dataset.node);
      if (!p) return;
      const from = geo.current.origins[p.id] ?? {
          x: h.clientWidth / 2,
          y: h.clientHeight / 2,
        },
        to = {
          x: h.clientWidth / 2 + c.x + p.x * c.k,
          y: h.clientHeight / 2 + c.y + p.y * c.k,
        };
      el.animate(
        [
          {
            translate: `${(from.x - to.x) / c.k}px ${(from.y - to.y) / c.k}px`,
            opacity: 0.5,
          },
          {
            translate: `${(h.clientWidth / 2 - to.x) / c.k}px ${(h.clientHeight / 2 - to.y) / c.k}px`,
            opacity: 1,
            offset: 0.42,
          },
          { translate: '0 0', opacity: 1 },
        ],
        { duration: 650, easing: 'ease-in-out' },
      );
    });
  });
  const position = (id: string, x: number, y: number) => {
    const p = memory.current.positions.find((p) => p.id === id);
    if (!p) return;
    p.x = x;
    p.y = y;
    const el = host.current?.querySelector<HTMLElement>(`[data-node="${id}"]`);
    if (el) {
      el.style.left = `calc(50% + ${x}px)`;
      el.style.top = `calc(50% + ${y}px)`;
    }
    host.current
      ?.querySelectorAll<SVGLineElement>(
        `line[data-source="${id}"],line[data-target="${id}"]`,
      )
      .forEach((line) => {
        const source = line.dataset.source === id;
        line.setAttribute(source ? 'x1' : 'x2', String(x));
        line.setAttribute(source ? 'y1' : 'y2', String(y));
      });
  };
  const local = (x: number, y: number) => {
    const r = host.current!.getBoundingClientRect();
    return { x: x - r.left - r.width / 2, y: y - r.top - r.height / 2 };
  };
  const pointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement,
      id = target.closest<HTMLElement>('[data-node]')?.dataset.node ?? null;
    gestures.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (gestures.current.size === 1)
      drag.current = {
        id,
        x: e.clientX,
        y: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        moved: false,
      };
    else if (drag.current) {
      drag.current.moved = true;
      drag.current.id = null;
    }
    host.current!.setPointerCapture(e.pointerId);
  };
  const pointerMove = (e: React.PointerEvent) => {
    const prev = gestures.current.get(e.pointerId);
    if (!prev) return;
    const d = drag.current;
    const all = [...gestures.current.entries()];
    if (all.length === 2) {
      const other = all.find(([id]) => id !== e.pointerId)![1],
        before = Math.hypot(prev.x - other.x, prev.y - other.y),
        after = Math.hypot(e.clientX - other.x, e.clientY - other.y),
        mid = local((prev.x + other.x) / 2, (prev.y + other.y) / 2);
      if (before > 0)
        memory.current.camera = zoomAt(
          memory.current.camera,
          mid,
          after / before,
        );
      memory.current.camera.x += (e.clientX - prev.x) / 2;
      memory.current.camera.y += (e.clientY - prev.y) / 2;
      memory.current.moved = true;
      apply();
    } else if (d) {
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6) d.moved = true;
      if (d.moved) {
        if (d.id) {
          const p = screenToWorld(
            local(e.clientX, e.clientY),
            memory.current.camera,
          );
          position(d.id, p.x, p.y);
          memory.current.dragged.add(d.id);
        } else {
          memory.current.camera.x += e.clientX - d.lastX;
          memory.current.camera.y += e.clientY - d.lastY;
          apply();
        }
        memory.current.moved = true;
      }
      d.lastX = e.clientX;
      d.lastY = e.clientY;
    }
    gestures.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
  };
  const pointerUp = (e: React.PointerEvent) => {
    if (!gestures.current.has(e.pointerId)) return;
    gestures.current.delete(e.pointerId);
    if (gestures.current.size) {
      const remaining = [...gestures.current.values()][0];
      if (drag.current) {
        drag.current.lastX = remaining.x;
        drag.current.lastY = remaining.y;
      }
      return;
    }
    const d = drag.current;
    drag.current = null;
    if (!d?.moved && e.type !== 'pointercancel') {
      if (d?.id) onSelect(d.id);
      else onBlank();
    }
  };
  const positions = new Map(points.map((p) => [p.id, p]));
  return (
    <div
      ref={host}
      className="graph-canvas"
      role="region"
      aria-label={locale === 'en' ? 'Gathered stars' : '聚星图'}
      tabIndex={0}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerUp}
      onPointerCancel={pointerUp}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        const c = memory.current.camera;
        if (e.key === '+' || e.key === '=')
          memory.current.camera = zoomAt(c, { x: 0, y: 0 }, 1.2);
        else if (e.key === '-')
          memory.current.camera = zoomAt(c, { x: 0, y: 0 }, 1 / 1.2);
        else if (e.key.startsWith('Arrow')) {
          c.x += e.key === 'ArrowLeft' ? 40 : e.key === 'ArrowRight' ? -40 : 0;
          c.y += e.key === 'ArrowUp' ? 40 : e.key === 'ArrowDown' ? -40 : 0;
        } else return;
        e.preventDefault();
        memory.current.moved = true;
        apply();
      }}
    >
      <svg className="graph-edges" aria-hidden="true">
        <g
          transform="translate(0,0)"
          style={{ translate: '50% 50%' }}
          ref={edgeGroup}
        >
          {data.links.map((l) => {
            const a = positions.get(l.sourceId),
              b = positions.get(l.targetId);
            return a && b ? (
              <line
                key={l.id}
                data-source={l.sourceId}
                data-target={l.targetId}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
              />
            ) : null;
          })}
        </g>
      </svg>
      <div className="graph-scene" ref={scene}>
        {data.nodes.map((n) => {
          const p = positions.get(n.id);
          return (
            p && (
              <button
                key={n.id}
                data-node={n.id}
                className={`graph-star star-button ${selected === n.id ? 'selected' : ''}`}
                aria-label={textOf(n.names, locale)}
                aria-pressed={selected === n.id}
                style={{
                  left: `calc(50% + ${p.x}px)`,
                  top: `calc(50% + ${p.y}px)`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (e.detail === 0) onSelect(n.id);
                }}
              >
                ✦
              </button>
            )
          );
        })}
      </div>
      <div className="map-tools">
        <button
          className="floating"
          aria-label={locale === 'en' ? 'Zoom in' : '放大'}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => {
            memory.current.camera = zoomAt(
              memory.current.camera,
              { x: 0, y: 0 },
              1.2,
            );
            memory.current.moved = true;
            apply();
          }}
        >
          +
        </button>
        <button
          className="floating"
          aria-label={locale === 'en' ? 'Zoom out' : '缩小'}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => {
            memory.current.camera = zoomAt(
              memory.current.camera,
              { x: 0, y: 0 },
              1 / 1.2,
            );
            memory.current.moved = true;
            apply();
          }}
        >
          −
        </button>
        <button
          className="floating"
          aria-label={labels[locale].reset}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => {
            memory.current.version = '';
            setReset((v) => v + 1);
          }}
        >
          ↺
        </button>
      </div>
    </div>
  );
}
