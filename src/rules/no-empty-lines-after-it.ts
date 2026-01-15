import type { Rule } from 'eslint';
import {isTestFunction} from "../core/helpers/isTestFunction.js";

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'No empty lines should follow the "it" line.',
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
        if (fnBody.body.length === 0) return;

        const sourceText = sourceCode.getText();
        const bodyStart = fnBody.range![0];
        const bodyEnd = fnBody.range![1];
        const fullBodyText = sourceText.slice(bodyStart, bodyEnd);

        const openingBraceIndex = fullBodyText.indexOf('{');
        if (openingBraceIndex === -1) return;

        let searchStart = openingBraceIndex + 1;
        let lineCount = 0;
        let firstNonWhitespaceFound = false;
        let emptyLinesStart = -1;
        let emptyLinesEnd = -1;

        for (let i = searchStart; i < fullBodyText.length; i++) {
          const char = fullBodyText[i];

          if (char === '\n') {
            lineCount++;
            if (!firstNonWhitespaceFound) {
              if (emptyLinesStart === -1) {
                emptyLinesStart = i;
              }
              emptyLinesEnd = i + 1;
            }
          } else if (char === '}') {
            break;
          } else if (!/\s/.test(char)) {
            if (!firstNonWhitespaceFound && lineCount > 1) {
              context.report({
                node: node.arguments[0],
                message: 'No empty lines should follow the "it" line',
                fix(fixer) {
                  return fixer.removeRange([bodyStart + emptyLinesStart, bodyStart + emptyLinesEnd - 1]);
                }
              });
            }
            firstNonWhitespaceFound = true;
            break;
          }
        }
      },
    };
  },
};

export default rule;