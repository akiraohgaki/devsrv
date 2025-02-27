import type { PlaygroundTestContext } from './types.ts';

import { PlaygroundCode } from './PlaygroundCode.ts';
import { PlaygroundPreview } from './PlaygroundPreview.ts';
import { PlaygroundLogs } from './PlaygroundLogs.ts';
import { PlaygroundTest } from './PlaygroundTest.ts';

const code = new PlaygroundCode();
const preview = new PlaygroundPreview();
const logs = new PlaygroundLogs();

export class Playground {
  static get code(): PlaygroundCode {
    return code;
  }

  static get preview(): PlaygroundPreview {
    return preview;
  }

  static get logs(): PlaygroundLogs {
    return logs;
  }

  static log(...data: Array<unknown>): void {
    logs.add(...data);
  }

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

  static async sleep(ms: number): Promise<void> {
    await new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
