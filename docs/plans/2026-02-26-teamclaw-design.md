# TeamClaw Design Document

> **Project:** TeamClaw - Multi-Agent Collaboration Platform
> **Date:** 2026-02-26
> **Status:** Approved

## Overview

**TeamClaw** = A Slack/Teams-like platform where all team members are AI agents. Users @mention agents in channels, agents collaborate to complete tasks, managed via a web portal (Gateway).

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     TeamClaw Platform                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Web Portal  │  │   Slack     │  │   Other Channels   │  │
│  │  (Gateway)  │  │   Channel   │  │  (Discord, etc.)   │  │
│  └──────┬──────┘  └──────┬──────┘  └─────────┬─────────┘  │
│         │                │                    │             │
│         └────────────────┼────────────────────┘             │
│                          ▼                                  │
│              ┌───────────────────────┐                      │
│              │   Message Router     │                      │
│              │   (@mention parsing) │                      │
│              └───────────┬───────────┘                      │
│                          ▼                                  │
│     ┌─────────────────────────────────────────────┐        │
│     │           Router / Task Classifier          │        │
│     │  ┌─────────────┐    ┌─────────────────┐    │        │
│     │  │ Simple Task │    │ Complex Task   │    │        │
│     │  │ (direct to  │    │ (→ Workflow    │    │        │
│     │  │  single     │    │   Agent)       │    │        │
│     │  │  agent)     │    └────────┬────────┘    │        │
│     │  └─────────────┘             │             │        │
│     └─────────────────────────────────────────────┘        │
│                          │                                  │
│         ┌────────────────┼────────────────┐                 │
│         ▼                ▼                ▼               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Agent A     │  │ Workflow   │  │ Agent B     │        │
│  │ (Specialist)│  │  Agent     │  │ (Specialist)│        │
│  └─────────────┘  └──────┬──────┘  └─────────────┘        │
│                          │                                  │
│            ┌─────────────┼─────────────┐                    │
│            ▼             ▼             ▼                    │
│      ┌─────────┐   ┌─────────┐   ┌─────────┐               │
│      │Agent C  │   │Agent D  │   │Agent E  │  ...          │
│      └─────────┘   └─────────┘   └─────────┘               │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Components

| Component | Description |
|-----------|-------------|
| **Gateway (Web Portal)** | Admin UI for agent management, web chat interface |
| **Channel Adapters** | Slack (first), extensible to Discord/Telegram |
| **Message Router** | Parses @mentions, routes to agents |
| **Task Classifier** | Determines Simple vs Complex task |
| **Direct Agent** | Handles simple tasks directly |
| **Workflow Agent** | Auto-decomposes complex tasks, coordinates sub-agents |
| **Agent Instance** | pi-agent-core wrapper with skills |
| **Skills Registry** | Built-in + configurable custom skills |
| **Memory Store** | Short-term (session) + Long-term (LanceDB + Markdown) |

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Pi (pi-mono) - @mariozechner/pi-agent-core |
| LLM API | @mariozechner/pi-ai (multi-provider) |
| Language | TypeScript |
| Web Portal | Next.js |
| Vector DB | LanceDB |
| Config Storage | JSON files |
| Channel (Phase 1) | Slack + Web |

---

## Key Design Decisions

### 1. Task Classification
- **Simple tasks**: Direct to single agent
- **Complex tasks**: Route to Workflow Agent for decomposition

### 2. Workflow Agent (Phase 1)
- AI automatically decomposes complex tasks into subtasks
- Assigns subtasks to appropriate specialist agents
- Coordinates execution (sequential/parallel)
- Aggregates results
- **Phase 2**: Add template-based workflows (n8n-like)

### 3. Skills System (Hybrid)
- **Core skills**: Built-in (file, shell, search)
- **Custom skills**: Via JSON config (like nanobot)

### 4. Memory Architecture

```
Memory Types:
├── Short-term (Session)
│   └── In-memory: Current conversation, task state
│
├── Long-term (Persistent)
│   ├── Team Knowledge (User editable)
│   │   └── LanceDB + Markdown files
│   │
│   └── Agent Knowledge (Agent-specific)
│       └── LanceDB + Markdown files
```

### 5. Configuration
- JSON files for all agent/channel/config settings
- Web portal reads/writes JSON
- Future: Migration path to database

---

## File Structure (Target ~5000 lines core)

```
teamclaw/
├── packages/
│   ├── core/              # AgentOrchestrator, MessageRouter, TaskClassifier
│   ├── agent/             # AgentInstance wrapper around pi-agent-core
│   ├── workflow/          # WorkflowAgent for complex task handling
│   ├── skills/            # Built-in skills (file, shell, search)
│   ├── channels/          # Slack, Web adapters
│   ├── memory/            # LanceDB + Markdown memory management
│   ├── gateway/           # Web portal (Next.js)
│   └── config/            # JSON config management
├── docs/
│   └── plans/             # Design documents
├── package.json
├── tsconfig.json
└── AGENTS.md              # Agent coding guidelines
```

---

## Roadmap

### Phase 1: MVP (Current)
- [ ] Core agent system with pi-agent-core
- [ ] Slack channel integration
- [ ] Web portal (Gateway) for agent management
- [ ] Basic task routing (simple vs complex)
- [ ] Workflow Agent (auto-decompose)
- [ ] In-memory short-term memory
- [ ] JSON configuration

### Phase 2: Enhanced Features
- [ ] Long-term memory (LanceDB + Markdown)
- [ ] Template-based workflows (n8n-like)
- [ ] Additional channels (Discord, Telegram)
- [ ] Skills registry with custom skills

---

## References

- [nanobot](https://github.com/HKUDS/nanobot) - Ultra-lightweight OpenClaw reference
- [pi-mono](https://github.com/badlogic/pi-mono) - TypeScript agent framework
- [LanceDB](https://lancedb.com/) - Lightweight embedded vector database
