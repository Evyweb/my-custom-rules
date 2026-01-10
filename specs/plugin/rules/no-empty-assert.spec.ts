import {RuleTester} from 'eslint';
import rule from '../../../dist/plugin/rules/no-empty-assert.js';

RuleTester.it = it;
RuleTester.describe = describe;

describe('no-empty-assert', () => {
  describe('When there is an empty Assert section', () => {
    it('should report an error without auto-fix', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should fail', () => {
          // Arrange
          const setup = createSetup();
          // Act
          const result = doSomething(setup);
          // Assert
        });
      `;

      // Act
      const run = () => tester.run('no-empty-assert', rule, {
        valid: [],
        invalid: [{
          code,
          errors: [{message: 'Empty "// Assert" section detected. Add assertions after Assert comment.'}]
        }],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When there is an Assert section with code', () => {
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
      const run = () => tester.run('no-empty-assert', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When there is no Assert section', () => {
    it('should be valid', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should pass', () => {
          // Arrange
          const setup = createSetup();
          // Act
          const result = doSomething(setup);
        });
      `;

      // Act
      const run = () => tester.run('no-empty-assert', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When there are multiple empty Assert sections', () => {
    it('should report errors for all empty sections without auto-fix', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        describe('test suite', () => {
          it('should fail', () => {
            // Arrange
            const setup1 = createSetup();
            // Act
            const result1 = doSomething(setup1);
            // Assert
          });
          it('should also fail', () => {
            // Arrange
            const setup2 = createSetup();
            // Act
            const result2 = doSomething(setup2);
            // Assert
          });
        });
      `;

      // Act
      const run = () => tester.run('no-empty-assert', rule, {
        valid: [],
        invalid: [{
          code,
          errors: [
            {message: 'Empty "// Assert" section detected. Add assertions after Assert comment.'},
            {message: 'Empty "// Assert" section detected. Add assertions after Assert comment.'}
          ]
        }],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When Assert section has only whitespace after the comment', () => {
    it('should report an error without auto-fix', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should fail', () => {
          // Arrange
          const setup = createSetup();
          // Act
          const result = doSomething(setup);
          // Assert

        });
      `;

      // Act
      const run = () => tester.run('no-empty-assert', rule, {
        valid: [],
        invalid: [{
          code,
          errors: [{message: 'Empty "// Assert" section detected. Add assertions after Assert comment.'}]
        }],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });
});