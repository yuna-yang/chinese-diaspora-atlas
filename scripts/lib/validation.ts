import { safeUrl } from '../../website/src/lib/safe-url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import schema from '../../data/schema/organization.schema.json' with { type: 'json' };
import referenceSchema from './reference-schema';
import type { Organization, ReferenceData, ValidationIssue } from './contracts';
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const check = ajv.compile<Organization>(schema);
const checkReferences = ajv.compile<ReferenceData>(referenceSchema);
export const validDate = (s: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(s) &&
  Number.isFinite(Date.parse(s)) &&
  new Date(s).toISOString().slice(0, 10) === s;
export { safeUrl } from '../../website/src/lib/safe-url';
export function canonicalUrl(s: string) {
  const u = new URL(s);
  return u.toString();
}
export function validateRecords(
  records: unknown[],
  refs: ReferenceData,
  today: string,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const ids = new Set<string>();
  const issue = (file: string, path: string, message: string) =>
    issues.push({ file, path, code: 'invalid', message });
  if (!checkReferences(refs)) {
    for (const error of checkReferences.errors ?? [])
      issue(
        'reference data',
        error.instancePath,
        error.message ?? 'Invalid reference data',
      );
    return issues;
  }
  for (const [name, keys] of [
    ['categories', refs.categories.map((c) => c.id)],
    ['countries', refs.countries.map((c) => c.code)],
    ['cities', refs.cities.map((c) => c.id)],
  ] as const) {
    if (new Set(keys).size !== keys.length)
      issue('reference data', name, 'Duplicate reference ID/code');
  }
  for (const city of refs.cities) {
    if (!refs.countries.some((c) => c.code === city.country_code))
      issue('cities.json', city.id, 'Unknown city country');
    if (!safeUrl(city.source.url))
      issue('cities.json', city.id, 'Unsafe coordinate source URL');
    if (!validDate(city.source.accessed_at) || city.source.accessed_at > today)
      issue('cities.json', city.id, 'Invalid/future coordinate source date');
  }
  for (const category of refs.categories)
    if (!schema.properties.categories.items.enum.includes(category.id as never))
      issue('categories.json', category.id, 'Unknown taxonomy ID');
  const countries = new Set(refs.countries.map((c) => c.code));
  const cities = new Map(refs.cities.map((c) => [c.id, c]));
  const categories = new Set(refs.categories.map((c) => c.id));
  for (const raw of records) {
    const filename =
      typeof raw === 'object' && raw && 'id' in raw
        ? String(raw.id)
        : 'unknown';
    const file = `${filename}.json`;
    if (!check(raw)) {
      for (const e of check.errors ?? [])
        issue(file, e.instancePath, e.message ?? 'Invalid schema');
      continue;
    }
    const r = raw as Organization;
    if (ids.has(r.id)) issue(file, 'id', 'Duplicate ID');
    ids.add(r.id);
    for (const [key, date] of [
      ['created_at', r.created_at],
      ['updated_at', r.updated_at],
      ['last_verified', r.last_verified],
    ] as const)
      if (!validDate(date) || date > today)
        issue(file, key, 'Invalid or future date');
    if (r.created_at > r.updated_at || r.last_verified > r.updated_at)
      issue(file, 'updated_at', 'Date order invalid');
    if (r.online_only ? r.locations.length !== 0 : r.locations.length === 0)
      issue(file, 'locations', 'Online and physical locations conflict');
    for (const l of r.locations) {
      if (!countries.has(l.country_code))
        issue(file, 'locations', 'Unknown country');
      if (l.city_id && cities.get(l.city_id)?.country_code !== l.country_code)
        issue(file, 'locations', 'City-country mismatch');
    }
    for (const c of r.categories)
      if (!categories.has(c)) issue(file, 'categories', 'Unknown category');
    for (const key of r.translated_name_locales)
      if (!r.names[key])
        issue(file, 'translated_name_locales', 'Missing translated name');
    const sourceUrls = new Set<string>();
    const support = new Set<string>();
    for (const s of r.sources) {
      if (!safeUrl(s.url)) issue(file, 'sources', 'Unsafe URL');
      else {
        const normalized = canonicalUrl(s.url);
        if (sourceUrls.has(normalized))
          issue(file, 'sources', 'Duplicate source URL');
        sourceUrls.add(normalized);
      }
      if (!validDate(s.accessed_at) || s.accessed_at > today)
        issue(file, 'sources', 'Invalid source date');
      s.supports.forEach((x) => support.add(x));
    }
    for (const s of r.links)
      if (!safeUrl(s.url)) issue(file, 'links', 'Unsafe URL');
    for (const claim of [
      'identity',
      ...(r.kind === 'primary' ? ['scope'] : []),
      ...(!r.online_only ? ['location'] : []),
    ])
      if (!support.has(claim))
        issue(file, 'sources', `Missing ${claim} evidence`);
    if (
      r.founded_year !== null &&
      (r.founded_year > Number(today.slice(0, 4)) || !support.has('founded'))
    )
      issue(
        file,
        'founded_year',
        'Founding year must be nonfuture and sourced',
      );
    if (
      r.reach &&
      ((!r.reach.summary.en && !r.reach.summary.zh) ||
        r.reach.source_urls.some(
          (u) =>
            !r.sources.some((s) => s.url === u && s.supports.includes('reach')),
        ))
    )
      issue(file, 'reach', 'Reach requires a summary and specific evidence');
    for (const contact of r.public_contacts) {
      const emailValid =
        contact.kind === 'role_email' &&
        ajv.validate({ type: 'string', format: 'email' }, contact.value);
      if (
        contact.kind === 'contact_page' ? !safeUrl(contact.value) : !emailValid
      )
        issue(file, 'public_contacts', 'Invalid organization contact route');
      if (
        !r.sources.some(
          (s) => s.url === contact.source_url && s.supports.includes('contact'),
        )
      )
        issue(file, 'public_contacts', 'Contact evidence required');
    }
    if (
      r.information_basis !== 'public_documentation' &&
      !r.sources.some((s) => s.kind === 'organization_statement')
    )
      issue(
        file,
        'information_basis',
        'Organization-origin information needs publishable statement evidence',
      );
    if (r.activity_status !== 'unknown' && !support.has('activity'))
      issue(file, 'activity_status', 'Missing activity evidence');
    if (r.affiliation.kind !== 'unclear') {
      if (!r.affiliation.explanation.en && !r.affiliation.explanation.zh)
        issue(file, 'affiliation', 'Explanation required');
      if (
        !r.affiliation.source_urls.length ||
        r.affiliation.source_urls.some(
          (u) =>
            !r.sources.some(
              (s) => s.url === u && s.supports.includes('affiliation'),
            ),
        )
      )
        issue(file, 'affiliation', 'Affiliation evidence required');
    }
  }
  return issues;
}
