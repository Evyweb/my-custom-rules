import {RuleTester} from 'eslint';
import rule from '../../../dist/plugin/rules/no-arrange-act-assert-in-setup.js';

RuleTester.it = it;
RuleTester.describe = describe;

describe('no-arrange-act-assert-in-setup', () => {
  describe('When beforeEach contains Arrange comment', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        beforeEach(() => {
          // Arrange
          const setup = 'value';
        });
      `;

      // Act
      const run = () => tester.run('no-arrange-act-assert-in-setup', rule, {
        valid: [],
        invalid: [{code, errors: [{message: "Setup function should not contain '// Arrange' comment. Use descriptive function names instead."}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When beforeAll contains Act comment', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        beforeAll(() => {
          // Act
          global.config = loadConfig();
        });
      `;

      // Act
      const run = () => tester.run('no-arrange-act-assert-in-setup', rule, {
        valid: [],
        invalid: [{code, errors: [{message: "Setup function should not contain '// Act' comment. Use descriptive function names instead."}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When afterEach contains Assert comment', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        afterEach(() => {
          // Assert
          expect(mockFn).toHaveBeenCalled();
        });
      `;

      // Act
      const run = () => tester.run('no-arrange-act-assert-in-setup', rule, {
        valid: [],
        invalid: [{code, errors: [{message: "Setup function should not contain '// Assert' comment. Use descriptive function names instead."}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When afterAll contains multiple AAA comments', () => {
    it('should report all errors', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        afterAll(() => {
          // Arrange
          const cleanup = getCleanupTasks();
          // Act
          cleanup.forEach(task => task());
          // Assert
          expect(cleanup).toHaveLength(0);
        });
      `;

      // Act
      const run = () => tester.run('no-arrange-act-assert-in-setup', rule, {
        valid: [],
        invalid: [{
          code, 
          errors: [
            {message: "Setup function should not contain '// Arrange' comment. Use descriptive function names instead."},
            {message: "Setup function should not contain '// Act' comment. Use descriptive function names instead."},
            {message: "Setup function should not contain '// Assert' comment. Use descriptive function names instead."}
          ]
        }],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When setup functions have no AAA comments', () => {
    it('should not report any error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        beforeEach(() => {
          mockDatabase.clear();
          testUser = createTestUser();
        });
        
        beforeAll(() => {
          server = startTestServer();
        });
        
        afterEach(() => {
          mockDatabase.reset();
        });
        
        afterAll(() => {
          server.close();
        });
      `;

      // Act
      const run = () => tester.run('no-arrange-act-assert-in-setup', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When test function contains AAA comments', () => {
    it('should not report any error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        it('should work correctly', () => {
          // Arrange
          const setup = 'value';
          // Act
          const result = setup.toUpperCase();
          // Assert
          expect(result).toBe('VALUE');
        });
      `;

      // Act
      const run = () => tester.run('no-arrange-act-assert-in-setup', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When setup function uses function expression', () => {
    it('should report error for AAA comments', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        beforeEach(function() {
          // Arrange
          this.setup = 'value';
        });
      `;

      // Act
      const run = () => tester.run('no-arrange-act-assert-in-setup', rule, {
        valid: [],
        invalid: [{code, errors: [{message: "Setup function should not contain '// Arrange' comment. Use descriptive function names instead."}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });
});