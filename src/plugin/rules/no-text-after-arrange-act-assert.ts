import type { Rule } from 'eslint';
import {findCommentsStartingWith} from "../helpers/findCommentsStartingWith.js";
import {isTestFunction} from "../helpers/isTestFunction.js";

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce exact "// Arrange", "// Act", and "// Assert" comment format without extra text',
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
        const labels = ['Arrange', 'Act', 'Assert'];

        labels.forEach(label => {
          const commentsWithExtraText = findCommentsStartingWith(comments, label);
          
          commentsWithExtraText.forEach((comment: any) => {
            context.report({
              node: comment,
              message: `Comment '// ${comment.value.trim()}' should be exactly '// ${label}'`,
            });
          });

          const wrongCaseComments = comments.filter((comment: any) => {
            const trimmedValue = comment.value.trim();
            return trimmedValue.toLowerCase() === label.toLowerCase() && trimmedValue !== label;
          });

          wrongCaseComments.forEach((comment: any) => {
            context.report({
              node: comment,
              message: `Comment '// ${comment.value.trim()}' should be exactly '// ${label}'`,
            });
          });
        });
      },
    };
  },
};

export default rule;