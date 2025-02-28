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
   * Returns the test state.
   */
  get state(): PlaygroundTestState {
    return this.#state;
  }

  /**
   * Runs the test and all its child tests.
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
   * Checks if all child tests have passed.
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
   * Outputs a report of the test's state and the state of its children.
   *
   * @param state - The state of the test.
   * @param indentationLevel - The indentation level for visual hierarchy.
   */
  #outputTestReport(state: PlaygroundTestState, indentationLevel: number = 0): void {
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
