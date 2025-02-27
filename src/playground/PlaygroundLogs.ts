export class PlaygroundLogs {
  #containerElement: Element;

  constructor() {
    this.#containerElement = document.querySelector('[data-content="logs"]') as Element;
  }

  get(): Array<string> {
    const logs = this.#containerElement.querySelectorAll('[data-content="log"]');

    return Array.from(logs).map((item) => {
      return item.textContent ?? '';
    });
  }

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

  clear(): void {
    this.#containerElement.textContent = '';
  }
}
