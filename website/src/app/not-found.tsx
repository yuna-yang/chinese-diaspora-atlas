import { publicPath } from '../lib/paths';
export default function NotFound() {
  return (
    <main>
      <h1>Page not found · 页面不存在</h1>
      <a href={publicPath('/en/')}>Return to atlas · 返回地图</a>
    </main>
  );
}
