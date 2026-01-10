import type { Rule } from 'eslint';
import { isDescribeFunction } from "../helpers/isDescribeFunction.js";
import path from 'path';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: "First describe should be the name of the file without extension",
    },
    schema: [],
  },
  create(context) {
    let isFirstDescribe = true;

    return {
      CallExpression(node: any) {
        if (!isDescribeFunction(node)) return;

        if (isFirstDescribe) {
          isFirstDescribe = false;

          const title = node.arguments[0].value;
          const filename = context.filename || context.getFilename?.();

          if (typeof title === 'string' && filename && filename !== '<input>') {
            const baseName = path.basename(filename);
            const nameWithoutExtension = baseName.replace(/\.[^/.]+$/, '').replace(/\.[^/.]+$/, '');

            if (title !== nameWithoutExtension) {
              context.report({
                node: node.arguments[0],
                message: `First describe title "${title}" should match the filename without extension "${nameWithoutExtension}"`,
              });
            }
          }
        }
      },
    };
  },
};

export default rule;