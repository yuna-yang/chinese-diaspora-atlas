import { loadInput, requireValid } from './lib/input';
import { projectConfig } from '../website/src/lib/project-config';
const { records, refs, relationships } = await loadInput();
requireValid(
  records,
  refs,
  new Date().toISOString().slice(0, 10),
  relationships,
);
const primary = records.filter((o) => o.kind === 'primary');
const problems: string[] = [];
if (
  primary.length < 30 ||
  new Set(primary.flatMap((o) => o.locations.map((l) => l.country_code))).size <
    5
)
  problems.push(
    'Reviewed coverage is below the proposed launch gate (30 primary organizations / 5 countries).',
  );
if (!projectConfig().privateRemovalUrl)
  problems.push(
    'Private reporting contact is absent or a development placeholder.',
  );
if (!projectConfig().editorialUrl)
  problems.push('Editorial inbox is absent or a development placeholder.');
if (process.env.ATLAS_DEMO === '1' || process.env.NEXT_PUBLIC_DEMO === '1')
  problems.push(
    'Synthetic demo mode must not be published as a verified atlas.',
  );
if (process.env.ATLAS_LICENSES_CONFIRMED !== '1')
  problems.push('Owner license/provenance confirmation is not recorded.');
if (process.env.ATLAS_REVIEW_CONFIRMED !== '1')
  problems.push('Human evidence, consent and safety review is not confirmed.');
if (process.env.ATLAS_DELIVERY_CONFIRMED !== '1')
  problems.push(
    'Non-GitHub editorial delivery and private reporting have not been tested.',
  );
if (process.env.ATLAS_QUALITY_CONFIRMED !== '1')
  problems.push(
    'Accessibility, performance, removal/recovery and hosting verification are not confirmed.',
  );
if (problems.length) {
  console.error(
    'Public release is not ready:\n' + problems.map((p) => `- ${p}`).join('\n'),
  );
  process.exitCode = 1;
} else
  console.log(
    'Configured release gates passed; deploy only the tested artifact recorded in the release checklist.',
  );
