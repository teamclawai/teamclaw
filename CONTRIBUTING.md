# Contributing to TeamClaw

Thank you for your interest in contributing to TeamClaw! This document provides guidelines and instructions for contributing.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to:
- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Assume good intent

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please:
1. Check if the bug has already been reported
2. Try the latest version to see if it's been fixed
3. Collect information about the bug (steps to reproduce, expected behavior, actual behavior)

When reporting bugs, use the bug report template and include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots if applicable

### Suggesting Features

We welcome feature suggestions! Please:
1. Check if the feature has already been suggested
2. Explain the use case clearly
3. Describe how it would benefit users
4. Consider implementation complexity

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `pnpm install`
3. **Make your changes** following our code style
4. **Run tests**: `pnpm test`
5. **Run linting**: `pnpm check`
6. **Update documentation** as needed
7. **Commit** with a clear message following our format
8. **Push** to your fork
9. **Open a Pull Request** with a clear description

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm 8+
- Git

### Setup Steps

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/teamclaw.git
cd teamclaw

# Install dependencies
pnpm install

# Build packages
pnpm build

# Configure
cp config/default.json config/local.json
# Edit config/local.json with your API keys

# Run dev server
pnpm dev
```

## Code Style

We use TypeScript with strict mode. Key points:

### TypeScript
- No `any` types (unless absolutely necessary with comment)
- Explicit return types on functions
- No inline imports
- Strict null checks

### Naming
- Files: `kebab-case.ts`
- Classes: `PascalCase`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

### Imports
```typescript
// Good
import { AgentCore } from "@teamclaw/core";
import { MessageRouter } from "./router";

// Bad
const AgentCore = await import("@teamclaw/core");
```

### Error Handling
```typescript
try {
  await agent.execute(task);
} catch (error) {
  if (error instanceof AgentError) {
    console.error(`Agent error: ${error.message}`, error.context);
  } else {
    console.error("Unexpected error", { error });
  }
  throw error;
}
```

## Commit Message Format

We follow conventional commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

Examples:
```
feat(gateway): add agent typing indicators
fix(core): handle empty message content
docs: update README with API examples
```

## Testing

### Running Tests
```bash
# All tests
pnpm test

# Specific package
cd packages/core && pnpm test

# Watch mode
pnpm vitest watch
```

### Writing Tests
- Use Vitest
- Place tests in `test/` directory
- Name files `*.test.ts`
- Mock external dependencies
- Test edge cases

Example:
```typescript
import { describe, it, expect } from 'vitest';
import { MessageRouter } from '../src/router';

describe('MessageRouter', () => {
  it('should route to mentioned agent', () => {
    const router = new MessageRouter();
    const result = router.route('@dev fix bug');
    expect(result.agentId).toBe('dev');
  });
});
```

## Project Structure

```
teamclaw/
├── packages/
│   ├── core/          # Core orchestration logic
│   ├── agent/         # Agent instances
│   ├── workflow/      # Workflow handling
│   ├── channels/      # Channel adapters
│   ├── memory/        # Memory storage
│   ├── gateway/       # Web portal
│   └── config/        # Configuration
├── config/            # Config files
├── docs/              # Documentation
└── test/              # Integration tests
```

## Package Development

### Creating a New Package

1. Create directory: `packages/<name>`
2. Add `package.json`:
```json
{
  "name": "@teamclaw/<name>",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "check": "tsc --noEmit"
  }
}
```
3. Add `tsconfig.json` extending base config
4. Create `src/index.ts` as entry point
5. Add tests in `test/`

### Adding Dependencies

For production dependencies:
```bash
cd packages/<name>
pnpm add <package>
```

For workspace dependencies:
```bash
cd packages/<name>
pnpm add @teamclaw/<other-package> --workspace
```

## Documentation

- Update README.md if adding features
- Update AGENTS.md if changing development guidelines
- Update CHANGELOG.md under [Unreleased]
- Add JSDoc comments for public APIs

## Release Process

1. Update version in `package.json` files
2. Update CHANGELOG.md
3. Create git tag: `git tag v0.x.x`
4. Push tag: `git push origin v0.x.x`
5. Create GitHub release

## Getting Help

- 📖 Read [README.md](README.md)
- 📋 Check [docs/](docs/)
- 🐛 Open an [issue](https://github.com/yourusername/teamclaw/issues)
- 💬 Start a [discussion](https://github.com/yourusername/teamclaw/discussions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to TeamClaw! 🎉
