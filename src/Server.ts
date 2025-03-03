import type { ServerOptions } from './types.ts';

import { BuildHelper } from './BuildHelper.ts';
import { mimeTypes } from './mimeTypes.ts';
import playgroundPage from './playground/page.ts';

const buildHelper = new BuildHelper();

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
export class Server {
  #options: ServerOptions;

  #server: Deno.HttpServer | null;

  #abortController: AbortController | null;

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

    this.#server = null;

    this.#abortController = null;
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
    try {
      const path = new URL(request.url).pathname;

      console.info(`${request.method} ${path}`);

      if (path.endsWith('.playground') && this.#options.playground) {
        return this.#response(200, mimeTypes.html, playgroundPage);
      }

      if (path.endsWith('.bundle.js') && this.#options.bundle) {
        const resolvedPath = this.#options.documentRoot + path.replace(/^(.+)\.bundle\.js$/, '$1.ts');

        if (await this.#fileExists(resolvedPath)) {
          const content = await buildHelper.bundle(resolvedPath);

          return this.#response(200, mimeTypes.js, content);
        } else {
          return this.#response(404, mimeTypes.txt, 'Not Found');
        }
      }

      let resolvedPath = '';
      if (path === '/') {
        resolvedPath = this.#options.documentRoot + '/' + this.#options.directoryIndex;
      } else if (path.endsWith('/')) {
        resolvedPath = this.#options.documentRoot + path + this.#options.directoryIndex;
        if (!(await this.#fileExists(resolvedPath))) {
          resolvedPath = this.#options.documentRoot + '/' + this.#options.directoryIndex;
        }
      } else {
        resolvedPath = this.#options.documentRoot + path;
        if (!(await this.#fileExists(resolvedPath))) {
          resolvedPath = this.#options.documentRoot + '/' + this.#options.directoryIndex;
        }
      }

      if (await this.#fileExists(resolvedPath)) {
        const ext = resolvedPath.split('.').pop() ?? '';
        const mimeType = mimeTypes[ext] ?? mimeTypes.bin;
        const content = await Deno.readFile(resolvedPath);

        return this.#response(200, mimeType, content);
      } else {
        return this.#response(404, mimeTypes.txt, 'Not Found');
      }
    } catch (exception) {
      console.error(exception instanceof Error ? exception.message : exception);

      return this.#response(500, mimeTypes.txt, 'Internal Server Error');
    }
  }

  /**
   * Checks if a file exists.
   *
   * @param path - Path to check
   */
  async #fileExists(path: string): Promise<boolean> {
    let result = false;
    try {
      result = (await Deno.stat(path)).isFile;
    } catch {
      void 0;
    }
    return result;
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
