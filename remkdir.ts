/**
 * @module @akiraohgaki/devsrv/remkdir
 */

import $ from '@david/dax';

import { args, stringValue } from './src/cliUtil.ts';

const includes = stringValue(args.includes, '');
const targetDirectory = stringValue(args._[0], '');

if (targetDirectory) {
  console.log(`includes: ${includes}`);
  console.log(`targetDirectory: ${targetDirectory}`);

  await $`rm -rf ${targetDirectory}`;
  await $`mkdir -p ${targetDirectory}`;

  if (includes) {
    for (const include of includes.split(',')) {
      await $`cp -r ${include.trim()} ${targetDirectory}`;
    }
  }

  await $`ls -a ${targetDirectory}`;

  Deno.exit(0);
} else {
  console.error('Invalid argument error');

  Deno.exit(1);
}
