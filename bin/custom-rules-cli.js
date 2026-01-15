#!/usr/bin/env node

// ESM loader for TypeScript compiled output
import('../dist/core/cli.js').catch(err => {
  console.error('Failed to load CLI:', err);
  process.exit(1);
});
