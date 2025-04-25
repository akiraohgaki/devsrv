import { assert, assertEquals } from '@std/assert';

import { BuildHelper } from '../../mod.ts';

Deno.test('BuildHelper', async (t) => {
  let buildHelper: BuildHelper;

  const tempDir = await Deno.makeTempDir();

  console.log(tempDir);

  await t.step('constructor()', () => {
    buildHelper = new BuildHelper();

    assert(buildHelper);
  });

  await t.step('export()', async (t) => {
    await t.step('re-create directory', async () => {
      await buildHelper.export(`${tempDir}/demo`);

      assert((await Deno.stat(`${tempDir}/demo`)).isDirectory);
    });

    await t.step('re-create directory and copy files', async () => {
      await buildHelper.export(`${tempDir}/demo`, ['tests/demo/index.html']);

      assert((await Deno.stat(`${tempDir}/demo/index.html`)).isFile);
    });
  });

  await t.step('bundleFile()', async (t) => {
    await t.step('without options', async () => {
      await buildHelper.bundleFile(
        'tests/demo/main.ts',
        `${tempDir}/demo/main.bundle.js`,
      );

      assert((await Deno.stat(`${tempDir}/demo/main.bundle.js`)).isFile);
    });

    await t.step('minify option', async () => {
      await buildHelper.bundleFile(
        'tests/demo/main.ts',
        `${tempDir}/demo/main.bundle.min.js`,
        { minify: true },
      );

      assert((await Deno.stat(`${tempDir}/demo/main.bundle.min.js`)).isFile);
    });

    await t.step('externals option', async () => {
      await buildHelper.bundleFile(
        'tests/demo/external.ts',
        `${tempDir}/demo/external.bundle.js`,
        { externals: ['@*', 'jsr:*', 'npm:*', 'https:*', '../../node_modules/*'] },
      );

      assert((await Deno.stat(`${tempDir}/demo/external.bundle.js`)).isFile);
    });
  });

  await t.step('bundle()', async (t) => {
    await t.step('without options', async () => {
      const code = await buildHelper.bundle('tests/demo/main.ts');

      assertEquals(await Deno.readTextFile(`${tempDir}/demo/main.bundle.js`), code);
    });

    await t.step('minify option', async () => {
      const code = await buildHelper.bundle('tests/demo/main.ts', {
        minify: true,
      });

      assertEquals(await Deno.readTextFile(`${tempDir}/demo/main.bundle.min.js`), code);
    });

    await t.step('externals option', async () => {
      const code = await buildHelper.bundle('tests/demo/external.ts', {
        externals: ['@*', 'jsr:*', 'npm:*', 'https:*', '../../node_modules/*'],
      });

      assertEquals(await Deno.readTextFile(`${tempDir}/demo/external.bundle.js`), code);
    });
  });
});
