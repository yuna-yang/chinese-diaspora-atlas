import type { Dataset } from './contracts';
import type {
  MapSnapshot,
  Evidence,
} from '../../website/src/features/minimal/contracts';
export function buildMapSnapshot(d: Dataset, demo: boolean): MapSnapshot {
  const sources = (
    items: readonly { url: string; title: string; accessed_at: string }[],
  ): Evidence[] =>
    items.map((s) => ({
      url: s.url,
      title: s.title,
      accessedAt: s.accessed_at,
    }));
  return {
    schemaVersion: 1,
    datasetVersion: d.dataset_version,
    generatedAt: d.generated_at,
    demo,
    nodes: d.organizations.map((o) => ({
      id: o.id,
      names: o.names,
      summary: o.descriptions,
      onlineOnly: o.online_only,
      locations: o.locations.map((l) => {
        const city = d.reference_data.cities.find((c) => c.id === l.city_id),
          country = d.reference_data.countries.find(
            (c) => c.code === l.country_code,
          )!;
        return {
          cityId: l.city_id,
          city: city?.names ?? null,
          country: country.names,
          latitude: city?.latitude ?? null,
          longitude: city?.longitude ?? null,
        };
      }),
      links: o.links,
      contacts: o.public_contacts.map((c) => ({
        kind: c.kind,
        value: c.value,
        sourceUrl: c.source_url,
      })),
      sources: sources(o.sources),
      verifiedAt: o.last_verified,
      basis: o.profile_basis ?? 'public_information',
      interview: o.interview
        ? {
            excerpt: o.interview.excerpt,
            date: o.interview.date,
            attribution: o.interview.attribution,
            sourceUrl: o.interview.source_url,
          }
        : null,
    })),
    links: d.relationships.map((e) => ({
      id: e.id,
      sourceId: e.source_id,
      targetId: e.target_id,
      sourceCityId: e.source_city_id,
      targetCityId: e.target_city_id,
      summary: e.descriptions,
      period: e.period,
      sources: sources(e.sources),
      verifiedAt: e.last_verified,
    })),
  };
}
