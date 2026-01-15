import {RuleTester} from 'eslint';
import rule from '../../../src/rules/it-should-start-with-should.js';

RuleTester.it = it;
RuleTester.describe = describe;

describe('it-should-start-with-should', () => {
  describe('When using it with a title not starting with "should"', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = "it('does something', () => {});";

      // Act
      const run = () => tester.run('it-should-start-with-should', rule, {
        valid: [],
        invalid: [{code, errors: [{message: 'Test title "does something" must start with "should"'}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When using test with a title not starting with "should"', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = "test('does work', () => {});";

      // Act
      const run = () => tester.run('it-should-start-with-should', rule, {
        valid: [],
        invalid: [{code, errors: [{message: 'Test title "does work" must start with "should"'}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When using it with a title starting with "should"', () => {
    it('should not report any error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = "it('should work', () => {});";

      // Act
      const run = () => tester.run('it-should-start-with-should', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When using test with a title starting with "should"', () => {
    it('should not report any error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = "test('should work', () => {});";

      // Act
      const run = () => tester.run('it-should-start-with-should', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When another function is used', () => {
    it('should not report any error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = "foo('does something', () => {});";

      // Act
      const run = () => tester.run('it-should-start-with-should', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });
});
