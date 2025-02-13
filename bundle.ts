/**
 * @module @akiraohgaki/devsrv/bundle
 */

import type { BuildHelperBundleOptions } from './mod.ts';

import { BuildHelper } from './mod.ts';
import { args, arrayValue, booleanValue, stringValue } from './src/cli.ts';

try {
  const entryPoint = stringValue(args._[0], '');
  const outFile = stringValue(args._[1], '');
  const options: BuildHelperBundleOptions = {
    minify: booleanValue(args.minify, false),
    externals: arrayValue(args.externals, []),
  };

  console.info('entryPoint:', entryPoint);
  console.info('outFile:', outFile);
  console.info('options:', options);

  if (!entryPoint) {
    throw new Error('entryPoint must be set.');
  }

  if (!outFile) {
    throw new Error('outFile must be set.');
  }

  const buildHelper = new BuildHelper();
  await buildHelper.bundleFile(entryPoint, outFile, options);

  Deno.exit(0);
} catch (exception) {
  console.error(exception instanceof Error ? exception.message : exception);

  Deno.exit(1);
}
