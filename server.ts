/**
 * @module @akiraohgaki/devsrv/server
 */

import { parseArgs } from '@std/cli/parse-args';

import { Server, serverOptions } from './mod.ts';

function booleanValue(value: unknown, defaultValue: boolean): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string' && ['true', 'false'].includes(value)) {
    return value === 'true';
  }
  return defaultValue;
}

function numberValue(value: unknown, defaultValue: number): number {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    return parseInt(value, 10) || defaultValue;
  }
  return defaultValue;
}

function stringValue(value: unknown, defaultValue: string): string {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return '' + value;
  }
  return defaultValue;
}

const args = parseArgs(Deno.args);

const server = new Server({
  hostname: stringValue(args.h ?? args.host, serverOptions.hostname),
  port: numberValue(args.p ?? args.port, serverOptions.port),
  directoryIndex: stringValue(args['directory-index'], serverOptions.directoryIndex),
  bundle: booleanValue(args.bundle, serverOptions.bundle),
  documentRoot: stringValue(args._[0], serverOptions.documentRoot),
});

server.start();
