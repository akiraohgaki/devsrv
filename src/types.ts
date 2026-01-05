/**
 * The options for the server.
 */
export interface ServerOptions {
  /**
   * Host name.
   */
  hostname: string;
  /**
   * Port number.
   */
  port: number;
  /**
   * TLS certificate file.
   */
  tlsCert: string;
  /**
   * TLS key file.
   */
  tlsKey: string;
  /**
   * Directory index file.
   */
  directoryIndex: string;
  /**
   * Live reload the browser.
   */
  liveReload: boolean;
  /**
   * TypeScript bundling.
   */
  bundle: boolean;
  /**
   * Playground page.
   */
  playground: boolean;
  /**
   * Document root directory.
   */
  documentRoot: string;
}

/**
 * The options for bundling.
 */
export interface BuildHelperBundleOptions {
  /**
   * Minification.
   */
  minify: boolean;
  /**
   * External modules.
   */
  externals: Array<string>;
}
