import type { Rule } from 'eslint';
import {findComment} from "../core/helpers/findComment.js";
import {isTestFunction} from "../core/helpers/isTestFunction.js";

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow empty "// Assert" sections. Assert sections are mandatory and must contain assertions.',
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

        const assertComment = findComment(comments, 'Assert');
        if (!assertComment) return;

        const hasCodeAfterAssert = bodyStatements.some((stmt: any) => {
          return stmt.loc.start.line > assertComment.loc!.end.line;
        });

        if (!hasCodeAfterAssert) {
          context.report({
            node: assertComment as any,
            message: 'Empty "// Assert" section detected. Add assertions after Assert comment.',
          });
        }
      },
    };
  },
};

export default rule;