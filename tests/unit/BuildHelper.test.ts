import { assert, assertEquals } from '@std/assert';

import { BuildHelper } from '../../mod.ts';

Deno.test('BuildHelper', async (t) => {
  let buildHelper: BuildHelper;

  await t.step('constructor()', () => {
    buildHelper = new BuildHelper();

    assert(buildHelper);
  });

  await t.step('export()', async (t) => {
    await t.step('re-create directory', async () => {
      await buildHelper.export('tmp/demo');

      assert((await Deno.stat('tmp/demo')).isDirectory);
    });

    await t.step('re-create directory and copy files', async () => {
      await buildHelper.export('tmp/demo', ['tests/demo/index.html']);

      assert((await Deno.stat('tmp/demo/index.html')).isFile);
    });
  });

  await t.step('bundleFile()', async (t) => {
    await t.step('without options', async () => {
      await buildHelper.bundleFile(
        'tests/demo/main.ts',
        'tmp/demo/main.bundle.js',
      );

      assert((await Deno.stat('tmp/demo/main.bundle.js')).isFile);
    });

    await t.step('minify option', async () => {
      await buildHelper.bundleFile(
        'tests/demo/main.ts',
        'tmp/demo/main.bundle.min.js',
        { minify: true },
      );

      assert((await Deno.stat('tmp/demo/main.bundle.min.js')).isFile);
    });

    await t.step('externals option', async () => {
      await buildHelper.bundleFile(
        'tests/demo/external.ts',
        'tmp/demo/external.bundle.js',
        { externals: ['@*', 'jsr:*', 'npm:*', 'https:*', '../../node_modules/*'] },
      );

      assert((await Deno.stat('tmp/demo/external.bundle.js')).isFile);
    });
  });

  await t.step('bundle()', async (t) => {
    await t.step('without options', async () => {
      const code = await buildHelper.bundle('tests/demo/main.ts');

      assertEquals(await Deno.readTextFile('tmp/demo/main.bundle.js'), code);
    });

    await t.step('minify option', async () => {
      const code = await buildHelper.bundle('tests/demo/main.ts', {
        minify: true,
      });

      assertEquals(await Deno.readTextFile('tmp/demo/main.bundle.min.js'), code);
    });

    await t.step('externals option', async () => {
      const code = await buildHelper.bundle('tests/demo/external.ts', {
        externals: ['@*', 'jsr:*', 'npm:*', 'https:*', '../../node_modules/*'],
      });

      assertEquals(await Deno.readTextFile('tmp/demo/external.bundle.js'), code);
    });
  });
});
