import { assertEquals } from '@std/assert';

import { BuildHelper } from '../../mod.ts';

Deno.test('BuildHelper', async (t) => {
  await t.step('export', async () => {
    const buildHelper = new BuildHelper();
    await buildHelper.export('tmp/demo', ['tests/demo/index.html']);

    assertEquals((await Deno.stat('tmp/demo/index.html')).isFile, true);
  });

  await t.step('bundleFile', async () => {
    const buildHelper = new BuildHelper();
    await buildHelper.bundleFile(
      'tests/demo/main.ts',
      'tmp/demo/main.bundle.js',
    );
    await buildHelper.bundleFile(
      'tests/demo/main.ts',
      'tmp/demo/main.bundle.min.js',
      { minify: true },
    );

    assertEquals((await Deno.stat('tmp/demo/main.bundle.js')).isFile, true);
    assertEquals((await Deno.stat('tmp/demo/main.bundle.min.js')).isFile, true);
  });

  await t.step('bundle', async () => {
    const buildHelper = new BuildHelper();
    const code = await buildHelper.bundle('tests/demo/main.ts');
    const codeMin = await buildHelper.bundle('tests/demo/main.ts', { minify: true });

    assertEquals(code !== codeMin, true);
    assertEquals(await Deno.readTextFile('tmp/demo/main.bundle.js'), code);
    assertEquals(await Deno.readTextFile('tmp/demo/main.bundle.min.js'), codeMin);
  });
});
