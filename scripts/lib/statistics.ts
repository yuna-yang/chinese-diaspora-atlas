import type { Dataset, Statistics } from './contracts';
import { isStale } from './review';
export function computeStatistics(d: Dataset, today: string): Statistics {
  const s: Statistics = {
    dataset_version: d.dataset_version,
    total: 0,
    institutions: 0,
    relationships: d.relationships.length,
    byRelationshipType: {},
    byPeriodStatus: {},
    byActivity: { active: 0, inactive: 0, unknown: 0 },
    stale: 0,
    onlineOnly: 0,
    byCountry: {},
    byCategory: {},
    byCity: {},
  };
  const add = (r: Record<string, number>, k: string) => {
    r[k] = (r[k] ?? 0) + 1;
  };
  for (const o of d.organizations) {
    if (o.kind === 'institution') {
      s.institutions++;
      continue;
    }
    s.total++;
    s.byActivity[o.activity_status]++;
    if (isStale(o.last_verified, today)) s.stale++;
    if (o.online_only) s.onlineOnly++;
    new Set(o.categories).forEach((k) => add(s.byCategory, k));
    new Set(o.locations.map((l) => l.country_code)).forEach((k) =>
      add(s.byCountry, k),
    );
    new Set(
      o.locations.map((l) => l.city_id).filter((x): x is string => !!x),
    ).forEach((k) => add(s.byCity, k));
  }
  for (const r of d.relationships) {
    (r.types.length ? r.types : ['unclassified']).forEach((k) =>
      add(s.byRelationshipType, k),
    );
    add(s.byPeriodStatus, r.temporal_status);
  }
  return s;
}
