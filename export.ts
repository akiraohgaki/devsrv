/**
 * @module @akiraohgaki/devsrv/export
 */

import { BuildHelper } from './mod.ts';
import { args, arrayValue, stringValue } from './src/cli-util.ts';

try {
  const outDirectory = stringValue(args._[0], '');
  const includes = arrayValue(args.includes, []);

  console.log('outDirectory:', outDirectory);
  console.log('includes:', includes);

  if (!outDirectory) {
    throw new Error('outDirectory must be set.');
  }

  const buildHelper = new BuildHelper();
  buildHelper.export(outDirectory, includes);

  Deno.exit(0);
} catch (exception) {
  console.error(exception instanceof Error ? exception.message : exception);

  Deno.exit(1);
}
