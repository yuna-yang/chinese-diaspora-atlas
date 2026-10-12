'use client';
import type { Locale } from '../lib/contracts';
import { publicPath } from '../lib/paths';
export default function LocaleSwitch({ locale }: { locale: Locale }) {
  const other = locale === 'en' ? 'zh-CN' : 'en';
  return (
    <a
      className="locale-switch"
      href={publicPath(`/${other}/`)}
      onClick={(e) => {
        e.preventDefault();
        const segments = window.location.pathname.split('/');
        const i = segments.indexOf(locale);
        if (i >= 0) segments[i] = other;
        window.location.assign(segments.join('/') + window.location.search);
      }}
    >
      {other === 'en' ? 'English' : '简体中文'}
    </a>
  );
}
