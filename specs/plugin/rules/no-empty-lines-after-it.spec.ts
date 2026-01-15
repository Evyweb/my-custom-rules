import {RuleTester} from 'eslint';
import rule from '../../../src/rules/no-empty-lines-after-it.js';

RuleTester.it = it;
RuleTester.describe = describe;

describe('no-empty-lines-after-it', () => {
  describe('When there is an empty line after the "it" line', () => {
    it('should report an error and auto-fix by removing the empty line', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should test something', () => {

          // Arrange
          const setup = createTestingEnvironment();
        });
      `;
      const output = `
        it('should test something', () => {
          // Arrange
          const setup = createTestingEnvironment();
        });
      `;

      // Act
      const run = () => tester.run('no-empty-lines-after-it', rule, {
        valid: [],
        invalid: [{
          code,
          output,
          errors: [{message: 'No empty lines should follow the "it" line'}]
        }],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When there are multiple empty lines after the "it" line', () => {
    it('should report an error and auto-fix by removing all empty lines', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should test something', () => {


          // Act
          const result = doSomething();
        });
      `;
      const output = `
        it('should test something', () => {
          // Act
          const result = doSomething();
        });
      `;

      // Act
      const run = () => tester.run('no-empty-lines-after-it', rule, {
        valid: [],
        invalid: [{
          code,
          output,
          errors: [{message: 'No empty lines should follow the "it" line'}]
        }],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When there is no empty line after the "it" line', () => {
    it('should not report an error for immediate comment', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should test something', () => {
          // Arrange
          const setup = createTestingEnvironment();
        });
      `;

      // Act
      const run = () => tester.run('no-empty-lines-after-it', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });

    it('should not report an error for immediate code', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should test something', () => {
          const setup = createTestingEnvironment();
        });
      `;

      // Act
      const run = () => tester.run('no-empty-lines-after-it', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When "it" function is empty', () => {
    it('should not report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should test something', () => {
        });
      `;

      // Act
      const run = () => tester.run('no-empty-lines-after-it', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });
});