import { promptForGlobPattern } from '../utils/prompt.js';
import { runESLint } from '../utils/eslint-runner.js';
import { selectErrorsAndGeneratePrompt } from '../utils/error-selector.js';

interface LintOptions {
  fix?: boolean;
}

export async function lintCommand(globPattern?: string, options?: LintOptions) {
  // Get glob pattern (from arg or prompt)
  const pattern = globPattern || await promptForGlobPattern();

  try {
    const result = await runESLint(pattern, options?.fix || false);

    if (!result) {
      process.exit(1);
    }

    // If there are errors and not in fix mode, generate structured output
    if (result.hasErrors && !options?.fix) {
      await selectErrorsAndGeneratePrompt(result.errors, process.cwd());
    }

    process.exit(result.hasErrors ? 1 : 0);
  } catch (error: any) {
    console.error('Error running ESLint:', error.message);
    process.exit(1);
  }
}
