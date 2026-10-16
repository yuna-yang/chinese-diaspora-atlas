import { it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  ProfilePanel,
  AboutPanel,
} from '../../website/src/features/minimal/Panels';
import { buildMapSnapshot } from '../../scripts/lib/map-snapshot';
import { buildDataset } from '../../scripts/lib/exports';
import nodes from '../fixtures/demo-nodes.json';
import refs from '../fixtures/references.json';
import links from '../fixtures/relationships.json';
it('shows dated cooperation, explicit language fallback and a repository record link', () => {
  const d = buildMapSnapshot(
    buildDataset(nodes as any, refs, '2026-10-13T00:00:00Z', links as any),
    true,
  );
  const n = d.nodes.find((n) => n.id === 'example-collective')!;
  n.summary.zh = null;
  const html = renderToStaticMarkup(
    createElement(ProfilePanel, {
      node: n,
      data: d,
      locale: 'zh-CN',
      close: () => {},
    }),
  );
  expect(html).toContain('2025');
  expect(html).toContain('lang="en"');
  expect(html).toContain('暂无中文译文');
  expect(html).toContain(
    'github.com/yuna-yang/chinese-diaspora-atlas/blob/main/tests/fixtures/demo-nodes.json',
  );
});
it('About discloses provenance and incomplete geographic coverage', () => {
  const html = renderToStaticMarkup(
    createElement(AboutPanel, { locale: 'en', demo: true, close: () => {} }),
  );
  expect(html).toContain('Interview');
  expect(html).toContain('Coverage is incomplete');
});
