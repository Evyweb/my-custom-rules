import type { Rule } from 'eslint';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Discourage the use of vi.mock and vi.mocked in favor of dependency injection with in-memory or fake implementations',
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node: any) {
        // Check for vi.mock() calls
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'Identifier' &&
          node.callee.object.name === 'vi' &&
          node.callee.property.type === 'Identifier' &&
          node.callee.property.name === 'mock'
        ) {
          const moduleArg = node.arguments[0];
          if (moduleArg && moduleArg.type === 'Literal') {
            const modulePath = moduleArg.value as string;
            
            if (modulePath.startsWith('@/')) {
              context.report({
                node,
                message: `Avoid mocking internal module '${modulePath}'. Use dependency injection with in-memory or fake implementations instead.`,
              });
            }
          }
        }

        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'Identifier' &&
          node.callee.object.name === 'vi' &&
          node.callee.property.type === 'Identifier' &&
          node.callee.property.name === 'mocked'
        ) {
          context.report({
            node,
            message: "Avoid using 'vi.mocked'. Use dependency injection with in-memory or fake implementations instead.",
          });
        }
      },
    };
  },
};

export default rule;