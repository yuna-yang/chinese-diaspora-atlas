import type { Dataset, Statistics, Locale } from '../../lib/contracts';
import { messages, label } from '../../lib/i18n';
import { publicPath } from '../../lib/paths';
import { networkMessages } from '../network/messages';
export default function DataPage({
  dataset: d,
  statistics: s,
  locale,
}: {
  dataset: Dataset;
  statistics: Statistics;
  locale: Locale;
}) {
  const t = messages(locale);
  return (
    <main id="main" className="content-page">
      <p className="eyebrow">{t.data}</p>
      <h1>{t.allData}</h1>
      <p className="page-intro">{t.dataIntro}</p>
      <div className="stats-grid">
        {[
          [s.total, networkMessages(locale).primary],
          [s.institutions, networkMessages(locale).institution],
          [s.relationships, networkMessages(locale).relationships],
          [Object.keys(s.byCountry).length, t.countries],
          [s.onlineOnly, t.onlineCount],
          [s.stale, t.staleCount],
        ].map(([value, title]) => (
          <div className="stat-card" key={title}>
            <strong>{value}</strong>
            <span>{title}</span>
          </div>
        ))}
      </div>
      <div className="download-actions">
        <a
          className="download-link"
          href={publicPath('/data/organizations.json')}
          download
        >
          {t.downloadJson} ↓
        </a>
        <a
          className="download-link"
          href={publicPath('/data/organizations.csv')}
          download
        >
          {t.downloadCsv} ↓
        </a>
      </div>
      <div className="download-actions">
        {[
          'atlas.json',
          'relationships.json',
          'relationships.csv',
          'LICENSE-DATA',
        ].map((file) => (
          <a
            className="download-link"
            key={file}
            href={publicPath('/data/' + file)}
            download
          >
            {file} ↓
          </a>
        ))}
      </div>
      <p>{t.coverageNote}</p>
      <p className="data-metadata">{t.csvNote}</p>
      <div className="counts-columns">
        <section>
          <h2>{t.byCategory}</h2>
          {d.reference_data.categories.map((c) => (
            <div className="count-row" key={c.id}>
              <span>{label(c.labels, locale)}</span>
              <strong>{s.byCategory[c.id] ?? 0}</strong>
            </div>
          ))}
        </section>
        <section>
          <h2>{t.byCountry}</h2>
          {d.reference_data.countries.map((c) => (
            <div className="count-row" key={c.code}>
              <span>{label(c.names, locale)}</span>
              <strong>{s.byCountry[c.code] ?? 0}</strong>
            </div>
          ))}
          <h2>{t.activity}</h2>
          {(['active', 'unknown', 'inactive'] as const).map((status) => (
            <div className="count-row" key={status}>
              <span>{t[status]}</span>
              <strong>{s.byActivity[status]}</strong>
            </div>
          ))}
        </section>
      </div>
      <section className="prose-section data-metadata">
        <p>
          {t.release}:{' '}
          <time dateTime={d.generated_at}>{d.generated_at.slice(0, 10)}</time>
          <br />
          {d.dataset_version}
        </p>
        <p>
          {t.license}:{' '}
          {locale === 'zh-CN'
            ? 'CC BY 4.0（拟采用，公开发布前需负责人确认）'
            : d.license}
        </p>
        <p>
          {locale === 'zh-CN'
            ? '署名：中国离散社群地图贡献者。各条目包含信息来源。'
            : d.attribution}
        </p>
      </section>
    </main>
  );
}
