import type { Rule } from 'eslint';
import {isTestFunction} from "../core/helpers/isTestFunction.js";

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prevent multiple Arrange, Act, or Assert comments in the same test function',
    },
    schema: [],
  },
  create(context) {
    const sourceCode = context.sourceCode;

    return {
      CallExpression(node: any) {
        if (!isTestFunction(node)) return;

        const fnBody = node.arguments[1].body;
        if (fnBody.type !== 'BlockStatement') return;

        const comments = sourceCode.getCommentsInside(fnBody);

        const arrangeComments = comments.filter((comment: any) => 
          new RegExp(`^Arrange$`, 'i').test(comment.value.trim())
        );
        const actComments = comments.filter((comment: any) => 
          new RegExp(`^Act$`, 'i').test(comment.value.trim())
        );
        const assertComments = comments.filter((comment: any) => 
          new RegExp(`^Assert$`, 'i').test(comment.value.trim())
        );

        if (arrangeComments.length > 1) {
          context.report({
            node: node.arguments[0],
            message: "Multiple '// Arrange' comments found in test. Only one is allowed.",
          });
        }

        if (actComments.length > 1) {
          context.report({
            node: node.arguments[0],
            message: "Multiple '// Act' comments found in test. Only one is allowed.",
          });
        }

        if (assertComments.length > 1) {
          context.report({
            node: node.arguments[0],
            message: "Multiple '// Assert' comments found in test. Only one is allowed.",
          });
        }
      },
    };
  },
};

export default rule;