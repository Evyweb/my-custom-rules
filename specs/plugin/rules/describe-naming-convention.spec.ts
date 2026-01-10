import {RuleTester} from 'eslint';
import rule from '../../../dist/plugin/rules/describe-naming-convention.js';

RuleTester.it = it;
RuleTester.describe = describe;

describe('describe-naming-convention', () => {
  describe('When a nested describe does not start with "When "', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        describe('suite', () => {
          describe('invalid', () => {});
        });
      `;

      // Act
      const run = () => tester.run('describe-naming-convention', rule, {
        valid: [],
        invalid: [{code, errors: [{message: 'Nested describe title "invalid" must start with "When " to describe the context of the test'}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When a nested describe starts with "When "', () => {
    it('should not report any error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        describe('suite', () => {
          describe('When valid', () => {});
        });
      `;

      // Act
      const run = () => tester.run('describe-naming-convention', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When the describe is not nested', () => {
    it('should not report any error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        describe('not nested', () => {});
      `;

      // Act
      const run = () => tester.run('describe-naming-convention', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });
});
