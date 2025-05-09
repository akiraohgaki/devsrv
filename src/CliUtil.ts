import { parseArgs } from '@std/cli/parse-args';

/**
 * CLI utility class.
 *
 * @example Basic usage
 * ```ts
 * const cliUtil = new CliUtil();
 *
 * const arg = cliUtil.args.name;
 *
 * const booleanValue = cliUtil.toBoolean(arg, false);
 *
 * const numberValue = cliUtil.toNumber(arg, 0);
 *
 * const stringValue = cliUtil.toString(arg, '');
 *
 * const arrayValue = cliUtil.toArray(arg, []);
 * ```
 */
export class CliUtil {
  #args: ReturnType<typeof parseArgs>;

  /**
   * Creates a new instance of the CliUtil class.
   */
  constructor() {
    this.#args = parseArgs(Deno.args);
  }

  /**
   * Returns an object containing the parsed CLI arguments.
   */
  get args(): ReturnType<typeof parseArgs> {
    return this.#args;
  }

  /**
   * Converts a CLI argument value to a boolean value.
   *
   * @param value - The value of a CLI argument.
   * @param defaultValue - The default value to return if the argument is invalid or undefined.
   */
  toBoolean(value: unknown, defaultValue: boolean): boolean {
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
   * @param defaultValue - The default value to return if the argument is invalid or undefined.
   */
  toNumber(value: unknown, defaultValue: number): number {
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
   * @param defaultValue - The default value to return if the argument is invalid or undefined.
   */
  toString(value: unknown, defaultValue: string): string {
    if (typeof value === 'string') {
      return value;
    }
    if (typeof value === 'number') {
      return '' + value;
    }
    return defaultValue;
  }

  /**
   * Converts a CLI argument value to an array of strings.
   *
   * @param value - The value of a CLI argument.
   * @param defaultValue - The default value to return if the argument is invalid or undefined.
   */
  toArray(value: unknown, defaultValue: Array<string>): Array<string> {
    if (Array.isArray(value)) {
      return value.map((item) => '' + item);
    }
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    return defaultValue;
  }
}
