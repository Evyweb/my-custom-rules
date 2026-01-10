import type { Rule } from 'eslint';
import {findComment} from "../helpers/findComment.js";
import {isTestFunction} from "../helpers/isTestFunction.js";

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'There should be "// Arrange", "// Act" and "// Assert" comments in each test. "// Act" and "// Assert" are always required. If there is setup before "// Act", "// Arrange" is required.',
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
        const bodyStatements = fnBody.body;

        const actComment = findComment(comments, 'Act');
        const assertComment = findComment(comments, 'Assert');
        const arrangeComment = findComment(comments, 'Arrange');

        if (!actComment) {
          context.report({
            node: node.arguments[0],
            message: 'Missing "// Act" comment in test',
          });
          return;
        }

        if (!assertComment) {
          context.report({
            node: node.arguments[0],
            message: 'Missing "// Assert" comment in test',
          });
          return;
        }

        const hasCodeBeforeAct = bodyStatements.some((stmt: any) => stmt.loc.end.line < actComment.loc!.start.line);

        if (hasCodeBeforeAct && !arrangeComment) {
          context.report({
            node: node.arguments[0],
            message: 'Missing "// Arrange" before "// Act" since there is some setup to prepare',
          });
        }
      },
    };
  },
};

export default rule;
