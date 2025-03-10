/**
 * PlaygroundPreview class for managing preview content within the playground page.
 */
export class PlaygroundPreview {
  #container: Element;

  /**
   * Creates a new instance of the PlaygroundPreview class.
   */
  constructor() {
    this.#container = document.querySelector('[data-content="preview"]') as Element;
  }

  /**
   * Returns the current preview content from the playground page.
   *
   * @param selectors - Optional CSS selectors to query within the preview content.
   * @returns The Element matching the selectors, or the entire preview container if no selectors are provided.
   */
  get(selectors?: string): Element | null {
    return selectors ? this.#container.querySelector(selectors) : this.#container;
  }

  /**
   * Sets the preview content within the playground page.
   *
   * @param content - The content to set.
   */
  set(content: string | Node | NodeList): void {
    const template = document.createElement('template');

    if (typeof content === 'string') {
      template.innerHTML = content;
    } else if (content instanceof Node) {
      template.content.appendChild(content);
    } else if (content instanceof NodeList) {
      for (const node of Array.from(content)) {
        template.content.appendChild(node);
      }
    } else {
      template.textContent = '' + content;
    }

    this.#container.textContent = '';
    this.#container.appendChild(template.content);
  }

  /**
   * Clears the preview content within the playground page.
   */
  clear(): void {
    this.#container.textContent = '';
  }
}
