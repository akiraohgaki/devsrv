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
[data-content="content"],
[data-content="logs"] {
  margin: 1rem 0;
}

[data-content="content"],
[data-content="logs"] {
  padding: 1rem;
  border: 2px solid #cccccc;
  border-radius: 5px;
}

[data-content="code"] code {
  display: block;
  padding: 1rem;
  border: 2px solid #cccccc;
  border-radius: 5px;
  background-color: #f8f8f8;
  color: #333333;
  outline: none;
  overflow: auto;

  &:focus {
    border-color: #0098f1;
  }
}

button[data-action] {
  appearance: none;
  display: inline-block;
  line-height: 1;
  margin: 0.2rem;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 3px;
  background-color: #0098f1;
  color: #ffffff;
  font-weight: bold;
  font-size: 0.9rem;
  text-decoration: none;
  vertical-align: middle;
  white-space: nowrap;
  outline: none;
  cursor: pointer;

  &:hover {
    background-color: #006abc;
    color: #ffffff;
  }

  &:active {
    position: relative;
    top: 1px;
    background-color: #006abc;
    color: #ffffff;
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

    if (exception instanceof Error) {
      addLog(exception.message);
    } else {
      addLog(exception);
    }
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

function getContent() {
  return document.querySelector('[data-content="content"]');
}

function setContent(data) {
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

  clearContent();
  getContent().appendChild(template.content);
}

function clearContent() {
  getContent().innerHTML = '';
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

async function wait(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

globalThis.playground = {
  code: {
    run: runCode,
    get: getCode,
    set: setCode,
    clear: clearCode,
  },
  content: {
    get: getContent,
    set: setContent,
    clear: clearContent,
  },
  logs: {
    get: getLogs,
    add: addLog,
    clear: clearLogs,
  },
  wait: wait,
};
document.querySelector('[data-action="code.run"]').addEventListener('click', runCode);
document.querySelector('[data-action="code.clear"]').addEventListener('click', clearCode);
document.querySelector('[data-action="content.clear"]').addEventListener('click', clearContent);
document.querySelector('[data-action="logs.clear"]').addEventListener('click', clearLogs);
`;

/**
 * Example code.
 */
const exampleCode: string = `
// You can import modules.
//import * as mod from './mod.bundle.js';

// Helper functions available.
const { code, content, logs, wait } = globalThis.playground;

// For example

content.set('&lt;button&gt;Click me&lt;/button&gt;');

const button = content.get().querySelector('button');

button.addEventListener('click', () => {
  logs.add('Button clicked!');
});

logs.add(content.get().innerHTML);

await wait(30000);

const codeContent = code.get().textContent;

code.clear();
content.clear();
logs.clear();

await wait(1000);

code.set(codeContent);
`.trim();

/**
 * Playground page.
 */
const playgroundPage: string = `
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
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
      <pre><code contenteditable>${exampleCode}</code></pre>
    </div>
    <button data-action="code.run">Run</button>
    <button data-action="code.clear">Clear</button>
  </section>

  <section>
    <h2>Content</h2>
    <div data-content="content"></div>
    <button data-action="content.clear">Clear</button>
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

export default playgroundPage;
