import describeNamingConvention from './rules/describe-naming-convention.js';
import itShouldStartWithShould from './rules/it-should-start-with-should.js';
import requireArrangeActAssertComments from './rules/require-arrange-act-assert-comments.js';
import noDuplicateArrangeActAssertComments from './rules/no-duplicate-arrange-act-assert-comments.js';
import noTextAfterArrangeActAssert from './rules/no-text-after-arrange-act-assert.js';
import noArrangeActAssertInSetup from './rules/no-arrange-act-assert-in-setup.js';
import noViMock from './rules/no-vi-mock.js';
import firstDescribeFilename from './rules/first-describe-filename.js';
import noEmptyArrange from './rules/no-empty-arrange.js';
import noEmptyLinesAfterIt from './rules/no-empty-lines-after-it.js';
import noEmptyAct from './rules/no-empty-act.js';
import noEmptyAssert from './rules/no-empty-assert.js';
import noTryCatchInTests from './rules/no-try-catch-in-tests.js';
import singleSpecPerSut from './rules/single-spec-per-sut.js';
import noWhenInIt from './rules/no-when-in-it.js';
import helpersAtEndOfGlobalDescribe from './rules/helpers-at-end-of-global-describe.js';

export default {
  rules: {
    'describe-naming-convention': describeNamingConvention,
    'it-should-start-with-should': itShouldStartWithShould,
    'require-arrange-act-assert-comments': requireArrangeActAssertComments,
    'no-duplicate-arrange-act-assert-comments': noDuplicateArrangeActAssertComments,
    'no-text-after-arrange-act-assert': noTextAfterArrangeActAssert,
    'no-arrange-act-assert-in-setup': noArrangeActAssertInSetup,
    'no-vi-mock': noViMock,
    'first-describe-filename': firstDescribeFilename,
    'no-empty-arrange': noEmptyArrange,
    'no-empty-lines-after-it': noEmptyLinesAfterIt,
    'no-empty-act': noEmptyAct,
    'no-empty-assert': noEmptyAssert,
    'no-try-catch-in-tests': noTryCatchInTests,
    'single-spec-per-sut': singleSpecPerSut,
    'no-when-in-it': noWhenInIt,
    'helpers-at-end-of-global-describe': helpersAtEndOfGlobalDescribe,
  },
};
