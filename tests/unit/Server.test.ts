import { assertEquals } from '@std/assert';

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

    assertEquals(isRunningA, true);
    assertEquals(isRunningB, false);
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

    assertEquals(responseA.status, 200);
    assertEquals(responseA.headers.get('content-type'), 'text/html');
    assertEquals(contentA.search('<title>Playground</title>') !== -1, true);
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

    const responseC = await fetch(`${origin}/abcdef/`);
    const contentC = await responseC.text();

    const responseD = await fetch(`${origin}/abcdef`);
    const contentD = await responseD.text();

    server.stop();
    await wait(100);

    assertEquals(responseA.status, 200);
    assertEquals(responseA.headers.get('content-type'), 'text/html');

    assertEquals(responseB.status, 200);
    assertEquals(responseB.headers.get('content-type'), 'text/html');
    assertEquals(contentA, contentB);

    assertEquals(responseC.status, 200);
    assertEquals(responseC.headers.get('content-type'), 'text/html');
    assertEquals(contentA, contentC);

    assertEquals(responseD.status, 200);
    assertEquals(responseD.headers.get('content-type'), 'text/html');
    assertEquals(contentA, contentD);
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

    assertEquals(responseA.status, 200);
    assertEquals(responseA.headers.get('content-type'), 'text/javascript');
    assertEquals(contentA.search('bundled into') !== -1, true);
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

    assertEquals(responseA.status, 404);
    assertEquals(responseA.headers.get('content-type'), 'text/plain');
    assertEquals(contentA.search('Not Found') !== -1, true);

    assertEquals(responseB.status, 404);
    assertEquals(responseB.headers.get('content-type'), 'text/plain');
    assertEquals(contentB.search('Not Found') !== -1, true);
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

    const responseA = await fetch(`${origin}/external.bundle.js`);
    const contentA = await responseA.text();

    server.stop();
    await wait(100);

    assertEquals(responseA.status, 500);
    assertEquals(responseA.headers.get('content-type'), 'text/plain');
    assertEquals(contentA.search('Internal Server Error') !== -1, true);
  });
});
