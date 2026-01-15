import type { Rule } from 'eslint';
import { isDescribeFunction } from "../core/helpers/isDescribeFunction.js";

const message = 'Helper functions should be declared at the end of the global describe block';

const isFunctionInitializer = (node: any): boolean => {
  if (!node) {
    return false;
  }

  return node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression';
};

const isHelperStatement = (statement: any): boolean => {
  if (statement.type === 'FunctionDeclaration') {
    return true;
  }

  if (statement.type !== 'VariableDeclaration') {
    return false;
  }

  return statement.declarations.some((declaration: any) => isFunctionInitializer(declaration.init));
};

const isGlobalDescribeCall = (node: any): boolean => {
  if (!node.parent) {
    return false;
  }

  if (node.parent.type !== 'ExpressionStatement') {
    return false;
  }

  if (!node.parent.parent) {
    return false;
  }

  return node.parent.parent.type === 'Program';
};

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Helper functions should be declared at the end of the global describe block.',
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node: any) {
        if (!isDescribeFunction(node)) {
          return;
        }

        if (!isGlobalDescribeCall(node)) {
          return;
        }

        const callback = node.arguments[1];
        if (!callback) {
          return;
        }

        if (callback.type !== 'FunctionExpression' && callback.type !== 'ArrowFunctionExpression') {
          return;
        }

        if (callback.body.type !== 'BlockStatement') {
          return;
        }

        const statements = callback.body.body;
        let lastNonHelperIndex = -1;

        for (let index = 0; index < statements.length; index += 1) {
          if (!isHelperStatement(statements[index])) {
            lastNonHelperIndex = index;
          }
        }

        if (lastNonHelperIndex === -1) {
          return;
        }

        for (let index = 0; index < statements.length; index += 1) {
          const statement = statements[index];

          if (isHelperStatement(statement) && index < lastNonHelperIndex) {
            context.report({
              node: statement,
              message,
            });
          }
        }
      },
    };
  },
};

export default rule;
