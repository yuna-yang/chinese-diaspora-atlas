import { safeUrl } from '../../lib/safe-url';
export type ProposalMode =
  | 'organization'
  | 'relationship'
  | 'correction'
  | 'translation'
  | 'questionnaire';
export interface ProposalDraft {
  mode: ProposalMode;
  targetKind?: 'organization' | 'relationship';
  name: string;
  summary: string;
  sourceUrl: string;
  sourceId: string;
  targetId: string;
  geography: string;
  answers: readonly { question: number; value: string; public: boolean }[];
  permission: boolean;
}
export function validateProposal(
  d: ProposalDraft,
  knownIds: readonly string[],
  relationshipIds: readonly string[] = [],
): string[] {
  const issues: string[] = [];
  if (!d.name.trim() || d.name.length > 160) issues.push('name');
  if (!d.summary.trim() || d.summary.length > 600) issues.push('summary');
  if (!safeUrl(d.sourceUrl)) issues.push('sourceUrl');
  const slug = (v: string) =>
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v) && v.length <= 100;
  if (d.mode === 'relationship') {
    if (!slug(d.sourceId)) issues.push('sourceId');
    if (!slug(d.targetId) || d.sourceId === d.targetId) issues.push('targetId');
  }
  if (
    (d.mode === 'correction' || d.mode === 'translation') &&
    !(d.targetKind === 'relationship' ? relationshipIds : knownIds).includes(
      d.sourceId,
    )
  )
    issues.push('sourceId');
  if (d.geography.length > 200) issues.push('geography');
  if (
    d.answers.some(
      (a) => a.value.length > 2000 || a.question < 0 || a.question > 5,
    )
  )
    issues.push('answers');
  return [...new Set(issues)];
}
export function publicProposal(d: ProposalDraft) {
  if (!d.permission) return null;
  return {
    schema_version: 1,
    workflow: 'candidate' as const,
    mode: d.mode,
    correction_target_kind: d.targetKind ?? 'organization',
    name: d.name.trim(),
    summary: d.summary.trim(),
    source_url: d.sourceUrl.trim(),
    source_id: ['relationship', 'correction', 'translation'].includes(d.mode)
      ? d.sourceId.trim() || null
      : null,
    target_id: d.mode === 'relationship' ? d.targetId.trim() || null : null,
    geography: d.geography.trim() || null,
    publication_permission: true,
    answers: (d.mode === 'questionnaire' ? d.answers : [])
      .filter((a) => a.public && a.value.trim())
      .map((a) => ({
        question: a.question,
        value: a.value.trim(),
        public: true,
      })),
  };
}
export function proposalIssueUrl(d: ProposalDraft, repository: string | null) {
  const p = publicProposal(d);
  if (
    !p ||
    !repository ||
    !/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/.test(repository)
  )
    return null;
  return `${repository}/issues/new?${new URLSearchParams({ title: `Proposal: ${d.name.slice(0, 100)}`, body: 'Review candidate; not published.\n\n```json\n' + JSON.stringify(p, null, 2) + '\n```' })}`;
}
