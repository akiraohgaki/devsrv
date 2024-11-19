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

  test('playground.code', async ({ page }) => {
    const code = `
      const isEnabled = true;
      playground.logs.add(isEnabled);

      if (isEnabled) {
        const newCode = playground.code.get().textContent.replace(
          'const isEnabled = true;',
          'const isEnabled = false;'
        );

        playground.code.clear();
        playground.logs.add(playground.code.get().textContent);

        playground.code.set(newCode);

        playground.code.run();
      }
    `;

    console.log(code);

    await page.locator('[data-content="code"] code').fill(code);
    await page.locator('[data-action="code.run"]').click();

    await expect(page.locator('[data-content="log"]')).toHaveText([
      'true',
      '',
      'false',
    ]);
  });

  test('playground.preview', async ({ page }) => {
    const code = `
      playground.preview.set('text');
      playground.logs.add(playground.preview.get().innerHTML);

      const divElement = document.createElement('div');
      divElement.textContent = 'text';
      playground.preview.set(divElement);
      playground.logs.add(playground.preview.get().innerHTML);

      const liElement = document.createElement('li');
      liElement.textContent = 'text';
      const ulElement = document.createElement('ul');
      ulElement.appendChild(liElement);
      playground.preview.set(ulElement.childNodes);
      playground.logs.add(playground.preview.get().innerHTML);

      playground.preview.clear();
      playground.logs.add(playground.preview.get().innerHTML);
    `;

    console.log(code);

    await page.locator('[data-content="code"] code').fill(code);
    await page.locator('[data-action="code.run"]').click();

    await expect(page.locator('[data-content="log"]')).toHaveText([
      'text',
      '<div>text</div>',
      '<li>text</li>',
      '',
    ]);
  });

  test('playground.logs', async ({ page }) => {
    const code = `
      playground.logs.add('abc');

      const text = playground.logs.get().querySelector('[data-content="log"]').textContent;

      playground.logs.clear();

      playground.logs.add(text);
      playground.logs.add(['abc',123]);
      playground.logs.add({abc:123});

      playground.logs.add(true);
      playground.logs.add(123);
      playground.logs.add(null);
      playground.logs.add(undefined);
    `;

    console.log(code);

    await page.locator('[data-content="code"] code').fill(code);
    await page.locator('[data-action="code.run"]').click();

    await expect(page.locator('[data-content="log"]')).toHaveText([
      'abc',
      '["abc",123]',
      '{"abc":123}',
      'true',
      '123',
      'null',
      'undefined',
    ]);
  });

  test('playground.wait', async ({ page }) => {
    const code = `
      playground.logs.add(0);

      setTimeout(() => {
        playground.logs.add(1);
      }, 50);

      await playground.wait(100);

      playground.logs.add(2);
    `;

    console.log(code);

    await page.locator('[data-content="code"] code').fill(code);
    await page.locator('[data-action="code.run"]').click();

    await expect(page.locator('[data-content="log"]')).toHaveText([
      '0',
      '1',
      '2',
    ]);
  });
});
