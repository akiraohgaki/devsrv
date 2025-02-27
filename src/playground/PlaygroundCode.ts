export class PlaygroundCode {
  #containerElement: Element;

  constructor() {
    this.#containerElement = document.querySelector('[data-content="code"]') as Element;
  }

  get(): string {
    return this.#containerElement.textContent ?? '';
  }

  set(code: string): void {
    this.#containerElement.textContent = code;
  }

  clear(): void {
    this.#containerElement.textContent = '';
  }

  async run(): Promise<void> {
    const code = this.#containerElement.textContent ?? '';

    const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));

    try {
      await import(url);
    } catch (exception) {
      console.error(exception);
    }
  }
}
