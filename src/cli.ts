import { program } from 'commander';
import { lintCommand } from './commands/lint.js';
import { configCommand } from './commands/config.js';

const MIN_NODE_VERSION = 18;
const currentVersion = parseInt(process.version.slice(1));

if (currentVersion < MIN_NODE_VERSION) {
  console.error(`Error: Node.js ${MIN_NODE_VERSION}+ required (you have ${process.version})`);
  process.exit(1);
}

program
  .name('custom-rules-cli')
  .description('CLI for custom ESLint rules')
  .version('1.0.0');

program
  .command('lint [glob]')
  .description('Lint files using custom ESLint rules (supports glob patterns like "src/**/*.ts")')
  .option('-f, --fix', 'Automatically fix problems')
  .action(lintCommand);

program
  .command('config')
  .description('Configure which rules are active (settings saved in my-custom-rules project)')
  .action(configCommand);

program.parse();

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
