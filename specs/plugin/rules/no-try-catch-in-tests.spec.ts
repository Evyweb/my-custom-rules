import {RuleTester} from 'eslint';
import rule from '../../../src/rules/no-try-catch-in-tests.js';

RuleTester.it = it;
RuleTester.describe = describe;

describe('no-try-catch-in-tests', () => {
  describe('When using try/catch inside a test', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should handle errors', () => {
          try {
            throw new Error('failure');
          } catch (error) {
            expect(error).toBeDefined();
          }
        });
      `;

      // Act
      const run = () => tester.run('no-try-catch-in-tests', rule, {
        valid: [],
        invalid: [{code, errors: [{message: 'Avoid using try/catch blocks inside tests. Use hooks for cleanup or explicit expectations on thrown errors instead.'}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When using try/finally inside a test', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should clean resources', () => {
          try {
            performAction();
          } finally {
            cleanup();
          }
        });
      `;

      // Act
      const run = () => tester.run('no-try-catch-in-tests', rule, {
        valid: [],
        invalid: [{code, errors: [{message: 'Avoid using try/catch blocks inside tests. Use hooks for cleanup or explicit expectations on thrown errors instead.'}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When a helper function uses try/catch outside a test', () => {
    it('should not report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        function helper() {
          try {
            performAction();
          } catch (error) {
            logError(error);
          }
        }

        helper();
      `;

      // Act
      const run = () => tester.run('no-try-catch-in-tests', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });
});
