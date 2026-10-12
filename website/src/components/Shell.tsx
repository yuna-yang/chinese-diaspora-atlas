import type { ReactNode } from 'react';
import type { Locale } from '../lib/contracts';
import { messages } from '../lib/i18n';
import { publicPath } from '../lib/paths';
import LocaleSwitch from './LocaleSwitch';
export default function Shell({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const t = messages(locale);
  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <header className="site-header">
        <a className="brand" href={publicPath(`/${locale}/`)}>
          <span className="brand-symbol" aria-hidden="true">
            ✳
          </span>
          <span>
            {t.brand}
            <small>{t.brandSub}</small>
          </span>
        </a>
        <nav aria-label={t.navigation}>
          <a href={publicPath(`/${locale}/`)}>{t.explore}</a>
          <a href={publicPath(`/${locale}/about/`)}>{t.about}</a>
          <a href={publicPath(`/${locale}/data/`)}>{t.data}</a>
          <a
            className="contribute-nav"
            href={publicPath(`/${locale}/contribute/`)}
          >
            {t.contribute} <span aria-hidden="true">↗</span>
          </a>
        </nav>
        <LocaleSwitch locale={locale} />
      </header>
      {process.env.NEXT_PUBLIC_DEMO === '1' ? (
        <div className="demo-banner">{t.demo}</div>
      ) : null}
      {children}
      <footer className="site-footer">
        <span>✳ {t.footer}</span>
        <span>
          <a href={publicPath(`/${locale}/privacy/`)}>{t.privacy}</a> ·{' '}
          {t.openSource}
        </span>
      </footer>
    </>
  );
}
