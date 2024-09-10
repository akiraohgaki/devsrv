import { bundle } from '@deno/emit';

import mimeTypes from './mimeTypes.ts';
import serverOptions from './serverOptions.ts';

/**
 * Server class for serving files.
 *
 * @example
 * ```ts
 * const server = new Server({
 *   hostname: 'localhost',
 *   port: 3000,
 *   documentRoot: './public',
 *   directoryIndex: 'index.html',
 *   bundle: true,
 * });
 *
 * server.start();
 *
 * server.stop();
 * ```
 */
export default class Server {
  #options: typeof serverOptions;
  #server: Deno.HttpServer | null = null;
  #abortController: AbortController | null = null;

  /**
   * Creates a new server.
   *
   * @param options - Options for the server.
   */
  constructor(options: Partial<typeof serverOptions> = {}) {
    this.#options = { ...serverOptions, ...options };
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
      async (request) => {
        const path = new URL(request.url).pathname;

        console.log(`${request.method} ${path}`);

        if (this.#options.bundle && path.endsWith('.bundle.js')) {
          try {
            const result = await bundle(this.#options.documentRoot + path.replace('.bundle.js', '.ts'));
            return this.#response(result.code, mimeTypes.js, 200);
          } catch {
            return this.#response('Not Found', mimeTypes.txt, 404);
          }
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
        } catch {
          return this.#response('Not Found', mimeTypes.txt, 404);
        }
      },
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
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache',
        },
      },
    );
  }
}
