/**
 * @module @akiraohgaki/devsrv/serve
 */

import type { ServerOptions } from './mod.ts';

import { Server } from './mod.ts';
import { args, booleanValue, numberValue, stringValue } from './src/cli.ts';

try {
  const options: ServerOptions = {
    hostname: stringValue(args.h ?? args.host, '0.0.0.0'),
    port: numberValue(args.p ?? args.port, 3000),
    directoryIndex: stringValue(args['directory-index'], 'index.html'),
    bundle: booleanValue(args.bundle, true),
    playground: booleanValue(args.playground, true),
    documentRoot: stringValue(args._[0], '.'),
  };

  console.log('options:', options);

  const server = new Server(options);

  server.start();
} catch (exception) {
  console.error(exception instanceof Error ? exception.message : exception);

  Deno.exit(1);
}
