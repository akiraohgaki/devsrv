import type { ServerOptions } from './types.ts';

import { FsWatcher } from './FsWatcher.ts';
import { BuildHelper } from './BuildHelper.ts';
import { mimeTypes } from './mimeTypes.ts';
import playgroundPage from './playground/page.ts';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const buildHelper = new BuildHelper();

/**
 * Web server.
 *
 * @example Basic usage
 * ```ts
 * const server = new Server({
 *   hostname: 'localhost',
 *   port: 3000,
 *   directoryIndex: 'index.html',
 *   liveReload: true,
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

  #fsWatcher: FsWatcher;

  #state: {
    message: string | null;
    fsChanged: number | null;
  };

  /**
   * Creates a new instance of the Server class.
   *
   * @param options - The options for the server.
   */
  constructor(options: Partial<ServerOptions> = {}) {
    this.#options = {
      hostname: '0.0.0.0',
      port: 3000,
      directoryIndex: 'index.html',
      liveReload: true,
      bundle: true,
      playground: true,
      documentRoot: '.',
      ...options,
    };

    this.#server = null;

    this.#abortController = null;

    this.#fsWatcher = new FsWatcher(this.#options.documentRoot);
    this.#fsWatcher.onchange = () => {
      this.#state.fsChanged = Date.now();
    };

    this.#state = {
      message: this.#options.liveReload ? 'Live reload enabled' : null,
      fsChanged: null,
    };
  }

  /**
   * Whether there is the server currently running.
   */
  get isRunning(): boolean {
    return this.#server !== null;
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
      this.#fsWatcher.stop();
    });

    this.#fsWatcher.start();
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
   * @param request - Request object.
   */
  async #requestHandler(request: Request): Promise<Response> {
    try {
      const path = new URL(request.url).pathname;

      console.info(`${request.method} ${path}`);

      if (path.endsWith('.events')) {
        return this.#response(200, 'text/event-stream', this.#eventStream());
      }

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
        let content = await Deno.readFile(resolvedPath);

        if (mimeType === mimeTypes.html) {
          content = this.#insertScript(content);
        }

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
   * @param path - Path to the file.
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
   * Inserts an additional script into HTML page.
   *
   * @param html - HTML page content.
   *
   * @returns Modified HTML page content.
   */
  #insertScript(html: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer> {
    const script = `
      <script>
        // This script has been automatically inserted by the server.
        const liveReload = ${this.#options.liveReload ? 'true' : 'false'};
        const eventSource = new EventSource('/.events');
        eventSource.addEventListener('message', (event) => console.info(event.data));
        if (liveReload) {
          eventSource.addEventListener('fsChanged', () => location.reload());
        }
      </script>
    `;

    return textEncoder.encode(
      textDecoder.decode(html).replace(/(<\/body>)/i, script + '$1'),
    ) as Uint8Array<ArrayBuffer>;
  }

  /**
   * Creates a ReadableStream object for Server-Sent Events.
   */
  #eventStream(): ReadableStream<unknown> {
    const state = this.#state;

    let intervalId: number | undefined = undefined;

    return new ReadableStream({
      start(controller) {
        intervalId = setInterval(() => {
          if (state.message) {
            controller.enqueue(textEncoder.encode(`event: message\ndata: ${state.message}\n\n`));
            state.message = null;
          }
          if (state.fsChanged) {
            controller.enqueue(textEncoder.encode(`event: fsChanged\ndata: ${state.fsChanged}\n\n`));
            state.fsChanged = null;
          }
        }, 1000);
      },
      cancel() {
        clearInterval(intervalId);
      },
    });
  }

  /**
   * Creates a Response object.
   *
   * @param status - HTTP status code.
   * @param contentType - Content type.
   * @param body - Content body.
   */
  #response(status: number, contentType: string, body: BodyInit): Response {
    const headerForEventStream: HeadersInit = contentType === 'text/event-stream' ? { 'Connection': 'keep-alive' } : {};

    return new Response(
      body,
      {
        status,
        headers: {
          'Content-Type': contentType,
          'Cross-Origin-Resource-Policy': 'cross-origin',
          'Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          ...headerForEventStream,
        },
      },
    );
  }
}
