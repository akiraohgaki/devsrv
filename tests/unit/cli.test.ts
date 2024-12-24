import { assertEquals } from '@std/assert';

import { args, arrayValue, booleanValue, numberValue, stringValue } from '../../src/cli.ts';

Deno.test('cli', async (t) => {
  await t.step('args', () => {
    assertEquals(Array.isArray(args._), true);
  });

  await t.step('booleanValue', () => {
    assertEquals(booleanValue(true, false), true);
    assertEquals(booleanValue(false, true), false);
    assertEquals(booleanValue('true', false), true);
    assertEquals(booleanValue('false', true), false);

    assertEquals(booleanValue(123, false), false);
    assertEquals(booleanValue('abc', false), false);
    assertEquals(booleanValue(['abc'], false), false);
    assertEquals(booleanValue(undefined, true), true);
  });

  await t.step('numberValue', () => {
    assertEquals(numberValue(123, 0), 123);
    assertEquals(numberValue('123', 0), 123);

    assertEquals(numberValue(true, 0), 0);
    assertEquals(numberValue('abc', 0), 0);
    assertEquals(numberValue(['abc'], 0), 0);
    assertEquals(numberValue(undefined, 1), 1);
  });

  await t.step('stringValue', () => {
    assertEquals(stringValue('abc', 'def'), 'abc');
    assertEquals(stringValue(123, 'def'), '123');

    assertEquals(stringValue(true, 'def'), 'def');
    assertEquals(stringValue(['abc'], 'def'), 'def');
    assertEquals(stringValue(undefined, 'def'), 'def');
  });

  await t.step('arrayValue', () => {
    assertEquals(arrayValue(['abc', 123], ['def']), ['abc', '123']);
    assertEquals(arrayValue('abc, 123', ['def']), ['abc', '123']);

    assertEquals(arrayValue(true, ['def']), ['def']);
    assertEquals(arrayValue(123, ['def']), ['def']);
    assertEquals(arrayValue(undefined, ['def']), ['def']);
  });
});
