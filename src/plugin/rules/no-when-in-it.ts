import type { Rule } from 'eslint';
import {isTestFunction} from "../helpers/isTestFunction.js";

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Test titles in `it()` or `test()` should not contain "when". Use a describe block instead.',
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node: any) {
        if (isTestFunction(node)) {
          const title = node.arguments[0].value;
          if (typeof title === 'string' && /when/i.test(title)) {
            context.report({
              node: node.arguments[0],
              message: 'Test title should not contain "when". Describe the context in a parent `describe` block instead. Don\'t loose the context of the test. It is our live doc. Rework the test structure if necessary.',
            });
          }
        }
      },
    };
  },
};

export default rule;
