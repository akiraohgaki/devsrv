/**
 * PlaygroundLogs class for managing logs within the playground page.
 */
export class PlaygroundLogs {
  #containerElement: Element;

  /**
   * Creates a new instance of the PlaygroundLogs class.
   */
  constructor() {
    this.#containerElement = document.querySelector('[data-content="logs"]') as Element;
  }

  /**
   * Returns the current logs from the playground page.
   */
  get(): Array<string> {
    const logs = this.#containerElement.querySelectorAll('[data-content="log"]');

    return Array.from(logs).map((item) => {
      return item.textContent ?? '';
    });
  }

  /**
   * Adds a new log entry to the playground logs.
   *
   * @param data - The data to log.
   */
  add(...data: Array<unknown>): void {
    console.log(...data);

    const content = data.map((item) => {
      if (Array.isArray(item) || (typeof item === 'object' && item !== null)) {
        return JSON.stringify(item);
      } else {
        return '' + item;
      }
    }).join(' ');

    const log = document.createElement('pre');
    log.setAttribute('data-content', 'log');
    log.textContent = content;

    this.#containerElement.appendChild(log);
  }

  /**
   * Clears the logs within the playground page.
   */
  clear(): void {
    this.#containerElement.textContent = '';
  }
}
