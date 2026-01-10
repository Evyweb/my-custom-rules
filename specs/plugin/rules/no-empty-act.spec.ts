import {RuleTester} from 'eslint';
import rule from '../../../dist/plugin/rules/no-empty-act.js';

RuleTester.it = it;
RuleTester.describe = describe;

describe('no-empty-act', () => {
  describe('When there is an empty Act section', () => {
    it('should report an error without auto-fix', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should fail', () => {
          // Arrange
          const setup = createSetup();
          // Act
          // Assert
          expect(result).toBe(true);
        });
      `;

      // Act
      const run = () => tester.run('no-empty-act', rule, {
        valid: [],
        invalid: [{
          code,
          errors: [{message: 'Empty "// Act" section detected. Add code between Act and Assert comments.'}]
        }],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When there is an Act section with code', () => {
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
      const run = () => tester.run('no-empty-act', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When there is no Act section', () => {
    it('should be valid', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should pass', () => {
          // Arrange
          const setup = createSetup();
          // Assert
          expect(setup).toBeDefined();
        });
      `;

      // Act
      const run = () => tester.run('no-empty-act', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When there are multiple empty Act sections', () => {
    it('should report errors for all empty sections without auto-fix', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        describe('test suite', () => {
          it('should fail', () => {
            // Arrange
            const setup1 = createSetup();
            // Act
            // Assert
            expect(setup1).toBeDefined();
          });
          it('should also fail', () => {
            // Arrange
            const setup2 = createSetup();
            // Act
            // Assert
            expect(setup2).toBeDefined();
          });
        });
      `;

      // Act
      const run = () => tester.run('no-empty-act', rule, {
        valid: [],
        invalid: [{
          code,
          errors: [
            {message: 'Empty "// Act" section detected. Add code between Act and Assert comments.'},
            {message: 'Empty "// Act" section detected. Add code between Act and Assert comments.'}
          ]
        }],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When Act section has only whitespace after the comment', () => {
    it('should report an error without auto-fix', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should fail', () => {
          // Arrange
          const setup = createSetup();
          // Act

          // Assert
          expect(setup).toBeDefined();
        });
      `;

      // Act
      const run = () => tester.run('no-empty-act', rule, {
        valid: [],
        invalid: [{
          code,
          errors: [{message: 'Empty "// Act" section detected. Add code between Act and Assert comments.'}]
        }],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });
});