import type { Locale } from '../../../lib/contracts';
import { messages } from '../../../lib/i18n';
import { projectConfig } from '../../../lib/project-config';
import Shell from '../../../components/Shell';
export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params,
    t = messages(locale),
    contact = projectConfig().privateRemovalUrl;
  return (
    <Shell locale={locale}>
      <main id="main" className="content-page">
        <p className="eyebrow">{t.privacy}</p>
        <h1>{t.privacyTitle}</h1>
        <p className="page-intro">{t.privacyIntro}</p>
        <section className="prose-section">
          <p>{t.privacyData}</p>
          <h2>{t.locate}</h2>
          <p>{t.privacyLocation}</p>
          <p>{t.privacyTiles}</p>
          <h2>{t.removalContact}</h2>
          <p>{t.privacyRemoval}</p>
          {contact ? (
            <a className="download-link" href={contact}>
              {t.removalContact} ↗
            </a>
          ) : (
            <p className="channel-unavailable">{t.notConfigured}</p>
          )}
        </section>
      </main>
    </Shell>
  );
}
