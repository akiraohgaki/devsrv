/**
 * Server options.
 */
export interface ServerOptions {
  hostname: string;
  port: number;
  directoryIndex: string;
  bundle: boolean;
  playground: boolean;
  documentRoot: string;
}

/**
 * Bundler options.
 */
export interface BuildHelperBundleOptions {
  minify: boolean;
}
