import type { Rule } from 'eslint';
import path from 'path';

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce a single spec file per subject under test by forbidding extra name segments before .spec',
    },
    schema: [],
    messages: {
      multipleSpecs: 'The spec file "{{fileName}}" should not contain additional name segments. Use "{{recommendedName}}" instead to keep a single spec file per subject under test.'
    },
  },
  create(context) {
    const rawFilename = context.filename || context.getFilename?.();

    if (!rawFilename || rawFilename === '<input>') {
      return {};
    }

    const normalizedFilename = rawFilename.replace(/\\/g, '/');

    if (!/\.spec\.(?:t|j)sx?$/.test(normalizedFilename)) {
      return {};
    }

    const baseName = path.basename(normalizedFilename);
    const [nameBeforeSpec] = baseName.split('.spec.');

    if (!nameBeforeSpec || !nameBeforeSpec.includes('.')) {
      return {};
    }

    const recommendedName = `${nameBeforeSpec.split('.')[0]}.spec.${baseName.split('.spec.')[1]}`;

    return {
      Program(node) {
        context.report({
          node,
          messageId: 'multipleSpecs',
          data: {
            fileName: baseName,
            recommendedName,
          },
        });
      },
    };
  },
};

export default rule;
