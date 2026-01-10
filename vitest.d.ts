import type {
  describe as vitestDescribe,
  it as vitestIt,
  expect as vitestExpect,
  test as vitestTest,
  beforeEach as vitestBeforeEach,
  afterEach as vitestAfterEach,
  beforeAll as vitestBeforeAll,
  afterAll as vitestAfterAll,
  vi as vitestVi
} from 'vitest';

declare global {
  const describe: typeof vitestDescribe;
  const it: typeof vitestIt;
  const expect: typeof vitestExpect;
  const test: typeof vitestTest;
  const beforeEach: typeof vitestBeforeEach;
  const afterEach: typeof vitestAfterEach;
  const beforeAll: typeof vitestBeforeAll;
  const afterAll: typeof vitestAfterAll;
  const vi: typeof vitestVi;
}

export {};
