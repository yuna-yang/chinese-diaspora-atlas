'use client';
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import L from 'leaflet';
import Supercluster from 'supercluster';
import type { MapSnapshot, GeoMemory, GraphMemory } from './contracts';
import type { Locale } from '../../lib/contracts';
import type { VisitorPosition } from '../atlas/useVisitorLocation';
import { mapConfig } from '../atlas/map-config';
import { textOf, labels } from './ui';
import {
  viewportClusters,
  visibleLongitudes,
  nearestLongitude,
} from './geo-clusters';
export default function GeoCanvas({
  data,
  locale,
  selected,
  onSelect,
  onBlank,
  onPick,
  memory,
  graph,
  position,
  locationRevision,
}: {
  data: MapSnapshot;
  locale: Locale;
  selected: string | null;
  onSelect: (id: string) => void;
  onBlank: () => void;
  onPick: (ids: string[]) => void;
  memory: RefObject<GeoMemory>;
  graph: RefObject<GraphMemory>;
  position: VisitorPosition | null;
  locationRevision: number;
}) {
  const host = useRef<HTMLDivElement>(null),
    map = useRef<L.Map | null>(null),
    callbacks = useRef({ onSelect, onBlank, onPick });
  callbacks.current = { onSelect, onBlank, onPick };
  useEffect(() => {
    const config = mapConfig(),
      m = L.map(host.current!, {
        zoomControl: false,
        maxZoom: 12,
        minZoom: 2,
        worldCopyJump: true,
      }),
      layer = L.layerGroup().addTo(m);
    map.current = m;
    L.tileLayer(config.url, {
      attribution: `<a href="${config.attributionUrl}" target="_blank" rel="noreferrer">${config.attributionText}</a>`,
      maxZoom: 19,
    }).addTo(m);
    m.attributionControl.setPrefix(false);
    const features = data.nodes.flatMap((n) =>
      n.locations
        .filter((l) => l.latitude !== null && l.longitude !== null)
        .map((l) => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [l.longitude!, l.latitude!],
          },
          properties: { id: n.id },
        })),
    );
    const index = new Supercluster<{ id: string }>({
      radius: 44,
      maxZoom: 12,
    }).load(features);
    let suppressUntil = 0;
    let animateEntry = true;
    const save = () => {
      const c = m.getCenter();
      memory.current.viewport = {
        latitude: c.lat,
        longitude: c.lng,
        zoom: m.getZoom(),
      };
      memory.current.origins = {};
      for (const f of features) {
        const p = m.latLngToContainerPoint([
          f.geometry.coordinates[1],
          nearestLongitude(f.geometry.coordinates[0], c.lng),
        ]);
        memory.current.origins[f.properties.id] = { x: p.x, y: p.y };
      }
    };
    const render = () => {
      layer.clearLayers();
      const b = m.getBounds(),
        clusters = viewportClusters(
          index,
          {
            west: b.getWest(),
            south: b.getSouth(),
            east: b.getEast(),
            north: b.getNorth(),
          },
          m.getZoom(),
        );
      for (const f of clusters) {
        const p = f.properties,
          cluster = 'cluster' in p && p.cluster,
          ids = cluster
            ? index
                .getLeaves((p as { cluster_id: number }).cluster_id, Infinity)
                .map((l) => l.properties.id)
            : [(p as { id: string }).id],
          unique = [...new Set(ids)],
          node = data.nodes.find((n) => n.id === unique[0]);
        for (const longitude of visibleLongitudes(
          f.geometry.coordinates[0],
          b.getWest(),
          b.getEast(),
        )) {
          const button = document.createElement('button');
          button.className =
            'star-button geo-star' +
            (unique.includes(selected ?? '') ? ' selected' : '');
          button.textContent = '✦';
          button.setAttribute(
            'aria-label',
            unique.length === 1 && node
              ? textOf(node.names, locale)
              : `${labels[locale].picker} (${unique.length})`,
          );
          if (unique.length === 1) button.dataset.node = unique[0];
          if (unique.length > 1) {
            const count = document.createElement('small');
            count.textContent = String(unique.length);
            button.append(count);
          }
          L.DomEvent.disableClickPropagation(button);
          L.DomEvent.disableScrollPropagation(button);
          button.addEventListener('click', () => {
            if (unique.length === 1) callbacks.current.onSelect(unique[0]);
            else if (m.getZoom() < 12)
              m.setView(
                [f.geometry.coordinates[1], longitude],
                Math.min(
                  12,
                  index.getClusterExpansionZoom(
                    (p as { cluster_id: number }).cluster_id,
                  ),
                ),
              );
            else callbacks.current.onPick(unique);
          });
          L.marker([f.geometry.coordinates[1], longitude], {
            icon: L.divIcon({
              html: button,
              className: 'star-marker',
              iconSize: [44, 44],
              iconAnchor: [22, 22],
            }),
            keyboard: false,
          }).addTo(layer);
        }
      }
      if (m.getZoom() >= 4) {
        for (const e of data.links.slice(0, 200)) {
          const anchors = (id: string, city: string | null) => {
              const n = data.nodes.find((n) => n.id === id),
                ls =
                  n?.locations.filter(
                    (l) => l.latitude !== null && l.longitude !== null,
                  ) ?? [];
              return city
                ? ls.find((l) => l.cityId === city)
                : ls.length === 1
                  ? ls[0]
                  : null;
            },
            a = anchors(e.sourceId, e.sourceCityId),
            b = anchors(e.targetId, e.targetCityId);
          if (
            a &&
            b &&
            (a.latitude !== b.latitude || a.longitude !== b.longitude)
          )
            L.polyline(
              [
                [
                  a.latitude!,
                  nearestLongitude(a.longitude!, m.getCenter().lng),
                ],
                [
                  b.latitude!,
                  nearestLongitude(
                    b.longitude!,
                    nearestLongitude(a.longitude!, m.getCenter().lng),
                  ),
                ],
              ],
              { color: '#796850', weight: 1, opacity: 0.5, interactive: false },
            ).addTo(layer);
        }
      }
      if (
        animateEntry &&
        !matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        host.current
          ?.querySelectorAll<HTMLElement>('.geo-star[data-node]')
          .forEach((el) => {
            const from = graph.current.origins?.[el.dataset.node!];
            if (!from) return;
            const r = el.getBoundingClientRect();
            el.animate(
              [
                {
                  translate: `${from.x - r.left - 22}px ${from.y - r.top - 22}px`,
                  opacity: 0.5,
                },
                { translate: '0 0', opacity: 1 },
              ],
              { duration: 650, easing: 'ease-out' },
            );
          });
      }
      animateEntry = false;
      save();
    };
    const remembered = memory.current.viewport;
    if (remembered)
      m.setView([remembered.latitude, remembered.longitude], remembered.zoom);
    else if (features.length)
      m.fitBounds(
        L.latLngBounds(
          features.map((f) =>
            L.latLng(f.geometry.coordinates[1], f.geometry.coordinates[0]),
          ),
        ),
        { padding: [80, 80], maxZoom: 6 },
      );
    else m.setView([30, 10], 2);
    render();
    m.on('moveend', render);
    m.on('dragstart zoomstart', () => {
      suppressUntil = Infinity;
    });
    m.on('dragend zoomend', () => {
      suppressUntil = Date.now() + 250;
    });
    m.on('click', () => {
      if (Date.now() > suppressUntil) callbacks.current.onBlank();
    });
    return () => {
      save();
      m.remove();
      map.current = null;
    };
  }, [data, locale, selected, memory, graph]);
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    if (!position) {
      if (locationRevision > 0 && memory.current.viewport === null) {
        const coords = data.nodes.flatMap((n) =>
          n.locations
            .filter((l) => l.latitude !== null && l.longitude !== null)
            .map((l) => L.latLng(l.latitude!, l.longitude!)),
        );
        if (coords.length)
          m.fitBounds(L.latLngBounds(coords), {
            padding: [80, 80],
            maxZoom: 6,
          });
        else m.setView([30, 10], 2);
      }
      return;
    }
    const visitor = L.marker([position.latitude, position.longitude], {
        icon: L.divIcon({
          className: 'visitor-marker',
          html: '<span></span>',
          iconSize: [18, 18],
        }),
        interactive: false,
        keyboard: false,
      }).addTo(m),
      circle = L.circle([position.latitude, position.longitude], {
        radius: Math.min(position.accuracy, 100000),
        color: '#326d94',
        weight: 1,
        fillOpacity: 0.07,
        interactive: false,
      }).addTo(m);
    if (memory.current.handledLocation !== locationRevision) {
      memory.current.handledLocation = locationRevision;
      m.setView([position.latitude, position.longitude], 9);
    }
    return () => {
      visitor.remove();
      circle.remove();
    };
  }, [position, locationRevision, data, locale, selected, memory]);
  return (
    <>
      {' '}
      <div
        ref={host}
        className="geo-canvas"
        role="region"
        aria-label={locale === 'en' ? 'Geographical map' : '地理地图'}
      />
      <div className="map-tools">
        <button
          className="floating"
          aria-label={locale === 'en' ? 'Zoom in' : '放大'}
          onClick={() => map.current?.zoomIn(1, { animate: false })}
        >
          +
        </button>
        <button
          className="floating"
          aria-label={locale === 'en' ? 'Zoom out' : '缩小'}
          onClick={() => map.current?.zoomOut(1, { animate: false })}
        >
          −
        </button>
        <button
          className="floating"
          aria-label={locale === 'en' ? 'Reset map' : '重置地图'}
          onClick={() => {
            const m = map.current;
            if (!m) return;
            const coords = data.nodes.flatMap((n) =>
              n.locations
                .filter((l) => l.latitude !== null && l.longitude !== null)
                .map((l) => L.latLng(l.latitude!, l.longitude!)),
            );
            if (coords.length)
              m.fitBounds(L.latLngBounds(coords), {
                padding: [80, 80],
                maxZoom: 6,
              });
            else m.setView([30, 10], 2);
          }}
        >
          ↺
        </button>
      </div>
    </>
  );
}
