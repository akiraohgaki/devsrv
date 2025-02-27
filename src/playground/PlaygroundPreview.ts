export class PlaygroundPreview {
  #containerElement: Element;

  constructor() {
    this.#containerElement = document.querySelector('[data-content="preview"]') as Element;
  }

  get(selectors?: string): Element | null {
    return selectors ? this.#containerElement.querySelector(selectors) : this.#containerElement;
  }

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

    this.#containerElement.textContent = '';
    this.#containerElement.appendChild(template.content);
  }

  clear(): void {
    this.#containerElement.textContent = '';
  }
}
