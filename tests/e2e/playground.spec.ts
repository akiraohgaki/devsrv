import { expect, test } from '@playwright/test';

test.describe('playground', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/.playground');
  });

  test('code running', async ({ page, baseURL }) => {
    const code = `
      import template from '${baseURL}/template.bundle.js';

      playground.preview.set(template.content);

      playground.logs.add(playground.preview.get().innerHTML);
    `;

    console.log(code);

    await page.locator('[data-content="code"] code').fill(code);
    await page.locator('[data-action="code.run"]').click();

    await expect(page.locator('[data-content="code"] code')).toHaveText(/.+template\.bundle\.js.+/);
    await expect(page.locator('[data-content="preview"]')).toHaveText(/.+bundled into.+/);
    await expect(page.locator('[data-content="log"]')).toHaveText([/.+bundled into.+/]);

    await page.locator('[data-action="code.clear"]').click();
    await page.locator('[data-action="preview.clear"]').click();
    await page.locator('[data-action="logs.clear"]').click();

    await expect(page.locator('[data-content="code"] code')).not.toHaveText(/.+template\.bundle\.js.+/);
    await expect(page.locator('[data-content="preview"]')).not.toHaveText(/.+bundled into.+/);
    await expect(page.locator('[data-content="log"]')).not.toHaveText([/.+bundled into.+/]);
  });
});
