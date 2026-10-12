import { it, expect } from 'vitest';
import {
  validateProposal,
  publicProposal,
  proposalIssueUrl,
} from '../../website/src/features/contribute/proposals';
const draft = {
  mode: 'questionnaire',
  name: 'Example',
  summary: 'Original public summary',
  sourceUrl: 'https://example.org/evidence',
  sourceId: 'example-collective',
  targetId: '',
  geography: 'Copenhagen',
  answers: [
    { question: 0, value: 'Confidential account', public: false },
    { question: 1, value: 'Approved statement', public: true },
  ],
  permission: true,
} as const;
it('excludes confidential questionnaire material from public proposals and issue URLs', () => {
  const publicPart = publicProposal(draft);
  expect(JSON.stringify(publicPart)).not.toContain('Confidential');
  expect(JSON.stringify(publicPart)).toContain('Approved statement');
  const url = proposalIssueUrl(draft, 'https://github.com/owner/atlas');
  expect(new URL(url!).searchParams.get('template')).toBe('web-proposal.md');
  expect(new URL(url!).searchParams.get('body')!).not.toContain('Confidential');
  expect(new URL(url!).searchParams.get('body')!).toContain(
    'Approved statement',
  );
});
it('does not prepare public handoff without permission', () => {
  expect(publicProposal({ ...draft, permission: false })).toBeNull();
  expect(
    proposalIssueUrl(
      { ...draft, permission: false },
      'https://github.com/owner/atlas',
    ),
  ).toBeNull();
});
it('does not publish fields hidden by the selected proposal mode', () => {
  const result = publicProposal({ ...draft, mode: 'organization' });
  expect(result?.answers).toEqual([]);
  expect(result?.source_id).toBeNull();
  expect(result?.target_id).toBeNull();
});
it('rejects unsafe evidence links, blank summaries, and invalid endpoint IDs', () => {
  expect(
    validateProposal(
      { ...draft, sourceUrl: 'https://example.org/page?%74oken=secret' },
      [],
    ),
  ).toContain('sourceUrl');
  expect(
    validateProposal(
      { ...draft, sourceUrl: 'https://chat.whatsapp.com/private-invite' },
      [],
    ),
  ).toContain('sourceUrl');
  expect(
    validateProposal(
      { ...draft, sourceUrl: 'https://example.org/page?token=secret' },
      [],
    ),
  ).toContain('sourceUrl');
  expect(
    validateProposal({ ...draft, sourceUrl: 'javascript:alert(1)' }, [
      'example-collective',
    ]),
  ).toContain('sourceUrl');
  expect(validateProposal({ ...draft, summary: ' ' }, [])).toContain('summary');
  expect(
    validateProposal(
      { ...draft, mode: 'relationship', sourceId: '../../secret' },
      [],
    ),
  ).toContain('sourceId');
});
it('marks unknown relationship endpoints as candidates instead of claiming publication', () => {
  expect(
    validateProposal(
      { ...draft, mode: 'relationship', targetId: 'new-partner' },
      ['example-collective'],
    ),
  ).toEqual([]);
  expect(
    publicProposal({ ...draft, mode: 'relationship', targetId: 'new-partner' })
      ?.workflow,
  ).toBe('candidate');
});
