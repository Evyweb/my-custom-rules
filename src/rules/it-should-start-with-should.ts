import type { Rule } from 'eslint';
import {isTestFunction} from "../core/helpers/isTestFunction.js";

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: '`it()` must start with "should" to describe the expected behavior',
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node: any) {
        if (isTestFunction(node)) {
          const title = node.arguments[0].value;
          if (typeof title === 'string' && !title.startsWith('should ')) {
            context.report({
              node: node.arguments[0],
              message: `Test title "${title}" must start with "should"`,
            });
          }
        }
      },
    };
  },
};

export default rule;
