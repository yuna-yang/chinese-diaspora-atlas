import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import schema from '../../data/schema/relationship.schema.json' with { type: 'json' };
import type {
  Relationship,
  Organization,
  ReferenceData,
  ValidationIssue,
  DuplicateDecision,
} from './contracts';
import { validDate, safeUrl } from './validation';
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const check = ajv.compile<Relationship>(schema);
export function canonicalRelationship(r: Relationship): Relationship {
  return r.direction === 'undirected' && r.source_id > r.target_id
    ? {
        ...r,
        source_id: r.target_id,
        target_id: r.source_id,
        source_city_id: r.target_city_id,
        target_city_id: r.source_city_id,
      }
    : r;
}
export function periodBound(s: string | null, end = false): string | null {
  if (s === null) return null;
  if (!/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(s) || Number(s.slice(0, 4)) < 1000)
    return null;
  const parts = s.split('-');
  const year = Number(parts[0]);
  const month = parts[1] ? Number(parts[1]) : end ? 12 : 1;
  if (month < 1 || month > 12) return null;
  const day = parts[2]
    ? Number(parts[2])
    : end
      ? new Date(Date.UTC(year, month, 0)).getUTCDate()
      : 1;
  const date = `${parts[0]}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return validDate(date) ? date : null;
}
export function validateRelationships(
  edges: unknown[],
  nodes: Organization[],
  _refs: ReferenceData,
  today: string,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const nodeMap = new Map(nodes.map((n) => [n.id, n])),
    ids = new Set<string>(),
    approved: Relationship[] = [];
  const issue = (file: string, path: string, message: string) =>
    issues.push({ file, path, code: 'invalid', message });
  for (const raw of edges) {
    const file =
      typeof raw === 'object' && raw && 'id' in raw
        ? `${raw.id}.json`
        : 'relationship.json';
    if (!check(raw)) {
      for (const e of check.errors ?? [])
        issue(file, e.instancePath, e.message ?? 'Invalid relationship schema');
      continue;
    }
    const r = raw as Relationship;
    if (ids.has(r.id)) issue(file, 'id', 'Duplicate relationship ID');
    ids.add(r.id);
    const source = nodeMap.get(r.source_id),
      target = nodeMap.get(r.target_id);
    if (!source || !target) {
      issue(file, 'endpoints', 'Dangling endpoint');
      continue;
    }
    if (source.id === target.id)
      issue(file, 'endpoints', 'Self connection prohibited');
    if (source.kind !== 'primary' && target.kind !== 'primary')
      issue(file, 'endpoints', 'At least one primary endpoint required');
    for (const [node, anchor] of [
      [source, r.source_city_id],
      [target, r.target_city_id],
    ] as const)
      if (anchor && !node.locations.some((l) => l.city_id === anchor))
        issue(file, 'anchors', 'Anchor must belong to endpoint');
    const supports = new Set(r.sources.flatMap((s) => s.supports));
    const urls = new Set<string>();
    for (const s of r.sources) {
      if (!safeUrl(s.url) || urls.has(s.url))
        issue(file, 'sources', 'Unsafe or duplicate evidence URL');
      urls.add(s.url);
      if (!validDate(s.accessed_at) || s.accessed_at > today)
        issue(file, 'sources', 'Invalid/future source date');
    }
    if (!supports.has('relationship'))
      issue(file, 'sources', 'Cooperation evidence required');
    if (
      r.types.length &&
      (!supports.has('classification') ||
        (!r.classification_basis.en && !r.classification_basis.zh))
    )
      issue(file, 'types', 'Classification evidence and explanation required');
    if (r.direction === 'directed' && !supports.has('direction'))
      issue(file, 'direction', 'Directional evidence required');
    const start = periodBound(r.period.start),
      end = periodBound(r.period.end, true);
    if (
      (r.period.start !== null && !start) ||
      (r.period.end !== null && !end) ||
      (start && end && start > end) ||
      (start && start > today)
    )
      issue(file, 'period', 'Invalid/reversed/future-start period');
    if (
      (r.period.start || r.period.end || r.temporal_status !== 'unknown') &&
      !supports.has('period')
    )
      issue(file, 'period', 'Period/status evidence required');
    if (r.temporal_status === 'current' && end && end < today)
      issue(file, 'temporal_status', 'Expired period cannot be current');
    if (
      r.information_basis !== 'public_documentation' &&
      !r.sources.some((s) => s.kind === 'organization_statement')
    )
      issue(
        file,
        'information_basis',
        'Publishable organizational statement required',
      );
    for (const date of [r.last_verified, r.created_at, r.updated_at])
      if (!validDate(date) || date > today)
        issue(file, 'dates', 'Invalid/future date');
    if (r.created_at > r.updated_at || r.last_verified > r.updated_at)
      issue(file, 'dates', 'Date order invalid');
    approved.push(r);
  }
  for (const n of nodes)
    if (
      n.kind === 'institution' &&
      !approved.some(
        (r) =>
          (r.source_id === n.id &&
            nodeMap.get(r.target_id)?.kind === 'primary') ||
          (r.target_id === n.id &&
            nodeMap.get(r.source_id)?.kind === 'primary'),
      )
    )
      issue(
        `${n.id}.json`,
        'kind',
        'Connected institution has no approved direct primary relationship',
      );
  return issues;
}
export function reviewRelationships(
  edges: Relationship[],
  decisions: DuplicateDecision[],
) {
  const pairs: DuplicateDecision[] = [];
  const sorted = [...edges].sort((a, b) => a.id.localeCompare(b.id));
  for (let i = 0; i < sorted.length; i++)
    for (let j = i + 1; j < sorted.length; j++) {
      const a = canonicalRelationship(sorted[i]),
        b = canonicalRelationship(sorted[j]);
      if (decisions.some((d) => d.ids[0] === a.id && d.ids[1] === b.id))
        continue;
      if (
        a.source_id === b.source_id &&
        a.target_id === b.target_id &&
        a.direction === b.direction &&
        [...a.forms].sort().join(',') === [...b.forms].sort().join(',') &&
        JSON.stringify(a.period) === JSON.stringify(b.period) &&
        a.sources.some((s) => b.sources.some((t) => t.url === s.url))
      )
        pairs.push({
          ids: [a.id, b.id],
          reason: 'Same endpoints, form, period and evidence',
        });
    }
  return pairs;
}
