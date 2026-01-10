import { ESLint } from 'eslint';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs/promises';
import chalk from 'chalk';
import tseslint from 'typescript-eslint';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface LintError {
  file: string;
  line: number;
  column: number;
  ruleId: string;
  message: string;
  severity: string;
}

export interface LintResult {
  results: any[];
  errors: LintError[];
  hasErrors: boolean;
  formattedOutput: string;
  scannedFiles: string[];
}

export async function runESLint(globPattern: string, shouldFix: boolean = false): Promise<LintResult | null> {
  try {
    const pluginPath = path.resolve(__dirname, '../plugin/index.js');

    try {
      await fs.access(pluginPath);
    } catch {
      console.error(chalk.red('Error: Plugin not built. Run: npm run build'));
      return null;
    }

    let customRulesPlugin;
    try {
      const pluginUrl = pathToFileURL(pluginPath).href;
      const pluginModule = await import(pluginUrl);
      customRulesPlugin = pluginModule.default;
    } catch (err: any) {
      console.error(chalk.red(`Error: Failed to load plugin: ${err.message}`));
      return null;
    }

    const eslint = new ESLint({
      overrideConfigFile: true, // Don't load external configs
      baseConfig: [
        {
          files: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
          languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
              ecmaVersion: 'latest',
              sourceType: 'module'
            }
          },
          plugins: {
            'custom-rules': customRulesPlugin
          },
          rules: {
            ...Object.keys(customRulesPlugin.rules).reduce((acc: Record<string, any>, ruleName) => {
              acc[`custom-rules/${ruleName}`] = 'error';
              return acc;
            }, {})
          }
        }
      ],
      fix: shouldFix
    });

    const results = await eslint.lintFiles([globPattern]);

    const formatter = await eslint.loadFormatter('stylish');
    const formattedOutput = await formatter.format(results);

    if (shouldFix) {
      await ESLint.outputFixes(results);
    }

    const errors: LintError[] = [];
    for (const result of results) {
      if (result.messages && result.messages.length > 0) {
        for (const message of result.messages) {
          errors.push({
            file: result.filePath,
            line: message.line,
            column: message.column,
            ruleId: message.ruleId || 'unknown',
            message: message.message,
            severity: message.severity === 2 ? 'error' : 'warning'
          });
        }
      }
    }

    const hasErrors = results.some((result: any) => result.errorCount > 0);

    const scannedFiles = results.map((result: any) =>
      path.relative(process.cwd(), result.filePath)
    );

    return {
      results,
      errors,
      hasErrors,
      formattedOutput,
      scannedFiles
    };

  } catch (error: any) {
    console.error(chalk.red('Error running ESLint:'), error.message);
    return null;
  }
}
