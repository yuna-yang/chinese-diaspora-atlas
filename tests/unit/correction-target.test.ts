import { it, expect } from 'vitest';
import {
  validateProposal,
  publicProposal,
} from '../../website/src/features/contribute/proposals';
const draft = {
  mode: 'correction',
  name: 'Correct relationship',
  summary: 'Original correction',
  sourceUrl: 'https://example.org/evidence',
  sourceId: 'library-space',
  targetId: '',
  geography: '',
  answers: [],
  permission: true,
  targetKind: 'relationship',
} as any;
it('validates corrections against the selected node or relationship namespace', () => {
  expect(
    validateProposal(draft, ['example-collective'], ['library-space']),
  ).toEqual([]);
  expect(
    validateProposal(
      { ...draft, sourceId: 'example-collective' },
      ['example-collective'],
      ['library-space'],
    ),
  ).toContain('sourceId');
  expect(publicProposal(draft)?.correction_target_kind).toBe('relationship');
});
