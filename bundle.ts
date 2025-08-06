/**
 * @module @akiraohgaki/devsrv/bundle
 */

import type { BuildHelperBundleOptions } from './mod.ts';

import { BuildHelper } from './mod.ts';
import { CliUtil } from './src/CliUtil.ts';

try {
  const cliUtil = new CliUtil();

  const entryPoint = cliUtil.toString(cliUtil.args._[0], '');
  const outFile = cliUtil.toString(cliUtil.args._[1], '');
  const options: BuildHelperBundleOptions = {
    minify: cliUtil.toBoolean(cliUtil.args.minify, false),
    externals: cliUtil.toArray(cliUtil.args.externals, []),
  };

  console.info('entryPoint:', entryPoint);
  console.info('outFile:', outFile);
  console.info('options:', options);

  if (!entryPoint) {
    throw new Error('"entryPoint" must be set.');
  }

  if (!outFile) {
    throw new Error('"outFile" must be set.');
  }

  const buildHelper = new BuildHelper();
  await buildHelper.bundleFile(entryPoint, outFile, options);

  Deno.exit(0);
} catch (exception) {
  console.error(exception instanceof Error ? exception.message : exception);

  Deno.exit(1);
}
