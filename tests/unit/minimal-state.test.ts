import { it, expect } from 'vitest';
import {
  parseViewState,
  viewUrl,
} from '../../website/src/features/minimal/state';
it('restores only valid mode/selection/locale without coordinates or old filters', () => {
  const s = parseViewState(
    '/zh-CN/',
    new URLSearchParams(
      'view=gather&node=example-collective&q=old&latitude=55',
    ),
    ['example-collective'],
  );
  expect(s).toEqual({
    locale: 'zh-CN',
    view: 'gather',
    selectedId: 'example-collective',
    about: false,
  });
  expect(viewUrl(s)).toBe('/zh-CN/?view=gather&node=example-collective');
  expect(
    parseViewState('/en/', new URLSearchParams('node=removed&view=bad'), [])
      .selectedId,
  ).toBeNull();
});
it('About clears selection and legacy About paths open the information destination', () => {
  expect(
    parseViewState(
      '/en/about/',
      new URLSearchParams('node=example-collective'),
      ['example-collective'],
    ),
  ).toMatchObject({ about: true, selectedId: null });
});
