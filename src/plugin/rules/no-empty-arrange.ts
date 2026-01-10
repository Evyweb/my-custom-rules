import type { Rule } from 'eslint';
import {findComment} from "../helpers/findComment.js";
import {isTestFunction} from "../helpers/isTestFunction.js";

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Empty "// Arrange" sections should be removed. If no setup is needed, omit the Arrange comment entirely.',
    },
    fixable: 'code',
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

        const arrangeComment = findComment(comments, 'Arrange');
        if (!arrangeComment) return;

        const actComment = findComment(comments, 'Act');
        if (!actComment) return;

        const hasCodeBetweenArrangeAndAct = bodyStatements.some((stmt: any) => {
          return stmt.loc.start.line > arrangeComment.loc!.end.line &&
                 stmt.loc.end.line < actComment.loc!.start.line;
        });

        if (!hasCodeBetweenArrangeAndAct) {
          context.report({
            node: arrangeComment as any,
            message: 'Empty "// Arrange" section should be removed',
            fix(fixer) {
              const sourceText = sourceCode.getText();
              const arrangeCommentStart = arrangeComment.range![0];
              const arrangeCommentEnd = arrangeComment.range![1];

              let lineStart = arrangeCommentStart;
              while (lineStart > 0 && sourceText[lineStart - 1] !== '\n') {
                lineStart--;
              }

              let lineEnd = arrangeCommentEnd;
              while (lineEnd < sourceText.length && sourceText[lineEnd] !== '\n') {
                lineEnd++;
              }

              const lineContent = sourceText.slice(lineStart, lineEnd);
              const isCommentOnlyLine = lineContent.trim().match(/^\/\/\s*Arrange\s*$/i);

              if (isCommentOnlyLine) {
                if (lineEnd < sourceText.length) {
                  lineEnd++;
                }
                return fixer.removeRange([lineStart, lineEnd]);
              } else {
                return fixer.removeRange([arrangeCommentStart - 2, arrangeCommentEnd]);
              }
            }
          });
        }
      },
    };
  },
};

export default rule;