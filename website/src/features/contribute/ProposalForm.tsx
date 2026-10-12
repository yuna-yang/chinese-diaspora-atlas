'use client';
import { useState } from 'react';
import type { Locale } from '../../lib/contracts';
import {
  publicProposal,
  proposalIssueUrl,
  validateProposal,
  type ProposalDraft,
  type ProposalMode,
} from './proposals';
const en = {
  targetKind: 'Correction target',
  heading: 'Prepare a contribution',
  mode: 'Contribution type',
  organization: 'Add an organization',
  relationship: 'Add a relationship',
  correction: 'Correction',
  translation: 'Translation',
  questionnaire: 'Voluntary questionnaire',
  name: 'Organization or proposal name',
  summary: 'Original summary / proposed change',
  sourceUrl: 'Public evidence URL (HTTPS)',
  sourceId: 'Existing or candidate source ID',
  targetId: 'Existing or candidate partner ID',
  geography: 'City / country or online scope',
  permission:
    'I permit the proposal details above to be shared publicly after editorial review.',
  answerPermission: 'This answer may be shared publicly',
  prepare: 'Preview proposal',
  download: 'Download proposal JSON',
  issue: 'Prepare public GitHub proposal',
  mail: 'Prepare editorial email draft',
  notSent: 'Draft only — nothing has been sent or published.',
  privateNote:
    'Answers are optional. Unchecked answers are confidential and excluded from the public preview and GitHub handoff. The downloaded JSON includes all answers: keep it private and send only to a trusted editorial inbox.',
  noMail:
    'Editorial inbox is not configured. Preview and download are available; no delivery has occurred.',
  invalid: 'Please correct these fields:',
  known: 'Published IDs',
  candidate:
    'Unknown endpoint IDs remain review candidates. No relationship is added automatically.',
  publicPreview: 'Public preview',
  privateDownload: 'Private draft includes all answers and permission flags.',
  questions: [
    'What does your organization do?',
    'Which organizations or institutions have you worked with?',
    'What forms did those relationships take?',
    'Can you describe one concrete collaboration?',
    'Are there other initiatives the atlas should include?',
    'Which information may be published?',
  ],
};
const zh: typeof en = {
  targetKind: '更正对象',
  heading: '准备贡献草稿',
  mode: '贡献类型',
  organization: '添加组织',
  relationship: '添加关系',
  correction: '更正',
  translation: '翻译',
  questionnaire: '自愿问卷',
  name: '组织或提案名称',
  summary: '原创简介／建议修改',
  sourceUrl: '公开证据链接（HTTPS）',
  sourceId: '现有或候选来源 ID',
  targetId: '现有或候选伙伴 ID',
  geography: '城市／国家或线上范围',
  permission: '我同意以上提案信息经编辑审核后公开。',
  answerPermission: '此回答可以公开',
  prepare: '预览提案',
  download: '下载提案 JSON',
  issue: '准备公开 GitHub 提案',
  mail: '准备编辑邮件草稿',
  notSent: '仅为草稿——尚未发送或发布任何内容。',
  privateNote:
    '回答自愿。未勾选的回答保密，不进入公开预览或 GitHub 提案。下载的 JSON 包含所有回答：请私下保存，仅发送到可信的编辑邮箱。',
  noMail: '尚未配置编辑邮箱。可预览和下载；尚未送达。',
  invalid: '请更正以下字段：',
  known: '已发布 ID',
  candidate: '未知端点 ID 保持为候选，须经审核。不会自动添加关系。',
  publicPreview: '公开预览',
  privateDownload: '私人草稿包含所有回答及许可标记。',
  questions: [
    '您的组织主要做什么？',
    '您与哪些组织或机构合作过？',
    '这些关系采取了哪些形式？',
    '请描述一次具体合作。',
    '还有哪些倡议应纳入地图？',
    '哪些信息可以公开？',
  ],
};
export default function ProposalForm({
  locale,
  knownIds,
  relationshipIds,
  repositoryUrl,
  editorialUrl,
}: {
  locale: Locale;
  knownIds: string[];
  relationshipIds: string[];
  repositoryUrl: string | null;
  editorialUrl: string | null;
}) {
  const t = locale === 'zh-CN' ? zh : en;
  const [draft, setDraft] = useState<ProposalDraft>({
    mode: 'organization',
    targetKind: 'organization',
    name: '',
    summary: '',
    sourceUrl: '',
    sourceId: '',
    targetId: '',
    geography: '',
    permission: false,
    answers: t.questions.map((_, question) => ({
      question,
      value: '',
      public: false,
    })),
  });
  const [prepared, setPrepared] = useState(false),
    [issues, setIssues] = useState<string[]>([]);
  const change = (patch: Partial<ProposalDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setPrepared(false);
  };
  const publicPart = publicProposal(draft),
    issue = prepared ? proposalIssueUrl(draft, repositoryUrl) : null;
  const privateJson = JSON.stringify(
    { schema_version: 1, workflow: 'candidate', ...draft },
    null,
    2,
  );
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([privateJson], { type: 'application/json;charset=utf-8' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'atlas-proposal-private.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <section className="proposal-section">
      <h2>{t.heading}</h2>
      <p>{t.notSent}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const errors = validateProposal(draft, knownIds, relationshipIds);
          setIssues(errors);
          setPrepared(!errors.length);
        }}
      >
        <label htmlFor="proposal-mode">{t.mode}</label>
        <select
          id="proposal-mode"
          value={draft.mode}
          onChange={(e) => change({ mode: e.target.value as ProposalMode })}
        >
          {(
            [
              'organization',
              'relationship',
              'correction',
              'translation',
              'questionnaire',
            ] as const
          ).map((k) => (
            <option key={k} value={k}>
              {t[k]}
            </option>
          ))}
        </select>
        {['correction', 'translation'].includes(draft.mode) ? (
          <>
            <label htmlFor="proposal-targetKind">{t.targetKind}</label>
            <select
              id="proposal-targetKind"
              value={draft.targetKind}
              onChange={(e) =>
                change({
                  targetKind: e.target.value as 'organization' | 'relationship',
                  sourceId: '',
                })
              }
            >
              <option value="organization">{t.organization}</option>
              <option value="relationship">{t.relationship}</option>
            </select>
          </>
        ) : null}
        {(['name', 'summary', 'sourceUrl', 'geography'] as const).map((k) => (
          <div className="proposal-field" key={k}>
            <label htmlFor={`proposal-${k}`}>{t[k]}</label>
            {k === 'summary' ? (
              <textarea
                id={`proposal-${k}`}
                required
                maxLength={600}
                value={draft[k]}
                onChange={(e) => change({ [k]: e.target.value })}
              />
            ) : (
              <input
                id={`proposal-${k}`}
                type={k === 'sourceUrl' ? 'url' : 'text'}
                required={k !== 'geography'}
                maxLength={k === 'name' ? 160 : k === 'geography' ? 200 : 2000}
                value={draft[k]}
                onChange={(e) => change({ [k]: e.target.value })}
              />
            )}
          </div>
        ))}
        {['relationship', 'correction', 'translation'].includes(draft.mode) ? (
          <>
            <label htmlFor="proposal-sourceId">{t.sourceId}</label>
            <input
              id="proposal-sourceId"
              required
              list="published-ids"
              value={draft.sourceId}
              onChange={(e) => change({ sourceId: e.target.value })}
            />
            <datalist id="published-ids">
              {(draft.mode === 'correction' || draft.mode === 'translation'
                ? draft.targetKind === 'relationship'
                  ? relationshipIds
                  : knownIds
                : knownIds
              ).map((id) => (
                <option key={id} value={id} />
              ))}
            </datalist>
            {draft.mode === 'relationship' ? (
              <>
                <label htmlFor="proposal-targetId">{t.targetId}</label>
                <input
                  id="proposal-targetId"
                  required
                  list="published-ids"
                  value={draft.targetId}
                  onChange={(e) => change({ targetId: e.target.value })}
                />
                <p>{t.candidate}</p>
              </>
            ) : null}
          </>
        ) : null}
        {draft.mode === 'questionnaire' ? (
          <>
            <p className="policy-panel">{t.privateNote}</p>
            {t.questions.map((q, i) => (
              <fieldset key={q}>
                <legend>
                  {i + 1}. {q}
                </legend>
                <textarea
                  aria-label={q}
                  value={draft.answers[i].value}
                  maxLength={2000}
                  onChange={(e) =>
                    change({
                      answers: draft.answers.map((a, j) =>
                        j === i ? { ...a, value: e.target.value } : a,
                      ),
                    })
                  }
                />
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={draft.answers[i].public}
                    onChange={(e) =>
                      change({
                        answers: draft.answers.map((a, j) =>
                          j === i ? { ...a, public: e.target.checked } : a,
                        ),
                      })
                    }
                  />
                  {t.answerPermission}
                </label>
              </fieldset>
            ))}
          </>
        ) : null}
        <label className="check-row">
          <input
            type="checkbox"
            checked={draft.permission}
            onChange={(e) => change({ permission: e.target.checked })}
          />
          {t.permission}
        </label>
        <button type="submit">{t.prepare}</button>
        {issues.length ? (
          <p role="alert">
            {t.invalid}{' '}
            {issues.map((k) => t[k as keyof typeof t] ?? k).join(', ')}
          </p>
        ) : null}
      </form>
      {prepared ? (
        <div className="proposal-preview" aria-live="polite">
          <h3>{t.publicPreview}</h3>
          <pre>{JSON.stringify(publicPart, null, 2)}</pre>
          <p>{t.privateDownload}</p>
          <div className="download-actions">
            <button onClick={download}>{t.download}</button>
            {issue ? (
              <a href={issue} target="_blank" rel="noopener noreferrer">
                {t.issue}
              </a>
            ) : null}
            {editorialUrl ? (
              <a
                href={`${editorialUrl}?${new URLSearchParams({ subject: 'Scattered Stars editorial proposal', body: 'Private review draft; not public permission for unchecked answers.\n\n' + privateJson })}`}
              >
                {t.mail}
              </a>
            ) : (
              <p>{t.noMail}</p>
            )}
          </div>
          <p>{t.notSent}</p>
        </div>
      ) : null}
    </section>
  );
}
