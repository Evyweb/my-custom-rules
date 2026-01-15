import type {Rule} from 'eslint';
import {isTestFunction} from '../core/helpers/isTestFunction.js';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow try/catch or try/finally blocks inside tests to encourage clearer failure handling and cleanup via hooks.',
    },
    schema: [],
  },
  create(context) {
    return {
      TryStatement(node) {
        const ancestors = context.sourceCode.getAncestors(node);
        const isInsideTest = ancestors.some(ancestor => ancestor.type === 'CallExpression' && isTestFunction(ancestor));

        if (!isInsideTest) return;

        context.report({
          node: node as any,
          message: 'Avoid using try/catch blocks inside tests. Use hooks for cleanup or explicit expectations on thrown errors instead.',
        });
      },
    };
  },
};

export default rule;
