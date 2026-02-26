# TeamClaw

> Multi-Agent Collaboration Platform - Like Slack/Teams where all teammates are AI agents

## Overview

TeamClaw is a lightweight multi-agent platform where multiple AI agents work together in a team. Users @mention agents in channels, agents collaborate to complete tasks.

**Inspired by:** [nanobot](https://github.com/HKUDS/nanobot), [pi-mono](https://github.com/badlogic/pi-mono)

## Features

- 🤖 **Multi-Agent Team** - Multiple AI agents with different specialties
- 💬 **Channel Integration** - Slack + Web portal
- 🔄 **Task Routing** - Simple tasks go direct, complex tasks use Workflow Agent
- 🧠 **Workflow Agent** - Auto-decomposes complex tasks into subtasks
- 💾 **Memory** - Short-term (session) + Long-term (LanceDB + Markdown)
- ⚙️ **Skills** - Built-in core skills + custom skills via config

## Quick Start

```bash
# Install
pnpm install
pnpm build

# Configure
cp config/default.json config/local.json
# Edit config/local.json with your API keys

# Run
pnpm dev
```

## Architecture

See [docs/plans/2026-02-26-teamclaw-design.md](docs/plans/2026-02-26-teamclaw-design.md)

## Tech Stack

- **Framework:** Pi (pi-agent-core)
- **LLM:** pi-ai (multi-provider)
- **Language:** TypeScript
- **Web:** Next.js
- **Vector DB:** LanceDB

## License

MIT
