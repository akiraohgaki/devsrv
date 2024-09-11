import { assertStrictEquals } from '@std/assert';

import { Server } from '../../mod.ts';

async function wait(ms: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

Deno.test('Server', async (t) => {
  await t.step('start and stop', async () => {
    const server = new Server();

    let isRunning = false;

    server.start();
    await wait(100);
    try {
      server.start();
    } catch (exception) {
      if (exception instanceof Error) {
        console.log(exception.message);
        isRunning = exception.message.search('already running') !== -1;
      }
    }

    assertStrictEquals(isRunning, true);

    server.stop();
    await wait(100);
    try {
      server.stop();
    } catch (exception) {
      if (exception instanceof Error) {
        console.log(exception.message);
        isRunning = exception.message.search('not running') === -1;
      }
    }

    assertStrictEquals(isRunning, false);
  });

  await t.step('directory index', async () => {
    const server = new Server({
      hostname: 'localhost',
      port: 3333,
      documentRoot: './tests/demo',
      directoryIndex: 'index.html',
    });

    server.start();
    await wait(100);

    const responseA = await fetch('http://localhost:3333/');
    const contentA = await responseA.text();

    const responseB = await fetch('http://localhost:3333/index.html');
    const contentB = await responseB.text();

    const responseC = await fetch('http://localhost:3333/abcdef.html');
    const contentC = await responseC.text();

    server.stop();
    await wait(100);

    assertStrictEquals(responseA.status, 200);
    assertStrictEquals(responseB.status, 200);
    assertStrictEquals(responseC.status, 200);
    assertStrictEquals(contentA, contentB);
    assertStrictEquals(contentA, contentC);
  });

  await t.step('TypeScript bundling', async () => {
    const server = new Server({
      hostname: 'localhost',
      port: 3333,
      documentRoot: './tests/demo',
      bundle: true,
    });

    server.start();
    await wait(100);

    const response = await fetch('http://localhost:3333/main.bundle.js');
    const content = await response.text();

    server.stop();
    await wait(100);

    assertStrictEquals(response.status, 200);
    assertStrictEquals(content.search('was bundled into') !== -1, true);
  });

  await t.step('if the file is not found', async () => {
    const server = new Server({
      hostname: 'localhost',
      port: 3333,
      documentRoot: './tests/demo',
      directoryIndex: 'abcdef.html',
      bundle: true,
    });

    server.start();
    await wait(100);

    const responseA = await fetch('http://localhost:3333/abcdef.html');
    const contentA = await responseA.text();
    console.log(contentA);

    const responseB = await fetch('http://localhost:3333/abcdef.bundle.js');
    const contentB = await responseB.text();
    console.log(contentB);

    server.stop();
    await wait(100);

    assertStrictEquals(responseA.status, 404);
    assertStrictEquals(responseB.status, 404);
  });
});
