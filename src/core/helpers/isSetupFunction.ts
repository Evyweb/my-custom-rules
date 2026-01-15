export function isSetupFunction(node: any): boolean {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    ['beforeEach', 'beforeAll', 'afterEach', 'afterAll'].includes(node.callee.name) &&
    node.arguments.length >= 1 &&
    ['FunctionExpression', 'ArrowFunctionExpression'].includes(node.arguments[0].type)
  );
}