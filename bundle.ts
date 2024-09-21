/**
 * @module @akiraohgaki/devsrv/bundle
 */

import { bundle } from '@deno/emit';

import { args, booleanValue, stringValue } from './src/cli-util.ts';

try {
  const minify = booleanValue(args.minify, false);
  const entryPoint = stringValue(args._[0], '');
  const outfile = stringValue(args._[1], '');

  console.log(`minify: ${minify}`);
  console.log(`entryPoint: ${entryPoint}`);
  console.log(`outfile: ${outfile}`);

  if (!entryPoint || !outfile) {
    throw new Error('Invalid argument error');
  }

  const result = await bundle(entryPoint, { minify });
  await Deno.writeTextFile(outfile, result.code);

  Deno.exit(0);
} catch (exception) {
  console.error(exception instanceof Error ? exception.message : exception);

  Deno.exit(1);
}
