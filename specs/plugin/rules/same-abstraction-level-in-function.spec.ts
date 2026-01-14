import {RuleTester} from 'eslint';
import rule from '../../../dist/plugin/rules/same-abstraction-level-in-function.js';

RuleTester.it = it;
RuleTester.describe = describe;

describe('same-abstraction-level-in-function', () => {
  describe('When a function mixes delegation with low-level details', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        function summarizeOrder() {
          const total = calculateTotal();
          const label = 'Total: ' + total;
          return label;
        }
      `;

      // Act
      const run = () => tester.run('same-abstraction-level-in-function', rule, {
        valid: [],
        invalid: [{code, errors: [{message: 'Keep a single level of abstraction within a function. Extract lower-level steps into separate functions.'}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When an async arrow function mixes delegation with low-level details', () => {
    it('should report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2017}});
      const code = `
        const buildMessage = async () => {
          const data = await fetchData();
          const message = \`id: \${data.id}\`;
          return message;
        };
      `;

      // Act
      const run = () => tester.run('same-abstraction-level-in-function', rule, {
        valid: [],
        invalid: [{code, errors: [{message: 'Keep a single level of abstraction within a function. Extract lower-level steps into separate functions.'}]}],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });

  describe('When a function stays at the same level of abstraction', () => {
    it('should not report an error', () => {
      // Arrange
      const tester = new RuleTester({languageOptions: {ecmaVersion: 2015}});
      const code = `
        function processOrder() {
          validateOrder();
          saveOrder();
          notifyCustomer();
        }

        function computeTotal(price, quantity) {
          const subtotal = price * quantity;
          const total = subtotal + 10;
          return total;
        }
      `;

      // Act
      const run = () => tester.run('same-abstraction-level-in-function', rule, {
        valid: [code],
        invalid: [],
      });

      // Assert
      expect(run).not.toThrow();
    });
  });
});
