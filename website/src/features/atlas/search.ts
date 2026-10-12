import type { Dataset, AtlasState, Organization } from '../../lib/contracts';
const norm = (s: string) =>
  s.normalize('NFKC').trim().toLowerCase().replace(/\s+/g, ' ');
export function filterOrganizations(d: Dataset, s: AtlasState): Organization[] {
  const tokens = norm(s.q).split(' ').filter(Boolean);
  const countries = new Map(d.reference_data.countries.map((c) => [c.code, c]));
  const cities = new Map(d.reference_data.cities.map((c) => [c.id, c]));
  return d.organizations.filter((o) => {
    if (s.kind !== 'all' && o.kind !== s.kind) return false;
    if (
      o.kind === 'institution' &&
      s.institution &&
      o.institution_type !== s.institution
    )
      return false;
    if (
      !s.statuses.includes(o.activity_status) ||
      (s.onlineOnly && !o.online_only) ||
      (o.kind === 'primary' &&
        s.categories.length &&
        !o.categories.some((c) => s.categories.includes(c)))
    )
      return false;
    if (
      (s.country || s.city) &&
      !o.locations.some(
        (l) =>
          (!s.country || l.country_code === s.country) &&
          (!s.city || l.city_id === s.city),
      )
    )
      return false;
    const geography = o.locations.flatMap((l) => {
      const c = countries.get(l.country_code),
        city = cities.get(l.city_id ?? '');
      return [
        c?.names.en,
        c?.names.zh,
        ...(c?.aliases ?? []),
        city?.names.en,
        city?.names.zh,
        ...(city?.aliases ?? []),
      ];
    });
    const haystack = norm(
      [
        o.names.en,
        o.names.zh,
        o.descriptions.en,
        o.descriptions.zh,
        ...o.aliases,
        ...o.keywords,
        ...geography,
      ]
        .filter(Boolean)
        .join(' '),
    );
    return tokens.every((t) => haystack.includes(t));
  });
}
