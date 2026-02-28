# TeamClaw - Agent Development Guidelines

> For AI agents and human developers contributing to TeamClaw

---

## Project Overview

TeamClaw is an open-source multi-agent AI collaboration platform built with TypeScript and Next.js.

**Repository:** https://github.com/yourusername/teamclaw  
**License:** MIT  
**Version:** 0.1.0

---

## Quick Start for Contributors

### Prerequisites

- Node.js 18+
- pnpm 8+
- Git

### Setup

```bash
# Clone and setup
git clone https://github.com/yourusername/teamclaw.git
cd teamclaw
pnpm install
pnpm build

# Configure
cp config/default.json config/local.json
# Edit config/local.json with your OpenRouter API key

# Run dev server
pnpm dev
```

---

## Build / Lint / Test Commands

### Root Level
```bash
pnpm install          # Install all dependencies
pnpm build            # Build all packages
pnpm test             # Run all tests
pnpm check            # Lint and type check (REQUIRED before commit)
```

### Package Level
```bash
cd packages/<package-name>
pnpm build            # Build package
pnpm check            # Lint and type check
pnpm test             # Run package tests
```

---

## Code Style Guidelines

### TypeScript

- **No `any` types** unless absolutely necessary with explicit comment
- **Always use explicit types** for function parameters and return values
- **Never use inline imports** - always use standard top-level imports
- **Strict mode enabled** - no implicit any

### Imports

```typescript
// Good
import { AgentCore } from "@teamclaw/core";
import { MessageRouter } from "./router";

// Bad
const AgentCore = await import("@teamclaw/core");
```

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Files | kebab-case | `message-router.ts` |
| Classes | PascalCase | `class AgentOrchestrator` |
| Functions | camelCase | `function handleMessage()` |
| Constants | UPPER_SNAKE | `const MAX_RETRIES = 3` |
| Interfaces | PascalCase | `interface AgentConfig` |
| Types | PascalCase | `type MessageHandler` |

### Error Handling

```typescript
// Always use try-catch with proper typing
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

### Async / Promises

- Always properly await async functions
- Never use `.catch()` without handling
- Use `Promise.all()` for parallel operations

```typescript
// Good
const [result1, result2] = await Promise.all([
  agentA.execute(task1),
  agentB.execute(task2),
]);

// Bad
agentA.execute(task1).then(() => agentB.execute(task2));
```

---

## Project Structure

```
teamclaw/
├── packages/
│   ├── core/              # AgentOrchestrator, MessageRouter
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── orchestrator.ts
│   │   │   ├── router.ts
│   │   │   └── types.ts
│   │   └── test/
│   ├── agent/             # AgentInstance wrapper
│   ├── workflow/          # WorkflowAgent for complex tasks
│   ├── skills/            # Built-in skills (planned)
│   ├── channels/          # Slack, Web adapters
│   ├── memory/            # LanceDB + Markdown (planned)
│   ├── gateway/           # Web portal (Next.js)
│   │   ├── src/
│   │   │   ├── app/       # Next.js app router
│   │   │   ├── components/# React components
│   │   │   ├── lib/       # Utilities
│   │   │   └── server/    # tRPC routers
│   │   └── config/
│   └── config/            # JSON config management
├── config/                # Default configurations
│   ├── default.json
│   └── local.json         # Your local config (gitignored)
├── docs/                  # Documentation
│   └── plans/             # Design documents
├── test/                  # Integration tests
└── package.json
```

---

## Configuration

All configuration is in JSON files under `config/`:

- `config/default.json` - Default configuration (committed)
- `config/local.json` - Local overrides (gitignored)

### Example Configuration

```json
{
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-v1-..."
    }
  },
  "model": "openai/gpt-4o-mini",
  "agents": {
    "dev": {
      "name": "Developer",
      "description": "Coding expert",
      "systemPrompt": "You are a senior developer...",
      "enabled": true
    }
  }
}
```

---

## Git Workflow

### Commit Rules
- **ALWAYS run `pnpm check` before committing**
- Fix ALL errors, warnings, and infos before committing
- **NEVER commit unless explicitly requested by user**

### Commit Message Format
```
<type>(<scope>): <description>

Examples:
feat(core): add message router
fix(agent): handle timeout gracefully
docs: update README
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Tests
- `chore` - Maintenance

### Parallel Agent Safety
When multiple agents work simultaneously:
- **ONLY commit files YOU changed**
- **NEVER use `git add -A` or `git add .`**
- Use `git add <specific-file>` for your files only

---

## Testing Guidelines

### Test Structure
```typescript
import { describe, it, expect } from 'vitest';
import { AgentOrchestrator } from '../src/orchestrator';

describe('AgentOrchestrator', () => {
  it('should route message to correct agent', async () => {
    const orchestrator = new AgentOrchestrator(config);
    const result = await orchestrator.route('@dev fix bug');
    expect(result.agent).toBe('dev-agent');
  });
});
```

### Test Requirements
- Each feature needs at least one test
- Tests must be deterministic (no flaky tests)
- Mock external dependencies

---

## Key Principles

1. **YAGNI** - Don't add functionality until needed
2. **DRY** - Don't repeat yourself
3. **TDD** - Write tests first when possible
4. **Keep it lightweight** - Follow nanobot's minimal footprint philosophy
5. **Type safety** - No `any`, explicit types everywhere
6. **Documentation** - Update docs when changing features

---

## AI Agent Instructions

When working on TeamClaw:

1. **Understand the context** - Read relevant files before making changes
2. **Follow conventions** - Match existing code style
3. **Test your changes** - Run tests and type checks
4. **Update documentation** - Keep README and docs in sync
5. **Be minimal** - Don't over-engineer solutions

### Before Making Changes
- Read the relevant package README
- Check existing tests for patterns
- Understand the data flow

### After Making Changes
- Run `pnpm check` to verify
- Test manually if needed
- Update relevant documentation

---

## Dependencies

### Core Dependencies
- `@ai-sdk/react` - AI SDK React integration
- `@ai-sdk/openai` - OpenAI/compatible providers
- `@trpc/*` - tRPC for type-safe APIs
- `ai` - Vercel AI SDK
- `zod` - Schema validation

### Development Dependencies
- TypeScript 5.7
- Vitest (testing)
- ESLint / typescript-eslint (linting)

---

## Getting Help

- 📖 Read the [README](../README.md)
- 📋 Check [docs/plans/](../docs/plans/) for design documents
- 🐛 Open an issue on GitHub
- 💬 Start a discussion

---

**Remember:** This is an open-source project. Write code that others can understand and maintain.
