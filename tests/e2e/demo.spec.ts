import { expect, test } from '@playwright/test';

test.describe('Demo page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TypeScript bundling', async ({ page }) => {
    await expect(page.locator('body')).toHaveText(/.+bundled into.+/);
  });
});
