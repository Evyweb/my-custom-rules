import {RuleTester} from 'eslint';
import rule from '../../../dist/plugin/rules/no-text-after-arrange-act-assert.js';

RuleTester.it = it;
RuleTester.describe = describe;

describe('no-text-after-arrange-act-assert', () => {
  describe('When Arrange comment has extra text', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should fail', () => {
          // Arrange test data
          const setup = 'value';
          // Act
          const result = setup.toUpperCase();
          // Assert
          expect(result).toBe('VALUE');
        });
      `;

      // Act
      const run = () => tester.run('no-text-after-arrange-act-assert', rule, {
        valid: [],
        invalid: [{code, errors: [{message: "Comment '// Arrange test data' should be exactly '// Arrange'"}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When Act comment has extra text', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should fail', () => {
          // Arrange
          const setup = 'value';
          // Act - perform transformation
          const result = setup.toUpperCase();
          // Assert
          expect(result).toBe('VALUE');
        });
      `;

      // Act
      const run = () => tester.run('no-text-after-arrange-act-assert', rule, {
        valid: [],
        invalid: [{code, errors: [{message: "Comment '// Act - perform transformation' should be exactly '// Act'"}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When Assert comment has extra text', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should fail', () => {
          // Arrange
          const setup = 'value';
          // Act
          const result = setup.toUpperCase();
          // Assert the result is correct
          expect(result).toBe('VALUE');
        });
      `;

      // Act
      const run = () => tester.run('no-text-after-arrange-act-assert', rule, {
        valid: [],
        invalid: [{code, errors: [{message: "Comment '// Assert the result is correct' should be exactly '// Assert'"}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When comments have wrong case', () => {
    it('should report an error for lowercase', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should fail', () => {
          // arrange
          const setup = 'value';
          // act
          const result = setup.toUpperCase();
          // assert
          expect(result).toBe('VALUE');
        });
      `;

      // Act
      const run = () => tester.run('no-text-after-arrange-act-assert', rule, {
        valid: [],
        invalid: [{
          code, 
          errors: [
            {message: "Comment '// arrange' should be exactly '// Arrange'"},
            {message: "Comment '// act' should be exactly '// Act'"},
            {message: "Comment '// assert' should be exactly '// Assert'"}
          ]
        }],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When comments are exactly correct', () => {
    it('should not report any error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should pass', () => {
          // Arrange
          const setup = 'value';
          // Act
          const result = setup.toUpperCase();
          // Assert
          expect(result).toBe('VALUE');
        });
      `;

      // Act
      const run = () => tester.run('no-text-after-arrange-act-assert', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When only Act and Assert are present', () => {
    it('should not report any error if exactly correct', () => {
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
      const run = () => tester.run('no-text-after-arrange-act-assert', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When multiple violations exist', () => {
    it('should report all errors', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should fail', () => {
          // Arrange setup data
          const setup = 'value';
          // Act - transform the data
          const result = setup.toUpperCase();
          // Assert that result matches
          expect(result).toBe('VALUE');
        });
      `;

      // Act
      const run = () => tester.run('no-text-after-arrange-act-assert', rule, {
        valid: [],
        invalid: [{
          code, 
          errors: [
            {message: "Comment '// Arrange setup data' should be exactly '// Arrange'"},
            {message: "Comment '// Act - transform the data' should be exactly '// Act'"},
            {message: "Comment '// Assert that result matches' should be exactly '// Assert'"}
          ]
        }],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });
});