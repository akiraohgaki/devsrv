import type { PlaygroundTestContext } from './types.ts';

import { PlaygroundCode } from './PlaygroundCode.ts';
import { PlaygroundPreview } from './PlaygroundPreview.ts';
import { PlaygroundLogs } from './PlaygroundLogs.ts';
import { PlaygroundTest } from './PlaygroundTest.ts';

const code = new PlaygroundCode();
const preview = new PlaygroundPreview();
const logs = new PlaygroundLogs();

/**
 * Playground class for managing the playground page.
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
   * Returns the PlaygroundCode instance.
   */
  static get code(): PlaygroundCode {
    return code;
  }

  /**
   * Returns the PlaygroundPreview instance.
   */
  static get preview(): PlaygroundPreview {
    return preview;
  }

  /**
   * Returns the PlaygroundLogs instance.
   */
  static get logs(): PlaygroundLogs {
    return logs;
  }

  /**
   * Logs data to the playground logs.
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
   * @param func - The function to run.
   */
  static async test(
    name: string,
    func: (context: PlaygroundTestContext) => unknown,
  ): Promise<boolean> {
    const test = new PlaygroundTest({
      name: name,
      func: func,
    });

    return await test.run();
  }

  /**
   * Pauses the execution for a specified amount of time.
   *
   * @param ms - The number of milliseconds to wait.
   */
  static async sleep(ms: number): Promise<void> {
    await new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
