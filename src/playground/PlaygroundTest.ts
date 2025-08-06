import type { PlaygroundTestContext, PlaygroundTestOptions, PlaygroundTestState } from './types.ts';

import { PlaygroundLogs } from './PlaygroundLogs.ts';

const logs = new PlaygroundLogs();

/**
 * Manages tests within the playground page.
 */
export class PlaygroundTest {
  #options: PlaygroundTestOptions;

  #state: PlaygroundTestState;

  /**
   * Creates a new instance of the PlaygroundTest class.
   *
   * @param options - The options for the test.
   */
  constructor(options: Partial<PlaygroundTestOptions>) {
    this.#options = {
      name: 'Untitled test',
      fn: () => {},
      parent: this,
      ...options,
    };

    this.#state = {
      name: this.#options.name,
      passed: false,
      result: undefined,
      exception: undefined,
      children: [],
    };

    if (this.#options.parent !== this) {
      this.#options.parent.state.children.push(this.#state);
    }
  }

  /**
   * The state of the test.
   */
  get state(): PlaygroundTestState {
    return this.#state;
  }

  /**
   * Runs the test and all its child tests.
   */
  async run(): Promise<boolean> {
    const context: PlaygroundTestContext = {
      step: async (name, fn) => {
        const test = new PlaygroundTest({ name, fn, parent: this });

        return await test.run();
      },
    };

    await Promise.resolve().then(() => {
      // Invoke the sync/async function in Promise chain.
      return this.#options.fn(context);
    }).then((result) => {
      this.#state.passed = this.#areChildrenPassed();
      this.#state.result = result;
    }).catch((exception) => {
      this.#state.passed = false;
      this.#state.exception = exception;
    });

    if (this.#options.parent === this) {
      this.#outputTestReport(this.#state);
    }

    return this.#state.passed;
  }

  /**
   * Checks if all child tests passed.
   */
  #areChildrenPassed(): boolean {
    for (const childState of this.#state.children) {
      if (!childState.passed) {
        return false;
      }
    }
    return true;
  }

  /**
   * Outputs a report on the test’s state and its children’s states.
   *
   * @param state - The state of the test.
   * @param indentationLevel - The indentation level for visual hierarchy.
   */
  #outputTestReport(state: PlaygroundTestState, indentationLevel: number = 1): void {
    logs.add(
      '#'.repeat(indentationLevel),
      state.name,
      '...',
      state.passed ? 'Passed' : 'Failed',
    );

    if (state.result !== undefined) {
      logs.add('Result:', state.result);
    }

    if (state.exception !== undefined) {
      logs.add('Exception:', state.exception);
    }

    for (const childState of state.children) {
      this.#outputTestReport(childState, indentationLevel + 1);
    }
  }
}
