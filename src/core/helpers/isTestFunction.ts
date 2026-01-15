export function isTestFunction(node: any): boolean {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    ['it', 'test'].includes(node.callee.name) &&
    node.arguments.length >= 2 &&
    ['FunctionExpression', 'ArrowFunctionExpression'].includes(node.arguments[1].type)
  );
}