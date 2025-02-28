import { assert, assertEquals, assertRejects, assertThrows } from '@std/assert';

import { Server } from '../../mod.ts';

const hostname = 'localhost';
const port = 3333;
const documentRoot = './tests/demo';
const origin = `http://${hostname}:${port}`;

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

Deno.test('Server', async (t) => {
  let server: Server;

  await t.step('constructor()', () => {
    server = new Server();

    assert(server);
  });

  await t.step('start()', async () => {
    server.start();

    await sleep(100);

    assertThrows(() => server.start(), Error);
  });

  await t.step('stop()', async () => {
    server.stop();

    await sleep(100);

    assertThrows(() => server.stop(), Error);
  });
});

Deno.test('Web server', async (t) => {
  let server: Server;

  await t.step('starts server', async () => {
    server = new Server({
      hostname,
      port,
      directoryIndex: 'index.html',
      bundle: true,
      playground: true,
      documentRoot,
    });

    server.start();

    await sleep(100);

    assert((await fetch(origin, { method: 'HEAD' })).ok);
  });

  await t.step('playground page', async () => {
    const response = await fetch(`${origin}/test.playground`);
    const content = await response.text();

    assertEquals(response.status, 200);
    assertEquals(response.headers.get('content-type'), 'text/html');
    assert(content.search('<title>Playground</title>') !== -1);
  });

  await t.step('directory index page', async () => {
    const responseA = await fetch(`${origin}/`);
    const contentA = await responseA.text();

    const responseB = await fetch(`${origin}/index.html`);
    const contentB = await responseB.text();

    const responseC = await fetch(`${origin}/abcdef/`);
    const contentC = await responseC.text();

    const responseD = await fetch(`${origin}/abcdef`);
    const contentD = await responseD.text();

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
    const response = await fetch(`${origin}/main.bundle.js`);
    const content = await response.text();

    assertEquals(response.status, 200);
    assertEquals(response.headers.get('content-type'), 'text/javascript');
    assert(content.search('bundled into') !== -1);
  });

  await t.step('404 Not Found', async (t) => {
    await t.step('if directory index page not found', async () => {
      const anotherPort = port + 1;
      const origin = `http://${hostname}:${anotherPort}`;

      const server = new Server({
        hostname,
        port: anotherPort,
        directoryIndex: 'abcdef.html',
        documentRoot,
      });

      server.start();

      await sleep(100);

      const response = await fetch(`${origin}/abcdef.html`);
      const content = await response.text();

      server.stop();

      await sleep(100);

      assertEquals(response.status, 404);
      assertEquals(response.headers.get('content-type'), 'text/plain');
      assert(content.search('Not Found') !== -1);
    });

    await t.step('if file not found when TypeScript bundling', async () => {
      const response = await fetch(`${origin}/abcdef.bundle.js`);
      const content = await response.text();

      assertEquals(response.status, 404);
      assertEquals(response.headers.get('content-type'), 'text/plain');
      assert(content.search('Not Found') !== -1);
    });
  });

  await t.step('500 Internal Server Error', async () => {
    const response = await fetch(`${origin}/error.bundle.js`);
    const content = await response.text();

    assertEquals(response.status, 500);
    assertEquals(response.headers.get('content-type'), 'text/plain');
    assert(content.search('Internal Server Error') !== -1);
  });

  await t.step('stops server', async () => {
    server.stop();

    await sleep(100);

    await assertRejects(async () => await fetch(origin, { method: 'HEAD' }));
  });
});
