import describeNamingConvention from './describe-naming-convention.js';
import itShouldStartWithShould from './it-should-start-with-should.js';
import requireArrangeActAssertComments from './require-arrange-act-assert-comments.js';
import noDuplicateArrangeActAssertComments from './no-duplicate-arrange-act-assert-comments.js';
import noTextAfterArrangeActAssert from './no-text-after-arrange-act-assert.js';
import noArrangeActAssertInSetup from './no-arrange-act-assert-in-setup.js';
import noViMock from './no-vi-mock.js';
import firstDescribeFilename from './first-describe-filename.js';
import noEmptyArrange from './no-empty-arrange.js';
import noEmptyLinesAfterIt from './no-empty-lines-after-it.js';
import noEmptyAct from './no-empty-act.js';
import noEmptyAssert from './no-empty-assert.js';
import noTryCatchInTests from './no-try-catch-in-tests.js';
import singleSpecPerSut from './single-spec-per-sut.js';
import noWhenInIt from './no-when-in-it.js';
import helpersAtEndOfGlobalDescribe from './helpers-at-end-of-global-describe.js';

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
