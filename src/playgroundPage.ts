/**
 * Style of the page.
 */
const style: string = `
:root {
  font-size: 14px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background-color: #fefefe;
  color: #333333;
  font: 1rem/1.5 system-ui;
}

header,
section {
  margin: 4rem;
}

[data-content="code"],
[data-content="preview"],
[data-content="logs"] {
  margin: 1rem 0;
  padding: 1rem;
  border: 2px solid #cccccc;
  border-radius: 5px;
}

[data-content="code"] {
  background-color: #f8f8f8;
  color: #333333;
  overflow: auto;

  &:has(code:focus) {
    border-color: #0098f1;
  }

  & code {
    display: block;
    outline: none;
  }
}

button[data-action] {
  appearance: none;
  display: inline-block;
  line-height: 1;
  min-width: 6rem;
  margin: 0.2rem;
  padding: 0.5rem 1rem;
  border: 2px solid #cccccc;
  border-radius: 3px;
  background-color: #fefefe;
  color: #333333;
  font-weight: bold;
  vertical-align: middle;
  white-space: nowrap;
  outline: none;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    border-color: #0098f1;
  }

  &:active {
    border-color: #333333;
  }
}
`;

/**
 * Script of the page.
 */
const script: string = `
async function runCode() {
  const code = getCode().textContent;

  const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));

  try {
    await import(url);
  } catch (exception) {
    console.error(exception);
    addLog(exception instanceof Error ? exception.message : exception);
  }
}

function getCode() {
  return document.querySelector('[data-content="code"] code');
}

function setCode(data) {
  getCode().textContent = data;
}

function clearCode() {
  getCode().innerHTML = '';
}

function getPreview() {
  return document.querySelector('[data-content="preview"]');
}

function setPreview(data) {
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

  clearPreview();
  getPreview().appendChild(template.content);
}

function clearPreview() {
  getPreview().innerHTML = '';
}

function getLogs() {
  return document.querySelector('[data-content="logs"]');
}

function addLog(data) {
  console.log(data);

  let content = '';
  if (Array.isArray(data) || (typeof data === 'object' && data !== null)) {
    content = JSON.stringify(data);
  } else {
    content = '' + data;
  }

  const log = document.createElement('pre');
  log.setAttribute('data-content', 'log');
  log.textContent = content;

  getLogs().appendChild(log);
}

function clearLogs() {
  getLogs().innerHTML = '';
}

async function sleep(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

globalThis.playground = {
  code: {
    run: runCode,
    get: getCode,
    set: setCode,
    clear: clearCode,
  },
  preview: {
    get: getPreview,
    set: setPreview,
    clear: clearPreview,
  },
  logs: {
    get: getLogs,
    add: addLog,
    clear: clearLogs,
  },
  sleep: sleep,
};
document.querySelector('[data-action="code.run"]').addEventListener('click', runCode);
document.querySelector('[data-action="code.clear"]').addEventListener('click', clearCode);
document.querySelector('[data-action="preview.clear"]').addEventListener('click', clearPreview);
document.querySelector('[data-action="logs.clear"]').addEventListener('click', clearLogs);
`;

/**
 * Example code.
 */
const exampleCode: string = `
// You can import modules.
//import * as mod from 'http://localhost:3000/mod.bundle.js';

// Helper functions available.
const { code, preview, logs, sleep } = globalThis.playground;

// For example

preview.set('&lt;button&gt;Click me&lt;/button&gt;');

const button = preview.get().querySelector('button');

button.addEventListener('click', () => {
  logs.add('Button clicked!');
});

logs.add(preview.get().innerHTML);

await sleep(30000);

const codeContent = code.get().textContent;

code.clear();
preview.clear();
logs.clear();

await sleep(1000);

code.set(codeContent);
`;

/**
 * Playground page.
 */
export const playgroundPage: string = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no, email=no, address=no">

  <title>Playground</title>

  <style>${style}</style>
</head>

<body>
  <header>
    <h1>Playground</h1>
  </header>

  <section>
    <h2>Code</h2>
    <div data-content="code">
      <pre><code contenteditable="true" spellcheck="false">${exampleCode.trim()}</code></pre>
    </div>
    <button data-action="code.run">Run</button>
    <button data-action="code.clear">Clear</button>
  </section>

  <section>
    <h2>Preview</h2>
    <div data-content="preview"></div>
    <button data-action="preview.clear">Clear</button>
  </section>

  <section>
    <h2>Logs</h2>
    <div data-content="logs"></div>
    <button data-action="logs.clear">Clear</button>
  </section>

  <script type="module">${script}</script>
</body>

</html>
`;
