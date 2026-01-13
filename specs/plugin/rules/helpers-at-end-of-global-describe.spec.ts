import {RuleTester} from 'eslint';
import rule from '../../../dist/plugin/rules/helpers-at-end-of-global-describe.js';

RuleTester.it = it;
RuleTester.describe = describe;

describe('helpers-at-end-of-global-describe', () => {
  describe('When a helper function is declared before a test in the global describe', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        describe('suite', () => {
          const buildSut = () => ({value: 1});
          it('should return the value', () => {
            // Arrange
            const input = 1;
            // Act
            const result = input + 1;
            // Assert
            expect(result).toBe(2);
          });
        });
      `;

      // Act
      const run = () => tester.run('helpers-at-end-of-global-describe', rule, {
        valid: [],
        invalid: [{
          code,
          errors: [{message: 'Helper functions should be declared at the end of the global describe block'}],
        }],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When helper functions are declared after tests in the global describe', () => {
    it('should be valid', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        describe('suite', () => {
          it('should return the value', () => {
            // Arrange
            const input = 1;
            // Act
            const result = input + 1;
            // Assert
            expect(result).toBe(2);
          });

          function buildSut() {
            return {value: 1};
          }
        });
      `;

      // Act
      const run = () => tester.run('helpers-at-end-of-global-describe', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When the global describe contains only helper functions', () => {
    it('should be valid', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        describe('suite', () => {
          const buildSut = () => ({value: 1});
          function createSut() {
            return {value: 2};
          }
        });
      `;

      // Act
      const run = () => tester.run('helpers-at-end-of-global-describe', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });
});
