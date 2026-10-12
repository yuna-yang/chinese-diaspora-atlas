import { loadInput, requireValid } from './lib/input';
const { records, refs, relationships } = await loadInput();
requireValid(
  records,
  refs,
  new Date().toISOString().slice(0, 10),
  relationships,
);
console.log(`Validated ${records.length} reviewed records.`);
