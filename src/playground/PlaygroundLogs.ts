/**
 * Manages logs within the playground page.
 */
export class PlaygroundLogs {
  #container: Element;

  /**
   * Creates a new instance of the PlaygroundLogs class.
   */
  constructor() {
    this.#container = document.querySelector('[data-content="logs"]') as Element;
  }

  /**
   * Gets the logs.
   */
  get(): Array<string> {
    const logs = this.#container.querySelectorAll('[data-content="log"]');

    return Array.from(logs).map((item) => {
      return item.textContent ?? '';
    });
  }

  /**
   * Adds a new log.
   *
   * @param data - The data to log.
   */
  add(...data: Array<unknown>): void {
    console.log(...data);

    const content = data.map((item) => {
      if (item instanceof Error) {
        return item.message;
      } else if (typeof item === 'object' && item !== null) {
        return JSON.stringify(item);
      } else {
        return String(item);
      }
    }).join(' ');

    const log = document.createElement('pre');
    log.setAttribute('data-content', 'log');
    log.textContent = content;

    this.#container.appendChild(log);
  }

  /**
   * Clears the logs.
   */
  clear(): void {
    this.#container.textContent = '';
  }
}
