import type { Locale } from '../../../lib/contracts';
import { messages } from '../../../lib/i18n';
import { projectConfig, issueUrl } from '../../../lib/project-config';
import Shell from '../../../components/Shell';
import ProposalForm from '../../../features/contribute/ProposalForm';
import { loadDataset } from '../../../lib/dataset';
export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params,
    t = messages(locale);
  const dataset = await loadDataset();
  const cards = [
    {
      title: t.addTitle,
      text: t.addText,
      url: issueUrl('add.yml'),
      symbol: '✳',
    },
    {
      title: t.correctTitle,
      text: t.correctText,
      url: issueUrl('correct.yml'),
      symbol: '✎',
    },
    {
      title: t.removeTitle,
      text: t.removeText,
      url: projectConfig().privateRemovalUrl,
      symbol: '♡',
    },
  ];
  return (
    <Shell locale={locale}>
      <main id="main" className="content-page">
        <p className="eyebrow">{t.contribute}</p>
        <h1>{t.contributeTitle}</h1>
        <p className="page-intro">{t.contributeIntro}</p>
        <div className="policy-panel">{t.publicWarning}</div>
        <div className="contribution-grid">
          {cards.map((c) => (
            <section className="contribution-card" key={c.title}>
              <span aria-hidden="true">{c.symbol}</span>
              <h2>{c.title}</h2>
              <p>{c.text}</p>
              {c.url ? (
                <a href={c.url}>
                  {c.symbol === '♡' ? t.removal : t.openIssue} ↗
                </a>
              ) : (
                <small className="channel-unavailable">{t.notConfigured}</small>
              )}
            </section>
          ))}
        </div>
        <ProposalForm
          locale={locale}
          knownIds={dataset.organizations.map((o) => o.id)}
          relationshipIds={dataset.relationships.map((e) => e.id)}
          repositoryUrl={projectConfig().repositoryUrl}
          editorialUrl={projectConfig().editorialUrl}
        />
        <section className="prose-section">
          <h2>{t.methodology}</h2>
          <p>{t.reviewText}</p>
        </section>
      </main>
    </Shell>
  );
}
