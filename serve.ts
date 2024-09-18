/**
 * @module @akiraohgaki/devsrv/serve
 */

import { Server, serverOptions } from './mod.ts';
import { args, booleanValue, numberValue, stringValue } from './src/cli-util.ts';

const server = new Server({
  hostname: stringValue(args.h ?? args.host, serverOptions.hostname),
  port: numberValue(args.p ?? args.port, serverOptions.port),
  directoryIndex: stringValue(args['directory-index'], serverOptions.directoryIndex),
  bundle: booleanValue(args.bundle, serverOptions.bundle),
  documentRoot: stringValue(args._[0], serverOptions.documentRoot),
});

server.start();
