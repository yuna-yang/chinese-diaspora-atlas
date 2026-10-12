import { describe, it, expect } from 'vitest';
import { publicPath } from '../../website/src/lib/paths';
describe('static hosting paths', () => {
  it('keeps profile links within the configured repository subpath', () => {
    expect(publicPath('/en/organizations/example/', '/atlas-test')).toBe(
      '/atlas-test/en/organizations/example/',
    );
  });
  it('rejects malformed base paths', () => {
    expect(() => publicPath('/en/', '/bad/../path')).toThrow();
  });
});
