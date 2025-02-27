/**
 * PlaygroundCode class for managing code within the playground page.
 */
export class PlaygroundCode {
  #containerElement: Element;

  /**
   * Creates a new instance of the PlaygroundCode class.
   */
  constructor() {
    this.#containerElement = document.querySelector('[data-content="code"]') as Element;
  }

  /**
   * Returns the current code content from the playground page.
   */
  get(): string {
    return this.#containerElement.textContent ?? '';
  }

  /**
   * Sets the code content within the playground page.
   *
   * @param code - The code string to set.
   */
  set(code: string): void {
    this.#containerElement.textContent = code;
  }

  /**
   * Clears the code content within the playground page.
   */
  clear(): void {
    this.#containerElement.textContent = '';
  }

  /**
   * Runs the code currently present in the playground page.
   */
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
