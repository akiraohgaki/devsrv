/**
 * @module @akiraohgaki/devsrv/bundle
 */

import type { BuildHelperBundleOptions } from './mod.ts';

import { BuildHelper } from './mod.ts';
import { args, booleanValue, stringValue } from './src/cli-util.ts';

try {
  const entryPoint = stringValue(args._[0], '');
  const outFile = stringValue(args._[1], '');
  const options: BuildHelperBundleOptions = {
    minify: booleanValue(args.minify, false),
  };

  console.log('entryPoint:', entryPoint);
  console.log('outFile:', outFile);
  console.log('options:', options);

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
