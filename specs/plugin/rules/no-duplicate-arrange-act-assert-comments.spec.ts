import {RuleTester} from 'eslint';
import rule from '../../../src/rules/no-duplicate-arrange-act-assert-comments.js';

RuleTester.it = it;
RuleTester.describe = describe;

describe('no-duplicate-arrange-act-assert-comments', () => {
  describe('When multiple Arrange comments are present', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should fail', () => {
          // Arrange
          const setup1 = 'value1';
          // Arrange
          const setup2 = 'value2';
          // Act
          const result = setup1 + setup2;
          // Assert
          expect(result).toBe('value1value2');
        });
      `;

      // Act
      const run = () => tester.run('no-duplicate-arrange-act-assert-comments', rule, {
        valid: [],
        invalid: [{code, errors: [{message: "Multiple '// Arrange' comments found in test. Only one is allowed."}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When multiple Act comments are present', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should fail', () => {
          // Arrange
          const setup = 'value';
          // Act
          const result1 = setup.toUpperCase();
          // Act
          const result2 = result1.toLowerCase();
          // Assert
          expect(result2).toBe('value');
        });
      `;

      // Act
      const run = () => tester.run('no-duplicate-arrange-act-assert-comments', rule, {
        valid: [],
        invalid: [{code, errors: [{message: "Multiple '// Act' comments found in test. Only one is allowed."}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When multiple Assert comments are present', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should fail', () => {
          // Arrange
          const value = 42;
          // Act
          const result = value * 2;
          // Assert
          expect(result).toBeGreaterThan(0);
          // Assert
          expect(result).toBe(84);
        });
      `;

      // Act
      const run = () => tester.run('no-duplicate-arrange-act-assert-comments', rule, {
        valid: [],
        invalid: [{code, errors: [{message: "Multiple '// Assert' comments found in test. Only one is allowed."}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When single Arrange, Act, Assert comments are present', () => {
    it('should not report any error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should pass', () => {
          // Arrange
          const value = 'test';
          // Act
          const result = value.toUpperCase();
          // Assert
          expect(result).toBe('TEST');
        });
      `;

      // Act
      const run = () => tester.run('no-duplicate-arrange-act-assert-comments', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When only Act and Assert comments are present', () => {
    it('should not report any error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should pass', () => {
          // Act
          const result = Math.random();
          // Assert
          expect(typeof result).toBe('number');
        });
      `;

      // Act
      const run = () => tester.run('no-duplicate-arrange-act-assert-comments', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When multiple types of duplicate comments are present', () => {
    it('should report all errors', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should fail', () => {
          // Arrange
          const setup1 = 'value1';
          // Arrange
          const setup2 = 'value2';
          // Act
          const result1 = setup1;
          // Act
          const result2 = setup2;
          // Assert
          expect(result1).toBe('value1');
          // Assert
          expect(result2).toBe('value2');
        });
      `;

      // Act
      const run = () => tester.run('no-duplicate-arrange-act-assert-comments', rule, {
        valid: [],
        invalid: [{
          code, 
          errors: [
            {message: "Multiple '// Arrange' comments found in test. Only one is allowed."},
            {message: "Multiple '// Act' comments found in test. Only one is allowed."},
            {message: "Multiple '// Assert' comments found in test. Only one is allowed."}
          ]
        }],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });
});