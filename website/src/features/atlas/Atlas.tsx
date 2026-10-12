'use client';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { Dataset, AtlasState, Locale } from '../../lib/contracts';
import { messages, localizedText } from '../../lib/i18n';
import { publicPath } from '../../lib/paths';
import { parseAtlasState, serializeAtlasState } from './state';
import { filterOrganizations } from './search';
import {
  filterRelationships,
  contextNodes,
  contextEdges,
  normalizeSelection,
} from '../network/network';
import { networkMessages } from '../network/messages';
import RelationshipList from '../network/RelationshipList';
import Filters from './Filters';
import Directory from './Directory';
import AtlasMap from './Map';
import LocationControl from './LocationControl';
import { useVisitorLocation } from './useVisitorLocation';
export default function Atlas({ locale }: { locale: Locale }) {
  const t = messages(locale);
  const [dataset, setDataset] = useState<Dataset | null>(null),
    [error, setError] = useState(false),
    [attempt, setAttempt] = useState(0),
    [state, setState] = useState<AtlasState | null>(null),
    [query, setQuery] = useState(''),
    [view, setView] = useState<'map' | 'list'>('list'),
    [wide, setWide] = useState(false),
    [fitRequest, setFitRequest] = useState(0);
  const stateRef = useRef<AtlasState | null>(null),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    queryRef = useRef('');
  const located = useCallback(() => setView('map'), []);
  const location = useVisitorLocation(located);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1000px)');
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetch(publicPath('/data/atlas.json'), { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error('Dataset unavailable');
        return r.json();
      })
      .then((d: Dataset) => {
        if (
          d.schema_version !== 2 ||
          !Array.isArray(d.organizations) ||
          !Array.isArray(d.relationships) ||
          !d.reference_data
        )
          throw new Error('Invalid dataset');
        const initial = parseAtlasState(
          new URLSearchParams(window.location.search),
          d.reference_data,
        );
        Object.assign(
          initial,
          normalizeSelection(
            d,
            initial,
            filterOrganizations(d, initial).map((o) => o.id),
          ),
        );
        const clean = serializeAtlasState(initial).toString();
        window.history.replaceState(
          null,
          '',
          window.location.pathname + (clean ? '?' + clean : ''),
        );
        initial.page = Math.min(
          initial.page,
          Math.max(1, Math.ceil(filterOrganizations(d, initial).length / 20)),
        );
        stateRef.current = initial;
        queryRef.current = initial.q;
        setQuery(initial.q);
        setState(initial);
        setDataset(d);
        setError(false);
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setError(true);
      });
    return () => controller.abort();
  }, [attempt]);
  useEffect(() => {
    if (!dataset) return;
    const restore = () => {
      if (timer.current) clearTimeout(timer.current);
      const next = parseAtlasState(
        new URLSearchParams(window.location.search),
        dataset.reference_data,
      );
      Object.assign(
        next,
        normalizeSelection(
          dataset,
          next,
          filterOrganizations(dataset, next).map((o) => o.id),
        ),
      );
      next.page = Math.min(
        next.page,
        Math.max(1, Math.ceil(filterOrganizations(dataset, next).length / 20)),
      );
      stateRef.current = next;
      queryRef.current = next.q;
      setState(next);
      setQuery(next.q);
    };
    window.addEventListener('popstate', restore);
    return () => {
      window.removeEventListener('popstate', restore);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [dataset]);
  const update = useCallback(
    (patch: Partial<AtlasState>, replace = false) => {
      if (!dataset || !stateRef.current) return;
      const next = { ...stateRef.current, q: queryRef.current, ...patch };
      if (!('page' in patch)) next.page = 1;
      Object.assign(
        next,
        normalizeSelection(
          dataset,
          next,
          filterOrganizations(dataset, next).map((o) => o.id),
        ),
      );
      next.page = Math.min(
        next.page,
        Math.max(1, Math.ceil(filterOrganizations(dataset, next).length / 20)),
      );
      stateRef.current = next;
      setState(next);
      const q = serializeAtlasState(next).toString();
      window.history[replace ? 'replaceState' : 'pushState'](
        null,
        '',
        window.location.pathname + (q ? '?' + q : ''),
      );
    },
    [dataset],
  );
  useEffect(() => {
    const flush = (event: MouseEvent) => {
      if (
        !timer.current ||
        !(event.target instanceof Element) ||
        !event.target.closest('a[href]')
      )
        return;
      clearTimeout(timer.current);
      timer.current = null;
      update({ q: queryRef.current }, true);
    };
    document.addEventListener('click', flush, true);
    return () => document.removeEventListener('click', flush, true);
  }, [update]);
  const filtered = useMemo(
    () =>
      dataset && state
        ? filterOrganizations(dataset, state).sort(
            (a, b) =>
              localizedText(a.names, locale).text.localeCompare(
                localizedText(b.names, locale).text,
                locale,
              ) || a.id.localeCompare(b.id),
          )
        : [],
    [dataset, state, locale],
  );
  const selected = state?.selectedNodeId ?? null;
  const select = useCallback(
    (id: string) => {
      update({ selectedNodeId: id, selectedRelationshipId: null });
      setView('map');
    },
    [update],
  );
  const edges = useMemo(
    () =>
      dataset && state
        ? contextEdges(filterRelationships(dataset, state), filtered, selected)
        : [],
    [dataset, state, filtered, selected],
  );
  const mapRecords = useMemo(
    () => (dataset ? contextNodes(dataset, filtered, selected, edges) : []),
    [dataset, filtered, selected, edges],
  );
  const n = networkMessages(locale);
  const clear = () => {
    if (!dataset) return;
    if (timer.current) clearTimeout(timer.current);
    queryRef.current = '';
    setQuery('');
    update({
      ...parseAtlasState(new URLSearchParams(), dataset.reference_data),
    });
  };
  const selectionTrigger = useRef<HTMLElement | null>(null);
  const selectRelationship = useCallback(
    (id: string) => {
      selectionTrigger.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      update({ selectedRelationshipId: id });
    },
    [update],
  );
  const chosen = dataset?.organizations.find((o) => o.id === selected);
  const chosenEdge = edges.find((e) => e.id === state?.selectedRelationshipId);
  return (
    <main id="main" className="atlas-page">
      <section className="hero">
        <div>
          <p className="eyebrow">
            <span aria-hidden="true">✳</span> {t.kicker}
          </p>
          <h1>
            {t.title}
            <br />
            <span>{t.titleAccent}</span>
          </h1>
          <p className="hero-intro">{t.intro}</p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="orbit-star">✴</span>
          <span className="orbit-daisy">✿</span>
          <span className="orbit-label">散是满天星</span>
          <span className="orbit-small">✦</span>
          <svg viewBox="0 0 300 150">
            <path
              d="M20 115 Q80 10 150 75 T275 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="5 7"
            />
          </svg>
        </div>
      </section>
      <section className="search-strip" aria-label={t.search}>
        <div className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            aria-label={t.search}
            placeholder={t.searchHint}
            value={query}
            maxLength={200}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              queryRef.current = value;
              if (timer.current) clearTimeout(timer.current);
              timer.current = setTimeout(() => {
                timer.current = null;
                update({ q: value }, true);
              }, 200);
            }}
          />
        </div>
        <LocationControl locale={locale} location={location} />
      </section>
      {error ? (
        <div className="empty-state" role="alert">
          <p>{t.dataError}</p>
          <button
            onClick={() => {
              setError(false);
              setAttempt((x) => x + 1);
            }}
          >
            {t.retry}
          </button>
        </div>
      ) : !dataset || !state ? (
        <p className="loading-message" role="status">
          {t.loading}
        </p>
      ) : (
        <div className="atlas-workspace">
          <Filters
            state={state}
            refs={dataset.reference_data}
            locale={locale}
            onChange={update}
          />
          <section className="results-area" aria-label={t.explore}>
            <div className="results-toolbar">
              <p role="status">
                <strong>{filtered.length}</strong> {t.matching}
              </p>
              <div className="view-toggle">
                <button
                  className={view === 'list' ? 'current' : ''}
                  onClick={() => setView('list')}
                >
                  {t.list}
                </button>
                <button
                  className={view === 'map' ? 'current' : ''}
                  onClick={() => setView('map')}
                >
                  {t.map}
                </button>
              </div>
              <button className="text-button" onClick={clear}>
                {t.clear}
              </button>
            </div>
            <div
              className={`map-directory ${view === 'map' ? 'mobile-map' : ''}`}
            >
              <section className="map-panel">
                <div className="map-caption">
                  <span>✳ {t.approximate}</span>
                  <button onClick={() => setFitRequest((x) => x + 1)}>
                    {t.showResults}
                  </button>
                </div>
                <div className="map-canvas">
                  {wide || view === 'map' ? (
                    <AtlasMap
                      dataset={dataset}
                      records={mapRecords}
                      relationships={edges}
                      selectedRelationship={state.selectedRelationshipId}
                      onRelationshipSelect={selectRelationship}
                      locale={locale}
                      selected={selected}
                      onSelect={select}
                      position={location.position}
                      fitRequest={fitRequest}
                    />
                  ) : (
                    <div className="map-skeleton" />
                  )}
                </div>
                {chosenEdge ? (
                  <section
                    className="relationship-preview selection-preview"
                    aria-label={n.selected}
                  >
                    <div>
                      <strong>{n.selected}</strong>
                      <p>
                        {localizedText(chosenEdge.descriptions, locale).text}
                      </p>
                      <p>
                        {chosenEdge.types.map((type) => n[type]).join(' · ') ||
                          n.unclassified}{' '}
                        · {n[chosenEdge.temporal_status]}
                      </p>
                      <a href={'#relationship-' + chosenEdge.id}>
                        {n.evidence}
                      </a>
                    </div>
                    <button
                      aria-label={n.close}
                      onClick={() => {
                        update({ selectedRelationshipId: null });
                        requestAnimationFrame(() =>
                          selectionTrigger.current?.focus(),
                        );
                      }}
                    >
                      ×
                    </button>
                  </section>
                ) : null}
                {chosen ? (
                  <div className="selection-preview">
                    <div>
                      <small>{t.previewSelection}</small>
                      {!filtered.some((o) => o.id === chosen.id) ? (
                        <p className="context-note">{n.context}</p>
                      ) : null}
                      <strong>
                        {localizedText(chosen.names, locale).text}
                      </strong>
                      {chosen.online_only ||
                      chosen.locations.every((l) => !l.city_id) ? (
                        <p>
                          {chosen.online_only ? t.online : t.locationUnknown}
                        </p>
                      ) : null}
                    </div>
                    <a
                      href={publicPath(
                        `/${locale}/organizations/${chosen.id}/`,
                      )}
                    >
                      {t.viewProfile} ↗
                    </a>
                    <button
                      aria-label={n.close}
                      onClick={() =>
                        update({
                          selectedNodeId: null,
                          selectedRelationshipId: null,
                        })
                      }
                    >
                      ×
                    </button>
                  </div>
                ) : null}
              </section>
              <section className="directory-panel" aria-label={t.directory}>
                {filtered.length ? (
                  <>
                    <Directory
                      records={filtered.slice(
                        (state.page - 1) * 20,
                        state.page * 20,
                      )}
                      dataset={dataset}
                      locale={locale}
                      selected={selected}
                      onSelect={select}
                    />
                    {filtered.length > 20 ? (
                      <nav className="pagination" aria-label={t.page}>
                        <button
                          disabled={state.page <= 1}
                          onClick={() => update({ page: state.page - 1 })}
                        >
                          {t.previous}
                        </button>
                        <span>
                          {state.page} / {Math.ceil(filtered.length / 20)}
                        </span>
                        <button
                          disabled={
                            state.page >= Math.ceil(filtered.length / 20)
                          }
                          onClick={() => update({ page: state.page + 1 })}
                        >
                          {t.next}
                        </button>
                      </nav>
                    ) : null}
                  </>
                ) : (
                  <div className="empty-state">
                    <span aria-hidden="true">✴</span>
                    <h2>{t.empty}</h2>
                    <p>
                      {dataset.organizations.length
                        ? t.emptyHint
                        : t.coveragePending}
                    </p>
                    <a href={publicPath(`/${locale}/contribute/`)}>
                      {t.contribute} ↗
                    </a>
                  </div>
                )}
              </section>
            </div>
            <p className="context-note">{n.contextNote}</p>
            <RelationshipList
              dataset={dataset}
              edges={edges}
              locale={locale}
              onSelect={selectRelationship}
              onNodeSelect={select}
              selected={state.selectedRelationshipId}
            />
          </section>
        </div>
      )}
    </main>
  );
}
