import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_FILE = path.resolve(__dirname, '../../.rules-config.json');

export interface RulesConfig {
  enabledRules: string[];
}

const ALL_RULES = [
  'describe-naming-convention',
  'it-should-start-with-should',
  'require-arrange-act-assert-comments',
  'no-duplicate-arrange-act-assert-comments',
  'no-text-after-arrange-act-assert',
  'no-arrange-act-assert-in-setup',
  'no-vi-mock',
  'first-describe-filename',
  'no-empty-arrange',
  'no-empty-lines-after-it',
  'no-empty-act',
  'no-empty-assert',
  'no-try-catch-in-tests',
  'single-spec-per-sut',
  'no-when-in-it',
];

export function getAllRules(): string[] {
  return [...ALL_RULES];
}

export async function loadConfig(): Promise<RulesConfig> {
  try {
    const content = await fs.readFile(CONFIG_FILE, 'utf-8');
    const config = JSON.parse(content) as RulesConfig;
    return {
      enabledRules: config.enabledRules.filter(rule => ALL_RULES.includes(rule))
    };
  } catch {
    return { enabledRules: [...ALL_RULES] };
  }
}

export async function saveConfig(config: RulesConfig): Promise<void> {
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

export function getConfigFilePath(): string {
  return CONFIG_FILE;
}
