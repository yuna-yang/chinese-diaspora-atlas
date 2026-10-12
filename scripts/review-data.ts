import { loadInput, requireValid } from './lib/input';
import { reviewRecords } from './lib/review';
import { reviewRelationships } from './lib/relationships';
const { records, refs, decisions, relationships, relationshipDecisions } =
  await loadInput();
const today = new Date().toISOString().slice(0, 10);
requireValid(records, refs, today, relationships);
const report = reviewRecords(records, refs, today, decisions);
const duplicateRelationships = reviewRelationships(
  relationships,
  relationshipDecisions,
);
console.log(JSON.stringify({ ...report, duplicateRelationships }, null, 2));
if (report.duplicatePairs.length || duplicateRelationships.length)
  process.exitCode = 1;
