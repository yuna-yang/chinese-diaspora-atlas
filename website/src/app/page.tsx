import { publicPath } from '../lib/paths';
export default function Root() {
  return (
    <html lang="en">
      <body>
        <main>
          <h1>Chinese Diaspora Atlas · 中国离散社群地图</h1>
          <p>
            <a href={publicPath('/en/')}>English</a> ·{' '}
            <a href={publicPath('/zh-CN/')}>简体中文</a>
          </p>
        </main>
      </body>
    </html>
  );
}
