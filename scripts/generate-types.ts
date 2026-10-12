import { readFile, writeFile } from 'node:fs/promises';
const schema = JSON.parse(
  await readFile('data/schema/organization.schema.json', 'utf8'),
);
await writeFile(
  'scripts/lib/schema.generated.ts',
  '// Generated from data/schema/organization.schema.json; do not edit.\nexport default ' +
    JSON.stringify(schema, null, 2) +
    ' as const;\n',
);
const relationshipSchema = JSON.parse(
  await readFile('data/schema/relationship.schema.json', 'utf8'),
);
await writeFile(
  'scripts/lib/relationship-schema.generated.ts',
  '// Generated from data/schema/relationship.schema.json; do not edit.\nexport default ' +
    JSON.stringify(relationshipSchema, null, 2) +
    ' as const;\n',
);
