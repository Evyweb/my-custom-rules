import prompts from 'prompts';
import chalk from 'chalk';
import { getAllRules, loadConfig, saveConfig, getConfigFilePath } from '../utils/config.js';

export async function configCommand() {
  const allRules = getAllRules();
  const currentConfig = await loadConfig();

  console.log(chalk.cyan('\nConfigure Custom ESLint Rules'));
  console.log(chalk.gray('Select the rules you want to activate:\n'));

  const response = await prompts({
    type: 'multiselect',
    name: 'rules',
    message: 'Select active rules (space to toggle, enter to confirm)',
    choices: allRules.map(rule => ({
      title: rule,
      value: rule,
      selected: currentConfig.enabledRules.includes(rule)
    })),
    hint: '- Space to select. Return to submit',
    instructions: false
  });

  if (!response.rules) {
    console.log(chalk.yellow('\nConfiguration cancelled.'));
    return;
  }

  const newConfig = { enabledRules: response.rules as string[] };
  await saveConfig(newConfig);

  const enabledCount = newConfig.enabledRules.length;
  const disabledCount = allRules.length - enabledCount;

  console.log(chalk.green(`\nConfiguration saved to ${getConfigFilePath()}`));
  console.log(chalk.cyan(`  ${enabledCount} rules enabled, ${disabledCount} rules disabled`));

  if (enabledCount > 0) {
    console.log(chalk.gray('\nEnabled rules:'));
    newConfig.enabledRules.forEach(rule => {
      console.log(chalk.green(`  + ${rule}`));
    });
  }

  const disabledRules = allRules.filter(r => !newConfig.enabledRules.includes(r));
  if (disabledRules.length > 0) {
    console.log(chalk.gray('\nDisabled rules:'));
    disabledRules.forEach(rule => {
      console.log(chalk.red(`  - ${rule}`));
    });
  }
}
