import { assertStrictEquals } from '@std/assert';

import { Server } from '../../mod.ts';

const hostname = 'localhost';
const port = 3333;
const documentRoot = './tests/demo';
const origin = `http://${hostname}:${port}`;

async function wait(ms: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

Deno.test('Server', async (t) => {
  await t.step('start and stop', async () => {
    const server = new Server();

    let isRunningA = false;

    server.start();
    await wait(100);

    try {
      server.start();
    } catch (exception) {
      if (exception instanceof Error) {
        console.log(exception.message);
        isRunningA = exception.message.search('already running') !== -1;
      }
    }

    let isRunningB = false;

    server.stop();
    await wait(100);

    try {
      server.stop();
    } catch (exception) {
      if (exception instanceof Error) {
        console.log(exception.message);
        isRunningB = exception.message.search('not running') === -1;
      }
    }

    assertStrictEquals(isRunningA, true);
    assertStrictEquals(isRunningB, false);
  });

  await t.step('playground page', async () => {
    const server = new Server({
      hostname,
      port,
      documentRoot,
      playground: true,
    });

    server.start();
    await wait(100);

    const responseA = await fetch(`${origin}/test.playground`);
    const contentA = await responseA.text();

    server.stop();
    await wait(100);

    assertStrictEquals(responseA.status, 200);
    assertStrictEquals(responseA.headers.get('content-type'), 'text/html');
    assertStrictEquals(contentA.search('<title>Playground</title>') !== -1, true);
  });

  await t.step('directory index', async () => {
    const server = new Server({
      hostname,
      port,
      documentRoot,
      directoryIndex: 'index.html',
    });

    server.start();
    await wait(100);

    const responseA = await fetch(`${origin}/`);
    const contentA = await responseA.text();

    const responseB = await fetch(`${origin}/index.html`);
    const contentB = await responseB.text();

    const responseC = await fetch(`${origin}/abcdef.html`);
    const contentC = await responseC.text();

    server.stop();
    await wait(100);

    assertStrictEquals(responseA.status, 200);
    assertStrictEquals(responseA.headers.get('content-type'), 'text/html');

    assertStrictEquals(responseB.status, 200);
    assertStrictEquals(responseB.headers.get('content-type'), 'text/html');
    assertStrictEquals(contentA, contentB);

    assertStrictEquals(responseC.status, 200);
    assertStrictEquals(responseC.headers.get('content-type'), 'text/html');
    assertStrictEquals(contentA, contentC);
  });

  await t.step('TypeScript bundling', async () => {
    const server = new Server({
      hostname,
      port,
      documentRoot,
      bundle: true,
    });

    server.start();
    await wait(100);

    const responseA = await fetch(`${origin}/main.bundle.js`);
    const contentA = await responseA.text();

    server.stop();
    await wait(100);

    assertStrictEquals(responseA.status, 200);
    assertStrictEquals(responseA.headers.get('content-type'), 'text/javascript');
    assertStrictEquals(contentA.search('bundled into') !== -1, true);
  });

  await t.step('file not found', async () => {
    const server = new Server({
      hostname,
      port,
      documentRoot,
      directoryIndex: 'abcdef.html',
      bundle: true,
    });

    server.start();
    await wait(100);

    const responseA = await fetch(`${origin}/abcdef.html`);
    const contentA = await responseA.text();

    const responseB = await fetch(`${origin}/abcdef.bundle.js`);
    const contentB = await responseB.text();

    server.stop();
    await wait(100);

    assertStrictEquals(responseA.status, 404);
    assertStrictEquals(responseA.headers.get('content-type'), 'text/plain');
    assertStrictEquals(contentA.search('Not Found') !== -1, true);

    assertStrictEquals(responseB.status, 404);
    assertStrictEquals(responseB.headers.get('content-type'), 'text/plain');
    assertStrictEquals(contentB.search('Not Found') !== -1, true);
  });

  await t.step('internal server error', async () => {
    const server = new Server({
      hostname,
      port,
      documentRoot,
      bundle: true,
    });

    server.start();
    await wait(100);

    const responseA = await fetch(`${origin}/error.bundle.js`);
    const contentA = await responseA.text();

    server.stop();
    await wait(100);

    assertStrictEquals(responseA.status, 500);
    assertStrictEquals(responseA.headers.get('content-type'), 'text/plain');
    assertStrictEquals(contentA.search('Internal Server Error') !== -1, true);
  });
});
