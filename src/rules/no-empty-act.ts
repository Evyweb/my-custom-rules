import type { Rule } from 'eslint';
import {findComment} from "../core/helpers/findComment.js";
import {isTestFunction} from "../core/helpers/isTestFunction.js";

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow empty "// Act" sections. Act sections are mandatory and must contain code.',
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
        if (!actComment) return;

        const assertComment = findComment(comments, 'Assert');
        if (!assertComment) return;

        const hasCodeBetweenActAndAssert = bodyStatements.some((stmt: any) => {
          return stmt.loc.start.line > actComment.loc!.end.line &&
                 stmt.loc.end.line < assertComment.loc!.start.line;
        });

        if (!hasCodeBetweenActAndAssert) {
          context.report({
            node: actComment as any,
            message: 'Empty "// Act" section detected. Add code between Act and Assert comments.',
          });
        }
      },
    };
  },
};

export default rule;