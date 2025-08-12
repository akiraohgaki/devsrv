import { assert, assertEquals } from '@std/assert';

import { CliUtil } from '../../src/CliUtil.ts';

Deno.test('CliUtil', async (t) => {
  let cliUtil: CliUtil;

  await t.step('constructor()', () => {
    cliUtil = new CliUtil();

    assert(cliUtil);
  });

  await t.step('args', () => {
    assert(Array.isArray(cliUtil.args._));
  });

  await t.step('toBoolean()', async (t) => {
    await t.step('from boolean', () => {
      assertEquals(cliUtil.toBoolean(true, false), true);
      assertEquals(cliUtil.toBoolean(false, true), false);
    });

    await t.step('from string', () => {
      assertEquals(cliUtil.toBoolean('true', false), true);
      assertEquals(cliUtil.toBoolean('false', true), false);
    });

    await t.step('from invalid value', () => {
      assertEquals(cliUtil.toBoolean(123, false), false);
      assertEquals(cliUtil.toBoolean('abc', false), false);
      assertEquals(cliUtil.toBoolean(['abc'], false), false);
      assertEquals(cliUtil.toBoolean(undefined, false), false);
    });
  });

  await t.step('toNumber()', async (t) => {
    await t.step('from number', () => {
      assertEquals(cliUtil.toNumber(123, 0), 123);
      assertEquals(cliUtil.toNumber(0.123, 0), 0.123);
    });

    await t.step('from string', () => {
      assertEquals(cliUtil.toNumber('123', 0), 123);
      assertEquals(cliUtil.toNumber('0.123', 0), 0.123);
    });

    await t.step('from invalid value', () => {
      assertEquals(cliUtil.toNumber(true, 0), 0);
      assertEquals(cliUtil.toNumber('abc', 0), 0);
      assertEquals(cliUtil.toNumber(['abc'], 0), 0);
      assertEquals(cliUtil.toNumber(undefined, 0), 0);
    });
  });

  await t.step('toString()', async (t) => {
    await t.step('from string', () => {
      assertEquals(cliUtil.toString('abc', 'def'), 'abc');
    });

    await t.step('from number', () => {
      assertEquals(cliUtil.toString(123, 'def'), '123');
    });

    await t.step('from invalid value', () => {
      assertEquals(cliUtil.toString(true, 'def'), 'def');
      assertEquals(cliUtil.toString(['abc'], 'def'), 'def');
      assertEquals(cliUtil.toString(undefined, 'def'), 'def');
    });
  });

  await t.step('toArray()', async (t) => {
    await t.step('from array', () => {
      assertEquals(cliUtil.toArray(['abc', 123], ['def']), ['abc', '123']);
    });

    await t.step('from comma-separated string', () => {
      assertEquals(cliUtil.toArray('abc, 123', ['def']), ['abc', '123']);
    });

    await t.step('from invalid value', () => {
      assertEquals(cliUtil.toArray(true, ['def']), ['def']);
      assertEquals(cliUtil.toArray(123, ['def']), ['def']);
      assertEquals(cliUtil.toArray(undefined, ['def']), ['def']);
    });
  });
});
