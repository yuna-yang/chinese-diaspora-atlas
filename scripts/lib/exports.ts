import { createHash } from 'node:crypto';
import type {
  Organization,
  Relationship,
  ReferenceData,
  Dataset,
} from './contracts';
import { canonicalRelationship } from './relationships';
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, canonical(v)]),
    );
  return value;
}
export function buildDataset(
  records: Organization[],
  refs: ReferenceData,
  generatedAt: string,
  edges: Relationship[] = [],
  metadata = {
    license:
      'CC BY 4.0 (owner provenance confirmation required before public launch)',
    attribution: 'Scattered Stars contributors; see record evidence sources.',
  },
): Dataset {
  const organizations = [...records].sort((a, b) => a.id.localeCompare(b.id)),
    relationships = edges
      .map(canonicalRelationship)
      .sort((a, b) => a.id.localeCompare(b.id));
  const reference_data = {
    categories: [...refs.categories].sort((a, b) => a.id.localeCompare(b.id)),
    countries: [...refs.countries].sort((a, b) => a.code.localeCompare(b.code)),
    cities: [...refs.cities].sort((a, b) => a.id.localeCompare(b.id)),
  };
  const dataset_version = createHash('sha256')
    .update(
      JSON.stringify(
        canonical({
          organizations,
          relationships,
          reference_data,
          ...metadata,
        }),
      ),
    )
    .digest('hex');
  return {
    schema_version: 2,
    dataset_version,
    generated_at: generatedAt,
    ...metadata,
    reference_data,
    organizations,
    relationships,
  };
}
const headers = [
  'id',
  'kind',
  'institution_type',
  'founded_year',
  'reach',
  'public_contacts',
  'information_basis',
  'name_zh',
  'name_en',
  'description_zh',
  'description_en',
  'categories',
  'locations',
  'online_only',
  'activity_status',
  'affiliation',
  'last_verified',
  'links',
  'sources',
  'profile_basis',
  'interview',
];
function cell(value: unknown) {
  let s =
    typeof value === 'string'
      ? value
      : value == null
        ? ''
        : typeof value === 'object'
          ? JSON.stringify(value)
          : String(value);
  if (/^[\t\r\n]/.test(s) || /^\s*[=+\-@]/.test(s)) s = "'" + s;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
export function serializeCsv(d: Dataset): string {
  const rows = d.organizations.map((o) =>
    [
      o.id,
      o.kind,
      o.institution_type,
      o.founded_year,
      o.reach,
      o.public_contacts,
      o.information_basis,
      o.names.zh,
      o.names.en,
      o.descriptions.zh,
      o.descriptions.en,
      o.categories,
      o.locations.map((l) => {
        const city = d.reference_data.cities.find((c) => c.id === l.city_id),
          country = d.reference_data.countries.find(
            (c) => c.code === l.country_code,
          );
        return {
          ...l,
          city_names: city?.names ?? null,
          country_names: country?.names ?? null,
          latitude: city?.latitude ?? null,
          longitude: city?.longitude ?? null,
        };
      }),
      o.online_only,
      o.activity_status,
      o.affiliation.kind,
      o.last_verified,
      o.links,
      o.sources,
      o.profile_basis ?? 'public_information',
      o.interview,
    ]
      .map(cell)
      .join(','),
  );
  return '\uFEFF' + [headers.join(','), ...rows].join('\r\n') + '\r\n';
}
export function serializeRelationshipsCsv(d: Dataset) {
  const headers = [
    'id',
    'source_id',
    'target_id',
    'direction',
    'types',
    'forms',
    'description_zh',
    'description_en',
    'classification_basis',
    'period',
    'temporal_status',
    'source_city_id',
    'target_city_id',
    'information_basis',
    'last_verified',
    'sources',
  ];
  return (
    '\uFEFF' +
    [
      headers.join(','),
      ...d.relationships.map((r) =>
        [
          r.id,
          r.source_id,
          r.target_id,
          r.direction,
          r.types,
          r.forms,
          r.descriptions.zh,
          r.descriptions.en,
          r.classification_basis,
          r.period,
          r.temporal_status,
          r.source_city_id,
          r.target_city_id,
          r.information_basis,
          r.last_verified,
          r.sources,
        ]
          .map(cell)
          .join(','),
      ),
    ].join('\r\n') +
    '\r\n'
  );
}
