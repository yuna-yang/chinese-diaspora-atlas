import { it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import RelationshipList from '../../website/src/features/network/RelationshipList';
import nodes from '../fixtures/demo-nodes.json';
import edges from '../fixtures/relationships.json';
import refs from '../fixtures/references.json';
import { buildDataset } from '../../scripts/lib/exports';
const d = buildDataset(
  nodes as any,
  refs,
  '2026-10-12T00:00:00Z',
  edges as any,
);
it('provides evidenced, accessible relationships including coincident partners', () => {
  const html = renderToStaticMarkup(
    <RelationshipList dataset={d} edges={d.relationships} locale="en" />,
  );
  expect(html).toContain('Civic Library');
  expect(html).toContain('Bridging');
  expect(html).toContain('Linking');
  expect(html).toContain('Unclassified');
  expect(html).toContain('https://example.org/');
  expect(html).toContain('2025');
});
it('provides Chinese relationship labels', () => {
  const html = renderToStaticMarkup(
    <RelationshipList dataset={d} edges={d.relationships} locale="zh-CN" />,
  );
  expect(html).toContain('桥接');
  expect(html).toContain('证据');
});
