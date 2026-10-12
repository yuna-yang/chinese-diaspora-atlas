import { it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Profile from '../../website/src/features/profile/Profile';
import RelationshipList from '../../website/src/features/network/RelationshipList';
import { buildDataset } from '../../scripts/lib/exports';
import nodes from '../fixtures/demo-nodes.json';
import refs from '../fixtures/references.json';
import edges from '../fixtures/relationships.json';
const d = buildDataset(
  nodes as any,
  refs,
  '2026-10-12T00:00:00Z',
  edges as any,
);
it('shows sourced secondary context and public role contact with evidence', () => {
  const o = {
    ...d.organizations.find((o) => o.id === 'example-collective')!,
    founded_year: 2020,
    reach: {
      scope: 'local',
      summary: { en: 'Documented local reach', zh: null },
      source_urls: ['https://example.org/reach'],
    },
    public_contacts: [
      {
        kind: 'role_email',
        value: 'hello@example.org',
        source_url: 'https://example.org/contact',
      },
    ],
  } as any;
  const html = renderToStaticMarkup(
    <Profile organization={o} dataset={d} locale="en" />,
  );
  expect(html).toContain('2020');
  expect(html).toContain('Documented local reach');
  expect(html).toContain('mailto:hello%40example.org');
  expect(html).toContain('https://example.org/contact');
});
it('retains period explanations and independent relationship verification dates', () => {
  const e = {
    ...d.relationships[0],
    period: {
      start: null,
      end: null,
      label: { en: 'Only documented during the library reopening', zh: null },
    },
    last_verified: '2026-10-10',
  };
  const html = renderToStaticMarkup(
    <RelationshipList dataset={d} edges={[e]} locale="en" />,
  );
  expect(html).toContain('Only documented during the library reopening');
  expect(html).toContain('dateTime="2026-10-10"');
});
