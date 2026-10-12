import type { AtlasState, ReferenceData, Locale } from '../../lib/contracts';
import { messages, label } from '../../lib/i18n';
import { networkMessages } from '../network/messages';
import {
  institutionTypes,
  relationshipTypes,
  periodStatuses,
} from '../network/network';
export default function Filters({
  state,
  refs,
  locale,
  onChange,
}: {
  state: AtlasState;
  refs: ReferenceData;
  locale: Locale;
  onChange: (patch: Partial<AtlasState>) => void;
}) {
  const t = messages(locale);
  const n = networkMessages(locale);
  return (
    <aside className="filters" aria-label={t.filters}>
      <div className="filter-heading">
        <h2>{t.filters}</h2>
        <span aria-hidden="true">☷</span>
      </div>
      <label className="field-label" htmlFor="node-kind">
        {n.kind}
      </label>
      <select
        id="node-kind"
        value={state.kind}
        onChange={(e) =>
          onChange({
            kind: e.target.value as AtlasState['kind'],
            institution: null,
          })
        }
      >
        {(['primary', 'institution', 'all'] as const).map((k) => (
          <option key={k} value={k}>
            {n[k]}
          </option>
        ))}
      </select>
      {state.kind !== 'primary' ? (
        <>
          <label className="field-label" htmlFor="institution-type">
            {n.institutionType}
          </label>
          <select
            id="institution-type"
            value={state.institution ?? ''}
            onChange={(e) => onChange({ institution: e.target.value || null })}
          >
            <option value="">{n.all}</option>
            {institutionTypes.map((k) => (
              <option key={k} value={k}>
                {n[k]}
              </option>
            ))}
          </select>
        </>
      ) : null}
      <label className="field-label" htmlFor="country">
        {t.country}
      </label>
      <select
        id="country"
        value={state.country ?? ''}
        onChange={(e) =>
          onChange({
            country: e.target.value || null,
            city: null,
            onlineOnly: false,
          })
        }
      >
        <option value="">{t.everywhere}</option>
        {refs.countries.map((c) => (
          <option key={c.code} value={c.code}>
            {label(c.names, locale)}
          </option>
        ))}
      </select>
      <label className="field-label" htmlFor="city">
        {t.city}
      </label>
      <select
        id="city"
        value={state.city ?? ''}
        onChange={(e) => {
          const city = refs.cities.find((c) => c.id === e.target.value);
          onChange({
            city: city?.id ?? null,
            country: city?.country_code ?? state.country,
            onlineOnly: false,
          });
        }}
      >
        <option value="">{t.allCities}</option>
        {refs.cities
          .filter((c) => !state.country || c.country_code === state.country)
          .map((c) => (
            <option key={c.id} value={c.id}>
              {label(c.names, locale)}
            </option>
          ))}
      </select>
      <fieldset>
        <legend>{t.category}</legend>
        {refs.categories.map((c) => (
          <label className="check-row" key={c.id}>
            <input
              type="checkbox"
              checked={state.categories.includes(c.id)}
              onChange={() =>
                onChange({
                  categories: state.categories.includes(c.id)
                    ? state.categories.filter((x) => x !== c.id)
                    : [...state.categories, c.id],
                })
              }
            />
            <span
              className={`category-dot category-${c.id}`}
              aria-hidden="true"
            />
            {label(c.labels, locale)}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>{t.activity}</legend>
        {(['active', 'unknown', 'inactive'] as const).map((s) => (
          <label className="check-row" key={s}>
            <input
              type="checkbox"
              checked={state.statuses.includes(s)}
              onChange={() => {
                const next = state.statuses.includes(s)
                  ? state.statuses.filter((x) => x !== s)
                  : [...state.statuses, s];
                onChange({
                  statuses: next.length ? next : ['active', 'unknown'],
                });
              }}
            />
            {t[s]}
          </label>
        ))}
      </fieldset>
      <label className="check-row online-filter">
        <input
          type="checkbox"
          checked={state.onlineOnly}
          onChange={(e) =>
            onChange({
              onlineOnly: e.target.checked,
              country: null,
              city: null,
            })
          }
        />
        {t.onlineOnly}
      </label>
      <fieldset>
        <legend>{n.relationshipTypes}</legend>
        {relationshipTypes.map((k) => (
          <label className="check-row" key={k}>
            <input
              type="checkbox"
              checked={state.relationshipTypes.includes(k)}
              onChange={() => {
                const next = state.relationshipTypes.includes(k)
                  ? state.relationshipTypes.filter((x) => x !== k)
                  : [...state.relationshipTypes, k];
                onChange({
                  relationshipTypes: next.length
                    ? next
                    : [...relationshipTypes],
                });
              }}
            />
            {n[k]}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>{n.periodStatuses}</legend>
        {periodStatuses.map((k) => (
          <label className="check-row" key={k}>
            <input
              type="checkbox"
              checked={state.periodStatuses.includes(k)}
              onChange={() => {
                const next = state.periodStatuses.includes(k)
                  ? state.periodStatuses.filter((x) => x !== k)
                  : [...state.periodStatuses, k];
                onChange({
                  periodStatuses: next.length ? next : [...periodStatuses],
                });
              }}
            />
            {n[k]}
          </label>
        ))}
      </fieldset>
      <div className="filter-note">
        <span aria-hidden="true">✴</span>
        <p>{t.approximate}</p>
      </div>
    </aside>
  );
}
