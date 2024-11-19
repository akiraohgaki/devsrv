import { assertStrictEquals } from '@std/assert';

import { BuildHelper } from '../../mod.ts';

Deno.test('BuildHelper', async (t) => {
  await t.step('export', async () => {
    const buildHelper = new BuildHelper();
    await buildHelper.export('tmp/demo', ['tests/demo/index.html']);

    assertStrictEquals((await Deno.stat('tmp/demo/index.html')).isFile, true);
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

    assertStrictEquals((await Deno.stat('tmp/demo/main.bundle.js')).isFile, true);
    assertStrictEquals((await Deno.stat('tmp/demo/main.bundle.min.js')).isFile, true);
  });

  await t.step('bundle', async () => {
    const buildHelper = new BuildHelper();
    const code = await buildHelper.bundle('tests/demo/main.ts');
    const codeMin = await buildHelper.bundle('tests/demo/main.ts', { minify: true });

    assertStrictEquals(code !== codeMin, true);
    assertStrictEquals(await Deno.readTextFile('tmp/demo/main.bundle.js'), code);
    assertStrictEquals(await Deno.readTextFile('tmp/demo/main.bundle.min.js'), codeMin);
  });
});
