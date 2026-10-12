import type { Dataset, Organization, Locale } from '../../lib/contracts';
import { messages, localizedText, label, localeKey } from '../../lib/i18n';
import { publicPath } from '../../lib/paths';
import { issueUrl, projectConfig } from '../../lib/project-config';
import { networkMessages } from '../network/messages';
import RelationshipList from '../network/RelationshipList';
export default function Profile({
  organization: o,
  dataset: d,
  locale,
}: {
  organization: Organization;
  dataset: Dataset;
  locale: Locale;
}) {
  const n = networkMessages(locale);
  const reachSummary = o.reach ? localizedText(o.reach.summary, locale) : null;
  const t = messages(locale),
    name = localizedText(o.names, locale),
    description = localizedText(o.descriptions, locale),
    explanation = localizedText(o.affiliation.explanation, locale);
  const stale =
    (Date.parse(d.generated_at.slice(0, 10)) - Date.parse(o.last_verified)) /
      86400000 >
    180;
  const correction = issueUrl('correct.yml', o.id),
    removal = projectConfig().privateRemovalUrl;
  return (
    <main id="main" className="profile-page">
      <a className="back-link" href={publicPath(`/${locale}/`)}>
        ← {t.back}
      </a>
      <p className="eyebrow">{t.profile}</p>
      <h1 lang={name.lang}>{name.text}</h1>
      {name.isFallback ? <p className="fallback">{t.fallback}</p> : null}
      {o.translated_name_locales.includes(localeKey(locale)) ? (
        <p className="fallback">{t.translated}</p>
      ) : null}
      <div className="card-tags">
        {o.categories.map((c) => (
          <span key={c}>
            {label(
              d.reference_data.categories.find((k) => k.id === c)!.labels,
              locale,
            )}
          </span>
        ))}
      </div>
      <p className="profile-description" lang={description.lang}>
        {description.text}
      </p>
      {description.isFallback ? <p className="fallback">{t.fallback}</p> : null}
      <div className="download-actions">
        {o.links.map((l, i) => (
          <a
            className="download-link"
            href={l.url}
            key={l.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {l.kind === 'website' ? t.website : new URL(l.url).hostname}
            {i === 0 ? ' ↗' : ''}
          </a>
        ))}
      </div>
      <dl className="profile-meta">
        <div>
          <dt>{n.kind}</dt>
          <dd>
            {o.kind === 'primary' ? n.primary : n.institution}
            {o.institution_type ? ': ' + n[o.institution_type] : ''}
          </dd>
        </div>
        {o.founded_year ? (
          <div>
            <dt>{n.founded}</dt>
            <dd>{o.founded_year}</dd>
          </div>
        ) : null}
        {o.reach ? (
          <div>
            <dt>{n.reach}</dt>
            <dd>
              {n[o.reach.scope]}
              <p lang={reachSummary?.lang}>{reachSummary?.text}</p>
              {reachSummary?.isFallback ? <small>{t.fallback}</small> : null}
              {o.reach.source_urls.map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {n.evidence} ↗{' '}
                </a>
              ))}
            </dd>
          </div>
        ) : null}
        <div>
          <dt>{n.information}</dt>
          <dd>{n[o.information_basis]}</dd>
        </div>
        {o.public_contacts.length ? (
          <div>
            <dt>{n.contacts}</dt>
            <dd>
              {o.public_contacts.map((c) => (
                <p key={c.value}>
                  <a
                    href={
                      c.kind === 'role_email'
                        ? 'mailto:' + encodeURIComponent(c.value)
                        : c.value
                    }
                  >
                    {c.value}
                  </a>{' '}
                  ·{' '}
                  <a
                    href={c.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {n.evidence}
                  </a>
                </p>
              ))}
            </dd>
          </div>
        ) : null}
        <div>
          <dt>{t.locations}</dt>
          <dd>
            {o.online_only
              ? t.online
              : o.locations
                  .map((l) => {
                    const city = d.reference_data.cities.find(
                        (c) => c.id === l.city_id,
                      ),
                      country = d.reference_data.countries.find(
                        (c) => c.code === l.country_code,
                      );
                    return [
                      city ? label(city.names, locale) : null,
                      country ? label(country.names, locale) : l.country_code,
                    ]
                      .filter(Boolean)
                      .join(', ');
                  })
                  .join(' · ')}
          </dd>
        </div>
        <div>
          <dt>{t.activity}</dt>
          <dd>{t[o.activity_status]}</dd>
        </div>
        <div>
          <dt>{t.verified}</dt>
          <dd>
            <time dateTime={o.last_verified}>
              {new Intl.DateTimeFormat(locale, {
                dateStyle: 'medium',
                timeZone: 'UTC',
              }).format(new Date(o.last_verified))}
            </time>
          </dd>
        </div>
        <div>
          <dt>{t.affiliation}</dt>
          <dd>
            {t[o.affiliation.kind]}
            {explanation.text ? (
              <p lang={explanation.lang}>{explanation.text}</p>
            ) : null}
            {explanation.text && explanation.isFallback ? (
              <small>{t.fallback}</small>
            ) : null}
          </dd>
        </div>
      </dl>
      {stale ? <p className="warning-label">{t.stale}</p> : null}
      <p className="data-metadata">{t.freshnessNote}</p>
      <section className="prose-section">
        <h2>{t.sources}</h2>
        <ul className="source-list">
          {o.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.title} ↗
              </a>
              <small>
                <time dateTime={s.accessed_at}>{s.accessed_at}</time> ·{' '}
                {new URL(s.url).hostname}
              </small>
            </li>
          ))}
        </ul>
      </section>
      <RelationshipList
        dataset={d}
        edges={d.relationships.filter(
          (e) => e.source_id === o.id || e.target_id === o.id,
        )}
        locale={locale}
      />
      <div className="profile-actions">
        {correction ? (
          <a href={correction}>{t.correction}</a>
        ) : (
          <a href={publicPath(`/${locale}/contribute/`)}>{t.correction}</a>
        )}
        {removal ? (
          <a href={removal}>{t.removal}</a>
        ) : (
          <a href={publicPath(`/${locale}/privacy/`)}>{t.removal}</a>
        )}
      </div>
    </main>
  );
}
