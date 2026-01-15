export function isDescribeFunction(node: any): boolean {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'describe' &&
    node.arguments.length > 0 &&
    node.arguments[0].type === 'Literal'
  );
}