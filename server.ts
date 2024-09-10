import { parseArgs } from '@std/cli/parse-args';

import { Server, serverOptions } from './mod.ts';

const args = parseArgs(Deno.args);

const server = new Server({
  hostname: args.h ?? args.host ?? serverOptions.hostname,
  port: args.p ?? args.port ?? serverOptions.port,
  directoryIndex: args['directory-index'] ?? serverOptions.directoryIndex,
  bundle: ('bundle' in args && args.bundle === 'false') ? false : serverOptions.bundle,
  documentRoot: args._[0]?.toString() ?? serverOptions.documentRoot,
});

server.start();
