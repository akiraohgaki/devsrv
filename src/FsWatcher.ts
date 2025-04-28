/**
 * File system watcher class.
 *
 * @example Basic usage
 * ```ts
 * const fsWatcher = new FsWatcher('.');
 *
 * fsWatcher.onchange = (event) => {
 *   console.log(event);
 * }
 *
 * fsWatcher.start();
 *
 * fsWatcher.stop();
 * ```
 */
export class FsWatcher {
  #onchange: (event: Deno.FsEvent) => unknown;

  #paths: string | Array<string>;

  #watcher: Deno.FsWatcher | null;

  /**
   * Creates a new instance of the FsWatcher class.
   *
   * @param paths - Paths to watch
   */
  constructor(paths: string | Array<string>) {
    this.#onchange = () => {};

    this.#paths = paths;
    this.#watcher = null;
  }

  /**
   * The function to be called when a files are changed.
   */
  set onchange(handler: (event: Deno.FsEvent) => unknown) {
    this.#onchange = handler;
  }

  /**
   * The function to be called when a files are changed.
   */
  get onchange(): (event: Deno.FsEvent) => unknown {
    return this.#onchange;
  }

  /**
   * Starts watch for file changes.
   *
   * @throws {Error} - If the watcher is already running.
   */
  start(): void {
    if (this.#watcher) {
      throw new Error('Watcher is already running.');
    }

    Promise.resolve().then(async () => {
      this.#watcher = Deno.watchFs(this.#paths);
      const kinds = ['create', 'modify', 'rename', 'remove'];
      let timeoutId: number | undefined = undefined;

      for await (const event of this.#watcher) {
        if (kinds.includes(event.kind)) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            this.#onchange(event);
          }, 50);
        }
      }
    });
  }

  /**
   * Stops watch for file changes.
   *
   * @throws {Error} - If the watcher is not running.
   */
  stop(): void {
    if (!this.#watcher) {
      throw new Error('Watcher is not running.');
    }

    this.#watcher.close();
    this.#watcher = null;
  }
}
