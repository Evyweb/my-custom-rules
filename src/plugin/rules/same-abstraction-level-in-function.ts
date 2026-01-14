import type {Rule} from 'eslint';

const message = 'Keep a single level of abstraction within a function. Extract lower-level steps into separate functions.';

const isCallLikeExpression = (expression: any): boolean => {
  if (!expression) {
    return false;
  }

  if (expression.type === 'CallExpression') {
    return true;
  }

  if (expression.type === 'AwaitExpression') {
    const awaited = expression.argument;

    if (awaited && awaited.type === 'CallExpression') {
      return true;
    }
  }

  return false;
};

const isDelegationStatement = (statement: any): boolean => {
  if (statement.type === 'ExpressionStatement') {
    return isCallLikeExpression(statement.expression);
  }

  if (statement.type === 'ReturnStatement') {
    return isCallLikeExpression(statement.argument);
  }

  if (statement.type === 'VariableDeclaration') {
    let hasNonCallInitializer = false;

    for (const declaration of statement.declarations) {
      if (!declaration.init) {
        hasNonCallInitializer = true;
        break;
      }

      if (!isCallLikeExpression(declaration.init)) {
        hasNonCallInitializer = true;
        break;
      }
    }

    return !hasNonCallInitializer;
  }

  return false;
};

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require a single level of abstraction within each function body.',
    },
    schema: [],
  },
  create(context) {
    const reportIfMixedAbstraction = (node: any) => {
      if (!node.body || node.body.type !== 'BlockStatement') {
        return;
      }

      let hasDelegation = false;
      let hasImplementation = false;

      for (const statement of node.body.body) {
        if (statement.type === 'EmptyStatement') {
          continue;
        }

        if (isDelegationStatement(statement)) {
          hasDelegation = true;
        } else {
          hasImplementation = true;
        }

        if (hasDelegation && hasImplementation) {
          context.report({
            node,
            message,
          });
          return;
        }
      }
    };

    return {
      FunctionDeclaration: reportIfMixedAbstraction,
      FunctionExpression: reportIfMixedAbstraction,
      ArrowFunctionExpression: reportIfMixedAbstraction,
    };
  },
};

export default rule;
