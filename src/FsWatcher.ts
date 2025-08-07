/**
 * File system watcher.
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
   * @param paths - Paths to watch.
   */
  constructor(paths: string | Array<string>) {
    this.#onchange = () => {};

    this.#paths = paths;
    this.#watcher = null;
  }

  /**
   * The function invoked when files are changed.
   *
   * @param event - File system event.
   */
  set onchange(handler: (event: Deno.FsEvent) => unknown) {
    this.#onchange = handler;
  }

  /**
   * The function invoked when files are changed.
   *
   * @param event - File system event.
   */
  get onchange(): (event: Deno.FsEvent) => unknown {
    return this.#onchange;
  }

  /**
   * Starts watching for file changes.
   *
   * @throws {Error} - If the file system watcher is already running.
   */
  start(): void {
    if (this.#watcher) {
      throw new Error('File system watcher is already running.');
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
   * Stops watching for file changes.
   *
   * @throws {Error} - If the file system watcher is not running.
   */
  stop(): void {
    if (!this.#watcher) {
      throw new Error('File system watcher is not running.');
    }

    this.#watcher.close();
    this.#watcher = null;
  }
}
