import type { Rule } from 'eslint';
import {findComment} from "../helpers/findComment.js";
import {isSetupFunction} from "../helpers/isSetupFunction.js";

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prevent Arrange, Act, Assert comments in setup/teardown functions like beforeEach, beforeAll, afterEach, afterAll',
    },
    schema: [],
  },
  create(context) {
    const sourceCode = context.sourceCode;

    return {
      CallExpression(node: any) {
        if (!isSetupFunction(node)) return;

        const fnBody = node.arguments[0].body;
        if (fnBody.type !== 'BlockStatement') return;

        const comments = sourceCode.getCommentsInside(fnBody);
        const labels = ['Arrange', 'Act', 'Assert'];

        labels.forEach(label => {
          const comment = findComment(comments, label);
          if (comment) {
            context.report({
              node: comment,
              message: `Setup function should not contain '// ${label}' comment. Use descriptive function names instead.`,
            });
          }
        });
      },
    };
  },
};

export default rule;