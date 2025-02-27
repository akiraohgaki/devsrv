import type { PlaygroundTestContext, PlaygroundTestOptions, PlaygroundTestState } from './types.ts';

import { PlaygroundLogs } from './PlaygroundLogs.ts';

export class PlaygroundTest {
  #options: PlaygroundTestOptions;

  #state: PlaygroundTestState;

  #stateCollection: Set<PlaygroundTestState>;

  constructor(options: PlaygroundTestOptions) {
    this.#options = {
      rootInstance: this,
      ...options,
    };

    this.#state = {
      name: this.#options.name,
      isPassed: false,
      result: undefined,
      exception: undefined,
    };

    this.#stateCollection = this.#options.rootInstance?.stateCollection ?? new Set();

    this.#stateCollection.add(this.#state);
  }

  get stateCollection(): Set<PlaygroundTestState> {
    return this.#stateCollection;
  }

  async run(): Promise<boolean> {
    const context: PlaygroundTestContext = {
      step: async (name, func) => {
        const test = new PlaygroundTest({
          name: name,
          func: func,
          rootInstance: this.#options.rootInstance,
        });

        return await test.run();
      },
    };

    await Promise.resolve().then(() => {
      // Invoke the sync/async func in Promise chain.
      return this.#options.func(context);
    }).then((result) => {
      this.#state.isPassed = true;
      this.#state.result = result;
    }).catch((exception) => {
      this.#state.isPassed = false;
      this.#state.exception = exception;
    });

    if (this.#options.rootInstance === this) {
      const logs = new PlaygroundLogs();

      for (const state of this.#stateCollection) {
        logs.add(state.name, '...', state.isPassed ? 'Passed' : 'Failed');

        if (state.result !== undefined) {
          logs.add(state.result);
        }

        if (state.exception !== undefined) {
          logs.add(state.exception);
        }
      }
    }

    return this.#state.isPassed;
  }
}
