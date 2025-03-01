import { expect, test } from '@playwright/test';

test.describe('Playground page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/.playground');
  });

  test('code running', async ({ page, baseURL }) => {
    const code = `
      import { template } from '${baseURL}/template.bundle.js';

      Playground.preview.set(template.content);

      Playground.log(Playground.preview.get().innerHTML);
    `;

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

  test('Playground.code', async ({ page }) => {
    const code = `
      const isEnabled = true;

      Playground.log(isEnabled);

      if (isEnabled) {
        const newCode = Playground.code.get().replace(
          'const isEnabled = true;',
          'const isEnabled = false;'
        );

        Playground.code.clear();

        Playground.log(Playground.code.get());

        Playground.code.set(newCode);

        Playground.code.run();
      }
    `;

    await page.locator('[data-content="code"] code').fill(code);
    await page.locator('[data-action="code.run"]').click();

    await expect(page.locator('[data-content="log"]')).toHaveText([
      'true',
      '',
      'false',
    ]);
  });

  test('Playground.preview', async ({ page }) => {
    const code = `
      Playground.preview.set('<span>abc</span>');

      Playground.log(Playground.preview.get('span').outerHTML);

      const divElement = document.createElement('div');
      divElement.textContent = 'abc';

      Playground.preview.set(divElement);

      Playground.log(Playground.preview.get('div').outerHTML);

      const liElement = document.createElement('li');
      liElement.textContent = 'abc';
      const ulElement = document.createElement('ul');
      ulElement.appendChild(liElement);

      Playground.preview.set(ulElement.childNodes);

      Playground.log(Playground.preview.get().innerHTML);

      Playground.preview.clear();

      Playground.log(Playground.preview.get().innerHTML);
    `;

    await page.locator('[data-content="code"] code').fill(code);
    await page.locator('[data-action="code.run"]').click();

    await expect(page.locator('[data-content="log"]')).toHaveText([
      '<span>abc</span>',
      '<div>abc</div>',
      '<li>abc</li>',
      '',
    ]);
  });

  test('Playground.logs', async ({ page }) => {
    const code = `
      Playground.logs.add('abc');

      const logs = Playground.logs.get();

      Playground.logs.clear();

      Playground.logs.add(logs);
      Playground.logs.add(['abc',123]);
      Playground.logs.add({abc:123});
      Playground.logs.add(true);
      Playground.logs.add(123);
      Playground.logs.add(null);
      Playground.logs.add(undefined);
    `;

    await page.locator('[data-content="code"] code').fill(code);
    await page.locator('[data-action="code.run"]').click();

    await expect(page.locator('[data-content="log"]')).toHaveText([
      '["abc"]',
      '["abc",123]',
      '{"abc":123}',
      'true',
      '123',
      'null',
      'undefined',
    ]);
  });

  test('Playground.log()', async ({ page }) => {
    const code = `
      Playground.log('abc');
    `;

    await page.locator('[data-content="code"] code').fill(code);
    await page.locator('[data-action="code.run"]').click();

    await expect(page.locator('[data-content="log"]')).toHaveText([
      'abc',
    ]);
  });

  test('Playground.test()', async ({ page }) => {
    const code = `
      await Playground.test('test1', async (t) => {
        await t.step('step1', async (t) => {
          await t.step('step1A', () => {
            return true;
          });
        });
      });

      await Playground.test('test2', async (t) => {
        await t.step('step1', () => {});
        await t.step('step2', async (t) => {
          await t.step('step2A', () => {});
          await t.step('step2B', () => {
            throw new Error('error');
          });
          await t.step('step2C', () => {});
        });
        await t.step('step3', () => {});
      });
    `;

    await page.locator('[data-content="code"] code').fill(code);
    await page.locator('[data-action="code.run"]').click();

    await expect(page.locator('[data-content="log"]')).toHaveText([
      '# test1 ... Passed',
      '## step1 ... Passed',
      '### step1A ... Passed',
      'Result: true',
      '# test2 ... Failed',
      '## step1 ... Passed',
      '## step2 ... Failed',
      '### step2A ... Passed',
      '### step2B ... Failed',
      'Exception: error',
      '### step2C ... Passed',
      '## step3 ... Passed',
    ]);
  });

  test('Playground.sleep()', async ({ page }) => {
    const code = `
      Playground.log(0);

      setTimeout(() => Playground.log(1), 50);

      await Playground.sleep(100);

      Playground.log(2);
    `;

    await page.locator('[data-content="code"] code').fill(code);
    await page.locator('[data-action="code.run"]').click();

    await expect(page.locator('[data-content="log"]')).toHaveText([
      '0',
      '1',
      '2',
    ]);
  });
});
