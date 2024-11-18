import { assertEquals, assertStrictEquals } from '@std/assert';

import { args, arrayValue, booleanValue, numberValue, stringValue } from '../../src/cli.ts';

Deno.test('cli', async (t) => {
  await t.step('args', () => {
    assertStrictEquals(Array.isArray(args._), true);
  });

  await t.step('booleanValue', () => {
    assertStrictEquals(booleanValue(true, false), true);
    assertStrictEquals(booleanValue(false, true), false);
    assertStrictEquals(booleanValue('true', false), true);
    assertStrictEquals(booleanValue('false', true), false);

    assertStrictEquals(booleanValue(123, false), false);
    assertStrictEquals(booleanValue('abc', false), false);
    assertStrictEquals(booleanValue(['abc'], false), false);
    assertStrictEquals(booleanValue(undefined, true), true);
  });

  await t.step('numberValue', () => {
    assertStrictEquals(numberValue(123, 0), 123);
    assertStrictEquals(numberValue('123', 0), 123);

    assertStrictEquals(numberValue(true, 0), 0);
    assertStrictEquals(numberValue('abc', 0), 0);
    assertStrictEquals(numberValue(['abc'], 0), 0);
    assertStrictEquals(numberValue(undefined, 1), 1);
  });

  await t.step('stringValue', () => {
    assertStrictEquals(stringValue('abc', 'def'), 'abc');
    assertStrictEquals(stringValue(123, 'def'), '123');

    assertStrictEquals(stringValue(true, 'def'), 'def');
    assertStrictEquals(stringValue(['abc'], 'def'), 'def');
    assertStrictEquals(stringValue(undefined, 'def'), 'def');
  });

  await t.step('arrayValue', () => {
    assertEquals(arrayValue(['abc', 123], ['def']), ['abc', '123']);
    assertEquals(arrayValue('abc, 123', ['def']), ['abc', '123']);

    assertEquals(arrayValue(true, ['def']), ['def']);
    assertEquals(arrayValue(123, ['def']), ['def']);
    assertEquals(arrayValue(undefined, ['def']), ['def']);
  });
});
