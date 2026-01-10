import path from 'node:path';
import type {Rule} from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow direct instantiation of Error in src/server files to enforce domain-specific errors',
    },
    schema: [],
    messages: {
      useDomainError: 'Use a dedicated domain error instead of new Error in src/server.',
    },
  },
  create(context) {
    const filename = context.getFilename();
    const normalizedFilename = filename.split(path.sep).join('/');
    const isServerFile = normalizedFilename.includes('src/server/');

    if (!isServerFile) {
      return {};
    }

    return {
      NewExpression(node: any) {
        if (node.callee.type === 'Identifier' && node.callee.name === 'Error') {
          context.report({node, messageId: 'useDomainError'});
        }
      },
    };
  },
};

export default rule;
