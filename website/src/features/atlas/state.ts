import type {
  AtlasState,
  ReferenceData,
  ActivityStatus,
} from '../../lib/contracts';
import {
  institutionTypes,
  relationshipTypes,
  periodStatuses,
} from '../network/network';
const statuses: ActivityStatus[] = ['active', 'inactive', 'unknown'];
const slug = (s: string | null) =>
  s && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s) ? s : null;
export function parseAtlasState(
  p: URLSearchParams,
  r: ReferenceData,
): AtlasState {
  const onlineOnly = p.get('online') === '1';
  let country = r.countries.some((c) => c.code === p.get('country'))
    ? p.get('country')
    : null;
  let city = r.cities.find((c) => c.id === p.get('city')) ?? null;
  if (city && country && city.country_code !== country) city = null;
  if (city && !country) country = city.country_code;
  const chosen = statuses.filter((s) => p.getAll('status').includes(s));
  const page = Number(p.get('page'));
  const kind =
    p.get('kind') === 'institution'
      ? 'institution'
      : p.get('kind') === 'all'
        ? 'all'
        : 'primary';
  const types = relationshipTypes.filter((t) =>
      p.getAll('relation_type').includes(t),
    ),
    periods = periodStatuses.filter((t) =>
      p.getAll('period_status').includes(t),
    );
  return {
    q: (p.get('q') ?? '').slice(0, 200),
    categories: [...new Set(p.getAll('category'))]
      .filter((c) => r.categories.some((k) => k.id === c))
      .sort(),
    country: onlineOnly ? null : country,
    city: onlineOnly ? null : (city?.id ?? null),
    statuses: chosen.length ? chosen : ['active', 'unknown'],
    onlineOnly,
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    kind,
    institution:
      kind !== 'primary' &&
      institutionTypes.some((t) => t === p.get('institution'))
        ? p.get('institution')
        : null,
    relationshipTypes: types.length ? types : [...relationshipTypes],
    periodStatuses: periods.length ? periods : [...periodStatuses],
    selectedNodeId: slug(p.get('node')),
    selectedRelationshipId: slug(p.get('relationship')),
  };
}
export function serializeAtlasState(s: AtlasState): URLSearchParams {
  const p = new URLSearchParams();
  if (s.q) p.set('q', s.q);
  [...s.categories].sort().forEach((c) => p.append('category', c));
  if (s.country) p.set('country', s.country);
  if (s.city) p.set('city', s.city);
  if (s.onlineOnly) p.set('online', '1');
  if ([...s.statuses].sort().join(',') !== 'active,unknown')
    [...s.statuses].sort().forEach((x) => p.append('status', x));
  if (s.page > 1) p.set('page', String(s.page));
  if (s.kind !== 'primary') p.set('kind', s.kind);
  if (s.institution && s.kind !== 'primary')
    p.set('institution', s.institution);
  if (s.relationshipTypes.length !== relationshipTypes.length)
    [...s.relationshipTypes]
      .sort()
      .forEach((t) => p.append('relation_type', t));
  if (s.periodStatuses.length !== periodStatuses.length)
    [...s.periodStatuses].sort().forEach((t) => p.append('period_status', t));
  if (s.selectedNodeId) p.set('node', s.selectedNodeId);
  if (s.selectedRelationshipId) p.set('relationship', s.selectedRelationshipId);
  return p;
}
