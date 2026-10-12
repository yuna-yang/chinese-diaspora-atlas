import { readFile, readdir } from 'node:fs/promises';
import type {
  Organization,
  Relationship,
  ReferenceData,
  DuplicateDecision,
} from './contracts';
import { validateRecords } from './validation';
import { validateRelationships, canonicalRelationship } from './relationships';
async function recordsFrom<T extends { id: string }>(
  directory: string,
): Promise<T[]> {
  const result: T[] = [];
  for (const file of (await readdir(directory))
    .filter((f) => f.endsWith('.json'))
    .sort()) {
    const r: T = JSON.parse(await readFile(`${directory}/${file}`, 'utf8'));
    if (`${r.id}.json` !== file)
      throw new Error(`Filename must match ID: ${directory}/${file}`);
    result.push(r);
  }
  return result;
}
function checkDecisions(decisions: DuplicateDecision[], ids: Set<string>) {
  for (const d of decisions)
    if (
      !d.reason?.trim() ||
      d.ids?.length !== 2 ||
      !d.ids.every((id) => ids.has(id)) ||
      d.ids[0] >= d.ids[1]
    )
      throw new Error('Invalid duplicate decision');
}
export async function loadInput(demo = false): Promise<{
  records: Organization[];
  relationships: Relationship[];
  refs: ReferenceData;
  decisions: DuplicateDecision[];
  relationshipDecisions: DuplicateDecision[];
}> {
  if (demo)
    return {
      records: JSON.parse(
        await readFile('tests/fixtures/demo-nodes.json', 'utf8'),
      ),
      relationships: JSON.parse(
        await readFile('tests/fixtures/relationships.json', 'utf8'),
      ).map(canonicalRelationship),
      refs: JSON.parse(
        await readFile('tests/fixtures/references.json', 'utf8'),
      ),
      decisions: [],
      relationshipDecisions: [],
    };
  const refs: ReferenceData = { categories: [], countries: [], cities: [] };
  for (const key of ['categories', 'countries', 'cities'] as const)
    refs[key] = JSON.parse(
      await readFile(`data/reference/${key}.json`, 'utf8'),
    );
  const records = await recordsFrom<Organization>('data/organizations'),
    relationships = (await recordsFrom<Relationship>('data/relationships')).map(
      canonicalRelationship,
    );
  const decisions: DuplicateDecision[] = JSON.parse(
      await readFile('data/duplicate-decisions.json', 'utf8'),
    ),
    relationshipDecisions: DuplicateDecision[] = JSON.parse(
      await readFile('data/relationship-duplicate-decisions.json', 'utf8'),
    );
  checkDecisions(decisions, new Set(records.map((r) => r.id)));
  checkDecisions(
    relationshipDecisions,
    new Set(relationships.map((r) => r.id)),
  );
  return { records, relationships, refs, decisions, relationshipDecisions };
}
export function requireValid(
  records: Organization[],
  refs: ReferenceData,
  today: string,
  relationships: Relationship[] = [],
) {
  const nodeIssues = validateRecords(records, refs, today);
  const issues = nodeIssues.length
    ? nodeIssues
    : validateRelationships(relationships, records, refs, today);
  if (issues.length)
    throw new Error(
      issues.map((e) => `${e.file} ${e.path}: ${e.message}`).join('\n'),
    );
}
