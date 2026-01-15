import {RuleTester} from 'eslint';
import rule from '../../../src/rules/require-arrange-act-assert-comments.js';

RuleTester.it = it;
RuleTester.describe = describe;

describe('require-arrange-act-assert-comments', () => {
  describe('When \'// Act\' is missing', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should fail', () => {
          // Assert
          expect(true).toBe(true);
        });
      `;

      // Act
      const run = () => tester.run('require-arrange-act-assert-comments', rule, {
        valid: [],
        invalid: [{code, errors: [{message: 'Missing "// Act" comment in test'}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When \'// Assert\' is missing', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should fail', () => {
          // Act
        });
      `;

      // Act
      const run = () => tester.run('require-arrange-act-assert-comments', rule, {
        valid: [],
        invalid: [{code, errors: [{message: 'Missing "// Assert" comment in test'}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When there is setup before Act and no Arrange comment', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should fail', () => {
          const a = 1;
          // Act
          void a;
          // Assert
          expect(a).toBe(1);
        });
      `;

      // Act
      const run = () => tester.run('require-arrange-act-assert-comments', rule, {
        valid: [],
        invalid: [{code, errors: [{message: 'Missing "// Arrange" before "// Act" since there is some setup to prepare'}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When there is no setup before Act', () => {
    it('should not require an Arrange comment', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should pass', () => {
          // Act
          // Assert
        });
      `;

      // Act
      const run = () => tester.run('require-arrange-act-assert-comments', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When there is setup and an Arrange comment', () => {
    it('should be valid', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should pass', () => {
          // Arrange
          const a = 1;
          // Act
          void a;
          // Assert
          expect(a).toBe(1);
        });
      `;

      // Act
      const run = () => tester.run('require-arrange-act-assert-comments', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });
});
