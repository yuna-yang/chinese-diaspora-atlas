import { test as base, expect } from '@playwright/test';
export const test = base.extend({
  context: async ({ context }, use) => {
    await context.route('**/*', (route) => {
      const u = new URL(route.request().url());
      if (u.hostname === '127.0.0.1' || u.hostname === 'localhost')
        return route.continue();
      if (u.hostname === 'tile.openstreetmap.org')
        return route.fulfill({
          contentType: 'image/png',
          body: Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lS8AAAAASUVORK5CYII=',
            'base64',
          ),
        });
      return route.abort();
    });
    await use(context);
  },
});
export { expect };
