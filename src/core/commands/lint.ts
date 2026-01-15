import chalk from 'chalk';
import { promptForGlobPattern } from '../utils/prompt.js';
import { runESLint } from '../utils/eslint-runner.js';
import { selectErrorsAndGeneratePrompt } from '../utils/error-selector.js';
import { loadConfig, getAllRules } from '../utils/config.js';

interface LintOptions {
  fix?: boolean;
}

export async function lintCommand(globPattern?: string, options?: LintOptions) {
  // Load configuration
  const config = await loadConfig();
  const allRules = getAllRules();
  const disabledRules = allRules.filter(r => !config.enabledRules.includes(r));

  // Display active rules
  console.log(chalk.cyan('\nActive rules:'));
  config.enabledRules.forEach(rule => {
    console.log(chalk.green(`  + ${rule}`));
  });

  if (disabledRules.length > 0) {
    console.log(chalk.gray(`\n  (${disabledRules.length} rules disabled)`));
  }

  console.log(chalk.gray('\nTo customize active rules, run: custom-rules-cli config\n'));

  // Get glob pattern (from arg or prompt)
  const pattern = globPattern || await promptForGlobPattern();

  try {
    const result = await runESLint(pattern, options?.fix || false, config.enabledRules);

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
