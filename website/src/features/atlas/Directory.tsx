import type { Organization, Dataset, Locale } from '../../lib/contracts';
import { messages, localizedText, label } from '../../lib/i18n';
import { publicPath } from '../../lib/paths';
import { networkMessages } from '../network/messages';
export default function Directory({
  records,
  dataset,
  locale,
  selected,
  onSelect,
}: {
  records: Organization[];
  dataset: Dataset;
  locale: Locale;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const t = messages(locale);
  return (
    <div className="directory-list">
      {records.map((o) => {
        const name = localizedText(o.names, locale),
          description = localizedText(o.descriptions, locale);
        const l = o.locations[0];
        const city = dataset.reference_data.cities.find(
          (c) => c.id === l?.city_id,
        );
        const country = dataset.reference_data.countries.find(
          (c) => c.code === l?.country_code,
        );
        return (
          <article
            className={`organization-card ${selected === o.id ? 'selected' : ''}`}
            key={o.id}
          >
            <div className="card-top">
              <span
                className={`category-icon category-${o.categories[0]}`}
                aria-hidden="true"
              >
                {o.kind === 'institution'
                  ? '▣'
                  : o.categories[0] === 'arts_intellectual'
                    ? '✶'
                    : o.categories[0] === 'lgbtq'
                      ? '✿'
                      : '✳'}
              </span>
              <span className="location-label">
                {o.online_only
                  ? t.online
                  : city
                    ? label(city.names, locale)
                    : country
                      ? label(country.names, locale)
                      : t.locationUnknown}
              </span>
              <button
                className="card-locate"
                aria-label={`${t.showOnMap}: ${name.text}`}
                onClick={() => onSelect(o.id)}
              >
                ↗
              </button>
            </div>
            <h3>
              <a
                href={publicPath(`/${locale}/organizations/${o.id}/`)}
                lang={name.lang}
              >
                {name.text}
              </a>
            </h3>
            {name.isFallback ? (
              <small className="fallback">{t.fallback}</small>
            ) : null}
            <p lang={description.lang}>{description.text}</p>
            {description.isFallback ? <small>{t.fallback}</small> : null}
            <div className="card-tags">
              {o.kind === 'institution' ? (
                <span>
                  {networkMessages(locale).institution}:{' '}
                  {networkMessages(locale)[o.institution_type!]}
                </span>
              ) : null}
              {o.categories.map((c) => (
                <span key={c}>
                  {label(
                    dataset.reference_data.categories.find((k) => k.id === c)!
                      .labels,
                    locale,
                  )}
                </span>
              ))}
              {o.activity_status !== 'active' ? (
                <span className="status-tag">{t[o.activity_status]}</span>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
