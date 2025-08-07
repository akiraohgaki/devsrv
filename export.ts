/**
 * @module @akiraohgaki/devsrv/export
 */

import { BuildHelper } from './mod.ts';
import { CliUtil } from './src/CliUtil.ts';

try {
  const cliUtil = new CliUtil();

  const outDirectory = cliUtil.toString(cliUtil.args._[0], '');
  const includes = cliUtil.toArray(cliUtil.args.includes, []);

  console.info('outDirectory:', outDirectory);
  console.info('includes:', includes);

  if (!outDirectory) {
    throw new Error('"outDirectory" must be set.');
  }

  const buildHelper = new BuildHelper();
  await buildHelper.export(outDirectory, includes);

  Deno.exit(0);
} catch (exception) {
  console.error(exception instanceof Error ? exception.message : exception);

  Deno.exit(1);
}
