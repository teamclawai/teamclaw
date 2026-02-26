# TeamClaw - Agent Development Guidelines

> For AI agents operating in this repository

---

## Build / Lint / Test Commands

### Installation
```bash
pnpm install          # Install all dependencies
pnpm build        # Build all packages
```

### Code Quality
```bash
pnpm check        # Lint, format, and type check (REQUIRED before commit)
```

### Running Tests
```bash
# Run all tests
pnpm test

# Run specific test file
pnpm vitest run test/specific.test.ts

# Run tests for specific package
cd packages/<package-name> && pnpm test
```

---

## Code Style Guidelines

### TypeScript

- **No `any` types** unless absolutely necessary
- **Always use explicit types** for function parameters and return values
- **Never use inline imports** - always use standard top-level imports

### Imports

```typescript
// Good
import { AgentCore } from "@mariozechner/pi-agent-core";
import { MessageRouter } from "./router";

// Bad
const AgentCore = await import("@mariozechner/pi-agent-core");
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
    logger.error(`Agent error: ${error.message}`, error.context);
  } else {
    logger.error("Unexpected error", { error });
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

### Configuration

- All config in JSON files under `config/`
- Use TypeScript interfaces for config validation
- Never hardcode secrets - use environment variables

---

## Project Structure

```
teamclaw/
├── packages/
│   ├── core/              # AgentOrchestrator, MessageRouter
│   ├── agent/             # AgentInstance wrapper
│   ├── workflow/          # WorkflowAgent
│   ├── skills/            # Built-in skills
│   ├── channels/          # Slack, Web adapters
│   ├── memory/            # LanceDB + Markdown
│   ├── gateway/           # Web portal (Next.js)
│   └── config/            # JSON config management
├── config/                # Default configurations
├── test/                  # Integration tests
└── package.json
```

---

## Git Workflow

### Commit Rules
- NEVER commit without running `pnpm check` first
- Fix ALL errors, warnings, and infos before committing
- NEVER commit unless explicitly requested

### Commit Message Format
```
<type>(<package>): <description>

Examples:
feat(core): add message router
fix(agent): handle timeout gracefully
docs: update README
```

### Parallel Agent Safety
When multiple agents work simultaneously:
- **ONLY commit files YOU changed**
- NEVER use `git add -A` or `git add .`
- Use `git add <specific-file>` for your files only

---

## Testing Guidelines

### Test Structure
```typescript
describe("AgentOrchestrator", () => {
  it("should route message to correct agent", async () => {
    const orchestrator = new AgentOrchestrator(config);
    const result = await orchestrator.route("@dev fix bug");
    expect(result.agent).toBe("dev-agent");
  });
});
```

### Test Requirements
- Each feature needs at least one test
- Tests must be deterministic (no flaky tests)
- Mock external dependencies

---

## Dependencies

### Core Dependencies
- `@mariozechner/pi-agent-core` - Agent runtime
- `@mariozechner/pi-ai` - LLM API
- `@lancedb/lancedb` - Vector database

### Development Dependencies
- TypeScript
- Vitest (testing)
- ESLint / Biome (linting)

---

## Key Principles

1. **YAGNI** - Don't add functionality until needed
2. **DRY** - Don't repeat yourself
3. **TDD** - Write tests first
4. **Keep it lightweight** - Follow nanobot's minimal footprint philosophy
5. **Type safety** - No `any`, explicit types everywhere
