import { assert, assertEquals, assertStrictEquals, assertThrows } from '@std/assert';

import { FsWatcher } from '../../src/FsWatcher.ts';

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

Deno.test('FsWatcher', async (t) => {
  let fsWatcher: FsWatcher;

  await t.step('constructor()', () => {
    fsWatcher = new FsWatcher('.');

    assert(fsWatcher);
  });

  await t.step('onchange()', () => {
    const handler = () => {};

    fsWatcher.onchange = handler;

    assertStrictEquals(fsWatcher.onchange, handler);
  });

  await t.step('start()', async () => {
    fsWatcher.start();

    await sleep(100);

    assertThrows(() => fsWatcher.start(), Error);
  });

  await t.step('stop()', () => {
    fsWatcher.stop();

    assertThrows(() => fsWatcher.stop(), Error);
  });
});

Deno.test('File system watcher', async (t) => {
  let fsWatcher: FsWatcher;

  let counter = 0;
  let kind = '';

  const tempDir = await Deno.makeTempDir();
  await Deno.mkdir(`${tempDir}/test`);
  const tempFile0 = `${tempDir}/test/file0.txt`;
  const tempFile1 = `${tempDir}/test/file1.txt`;
  const tempFile2 = `${tempDir}/test/file2.txt`;

  console.log(tempDir);

  await t.step('starts watching for file changes', async () => {
    fsWatcher = new FsWatcher(tempDir);

    fsWatcher.onchange = (event) => {
      counter++;
      kind = event.kind;
    };

    await Deno.writeTextFile(tempFile0, '');

    fsWatcher.start();

    await sleep(100);

    assertEquals(counter, 0);
    assertEquals(kind, '');
  });

  await t.step('responding to file system events', async (t) => {
    await t.step('when access', async () => {
      await Deno.readFile(tempFile0);

      await sleep(100);

      assertEquals(counter, 0);
      assertEquals(kind, '');
    });

    await t.step('when create', async () => {
      await Deno.writeTextFile(tempFile1, '');

      await sleep(100);

      assertEquals(counter, 1);
      assertEquals(kind, 'create');
    });

    await t.step('when modify', async () => {
      await Deno.writeTextFile(tempFile1, 'abc');

      await sleep(100);

      assertEquals(counter, 2);
      assertEquals(kind, 'modify');
    });

    await t.step('when rename', async () => {
      await Deno.rename(tempFile1, tempFile2);

      await sleep(100);

      assertEquals(counter, 3);
      assertEquals(kind, 'rename');
    });

    await t.step('when remove', async () => {
      await Deno.remove(tempFile2);

      await sleep(100);

      assertEquals(counter, 4);
      assertEquals(kind, 'remove');
    });
  });

  await t.step('onchange event should be debounced', async () => {
    await Deno.writeTextFile(tempFile1, '');

    await sleep(20);

    await Deno.writeTextFile(tempFile1, 'abc');

    await sleep(20);

    await Deno.rename(tempFile1, tempFile2);

    await sleep(20);

    await Deno.remove(tempFile2);

    await sleep(100);

    assertEquals(counter, 5);
  });

  await t.step('stops watching for file changes', async () => {
    fsWatcher.stop();

    await Deno.writeTextFile(tempFile0, 'abc');

    await sleep(100);

    assertEquals(counter, 5);
  });
});
