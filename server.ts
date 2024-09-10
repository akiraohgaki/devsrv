import { parseArgs } from '@std/cli/parse-args';

import { Server, serverOptions } from './mod.ts';

const args = parseArgs(Deno.args);

const server = new Server({
  hostname: args.h ?? args.host ?? serverOptions.hostname,
  port: args.p ?? args.port ?? serverOptions.port,
  documentRoot: args._[0]?.toString() ?? serverOptions.documentRoot,
});

server.start();
