import type { Dataset, Relationship, Locale } from '../../lib/contracts';
import { messages, localizedText } from '../../lib/i18n';
import { publicPath } from '../../lib/paths';
import { networkMessages } from './messages';
export default function RelationshipList({
  dataset,
  edges,
  locale,
  onSelect,
  onNodeSelect,
  selected,
}: {
  dataset: Dataset;
  edges: Relationship[];
  locale: Locale;
  onSelect?: (id: string) => void;
  onNodeSelect?: (id: string) => void;
  selected?: string | null;
}) {
  const t = networkMessages(locale);
  const endpoint = (id: string) => {
    const node = dataset.organizations.find((o) => o.id === id);
    if (!node) return null;
    const name = localizedText(node.names, locale);
    const control = onNodeSelect ? (
      <button
        className="text-button"
        onClick={() => onNodeSelect(id)}
        lang={name.lang}
      >
        {name.text}
      </button>
    ) : (
      <a href={publicPath(`/${locale}/organizations/${id}/`)} lang={name.lang}>
        {name.text}
      </a>
    );
    return (
      <span>
        {control}
        {name.isFallback ? <small>{messages(locale).fallback}</small> : null}
      </span>
    );
  };
  return (
    <section className="network-section" aria-label={t.relationships}>
      <h2>{t.relationships}</h2>
      {!edges.length ? (
        <p>{t.empty}</p>
      ) : (
        <ul className="relationship-list">
          {edges.map((e) => {
            const description = localizedText(e.descriptions, locale),
              basis = localizedText(e.classification_basis, locale),
              period = localizedText(e.period.label, locale);
            return (
              <li
                key={e.id}
                id={'relationship-' + e.id}
                className={
                  selected === e.id
                    ? 'selected relationship-card'
                    : 'relationship-card'
                }
              >
                <h3>
                  {endpoint(e.source_id)}{' '}
                  <span
                    aria-label={
                      e.direction === 'directed' ? t.directed : t.undirected
                    }
                  >
                    {e.direction === 'directed' ? '→' : '↔'}
                  </span>{' '}
                  {endpoint(e.target_id)}
                </h3>
                <div className="card-tags">
                  {(e.types.length ? e.types : (['unclassified'] as const)).map(
                    (type) => (
                      <span key={type} className={`relation-${type}`}>
                        {t[type]}
                      </span>
                    ),
                  )}
                  <span>{t[e.temporal_status]}</span>
                </div>
                <p>
                  {e.forms
                    .map((f) => (f === 'other' ? t.other : t[f]))
                    .join(' · ')}
                </p>
                <p lang={description.lang}>{description.text}</p>
                {description.isFallback ? (
                  <small>{messages(locale).fallback}</small>
                ) : null}
                <p>
                  {e.period.start ?? '?'} – {e.period.end ?? '?'}
                  <span lang={period.lang}> {period.text}</span>
                  {period.text && period.isFallback ? (
                    <small>{messages(locale).fallback}</small>
                  ) : null}
                </p>
                {basis.text ? (
                  <p lang={basis.lang}>
                    {t.basis}: {basis.text}
                  </p>
                ) : null}
                {basis.text && basis.isFallback ? (
                  <small>{messages(locale).fallback}</small>
                ) : null}
                <p>
                  {t.information}: {t[e.information_basis]}
                </p>
                <p>
                  {messages(locale).verified}:{' '}
                  <time dateTime={e.last_verified}>{e.last_verified}</time>
                </p>
                <ul className="source-list">
                  {e.sources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {t.evidence}: {s.title} ↗
                      </a>
                      <small>{s.accessed_at}</small>
                    </li>
                  ))}
                </ul>
                {onSelect ? (
                  <button
                    aria-pressed={selected === e.id}
                    onClick={() => onSelect(e.id)}
                  >
                    {t.select}
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
