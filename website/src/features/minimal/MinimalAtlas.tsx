'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Locale } from '../../lib/contracts';
import type { MapSnapshot, GeoMemory, GraphMemory } from './contracts';
import { parseViewState, viewUrl, type ViewState } from './state';
import { labels, textOf } from './ui';
import { publicPath } from '../../lib/paths';
import { useVisitorLocation } from '../atlas/useVisitorLocation';
import { ProfilePanel, AboutPanel } from './Panels';
const GeoCanvas = dynamic(() => import('./GeoCanvas'), { ssr: false }),
  GraphCanvas = dynamic(() => import('./GraphCanvas'), { ssr: false });
export default function MinimalAtlas({
  locale,
  initialAbout = false,
  initialSelectedId = null,
}: {
  locale: Locale;
  initialAbout?: boolean;
  initialSelectedId?: string | null;
}) {
  const [state, setState] = useState<ViewState>({
      locale,
      view: 'scatter',
      about: initialAbout,
      selectedId: initialSelectedId,
    }),
    [data, setData] = useState<MapSnapshot | null>(null),
    [error, setError] = useState(false),
    [retry, setRetry] = useState(0),
    [pick, setPick] = useState<string[] | null>(null),
    [locationRevision, setLocationRevision] = useState(0);
  const geo = useRef<GeoMemory>({
      viewport: null,
      handledLocation: -1,
      origins: {},
    }),
    graph = useRef<GraphMemory>({
      version: '',
      positions: [],
      camera: { x: 0, y: 0, k: 1 },
      dragged: new Set(),
      moved: false,
    }),
    title = useRef<HTMLButtonElement>(null);
  const located = useCallback(() => setLocationRevision((v) => v + 1), []),
    location = useVisitorLocation(located),
    t = labels[state.locale];
  const change = useCallback((patch: Partial<ViewState>) => {
    setState((old) => {
      const next = { ...old, ...patch };
      history.pushState(null, '', viewUrl(next));
      return next;
    });
    setPick(null);
  }, []);
  useEffect(() => {
    let live = true;
    setError(false);
    fetch(publicPath('/data/map.json'))
      .then((r) => {
        if (!r.ok) throw Error('snapshot');
        return r.json();
      })
      .then((snapshot: MapSnapshot) => {
        if (!live) return;
        if (
          snapshot.schemaVersion !== 1 ||
          !Array.isArray(snapshot.nodes) ||
          !Array.isArray(snapshot.links)
        )
          throw Error('snapshot');
        setData(snapshot);
        const parsed = parseViewState(
          locationPath(),
          new URLSearchParams(window.location.search),
          snapshot.nodes.map((n) => n.id),
        );
        if (initialAbout) {
          parsed.about = true;
          parsed.selectedId = null;
        } else if (
          initialSelectedId &&
          !parsed.selectedId &&
          snapshot.nodes.some((n) => n.id === initialSelectedId)
        )
          parsed.selectedId = initialSelectedId;
        setState(parsed);
        history.replaceState(null, '', viewUrl(parsed));
      })
      .catch(() => {
        if (live) setError(true);
      });
    return () => {
      live = false;
    };
  }, [retry, initialAbout, initialSelectedId]);
  useEffect(() => {
    document.documentElement.lang = state.locale;
    document.title =
      state.locale === 'en'
        ? 'Scattered Stars · 星散'
        : '星散 · Scattered Stars';
  }, [state.locale]);
  useEffect(() => {
    const pop = () => {
      if (data)
        setState(
          parseViewState(
            locationPath(),
            new URLSearchParams(window.location.search),
            data.nodes.map((n) => n.id),
          ),
        );
      setPick(null);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        change({ about: false, selectedId: null });
        setPick(null);
        title.current?.focus();
      }
    };
    window.addEventListener('popstate', pop);
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('popstate', pop);
      window.removeEventListener('keydown', key);
    };
  }, [data, change]);
  const select = (id: string) => change({ selectedId: id, about: false }),
    blank = () => {
      if (state.selectedId || pick) change({ selectedId: null });
    },
    node = data?.nodes.find((n) => n.id === state.selectedId);
  return (
    <main className={`minimal-atlas ${state.view}`}>
      <div className="canvas-stage" inert={state.about ? true : undefined}>
        {data &&
          (state.view === 'scatter' ? (
            <GeoCanvas
              data={data}
              locale={state.locale}
              selected={state.selectedId}
              onSelect={select}
              onBlank={blank}
              onPick={setPick}
              memory={geo}
              graph={graph}
              position={location.position}
              locationRevision={locationRevision}
            />
          ) : (
            <GraphCanvas
              data={data}
              locale={state.locale}
              selected={state.selectedId}
              onSelect={select}
              onBlank={blank}
              memory={graph}
              geo={geo}
            />
          ))}
      </div>
      <div className="atlas-controls">
        <button
          ref={title}
          className="atlas-title floating"
          aria-label={state.view === 'scatter' ? t.gather : t.scatter}
          onClick={() =>
            change({ view: state.view === 'scatter' ? 'gather' : 'scatter' })
          }
        >
          星星<strong>{state.view === 'scatter' ? '散' : '聚'}</strong>
          <span aria-hidden="true">
            {state.view === 'scatter' ? ' ⤢' : ' ⤡'}
          </span>
        </button>
        <button
          className="floating"
          onClick={() => change({ about: true, selectedId: null })}
        >
          {t.about}
        </button>
      </div>
      <div className="utility-controls">
        <button
          className="floating locate-button"
          aria-label={t.locate}
          disabled={location.status === 'locating'}
          onClick={() => {
            change({ view: 'scatter' });
            location.request();
          }}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="6" />
            <path d="M12 1v5m0 12v5M1 12h5m12 0h5" />
            <circle cx="12" cy="12" r="1" />
          </svg>
        </button>
        {location.position && (
          <button
            className="floating"
            aria-label={t.clear}
            onClick={() => {
              location.clear();
              geo.current.viewport = null;
              geo.current.handledLocation = -1;
              setLocationRevision((v) => v + 1);
            }}
          >
            ⊗
          </button>
        )}
        <button
          className="floating"
          aria-label={
            state.locale === 'en'
              ? 'EN/CN: switch to Simplified Chinese'
              : 'EN/CN：切换至英语'
          }
          onClick={() =>
            change({ locale: state.locale === 'en' ? 'zh-CN' : 'en' })
          }
        >
          <span className={state.locale === 'en' ? 'active-language' : ''}>
            EN
          </span>
          /
          <span className={state.locale === 'zh-CN' ? 'active-language' : ''}>
            CN
          </span>
        </button>
      </div>
      {data?.demo && <small className="demo-note floating">{t.demo}</small>}
      <div role="status" className="status-note">
        {error ? (
          <>
            {t.error}{' '}
            <button onClick={() => setRetry((v) => v + 1)}>{t.retry}</button>
          </>
        ) : !data ? (
          t.loading
        ) : !data.nodes.length ? (
          t.empty
        ) : location.status === 'locating' ? (
          t.locating
        ) : location.status === 'error' ? (
          t.locationError
        ) : location.position ? (
          t.privacy
        ) : null}
      </div>
      <button
        className="star-picker-trigger"
        onClick={() => setPick(data?.nodes.map((n) => n.id) ?? [])}
      >
        {t.picker}
      </button>
      {pick && (
        <section className="star-picker floating" aria-label={t.picker}>
          <button aria-label={t.close} onClick={() => setPick(null)}>
            ×
          </button>
          {pick.map((id) => {
            const n = data?.nodes.find((n) => n.id === id);
            return (
              n && (
                <button key={id} onClick={() => select(id)}>
                  {textOf(n.names, state.locale)}
                </button>
              )
            );
          })}
        </section>
      )}
      {node && !state.about && data && (
        <ProfilePanel
          key={node.id}
          node={node}
          data={data}
          locale={state.locale}
          close={() => change({ selectedId: null })}
        />
      )}{' '}
      {state.about && (
        <AboutPanel
          locale={state.locale}
          demo={data?.demo ?? false}
          close={() => change({ about: false })}
        />
      )}
    </main>
  );
}
function locationPath() {
  return window.location.pathname;
}
