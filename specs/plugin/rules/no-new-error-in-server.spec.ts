import {RuleTester} from 'eslint';
import rule from '../../../dist/plugin/rules/no-new-error-in-server.js';

RuleTester.it = it;
RuleTester.describe = describe;

describe('no-new-error-in-server', () => {
  describe('When instantiating Error outside src/server', () => {
    it('should not report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        function createError() {
          return new Error('example');
        }
      `;

      // Act
      const run = () => tester.run('no-new-error-in-server', rule, {
        valid: [{code, filename: 'src/client/some-file.ts'}],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When instantiating Error inside src/server', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        function createError() {
          throw new Error('example');
        }
      `;

      // Act
      const run = () => tester.run('no-new-error-in-server', rule, {
        valid: [],
        invalid: [{code, filename: 'src/server/example.ts', errors: [{messageId: 'useDomainError'}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });
});
