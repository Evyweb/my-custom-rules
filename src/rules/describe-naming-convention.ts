import type { Rule } from 'eslint';
import { isDescribeFunction } from "../core/helpers/isDescribeFunction.js";

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: "Nested describe must start with 'When ' to describe the context of the test",
    },
    schema: [],
  },
  create(context) {
    let describeDepth = 0;

    return {
      CallExpression(node: any) {
        if (!isDescribeFunction(node)) return;

        const title = node.arguments[0].value;

        if (describeDepth > 0 && typeof title === 'string' && !title.startsWith('When ')) {
          context.report({
            node: node.arguments[0],
            message: `Nested describe title "${title}" must start with "When " to describe the context of the test`,
          });
        }

        describeDepth++;
      },
      'CallExpression:exit'(node: any) {
        if (isDescribeFunction(node)) {
          describeDepth--;
        }
      },
    };
  },
};

export default rule;
