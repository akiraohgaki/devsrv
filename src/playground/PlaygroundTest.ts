import type { PlaygroundTestContext, PlaygroundTestOptions, PlaygroundTestState } from './types.ts';

import { PlaygroundLogs } from './PlaygroundLogs.ts';

const logs = new PlaygroundLogs();

/**
 * PlaygroundTest class for managing tests within the playground page.
 */
export class PlaygroundTest {
  #options: PlaygroundTestOptions;

  #state: PlaygroundTestState;

  /**
   * Creates a new instance of the PlaygroundTest class.
   *
   * @param options - The test options.
   */
  constructor(options: Partial<PlaygroundTestOptions>) {
    this.#options = {
      name: 'Untitled test',
      func: () => {},
      parent: this,
      ...options,
    };

    this.#state = {
      name: this.#options.name,
      isPassed: false,
      result: undefined,
      exception: undefined,
      children: [],
    };

    if (this.#options.parent !== this) {
      this.#options.parent.state.children.push(this.#state);
    }
  }

  /**
   * Returns the test state.
   */
  get state(): PlaygroundTestState {
    return this.#state;
  }

  /**
   * Runs the test.
   */
  async run(): Promise<boolean> {
    const context: PlaygroundTestContext = {
      step: async (name, func) => {
        const test = new PlaygroundTest({ name, func, parent: this });

        return await test.run();
      },
    };

    await Promise.resolve().then(() => {
      // Invoke the sync/async func in Promise chain.
      return this.#options.func(context);
    }).then((result) => {
      this.#state.isPassed = this.#isChildrenPassed();
      this.#state.result = result;
    }).catch((exception) => {
      this.#state.isPassed = false;
      this.#state.exception = exception;
    });

    if (this.#options.parent === this) {
      this.#outputState(this.#state);
    }

    return this.#state.isPassed;
  }

  /**
   * Checks if all child tests have passed.
   */
  #isChildrenPassed(): boolean {
    for (const childState of this.#state.children) {
      if (!childState.isPassed) {
        return false;
      }
    }
    return true;
  }

  /**
   * Outputs the state of the test and its children to the logs.
   *
   * @param state - The state of the test.
   * @param depth - The depth of the test in the hierarchy.
   */
  #outputState(state: PlaygroundTestState, depth: number = 1): void {
    logs.add(''.padEnd(depth, '#'), state.name, '...', state.isPassed ? 'Passed' : 'Failed');

    if (state.result !== undefined) {
      logs.add(state.result);
    }

    if (state.exception !== undefined) {
      logs.add(state.exception);
    }

    for (const childState of state.children) {
      this.#outputState(childState, depth + 1);
    }
  }
}
