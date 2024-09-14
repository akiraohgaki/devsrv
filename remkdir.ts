/**
 * @module @akiraohgaki/devsrv/remkdir
 */

import $ from '@david/dax';

import { args, stringValue } from './src/cliUtil.ts';

const targetDirectory = stringValue(args._[0], '');
const includes = stringValue(args._[1], '');

if (targetDirectory) {
  await $`rm -rf ${targetDirectory}`;
  await $`mkdir -p ${targetDirectory}`;

  if (includes) {
    await $`cp -a ${includes} ${targetDirectory}`;
  }

  await $`ls -a ${targetDirectory}`;

  Deno.exit(0);
} else {
  console.error('Invalid argument error');

  Deno.exit(1);
}
