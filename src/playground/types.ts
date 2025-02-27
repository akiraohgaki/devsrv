import type { PlaygroundTest } from './PlaygroundTest.ts';

export interface PlaygroundTestOptions {
  name: string;
  func: (context: PlaygroundTestContext) => unknown;
  rootInstance?: PlaygroundTest;
}

export interface PlaygroundTestContext {
  step: (
    name: string,
    func: (context: PlaygroundTestContext) => unknown,
  ) => Promise<boolean>;
}

export interface PlaygroundTestState {
  name: string;
  isPassed: boolean;
  result: unknown;
  exception: unknown;
}
