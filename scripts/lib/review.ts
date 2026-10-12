import type {
  Organization,
  ReferenceData,
  DuplicateDecision,
  ReviewReport,
} from './contracts';
import { canonicalUrl } from './validation';
export const normalize = (s: string) =>
  s.normalize('NFKC').trim().toLowerCase().replace(/\s+/g, ' ');
export const isStale = (date: string, today: string) =>
  (Date.parse(today) - Date.parse(date)) / 86400000 > 180;
export function reviewRecords(
  records: Organization[],
  _refs: ReferenceData,
  today: string,
  decisions: DuplicateDecision[],
): ReviewReport {
  const sorted = [...records].sort((a, b) => a.id.localeCompare(b.id));
  const duplicatePairs: DuplicateDecision[] = [];
  for (let i = 0; i < sorted.length; i++)
    for (let j = i + 1; j < sorted.length; j++) {
      const a = sorted[i],
        b = sorted[j];
      const ids: [string, string] = [a.id, b.id];
      if (decisions.some((d) => d.ids[0] === ids[0] && d.ids[1] === ids[1]))
        continue;
      const names = [a.names.en, a.names.zh, ...a.aliases]
        .filter((x): x is string => !!x)
        .map(normalize);
      const nameMatch = [b.names.en, b.names.zh, ...b.aliases].some(
        (x) => !!x && names.includes(normalize(x)),
      );
      const locationMatch =
        (a.online_only && b.online_only) ||
        a.locations.some((l) =>
          b.locations.some(
            (m) =>
              l.country_code === m.country_code &&
              (!l.city_id || !m.city_id || l.city_id === m.city_id),
          ),
        );
      const websites = a.links
        .filter((l) => l.kind === 'website')
        .map((l) => canonicalUrl(l.url));
      const websiteMatch = b.links.some(
        (l) => l.kind === 'website' && websites.includes(canonicalUrl(l.url)),
      );
      if (websiteMatch || (nameMatch && locationMatch))
        duplicatePairs.push({
          ids,
          reason: websiteMatch
            ? 'Same organization website'
            : 'Matching name and overlapping location',
        });
    }
  return {
    staleIds: sorted
      .filter((r) => isStale(r.last_verified, today))
      .map((r) => r.id),
    duplicatePairs,
  };
}
