// You can import modules.
//import * as mod from 'http://localhost:3000/mod.bundle.js';

// globalThis.Playground available, for example:
await Playground.test('example', async (t) => {
  await t.step('create button', () => {
    Playground.preview.set('&lt;button&gt;Click me&lt;/button&gt;');
  });

  await t.step('add event listener to button', () => {
    Playground.preview.get('button').addEventListener('click', () => {
      Playground.log('Button clicked!');
    });
  });

  await t.step('the preview content should be logged', () => {
    Playground.log(Playground.preview.get().innerHTML);
  });
});
