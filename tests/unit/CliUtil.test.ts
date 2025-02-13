import { assertEquals } from '@std/assert';

import { CliUtil } from '../../src/CliUtil.ts';

Deno.test('CliUtil', async (t) => {
  await t.step('args', () => {
    const cliUtil = new CliUtil();

    assertEquals(Array.isArray(cliUtil.args._), true);
  });

  await t.step('toBoolean', () => {
    const cliUtil = new CliUtil();

    assertEquals(cliUtil.toBoolean(true, false), true);
    assertEquals(cliUtil.toBoolean(false, true), false);
    assertEquals(cliUtil.toBoolean('true', false), true);
    assertEquals(cliUtil.toBoolean('false', true), false);

    assertEquals(cliUtil.toBoolean(123, false), false);
    assertEquals(cliUtil.toBoolean('abc', false), false);
    assertEquals(cliUtil.toBoolean(['abc'], false), false);
    assertEquals(cliUtil.toBoolean(undefined, true), true);
  });

  await t.step('toNumber', () => {
    const cliUtil = new CliUtil();

    assertEquals(cliUtil.toNumber(123, 0), 123);
    assertEquals(cliUtil.toNumber('123', 0), 123);

    assertEquals(cliUtil.toNumber(true, 0), 0);
    assertEquals(cliUtil.toNumber('abc', 0), 0);
    assertEquals(cliUtil.toNumber(['abc'], 0), 0);
    assertEquals(cliUtil.toNumber(undefined, 1), 1);
  });

  await t.step('toString', () => {
    const cliUtil = new CliUtil();

    assertEquals(cliUtil.toString('abc', 'def'), 'abc');
    assertEquals(cliUtil.toString(123, 'def'), '123');

    assertEquals(cliUtil.toString(true, 'def'), 'def');
    assertEquals(cliUtil.toString(['abc'], 'def'), 'def');
    assertEquals(cliUtil.toString(undefined, 'def'), 'def');
  });

  await t.step('toArray', () => {
    const cliUtil = new CliUtil();

    assertEquals(cliUtil.toArray(['abc', 123], ['def']), ['abc', '123']);
    assertEquals(cliUtil.toArray('abc, 123', ['def']), ['abc', '123']);

    assertEquals(cliUtil.toArray(true, ['def']), ['def']);
    assertEquals(cliUtil.toArray(123, ['def']), ['def']);
    assertEquals(cliUtil.toArray(undefined, ['def']), ['def']);
  });
});
