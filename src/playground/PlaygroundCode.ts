/**
 * Manages code within the playground page.
 */
export class PlaygroundCode {
  #container: Element;

  /**
   * Creates a new instance of the PlaygroundCode class.
   */
  constructor() {
    this.#container = document.querySelector('[data-content="code"] code') as Element;
  }

  /**
   * Gets the current code content from the playground page.
   */
  get(): string {
    return this.#container.textContent ?? '';
  }

  /**
   * Sets the code content within the playground page.
   *
   * @param code - The code string to set.
   */
  set(code: string): void {
    this.#container.textContent = code;
  }

  /**
   * Clears the code content within the playground page.
   */
  clear(): void {
    this.#container.textContent = '';
  }

  /**
   * Runs the code currently present in the playground page.
   */
  async run(): Promise<void> {
    const code = this.#container.textContent ?? '';

    const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));

    try {
      await import(url);
    } catch (exception) {
      console.error(exception);
    }
  }
}
