/**
 * @module @akiraohgaki/devsrv/bundle
 */

import { bundle } from '@deno/emit';

import { args, booleanValue, stringValue } from './src/cliUtil.ts';

const minify = booleanValue(args.minify, false);
const entryPoint = stringValue(args._[0], '');
const outfile = stringValue(args._[1], '');

if (entryPoint && outfile) {
  console.log(`minify: ${minify}`);
  console.log(`entryPoint: ${entryPoint}`);
  console.log(`outfile: ${outfile}`);

  const result = await bundle(entryPoint, { minify });
  await Deno.writeTextFile(outfile, result.code);

  Deno.exit(0);
} else {
  console.error('Invalid argument error');

  Deno.exit(1);
}
