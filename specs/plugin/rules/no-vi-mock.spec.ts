import {RuleTester} from 'eslint';
import rule from '../../../src/rules/no-vi-mock.js';

RuleTester.it = it;
RuleTester.describe = describe;

describe('no-vi-mock', () => {
  describe('When using vi.mock with external module', () => {
    it('should not report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        vi.mock('some-external-module', () => ({
          someMethod: vi.fn()
        }));
      `;

      // Act
      const run = () => tester.run('no-vi-mock', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When using vi.mock with internal module path', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        vi.mock('@/src/some/module', () => ({
          useHook: vi.fn()
        }));
      `;

      // Act
      const run = () => tester.run('no-vi-mock', rule, {
        valid: [],
        invalid: [{code, errors: [{message: "Avoid mocking internal module '@/src/some/module'. Use dependency injection with in-memory or fake implementations instead."}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When using vi.mocked', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        const mockFunction = vi.mocked(useHook);
      `;

      // Act
      const run = () => tester.run('no-vi-mock', rule, {
        valid: [],
        invalid: [{code, errors: [{message: "Avoid using 'vi.mocked'. Use dependency injection with in-memory or fake implementations instead."}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When using vi.fn without vi.mock', () => {
    it('should not report any error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        const mockCallback = vi.fn();
        const mockFunction = vi.fn(() => 'result');
      `;

      // Act
      const run = () => tester.run('no-vi-mock', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When using other vi methods', () => {
    it('should not report any error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        vi.clearAllMocks();
        vi.resetAllMocks();
        vi.restoreAllMocks();
        const spy = vi.spyOn(object, 'method');
      `;

      // Act
      const run = () => tester.run('no-vi-mock', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When using regular function calls', () => {
    it('should not report any error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        const result = someFunction();
        mock.method();
        const obj = { mock: () => {} };
      `;

      // Act
      const run = () => tester.run('no-vi-mock', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When using vi.mock with external arrow function', () => {
    it('should not report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015, sourceType: 'module'}});
      const code = `
        vi.mock('external-module', () => {
          return {
            default: vi.fn(),
            namedExport: vi.fn()
          };
        });
      `;

      // Act
      const run = () => tester.run('no-vi-mock', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When using multiple vi.mock calls with internal modules', () => {
    it('should report multiple errors', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        vi.mock('@/src/module-1', () => ({}));
        vi.mock('@/src/module-2', () => ({}));
        const mocked = vi.mocked(someFunction);
      `;

      // Act
      const run = () => tester.run('no-vi-mock', rule, {
        valid: [],
        invalid: [{
          code, 
          errors: [
            {message: "Avoid mocking internal module '@/src/module-1'. Use dependency injection with in-memory or fake implementations instead."},
            {message: "Avoid mocking internal module '@/src/module-2'. Use dependency injection with in-memory or fake implementations instead."},
            {message: "Avoid using 'vi.mocked'. Use dependency injection with in-memory or fake implementations instead."}
          ]
        }],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });
});