import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('website/out');
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const mime: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};
createServer(async (req, res) => {
  try {
    let url = decodeURIComponent(
      new URL(req.url ?? '/', 'http://localhost').pathname,
    );
    if (url === '/' && base) {
      res.writeHead(302, { Location: `${base}/` });
      res.end();
      return;
    }
    if (base && !url.startsWith(`${base}/`)) throw new Error('Not found');
    url = url.slice(base.length);
    let file = path.resolve(root, `.${url}`);
    if (file !== root && !file.startsWith(root + path.sep))
      throw new Error('Not found');
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    res.writeHead(200, {
      'Content-Type': mime[path.extname(file)] ?? 'application/octet-stream',
    });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(
      await readFile(path.join(root, '404.html')).catch(() =>
        Buffer.from('Page not found'),
      ),
    );
  }
}).listen(Number(process.env.PORT ?? 4173), '127.0.0.1', () =>
  process.stdout.write('Atlas static preview: http://127.0.0.1:4173\n'),
);
