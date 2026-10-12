import type { Locale } from '../../../lib/contracts';
import { messages } from '../../../lib/i18n';
import Shell from '../../../components/Shell';
export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params,
    t = messages(locale);
  return (
    <Shell locale={locale}>
      <main id="main" className="content-page">
        <p className="eyebrow">{t.about}</p>
        <h1>{t.ourStory}</h1>
        <p className="page-intro">{t.aboutIntro}</p>
        <section className="prose-section">
          <h2>{t.methodology}</h2>
          <p>{t.scopeText}</p>
          <p>{t.reviewText}</p>
        </section>
        <section className="prose-section">
          <h2>{t.affiliation}</h2>
          <p>{t.affiliationText}</p>
        </section>
      </main>
    </Shell>
  );
}
