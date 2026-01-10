import {RuleTester} from 'eslint';
import rule from '../../../dist/plugin/rules/single-spec-per-sut.js';

RuleTester.it = it;
RuleTester.describe = describe;

describe('single-spec-per-sut', () => {
  describe('When the spec filename contains additional segments before .spec', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        describe('When doing something', () => {
          it('should behave as expected', () => {});
        });
      `;

      // Act
      const run = () => tester.run('single-spec-per-sut', rule, {
        valid: [],
        invalid: [{
          code,
          filename: '/tests/Match.doSomething.spec.ts',
          errors: [{message: 'The spec file "Match.doSomething.spec.ts" should not contain additional name segments. Use "Match.spec.ts" instead to keep a single spec file per subject under test.'}]
        }],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When the spec filename already targets a single subject', () => {
    it('should not report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        describe('When Match is used', () => {
          it('should behave as expected', () => {});
        });
      `;

      // Act
      const run = () => tester.run('single-spec-per-sut', rule, {
        valid: [{
          code,
          filename: '/tests/Match.spec.ts'
        }],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When the file is not a spec', () => {
    it('should ignore the file', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        describe('When something else happens', () => {
          it('should do nothing', () => {});
        });
      `;

      // Act
      const run = () => tester.run('single-spec-per-sut', rule, {
        valid: [{
          code,
          filename: '/tests/Match.ts'
        }],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });
});
