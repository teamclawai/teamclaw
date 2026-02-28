# Changelog

All notable changes to TeamClaw will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-02-28

### Added

#### Core Features
- **Multi-Agent Chat Interface** - Chat with multiple AI agents simultaneously
- **Channel-Based Conversations** - Create group channels and direct messages
- **Parallel Agent Responses** - All agents in a channel respond at the same time
- **Smart Response Filtering** - Agents self-decide whether to respond based on context
- **Web Portal** - Modern Next.js-based chat interface with real-time updates

#### Architecture
- **Monorepo Structure** - 7 packages organized with pnpm workspaces
  - `@teamclaw/core` - Message routing and orchestration
  - `@teamclaw/agent` - Agent instance wrapper
  - `@teamclaw/workflow` - Workflow agent for complex tasks
  - `@teamclaw/channels` - Channel adapters (Web, Slack planned)
  - `@teamclaw/memory` - Memory storage (LanceDB planned)
  - `@teamclaw/gateway` - Next.js web portal
  - `@teamclaw/config` - Configuration management

#### Technical
- **AI SDK Integration** - Vercel AI SDK for streaming responses
- **OpenRouter Support** - Multi-provider LLM support via OpenRouter
- **TypeScript** - Strict mode enabled throughout
- **tRPC** - Type-safe API routes
- **Background Processing** - Async agent response handling
- **JSON-Based Config** - Simple configuration system

#### Developer Experience
- **Hot Reload** - Next.js dev server with HMR
- **Type Checking** - TypeScript strict mode
- **Linting** - ESLint with typescript-eslint
- **Testing** - Vitest for unit tests

### Infrastructure
- ESLint configuration with typescript-eslint
- Root-level build and test scripts
- Package-level isolation
- GitHub-ready structure

### Documentation
- Comprehensive README with quick start
- AGENTS.md development guidelines
- Architecture documentation in docs/plans/

## [Unreleased]

### Planned for v0.2.0
- Slack channel integration
- Agent memory and persistence
- Tool calling support
- Workflow orchestration

### Planned for v0.3.0
- LanceDB vector search
- File attachments
- Agent collaboration protocols
- Plugin system

---

## Release Checklist

### v0.1.0
- [x] Core multi-agent chat working
- [x] Web portal functional
- [x] Configuration system
- [x] Documentation complete
- [x] Open source ready
- [ ] GitHub repository public
- [ ] CI/CD setup
- [ ] Docker support

[0.1.0]: https://github.com/yourusername/teamclaw/releases/tag/v0.1.0
