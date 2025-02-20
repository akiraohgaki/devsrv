// You can import modules.
//import * as mod from 'http://localhost:3000/mod.bundle.js';

// Helper functions available.
const { code, preview, logs, log, sleep } = globalThis.playground;

// For example

preview.set('&lt;button&gt;Click me&lt;/button&gt;');

const button = preview.get().querySelector('button');

button.addEventListener('click', () => {
  log('Button clicked!'); // or logs.add('Button clicked!');
});

log(preview.get().innerHTML);

await sleep(30000);

const codeContent = code.get().textContent;

code.clear();
preview.clear();
logs.clear();

await sleep(1000);

code.set(codeContent);
