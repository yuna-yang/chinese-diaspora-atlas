import { it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Profile from '../../website/src/features/profile/Profile';
import RelationshipList from '../../website/src/features/network/RelationshipList';
import { buildDataset } from '../../scripts/lib/exports';
import nodes from '../fixtures/demo-nodes.json';
import refs from '../fixtures/references.json';
import edges from '../fixtures/relationships.json';
import zh from '../../website/src/locales/zh-CN.json';
const d = buildDataset(
  nodes as any,
  refs,
  '2026-10-12T00:00:00Z',
  edges as any,
);
it('labels fallback language for secondary profile and relationship context', () => {
  const o = {
    ...d.organizations.find((o) => o.id === 'example-collective')!,
    reach: {
      scope: 'local',
      summary: { en: 'Documented local reach', zh: null },
      source_urls: ['https://example.org/reach'],
    },
  } as any;
  expect(
    renderToStaticMarkup(
      <Profile organization={o} dataset={d} locale="zh-CN" />,
    ),
  ).toContain('<p lang="en">Documented local reach');
  const e = {
    ...d.relationships[0],
    classification_basis: { en: 'English explanation', zh: null },
  };
  expect(
    renderToStaticMarkup(
      <RelationshipList dataset={d} edges={[e]} locale="zh-CN" />,
    ),
  ).toContain(zh.fallback);
});
