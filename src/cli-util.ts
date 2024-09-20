import { parseArgs } from '@std/cli/parse-args';

/**
 * An object containing the parsed CLI arguments.
 */
const args = parseArgs(Deno.args);

/**
 * Converts a CLI argument value to a boolean value.
 *
 * @param value - The value of a CLI argument.
 * @param defaultValue - The default boolean value to return if the argument is invalid or undefined.
 */
function booleanValue(value: unknown, defaultValue: boolean): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string' && ['true', 'false'].includes(value)) {
    return value === 'true';
  }
  return defaultValue;
}

/**
 * Converts a CLI argument value to a number value.
 *
 * @param value - The value of a CLI argument.
 * @param defaultValue - The default number value to return if the argument is invalid or undefined.
 */
function numberValue(value: unknown, defaultValue: number): number {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    return parseInt(value, 10) || defaultValue;
  }
  return defaultValue;
}

/**
 * Converts a CLI argument value to a string value.
 *
 * @param value - The value of a CLI argument.
 * @param defaultValue - The default string value to return if the argument is invalid or undefined.
 */
function stringValue(value: unknown, defaultValue: string): string {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return '' + value;
  }
  return defaultValue;
}

export { args, booleanValue, numberValue, stringValue };
