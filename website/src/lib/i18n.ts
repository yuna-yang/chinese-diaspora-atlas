import en from '../locales/en.json';
import zh from '../locales/zh-CN.json';
import type { Locale } from './contracts';
export function messages(locale: Locale): typeof en {
  return locale === 'zh-CN' ? zh : en;
}
export function localizedText(
  value: { zh: string | null; en: string | null },
  locale: Locale,
) {
  const key = locale === 'zh-CN' ? 'zh' : 'en';
  const fallback = key === 'zh' ? 'en' : 'zh';
  return {
    text: value[key] ?? value[fallback] ?? '',
    lang: value[key]
      ? key === 'zh'
        ? 'zh-CN'
        : 'en'
      : fallback === 'zh'
        ? 'zh-CN'
        : 'en',
    isFallback: !value[key],
  };
}
export const label = (value: { zh: string; en: string }, locale: Locale) =>
  locale === 'zh-CN' ? value.zh : value.en;
export const localeKey = (locale: Locale) => (locale === 'zh-CN' ? 'zh' : 'en');
