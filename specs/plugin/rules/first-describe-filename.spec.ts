import {RuleTester} from 'eslint';
import rule from '../../../src/rules/first-describe-filename.js';

RuleTester.it = it;
RuleTester.describe = describe;

describe('first-describe-filename', () => {
  describe('When the first describe does not match the filename without extension', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        describe('wrong name', () => {
          it('should do something', () => {});
        });
      `;

      // Act
      const run = () => tester.run('first-describe-filename', rule, {
        valid: [],
        invalid: [{
          code,
          filename: '/path/to/myFile.spec.ts',
          errors: [{message: 'First describe title "wrong name" should match the filename without extension "myFile"'}],
          output: `
        describe('myFile', () => {
          it('should do something', () => {});
        });
      `
        }],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When the first describe matches the filename without extension', () => {
    it('should not report any error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        describe('myFile', () => {
          it('should do something', () => {});
        });
      `;

      // Act
      const run = () => tester.run('first-describe-filename', rule, {
        valid: [{
          code,
          filename: '/path/to/myFile.spec.ts'
        }],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When there are nested describes but first matches filename', () => {
    it('should not report any error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        describe('myFile', () => {
          describe('When something happens', () => {
            it('should do something', () => {});
          });
        });
      `;

      // Act
      const run = () => tester.run('first-describe-filename', rule, {
        valid: [{
          code,
          filename: '/path/to/myFile.spec.ts'
        }],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When filename has multiple extensions', () => {
    it('should match against the name without all extensions', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        describe('myTestFile', () => {
          it('should do something', () => {});
        });
      `;

      // Act
      const run = () => tester.run('first-describe-filename', rule, {
        valid: [{
          code,
          filename: '/path/to/myTestFile.spec.ts'
        }],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When filename is just a name without path', () => {
    it('should work correctly', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        describe('simpleFile', () => {
          it('should do something', () => {});
        });
      `;

      // Act
      const run = () => tester.run('first-describe-filename', rule, {
        valid: [{
          code,
          filename: 'simpleFile.ts'
        }],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When there is no filename', () => {
    it('should not report any error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        describe('anything', () => {
          it('should do something', () => {});
        });
      `;

      // Act
      const run = () => tester.run('first-describe-filename', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When there are no describe blocks', () => {
    it('should not report any error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        const x = 1;
        function test() {}
      `;

      // Act
      const run = () => tester.run('first-describe-filename', rule, {
        valid: [{
          code,
          filename: '/path/to/myFile.spec.ts'
        }],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });
});