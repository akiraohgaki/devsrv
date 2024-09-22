import type { ServerOptions } from './types.ts';

import BuildHelper from './BuildHelper.ts';
import mimeTypes from './mime-types.ts';
import playgroundPage from './playground-page.ts';

/**
 * Server class for serving files.
 *
 * @example
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

    if (this.#options.bundle && path.endsWith('.bundle.js')) {
      try {
        const buildHelper = new BuildHelper();
        const code = await buildHelper.bundle(this.#options.documentRoot + path.replace('.bundle.js', '.ts'));
        return this.#response(code, mimeTypes.js, 200);
      } catch (exception) {
        console.error(exception instanceof Error ? exception.message : exception);
        return this.#response('Not Found', mimeTypes.txt, 404);
      }
    }

    if (this.#options.playground && path.endsWith('.playground')) {
      return this.#response(playgroundPage, mimeTypes.html, 200);
    }

    if (path !== '/') {
      const resolvedPath = path.endsWith('/') ? path + this.#options.directoryIndex : path;
      try {
        const content = await Deno.readFile(this.#options.documentRoot + resolvedPath);
        const ext = resolvedPath.split('.').pop() ?? '';
        return this.#response(content, mimeTypes[ext] ?? mimeTypes.bin, 200);
      } catch {
        void 0;
      }
    }

    try {
      const content = await Deno.readFile(`${this.#options.documentRoot}/${this.#options.directoryIndex}`);
      return this.#response(content, mimeTypes.html, 200);
    } catch (exception) {
      console.error(exception instanceof Error ? exception.message : exception);
      return this.#response('Not Found', mimeTypes.txt, 404);
    }
  }

  /**
   * Creates a response object.
   *
   * @param body - Content body
   * @param contentType - Content type
   * @param status - HTTP status code
   */
  #response(body: BodyInit, contentType: string, status: number = 200): Response {
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
