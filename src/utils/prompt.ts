import prompts from 'prompts';

export async function promptForGlobPattern(): Promise<string> {
  const response = await prompts({
    type: 'text',
    name: 'glob',
    message: 'Enter the glob pattern to lint (e.g., src/**/*.ts, lib/**/*.js):',
    initial: 'specs/**/*.ts',
    validate: (value) => {
      if (!value || value.trim() === '') {
        return 'Glob pattern is required';
      }
      return true;
    }
  });

  if (!response.glob) {
    console.log('\nLinting cancelled.');
    process.exit(0);
  }

  return response.glob;
}
