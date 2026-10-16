'use client';
import { useEffect, useRef } from 'react';
import type { MapNode, MapSnapshot, Text } from './contracts';
import type { Locale } from '../../lib/contracts';
import { projectConfig } from '../../lib/project-config';
import { labels, textOf } from './ui';
function usePanelFocus() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const old = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    return () => {
      if (old?.isConnected) old.focus();
      else
        (document.querySelector('.atlas-title') as HTMLElement | null)?.focus();
    };
  }, []);
  return ref;
}
function Copy({
  value,
  locale,
  heading = false,
}: {
  value: Text;
  locale: Locale;
  heading?: boolean;
}) {
  const wanted = locale === 'en' ? value.en : value.zh,
    fallback = !wanted,
    lang = wanted ? locale : value.en ? 'en' : 'zh-CN';
  return (
    <>
      {heading ? (
        <h1 lang={lang}>{textOf(value, locale)}</h1>
      ) : (
        <p lang={lang}>{textOf(value, locale)}</p>
      )}
      {fallback && (
        <small className="translation-note">
          {locale === 'en' ? 'English translation unavailable' : '暂无中文译文'}
        </small>
      )}
    </>
  );
}
export function ProfilePanel({
  node,
  data,
  locale,
  close,
}: {
  node: MapNode;
  data: MapSnapshot;
  locale: Locale;
  close: () => void;
}) {
  const t = labels[locale],
    ref = usePanelFocus();
  return (
    <section
      ref={ref}
      tabIndex={-1}
      className="profile-panel floating"
      aria-label={textOf(node.names, locale)}
    >
      <button className="panel-close" onClick={close} aria-label={t.close}>
        ×
      </button>
      <Copy value={node.names} locale={locale} heading />
      <small>
        {
          t[
            node.basis === 'both'
              ? 'both'
              : node.basis === 'interview'
                ? 'interview'
                : 'public'
          ]
        }
      </small>
      <Copy value={node.summary} locale={locale} />
      <p>
        {node.onlineOnly
          ? t.online
          : node.locations
              .map((l) =>
                [l.city && textOf(l.city, locale), textOf(l.country, locale)]
                  .filter(Boolean)
                  .join(', '),
              )
              .join(' · ')}
      </p>
      {node.interview && (
        <blockquote>
          <Copy value={node.interview.excerpt} locale={locale} />
          <cite>
            <a href={node.interview.sourceUrl} target="_blank" rel="noreferrer">
              {node.interview.attribution} · {node.interview.date}
            </a>
          </cite>
        </blockquote>
      )}
      {node.links.length > 0 && (
        <ul>
          {node.links.map((l) => (
            <li key={l.url}>
              <a href={l.url} target="_blank" rel="noreferrer">
                {new URL(l.url).hostname}
              </a>
            </li>
          ))}
        </ul>
      )}
      {projectConfig().repositoryUrl && (
        <p>
          <a
            href={`${projectConfig().repositoryUrl}/blob/main/${data.demo ? 'tests/fixtures/demo-nodes.json' : `data/organizations/${node.id}.json`}`}
            target="_blank"
            rel="noreferrer"
          >
            {locale === 'en' ? 'Full record on GitHub' : 'GitHub 完整资料'} ↗
          </a>
        </p>
      )}
      {node.contacts.map((c) => (
        <p key={c.value}>
          {c.value} ·{' '}
          <a href={c.sourceUrl} target="_blank" rel="noreferrer">
            {t.sources}
          </a>
        </p>
      ))}
      {data.links.filter(
        (e) => e.sourceId === node.id || e.targetId === node.id,
      ).length > 0 && (
        <>
          <h2>{t.connections}</h2>
          {data.links
            .filter((e) => e.sourceId === node.id || e.targetId === node.id)
            .map((e) => (
              <p key={e.id}>
                {textOf(e.summary, locale)}{' '}
                <small>
                  {e.period.start || e.period.end
                    ? [e.period.start ?? '?', e.period.end ?? '?'].join(' – ')
                    : e.period.label.en || e.period.label.zh
                      ? textOf(e.period.label, locale)
                      : locale === 'en'
                        ? 'Dates unknown'
                        : '日期未知'}
                </small>{' '}
                <a href={e.sources[0]?.url} target="_blank" rel="noreferrer">
                  {t.sources}
                </a>
              </p>
            ))}
        </>
      )}
      <h2>{t.sources}</h2>
      <ul>
        {node.sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.title}
            </a>{' '}
            <small>{s.accessedAt}</small>
          </li>
        ))}
      </ul>
      <small>
        {t.verified}: {node.verifiedAt}
      </small>
    </section>
  );
}
export function AboutPanel({
  locale,
  demo,
  close,
}: {
  locale: Locale;
  demo: boolean;
  close: () => void;
}) {
  const ref = usePanelFocus(),
    t = labels[locale],
    zh = locale === 'zh-CN',
    config = projectConfig();
  return (
    <section
      ref={ref}
      tabIndex={-1}
      className="about-panel floating"
      aria-label={t.about}
    >
      <button onClick={close}>{t.back}</button>
      <h1>星散 · Scattered Stars</h1>
      <p>
        {zh
          ? '聚是一团火，散是满天星。'
          : 'Together, a fire; scattered, a sky full of stars.'}
      </p>
      <p>
        {zh
          ? '一个开放的华人离散社群地图。移动、缩放地图，点击星星了解社群；点击标题，在地理地图与聚星图之间切换。连线表示有来源支持的合作，不表示立场或认同。'
          : 'An open atlas of Chinese diaspora communities. Move and zoom the map, select a star, or use the title to gather the stars. Lines show documented cooperation, not affiliation or endorsement.'}
      </p>
      <p>
        {zh
          ? '资料卡区分公开信息与经同意发表的访谈；没有访谈证据的条目不会标为访谈。'
          : 'Public information summarizes public organizational sources. Interview excerpts require explicit publication permission and are labelled separately.'}
      </p>
      <p>
        {zh
          ? '当前覆盖不完整，不能视为全部社群名录。欧盟优先仍是讨论中的编辑方向，尚未确定地域限制。'
          : 'Coverage is incomplete; this atlas is not a census. EU-first coverage remains a proposal, with no agreed regional restriction.'}
      </p>
      <p>
        {zh
          ? '聚星图的布局是便于探索的排布，不代表地理位置、影响力或排名。'
          : 'The gathered layout supports exploration; star positions do not rank influence or represent geography.'}
      </p>
      {demo && (
        <p>
          {zh
            ? '当前全部社群、访谈与合作均为虚构演示。'
            : 'All communities, interviews and cooperation in this demo are fictional.'}
        </p>
      )}
      <p>
        {zh
          ? '位置以城市为单位，可能近似。没有地图位置的线上社群仍可在聚星图中查看。'
          : 'Locations are approximate city anchors. Online communities without geographic anchors remain available in the gathered view.'}
      </p>
      <p>
        {t.privacy}{' '}
        {zh
          ? '不会自动定位，也不会保存坐标。居中定位后，瓦片请求可能让地图服务商推断您查看的大致区域。'
          : 'Location is requested only when you activate the button and is not stored. Tile requests can reveal the approximate viewed area to the provider after centering.'}
      </p>
      <p>
        {zh
          ? '资料、方法、贡献方式、完整数据与开发进度均在 GitHub：'
          : 'Records, methods, contributions, full data and development progress are on GitHub:'}
      </p>
      {config.repositoryUrl && (
        <p>
          <a href={config.repositoryUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </p>
      )}
      <p>
        {zh
          ? '开源代码：MIT。数据许可须依据来源与发布审核确定。'
          : 'Open-source code: MIT. Data licensing depends on source permissions and release review.'}
      </p>
      <h2>{zh ? '更正与移除' : 'Corrections and removal'}</h2>
      {config.privateRemovalUrl ? (
        <a href={config.privateRemovalUrl}>
          {zh ? '私密联系' : 'Private contact'}
        </a>
      ) : (
        <p>
          {zh
            ? '私密移除联系方式尚未配置。请勿在公开 GitHub 问题中提交敏感信息。'
            : 'Private removal contact is not configured yet. Do not submit sensitive information in public GitHub issues.'}
        </p>
      )}
    </section>
  );
}
