/**
 * Style of the page.
 */
const style = `
:root {
  font-size: 16px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background-color: #fefefe;
  color: #222222;
  font: 1rem/1.5 Arial, system-ui;
}

header,
footer,
article,
aside {
  margin: 2rem 4rem;
}

[data-content="script"],
[data-content="content"],
[data-content="logs"] {
  margin: 1rem 0;
}

[data-content="content"],
[data-content="logs"] {
  padding: 1rem;
  border: 1px solid #cccccc;
  border-radius: 7px;
}

[data-content="code"] {
  display: block;
  padding: 1rem;
  border-radius: 7px;
  background-color: #eeeeee;
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
const script = `
async function wait(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function setContent(data) {
  clearContent();

  const template = document.createElement('template');

  if (typeof data === 'string') {
    template.innerHTML = data;
  } else if (data instanceof Node) {
    template.content.appendChild(data.cloneNode(true));
  } else if (data instanceof NodeList) {
    for (const node of Array.from(data)) {
      template.content.appendChild(node.cloneNode(true));
    }
  } else {
    template.textContent = '' + data;
  }

  document.querySelector('[data-content="content"]').appendChild(template.content);
}

function getContent() {
  return document.querySelector('[data-content="content"]');
}

function clearContent() {
  document.querySelector('[data-content="content"]').innerHTML = '';
}

function log(data) {
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

  document.querySelector('[data-content="logs"]').appendChild(log);
}

function clearLogs() {
  document.querySelector('[data-content="logs"]').innerHTML = '';
}

async function runCode() {
  const code = document.querySelector('[data-content="code"]').textContent;

  const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));

  try {
    await import(url);
  } catch (exception) {
    console.error(exception);

    if (exception instanceof Error) {
      log(exception.message);
    } else {
      log(exception);
    }
  }
}

globalThis.page = { wait, setContent, getContent, clearContent, log, clearLogs };
document.querySelector('[data-action="runCode"]').addEventListener('click', runCode);
document.querySelector('[data-action="clearContent"]').addEventListener('click', clearContent);
document.querySelector('[data-action="clearLogs"]').addEventListener('click', clearLogs);
`;

/**
 * Example code.
 */
const exampleCode = `
// You can import modules.
//import * as mod from './mod.bundle.js';

// Helper functions available.
const { wait, setContent, getContent, clearContent, log, clearLogs } = globalThis.page;

// For example:
setContent('&lt;button&gt;Click me&lt;/button&gt;');

const button = getContent().querySelector('button');

button.addEventListener('click', () => {
  log('Button clicked!');
});

log(getContent().innerHTML);

await wait(30000);

clearContent();
clearLogs();
`;

/**
 * Playground page.
 */
const playgroundPage = `
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <title>Playground</title>
  <style>${style}</style>
  <script type="module">${script}</script>
</head>

<body>
  <header>
    <h1>Playground</h1>
  </header>

  <article>
    <h2>Script</h2>
    <div data-content="script">
    <pre><code data-content="code" contenteditable>${exampleCode}</code></pre>
    </div>
    <button data-action="runCode">Run</button>
  </article>

  <aside>
    <h2>Content</h2>
    <div data-content="content"></div>
    <button data-action="clearContent">Clear</button>
  </aside>

  <footer>
    <h2>Logs</h2>
    <div data-content="logs"></div>
    <button data-action="clearLogs">Clear</button>
  </footer>
</body>

</html>
`;

export default playgroundPage;
