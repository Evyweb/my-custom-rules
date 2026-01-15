import {RuleTester} from 'eslint';
import rule from '../../../src/rules/no-when-in-it.js';

RuleTester.it = it;
RuleTester.describe = describe;

describe('no-when-in-it', () => {
  describe('When using it with "when" in the title', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = "it('when user is logged in, should display dashboard', () => {});";

      // Act
      const run = () => tester.run('no-when-in-it', rule, {
        valid: [],
        invalid: [{
          code,
          errors: [{message: 'Test title should not contain "when". Describe the context in a parent `describe` block instead. Don\'t loose the context of the test. It is our live doc. Rework the test structure if necessary.'}]
        }],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When using it with "When" (capitalized) in the title', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = "it('When user clicks button, should submit form', () => {});";

      // Act
      const run = () => tester.run('no-when-in-it', rule, {
        valid: [],
        invalid: [{
          code,
          errors: [{message: 'Test title should not contain "when". Describe the context in a parent `describe` block instead. Don\'t loose the context of the test. It is our live doc. Rework the test structure if necessary.'}]
        }],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When using test with "when" in the title', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = "test('when the API fails, should show error', () => {});";

      // Act
      const run = () => tester.run('no-when-in-it', rule, {
        valid: [],
        invalid: [{
          code,
          errors: [{message: 'Test title should not contain "when". Describe the context in a parent `describe` block instead. Don\'t loose the context of the test. It is our live doc. Rework the test structure if necessary.'}]
        }],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When using it without "when" in the title', () => {
    it('should not report any error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = "it('should display the user profile', () => {});";

      // Act
      const run = () => tester.run('no-when-in-it', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When using describe with "when" in the title', () => {
    it('should not report any error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = "describe('when user is logged in', () => { it('should work', () => {}); });";

      // Act
      const run = () => tester.run('no-when-in-it', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When another function contains "when"', () => {
    it('should not report any error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = "foo('when something happens', () => {});";

      // Act
      const run = () => tester.run('no-when-in-it', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });
});
