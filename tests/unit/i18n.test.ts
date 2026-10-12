import { it, expect } from 'vitest';
import { localizedText, messages } from '../../website/src/lib/i18n';
it('labels missing translations instead of fabricating text', () => {
  expect(localizedText({ zh: null, en: 'Original English' }, 'zh-CN')).toEqual({
    text: 'Original English',
    lang: 'en',
    isFallback: true,
  });
});
it('renders Chinese control labels rather than encoding replacement characters', () => {
  expect(messages('zh-CN').search).toMatch(/\p{Script=Han}/u);
  expect(messages('zh-CN').locate).toMatch(/\p{Script=Han}/u);
  expect(Object.keys(messages('zh-CN')).sort()).toEqual(
    Object.keys(messages('en')).sort(),
  );
});
