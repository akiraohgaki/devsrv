/**
 * @module @akiraohgaki/devsrv/remkdir
 */

import $ from '@david/dax';

import { args, stringValue } from './src/cli-util.ts';

try {
  const includes = stringValue(args.includes, '');
  const targetDirectory = stringValue(args._[0], '');

  console.log(`includes: ${includes}`);
  console.log(`targetDirectory: ${targetDirectory}`);

  if (!targetDirectory) {
    throw new Error('Invalid argument error');
  }

  await $`rm -rf ${targetDirectory}`;
  await $`mkdir -p ${targetDirectory}`;

  if (includes) {
    for (const include of includes.split(',')) {
      await $`cp -r ${include.trim()} ${targetDirectory}`;
    }
  }

  await $`ls -a ${targetDirectory}`;

  Deno.exit(0);
} catch (exception) {
  console.error(exception instanceof Error ? exception.message : exception);

  Deno.exit(1);
}
