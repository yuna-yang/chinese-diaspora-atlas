'use client';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import Supercluster, { type ClusterProperties } from 'supercluster';
import 'leaflet/dist/leaflet.css';
import type {
  Dataset,
  Organization,
  Locale,
  Relationship,
} from '../../lib/contracts';
import { messages, localizedText } from '../../lib/i18n';
import { buildMarkers } from './markers';
import { mapConfig } from './map-config';
import { resolveRelationshipAnchors } from '../network/network';
import { networkMessages } from '../network/messages';
import { edgePresentation, visibleEdges } from '../network/edge-presentation';
import type { VisitorPosition } from './useVisitorLocation';
export interface MapProps {
  dataset: Dataset;
  records: Organization[];
  locale: Locale;
  selected: string | null;
  onSelect: (id: string) => void;
  position: VisitorPosition | null;
  fitRequest: number;
  relationships: Relationship[];
  selectedRelationship: string | null;
  onRelationshipSelect: (id: string) => void;
}
export default function MapClient({
  dataset,
  records,
  locale,
  selected,
  onSelect,
  position,
  fitRequest,
  relationships,
  selectedRelationship,
  onRelationshipSelect,
}: MapProps) {
  const element = useRef<HTMLDivElement>(null),
    mapRef = useRef<L.Map | null>(null),
    markersRef = useRef<L.LayerGroup | null>(null),
    visitorRef = useRef<L.LayerGroup | null>(null);
  const lastFit = useRef(0),
    lastSelection = useRef<string | null>(null);
  const [tileFailed, setTileFailed] = useState(false);
  const [zoom, setZoom] = useState(2);
  const t = messages(locale);
  useEffect(() => {
    if (!element.current) return;
    const map = L.map(element.current, {
      zoomControl: false,
      minZoom: 2,
      maxZoom: 12,
      worldCopyJump: true,
    }).setView([20, 0], 2);
    mapRef.current = map;
    map.on('zoomend', () => setZoom(map.getZoom()));
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    const config = mapConfig();
    const link = document.createElement('a');
    link.href = config.attributionUrl;
    link.textContent = config.attributionText;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    L.tileLayer(config.url, { attribution: link.outerHTML, maxZoom: 19 })
      .on('tileerror', () => setTileFailed(true))
      .addTo(map);
    markersRef.current = L.layerGroup().addTo(map);
    visitorRef.current = L.layerGroup().addTo(map);
    const resize = new ResizeObserver(() => map.invalidateSize());
    resize.observe(element.current);
    return () => {
      resize.disconnect();
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
      visitorRef.current = null;
    };
  }, []);
  useEffect(() => {
    const map = mapRef.current,
      layer = markersRef.current;
    if (!map || !layer) return;
    map.closePopup();
    const markers = buildMarkers(records, dataset.reference_data);
    const index = new Supercluster<
      { organizationId: string },
      Record<string, never>
    >({ radius: 44, maxZoom: 12 });
    index.load(
      markers.map((m) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [m.longitude, m.latitude] },
        properties: { organizationId: m.organizationId },
      })),
    );
    const openList = (ids: string[], at: L.LatLngExpression) => {
      const list = document.createElement('div');
      list.className = 'cluster-list';
      [...new Set(ids)].forEach((id) => {
        const record = records.find((o) => o.id === id);
        if (!record) return;
        const b = document.createElement('button');
        b.textContent = localizedText(record.names, locale).text;
        b.addEventListener('click', () => {
          onSelect(id);
          map.closePopup();
        });
        list.append(b);
      });
      L.popup().setLatLng(at).setContent(list).openOn(map);
    };
    const render = () => {
      layer.clearLayers();
      const zoom = Math.round(map.getZoom());
      for (const p of index.getClusters([-180, -85, 180, 85], zoom)) {
        const [lng, lat] = p.geometry.coordinates;
        const cluster = 'cluster' in p.properties && p.properties.cluster;
        const count = cluster
          ? (p.properties as ClusterProperties).point_count
          : 1;
        const ids = cluster
          ? index
              .getLeaves(
                (p.properties as ClusterProperties).cluster_id,
                Infinity,
              )
              .map((x) => x.properties.organizationId)
          : [(p.properties as { organizationId: string }).organizationId];
        const button = document.createElement('button');
        button.className = `map-pin ${cluster ? 'cluster-pin' : ''} ${ids.includes(selected ?? '') ? 'selected-pin' : ''}`;
        const isInstitution =
          !cluster &&
          records.find((o) => o.id === ids[0])?.kind === 'institution';
        if (isInstitution) button.classList.add('institution-pin');
        button.textContent = cluster
          ? String(count)
          : isInstitution
            ? '▣'
            : '✳';
        button.setAttribute(
          'aria-label',
          cluster
            ? `${count} ${networkMessages(locale).all}`
            : localizedText(records.find((o) => o.id === ids[0])!.names, locale)
                .text,
        );
        const marker = L.marker([lat, lng], {
          icon: L.divIcon({
            html: button,
            className: 'atlas-marker',
            iconSize: [44, 44],
            iconAnchor: [22, 22],
          }),
          keyboard: false,
        }).addTo(layer);
        button.addEventListener('click', () => {
          if (cluster && zoom < 12) {
            const next = index.getClusterExpansionZoom(
              (p.properties as ClusterProperties).cluster_id,
            );
            map.setView([lat, lng], Math.min(12, next));
          } else {
            openList(ids, [lat, lng]);
          }
        });
        marker.on('click', () => {});
      }
    };
    render();
    map.on('zoomend', render);
    return () => {
      map.off('zoomend', render);
      layer.clearLayers();
    };
  }, [records, dataset.reference_data, locale, onSelect, selected, t.matching]);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const layer = L.layerGroup().addTo(map);
    for (const e of visibleEdges(relationships, zoom, selectedRelationship)) {
      const anchors = resolveRelationshipAnchors(
        e,
        dataset.organizations,
        dataset.reference_data,
      );
      if (!anchors || anchors.sourceCityId === anchors.targetCityId) continue;
      const source = dataset.reference_data.cities.find(
          (c) => c.id === anchors.sourceCityId,
        )!,
        target = dataset.reference_data.cities.find(
          (c) => c.id === anchors.targetCityId,
        )!;
      const line = L.polyline(
        [
          [source.latitude, source.longitude],
          [target.latitude, target.longitude],
        ],
        {
          ...edgePresentation(e),
          weight: selectedRelationship === e.id ? 4 : 2,
        },
      ).addTo(layer);
      const name = localizedText(e.descriptions, locale).text;
      line.bindTooltip(name);
      line.on('click', () => onRelationshipSelect(e.id));
      const button = document.createElement('button');
      button.className = 'edge-control';
      button.textContent = e.direction === 'directed' ? '→' : '↔';
      button.setAttribute(
        'aria-label',
        networkMessages(locale).select + ': ' + name,
      );
      button.addEventListener('click', () => onRelationshipSelect(e.id));
      if (e.direction === 'directed') {
        const angle =
          (Math.atan2(
            -(target.latitude - source.latitude),
            target.longitude - source.longitude,
          ) *
            180) /
          Math.PI;
        button.style.transform = `rotate(${angle}deg)`;
      }
      L.marker(
        [
          (source.latitude + target.latitude) / 2,
          (source.longitude + target.longitude) / 2,
        ],
        {
          icon: L.divIcon({
            html: button,
            className: 'relationship-marker',
            iconSize: [44, 44],
            iconAnchor: [22, 22],
          }),
          keyboard: false,
        },
      ).addTo(layer);
    }
    return () => {
      layer.remove();
    };
  }, [
    relationships,
    dataset,
    locale,
    selectedRelationship,
    onRelationshipSelect,
    zoom,
  ]);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || selected === lastSelection.current) return;
    lastSelection.current = selected;
    const record = records.find((o) => o.id === selected);
    if (!record) return;
    const points = buildMarkers([record], dataset.reference_data);
    if (points.length)
      map.fitBounds(
        L.latLngBounds(
          points.map((p) => [p.latitude, p.longitude] as L.LatLngTuple),
        ),
        { padding: [50, 50], maxZoom: 10 },
      );
  }, [selected, records, dataset.reference_data]);
  useEffect(() => {
    const map = mapRef.current,
      layer = visitorRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    if (position) {
      const { latitude, longitude, accuracy } = position;
      L.circle([latitude, longitude], {
        radius: accuracy,
        color: '#315cdf',
        weight: 1,
        fillOpacity: 0.12,
        interactive: false,
      }).addTo(layer);
      const node = document.createElement('div');
      node.className = 'visitor-dot';
      node.setAttribute('aria-label', t.yourLocation);
      L.marker([latitude, longitude], {
        icon: L.divIcon({
          html: node,
          className: 'visitor-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
        keyboard: false,
      })
        .bindTooltip(t.yourLocation)
        .addTo(layer);
      map.setView([latitude, longitude], accuracy > 5000 ? 6 : 10);
    }
  }, [position, t.yourLocation]);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || fitRequest === 0 || fitRequest === lastFit.current) return;
    lastFit.current = fitRequest;
    const markers = buildMarkers(records, dataset.reference_data);
    if (markers.length)
      map.fitBounds(
        L.latLngBounds(
          markers.map((m) => [m.latitude, m.longitude] as L.LatLngTuple),
        ),
        { padding: [50, 50], maxZoom: 10 },
      );
  }, [fitRequest, records, dataset.reference_data]);
  return (
    <>
      <div className="map-legend">
        {locale === 'zh-CN'
          ? '社群 ✳ · 机构 ▣ · 凝聚 ━ · 桥接 ┄ · 连接 ┈ · 混合 ┅ · 未分类 ⋯。过去的关系较浅。缩小地图时隐藏连线，完整关系见列表。'
          : 'Communities ✳ · Institutions ▣ · Bonding ━ · Bridging ┄ · Linking ┈ · Mixed ┅ · Unclassified ⋯. Past ties are lighter. Zoomed-out lines are hidden; all relationships remain in the list.'}
      </div>
      <div ref={element} className="leaflet-map" aria-label={t.map} />
      {tileFailed ? (
        <p className="tile-notice" role="status">
          {t.tileError}
        </p>
      ) : null}
    </>
  );
}
