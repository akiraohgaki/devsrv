import type { PlaygroundTest } from './PlaygroundTest.ts';

/**
 * PlaygroundTest options.
 */
export interface PlaygroundTestOptions {
  /**
   * The name of the test.
   */
  name: string;
  /**
   * The function to run for the test.
   */
  func: (context: PlaygroundTestContext) => unknown;
  /**
   * The parent instance of the PlaygroundTest, used for nested tests.
   */
  parent: PlaygroundTest;
}

/**
 * Context provided to test functions within the PlaygroundTest.
 */
export interface PlaygroundTestContext {
  /**
   * Defines a step within a test.
   *
   * @param name - The name of the step.
   * @param func - The function to run for the step.
   */
  step: (
    name: string,
    func: (context: PlaygroundTestContext) => unknown,
  ) => Promise<boolean>;
}

/**
 * Represents the state of a test within the PlaygroundTest.
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
