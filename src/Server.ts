import type { ServerOptions } from './types.ts';

import BuildHelper from './BuildHelper.ts';
import mimeTypes from './mimeTypes.ts';
import playgroundPage from './playgroundPage.ts';

/**
 * Server class for serving files.
 *
 * @example Basic usage
 * ```ts
 * const server = new Server({
 *   hostname: 'localhost',
 *   port: 3000,
 *   directoryIndex: 'index.html',
 *   bundle: true,
 *   playground: true,
 *   documentRoot: './public',
 * });
 *
 * server.start();
 *
 * server.stop();
 * ```
 */
export default class Server {
  #options: ServerOptions;
  #server: Deno.HttpServer | null = null;
  #abortController: AbortController | null = null;

  /**
   * Creates a new instance of the Server class.
   *
   * @param options - Options for the server.
   */
  constructor(options: Partial<ServerOptions> = {}) {
    this.#options = {
      hostname: '0.0.0.0',
      port: 3000,
      directoryIndex: 'index.html',
      bundle: true,
      playground: true,
      documentRoot: '.',
      ...options,
    };
  }

  /**
   * Starts the server.
   *
   * @throws {Error} - If the server is already running.
   */
  start(): void {
    if (this.#server) {
      throw new Error('Server is already running.');
    }

    this.#abortController = new AbortController();

    this.#server = Deno.serve(
      {
        port: this.#options.port,
        hostname: this.#options.hostname,
        signal: this.#abortController.signal,
      },
      this.#requestHandler.bind(this),
    );

    this.#server.finished.then(() => {
      this.#server = null;
      this.#abortController = null;
    });
  }

  /**
   * Stops the server.
   *
   * @throws {Error} - If the server is not running.
   */
  stop(): void {
    if (!this.#server) {
      throw new Error('Server is not running.');
    }

    this.#abortController?.abort();
  }

  /**
   * Handles HTTP requests.
   *
   * @param request - Request object
   */
  async #requestHandler(request: Request): Promise<Response> {
    const path = new URL(request.url).pathname;
    console.log(`${request.method} ${path}`);

    if (path.endsWith('.playground') && this.#options.playground) {
      return this.#response(200, mimeTypes.html, playgroundPage);
    }

    if (path.endsWith('.bundle.js') && this.#options.bundle) {
      const buildHelper = new BuildHelper();
      const resolvedPath = path.replace(/^(.+)\.bundle\.js$/, '$1.ts');
      let content: string | null = null;

      try {
        content = await buildHelper.bundle(this.#options.documentRoot + resolvedPath);
      } catch (exception) {
        console.error(exception instanceof Error ? exception.message : exception);
        return this.#response(404, mimeTypes.txt, 'Not Found');
      }

      return this.#response(200, mimeTypes.js, content);
    }

    if (path !== '/') {
      const resolvedPath = path.endsWith('/') ? path + this.#options.directoryIndex : path;
      const ext = resolvedPath.split('.').pop() ?? '';
      const mimeType = mimeTypes[ext] ?? mimeTypes.bin;
      let content: Uint8Array | null = null;

      try {
        content = await Deno.readFile(this.#options.documentRoot + resolvedPath);
      } catch {
        void 0;
      }

      if (content !== null) {
        return this.#response(200, mimeType, content);
      }
    }

    const ext = this.#options.directoryIndex.split('.').pop() ?? '';
    const mimeType = mimeTypes[ext] ?? mimeTypes.bin;
    let content: Uint8Array | null = null;

    try {
      content = await Deno.readFile(this.#options.documentRoot + '/' + this.#options.directoryIndex);
    } catch (exception) {
      console.error(exception instanceof Error ? exception.message : exception);
      return this.#response(404, mimeTypes.txt, 'Not Found');
    }

    return this.#response(200, mimeType, content);
  }

  /**
   * Creates a response object.
   *
   * @param status - HTTP status code
   * @param contentType - Content type
   * @param body - Content body
   */
  #response(status: number, contentType: string, body: BodyInit): Response {
    return new Response(
      body,
      {
        status,
        headers: {
          'Content-Type': contentType,
          'Cross-Origin-Resource-Policy': 'cross-origin',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
        },
      },
    );
  }
}
