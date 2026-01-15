import path from 'path';
import {LintError} from './eslint-runner.js';

export async function selectErrorsAndGeneratePrompt(errors: LintError[], targetPath: string): Promise<void> {
  if (errors.length === 0) {
    console.log('STATUS: success');
    console.log('ERRORS: 0');
    return;
  }

  const structuredOutput = generateStructuredOutput(errors, targetPath);

  console.log(structuredOutput);
}

function generateStructuredOutput(selectedErrors: LintError[], targetPath: string): string {
  const errorsByFile = new Map<string, LintError[]>();

  for (const error of selectedErrors) {
    const relativePath = path.relative(targetPath, error.file);
    if (!errorsByFile.has(relativePath)) {
      errorsByFile.set(relativePath, []);
    }
    errorsByFile.get(relativePath)!.push(error);
  }

  for (const fileErrors of errorsByFile.values()) {
    fileErrors.sort((a, b) => a.line - b.line);
  }

  let output = `STATUS: failed\n`;
  output += `ERRORS: ${selectedErrors.length}\n\n`;

  for (const [file, fileErrors] of errorsByFile.entries()) {
    output += `FILE: ${file}\n`;
    for (const error of fileErrors) {
      output += `  ${error.line}:${error.column} [${error.ruleId}] ${error.message}\n`;
    }
    output += `\n`;
  }

  return output.trim();
}
