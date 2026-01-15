import {RuleTester} from 'eslint';
import rule from '../../../src/rules/no-empty-arrange.js';

RuleTester.it = it;
RuleTester.describe = describe;

describe('no-empty-arrange', () => {
  describe('When there is an empty Arrange section', () => {
    it('should report an error and auto-fix by removing the comment', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should fail', () => {
          // Arrange
          // Act
          const result = doSomething();
          // Assert
          expect(result).toBe(true);
        });
      `;
      const expectedOutput = `
        it('should fail', () => {
          // Act
          const result = doSomething();
          // Assert
          expect(result).toBe(true);
        });
      `;

      // Act
      const run = () => tester.run('no-empty-arrange', rule, {
        valid: [],
        invalid: [{
          code,
          output: expectedOutput,
          errors: [{message: 'Empty "// Arrange" section should be removed'}]
        }],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When there is an Arrange section with code', () => {
    it('should be valid', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should pass', () => {
          // Arrange
          const setup = createSetup();
          // Act
          const result = doSomething(setup);
          // Assert
          expect(result).toBe(true);
        });
      `;

      // Act
      const run = () => tester.run('no-empty-arrange', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When there is no Arrange section', () => {
    it('should be valid', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should pass', () => {
          // Act
          const result = doSomething();
          // Assert
          expect(result).toBe(true);
        });
      `;

      // Act
      const run = () => tester.run('no-empty-arrange', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When there are multiple empty Arrange sections', () => {
    it('should report errors for all empty sections and auto-fix by removing them', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        describe('test suite', () => {
          it('should fail', () => {
            // Arrange
            // Act
            const result1 = doSomething();
            // Assert
            expect(result1).toBe(true);
          });
          it('should also fail', () => {
            // Arrange
            // Act
            const result2 = doSomethingElse();
            // Assert
            expect(result2).toBe(false);
          });
        });
      `;
      const expectedOutput = `
        describe('test suite', () => {
          it('should fail', () => {
            // Act
            const result1 = doSomething();
            // Assert
            expect(result1).toBe(true);
          });
          it('should also fail', () => {
            // Act
            const result2 = doSomethingElse();
            // Assert
            expect(result2).toBe(false);
          });
        });
      `;

      // Act
      const run = () => tester.run('no-empty-arrange', rule, {
        valid: [],
        invalid: [{
          code,
          output: expectedOutput,
          errors: [
            {message: 'Empty "// Arrange" section should be removed'},
            {message: 'Empty "// Arrange" section should be removed'}
          ]
        }],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When Arrange section has only whitespace after the comment', () => {
    it('should report an error and auto-fix by removing the comment', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should fail', () => {
          // Arrange

          // Act
          const result = doSomething();
          // Assert
          expect(result).toBe(true);
        });
      `;
      const expectedOutput = `
        it('should fail', () => {
          // Act
          const result = doSomething();
          // Assert
          expect(result).toBe(true);
        });
      `;

      // Act
      const run = () => tester.run('no-empty-arrange', rule, {
        valid: [],
        invalid: [{
          code,
          output: expectedOutput,
          errors: [{message: 'Empty "// Arrange" section should be removed'}]
        }],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });
});