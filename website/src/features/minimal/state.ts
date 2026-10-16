import type { Locale } from '../../lib/contracts';
import { publicPath } from '../../lib/paths';
import type { AtlasView } from './contracts';
export interface ViewState {
  locale: Locale;
  view: AtlasView;
  selectedId: string | null;
  about: boolean;
}
export function parseViewState(
  path: string,
  p: URLSearchParams,
  ids: string[],
): ViewState {
  const about = p.get('about') === '1' || path.endsWith('/about/');
  return {
    locale: path.includes('/zh-CN/') ? 'zh-CN' : 'en',
    view: p.get('view') === 'gather' ? 'gather' : 'scatter',
    selectedId:
      !about && ids.includes(p.get('node') ?? '') ? p.get('node') : null,
    about,
  };
}
export function viewUrl(s: ViewState): string {
  const q = new URLSearchParams();
  if (s.view === 'gather') q.set('view', 'gather');
  if (s.selectedId && !s.about) q.set('node', s.selectedId);
  if (s.about) q.set('about', '1');
  return publicPath(`/${s.locale}/`) + (q.size ? '?' + q : '');
}
