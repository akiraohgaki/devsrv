/**
 * @module @akiraohgaki/devsrv/serve
 */

import type { ServerOptions } from './mod.ts';

import { Server } from './mod.ts';
import { CliUtil } from './src/CliUtil.ts';

try {
  const cliUtil = new CliUtil();

  const options: ServerOptions = {
    hostname: cliUtil.toString(cliUtil.args.h ?? cliUtil.args.host, '0.0.0.0'),
    port: cliUtil.toNumber(cliUtil.args.p ?? cliUtil.args.port, 3000),
    tlsCert: cliUtil.toString(cliUtil.args['tls-cert'], ''),
    tlsKey: cliUtil.toString(cliUtil.args['tls-key'], ''),
    directoryIndex: cliUtil.toString(cliUtil.args['directory-index'], 'index.html'),
    liveReload: cliUtil.toBoolean(cliUtil.args['live-reload'], true),
    bundle: cliUtil.toBoolean(cliUtil.args.bundle, true),
    playground: cliUtil.toBoolean(cliUtil.args.playground, true),
    documentRoot: cliUtil.toString(cliUtil.args._[0], '.'),
  };

  console.info('options:', options);

  const server = new Server(options);
  server.start();
} catch (exception) {
  console.error(exception instanceof Error ? exception.message : exception);

  Deno.exit(1);
}
