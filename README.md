# Custom ESLint Rules CLI

Global CLI to apply your custom ESLint rules to any project.

## Installation

### Global Installation

```bash
cd F:\Workspaces\my-custom-rules
npm install
npm run build
npm install -g .
```

### Local Development

To test locally without global installation:

```bash
npm link
```

## Usage

### Lint Command

#### Interactive Mode

The CLI will prompt you for the folder to lint:

```bash
custom-rules-cli lint
```

#### Direct Mode

Directly specify the folder to lint:

```bash
custom-rules-cli lint ./src
custom-rules-cli lint ./lib
```

#### With Auto-fix

Automatically fix detected issues:

```bash
custom-rules-cli lint ./src --fix
```

or the short form:

```bash
custom-rules-cli lint ./src -f
```

### Help

```bash
# General help
custom-rules-cli --help

# Help for lint command
custom-rules-cli lint --help

# Version
custom-rules-cli --version
```

## Applied Rules

The CLI automatically applies all 17 custom rules defined in the plugin:

1. `describe-naming-convention` - Naming patterns for describe blocks
2. `first-describe-filename` - First describe must match filename
3. `it-should-start-with-should` - Tests must start with "should"
4. `no-arrange-act-assert-in-setup` - No AAA comments in beforeEach/beforeAll
5. `no-duplicate-arrange-act-assert-comments` - No duplicate AAA comments
6. `no-empty-act` - Detects empty "// Act" sections
7. `no-empty-arrange` - Detects empty "// Arrange" sections (with autofix)
8. `no-empty-assert` - Detects empty "// Assert" sections
9. `no-empty-lines-after-it` - No excessive empty lines after tests
10. `no-new-error-in-server` - Blocks new Error() in server context
11. `no-text-after-arrange-act-assert` - No text after AAA comments
12. `no-try-catch-in-tests` - Forbids try-catch in test functions
13. `no-vi-mock` - Discourages use of vi.mock()
14. `no-when-in-it` - Test titles should not contain "when"
15. `require-arrange-act-assert-comments` - Enforces AAA comments in tests
16. `single-spec-per-sut` - Single focus per test file
17. `helpers-at-end-of-global-describe` - Helper functions should be declared at the end of the global describe block

All rules are configured in `error` mode.

## Configuration

The CLI:
- Ignores target project's ESLint configuration (`.eslintrc`, `eslint.config.js`)
- Applies only your custom rules
- Works on `.js`, `.ts`, `.jsx`, `.tsx` files

## Uninstallation

```bash
npm uninstall -g eslint-plugin-custom-rules-cli
```

Or if installed with `npm link`:

```bash
npm unlink -g
```

## Updating Rules

After modifying a rule in `src/plugin/rules/`:

```bash
# Build the entire project
npm run build
```

The CLI will automatically use the newly compiled version on next launch, without needing to reinstall.

## Development

### Project Structure

```
my-custom-rules/
├── bin/
│   └── custom-rules-cli.js        # CLI entry point
├── src/
│   ├── cli.ts                     # Main orchestrator
│   ├── commands/
│   │   └── lint.ts                # Lint command
│   ├── utils/
│   │   ├── prompt.ts              # Interactive prompts
│   │   ├── eslint-runner.ts       # ESLint execution
│   │   └── error-selector.ts      # Error formatting
│   └── plugin/                    # ESLint plugin (embedded)
│       ├── index.ts               # Plugin entry point
│       ├── rules/                 # 16 custom rules
│       └── helpers/               # Shared utilities
├── specs/
│   └── plugin/
│       └── rules/                 # Test files (Vitest)
├── dist/                          # Compiled output
├── package.json                   # NPM configuration
├── tsconfig.json                  # TypeScript config
├── vitest.config.ts               # Test configuration
└── README.md
```

### Available Scripts

```bash
# Build the project
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Development mode (watch)
npm run dev
```

### Testing

The project uses Vitest for testing. All plugin rules have comprehensive test coverage:

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm run test:watch
```

## Prerequisites

- Node.js >= 18.0.0
- npm

## Dependencies

- `eslint` ^9.29.0 - ESLint engine
- `prompts` ^2.4.2 - Interactive interface
- `chalk` ^5.3.0 - Terminal colors
- `commander` ^12.0.0 - CLI command management
- `clipboardy` ^4.0.0 - Clipboard operations

## Dev Dependencies

- `typescript` ^5.7.2 - TypeScript compiler
- `typescript-eslint` ^8.35.0 - TypeScript ESLint parser
- `vitest` ^2.0.0 - Testing framework
- `@types/node`, `@types/prompts`, `@types/eslint` - Type definitions

## Architecture

This project is a unified package containing:
- **CLI Tool**: Command-line interface for linting projects
- **ESLint Plugin**: Embedded custom rules (not published separately)

The CLI dynamically loads the plugin rules from the compiled `dist/plugin/` directory and applies them to target projects without requiring ESLint configuration files.
