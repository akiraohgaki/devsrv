import type { PlaygroundTest } from './PlaygroundTest.ts';

/**
 * The options for the test.
 */
export interface PlaygroundTestOptions {
  /**
   * The name of the test.
   */
  name: string;
  /**
   * The function to run for the test.
   *
   * @param context - Context provided to test functions.
   */
  fn: (context: PlaygroundTestContext) => unknown;
  /**
   * The parent instance of the PlaygroundTest, used for nested tests.
   */
  parent: PlaygroundTest;
}

/**
 * Context provided to test functions.
 */
export interface PlaygroundTestContext {
  /**
   * Defines a step within a test.
   *
   * @param name - The name of the step.
   * @param fn - The function to run for the step.
   */
  step: (
    name: string,
    fn: (context: PlaygroundTestContext) => unknown,
  ) => Promise<boolean>;
}

/**
 * The state of the test.
 */
export interface PlaygroundTestState {
  /**
   * The name of the test.
   */
  name: string;
  /**
   * Indicates whether the test passed.
   */
  passed: boolean;
  /**
   * The result of the test, if any.
   */
  result: unknown;
  /**
   * The exception thrown during the test, if any.
   */
  exception: unknown;
  /**
   * The states of the steps within the test.
   */
  children: Array<PlaygroundTestState>;
}
