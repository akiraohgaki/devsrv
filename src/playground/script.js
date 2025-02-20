class PlaygroundCode {
  constructor() {}

  get() {
    return document.querySelector('[data-content="code"] code');
  }

  set(code) {
    this.get().textContent = code;
  }

  clear() {
    this.get().innerHTML = '';
  }

  async run() {
    const code = this.get().textContent;

    const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));

    try {
      await import(url);
    } catch (exception) {
      console.error(exception);
    }
  }
}

class PlaygroundPreview {
  constructor() {}

  get() {
    return document.querySelector('[data-content="preview"]');
  }

  set(data) {
    const template = document.createElement('template');

    if (typeof data === 'string') {
      template.innerHTML = data;
    } else if (data instanceof Node) {
      template.content.appendChild(data);
    } else if (data instanceof NodeList) {
      for (const node of Array.from(data)) {
        template.content.appendChild(node);
      }
    } else {
      template.textContent = '' + data;
    }

    this.clear();

    this.get().appendChild(template.content);
  }

  clear() {
    this.get().innerHTML = '';
  }
}

class PlaygroundLogs {
  constructor() {}

  get() {
    return document.querySelector('[data-content="logs"]');
  }

  add(...data) {
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

    this.get().appendChild(log);
  }

  clear() {
    this.get().innerHTML = '';
  }
}

async function sleep(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const code = new PlaygroundCode();
const preview = new PlaygroundPreview();
const logs = new PlaygroundLogs();

document.querySelector('[data-action="code.run"]').addEventListener('click', code.run.bind(code));
document.querySelector('[data-action="code.clear"]').addEventListener('click', code.clear.bind(code));
document.querySelector('[data-action="preview.clear"]').addEventListener('click', preview.clear.bind(preview));
document.querySelector('[data-action="logs.clear"]').addEventListener('click', logs.clear.bind(logs));

globalThis.playground = {
  code,
  preview,
  logs,
  log: logs.add.bind(logs),
  sleep,
};
