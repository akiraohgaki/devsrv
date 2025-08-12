import type { PlaygroundTestContext } from './types.ts';

import { PlaygroundCode } from './PlaygroundCode.ts';
import { PlaygroundPreview } from './PlaygroundPreview.ts';
import { PlaygroundLogs } from './PlaygroundLogs.ts';
import { PlaygroundTest } from './PlaygroundTest.ts';

const code = new PlaygroundCode();
const preview = new PlaygroundPreview();
const logs = new PlaygroundLogs();

/**
 * Manage the playground page.
 *
 * @example Basic usage
 * ```ts
 * await Playground.test('Test', async (t) => {
 *   await t.step('create button', () => {
 *     Playground.preview.set('<button>button</button>');
 *     Playground.log(Playground.preview.get('button').textContent);
 *     Playground.log(Playground.preview.get().innerHTML);
 *   });
 * });
 * ```
 */
export class Playground {
  /**
   * PlaygroundCode instance that manipulate the code.
   */
  static get code(): PlaygroundCode {
    return code;
  }

  /**
   * PlaygroundPreview instance that manipulate the preview content.
   */
  static get preview(): PlaygroundPreview {
    return preview;
  }

  /**
   * PlaygroundLogs instance that manipulate the logs.
   */
  static get logs(): PlaygroundLogs {
    return logs;
  }

  /**
   * Adds a new log.
   *
   * This is an alias for Playground.logs.add().
   *
   * @param data - The data to log.
   */
  static log(...data: Array<unknown>): void {
    logs.add(...data);
  }

  /**
   * Runs a test.
   *
   * @param name - The name of the test.
   * @param fn - The function to run.
   */
  static async test(
    name: string,
    fn: (context: PlaygroundTestContext) => unknown,
  ): Promise<boolean> {
    const test = new PlaygroundTest({ name, fn });

    return await test.run();
  }

  /**
   * Pauses execution for a specified amount of time.
   *
   * @param ms - The number of milliseconds to wait.
   */
  static async sleep(ms: number): Promise<void> {
    await new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
