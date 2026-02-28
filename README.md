# TeamClaw

> Multi-Agent AI Collaboration Platform - Chat with multiple AI agents like a team workspace

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)

## Overview

TeamClaw is an open-source multi-agent platform where multiple AI agents work together in a team environment. Users can chat with agents in channels, mention them with `@`, and watch them collaborate to complete tasks.

**Inspired by:** [nanobot](https://github.com/HKUDS/nanobot), [pi-mono](https://github.com/badlogic/pi-mono)

## Features

- 🤖 **Multi-Agent Teams** - Configure multiple AI agents with different specialties
- 💬 **Channel-Based Chat** - Group channels and direct messages with agents
- 🔄 **Parallel Responses** - All agents in a channel respond simultaneously
- 🧠 **Smart Filtering** - Agents self-decide whether to respond based on context
- 🌐 **Web Portal** - Modern Next.js-based chat interface
- 🔧 **Configurable** - Easy JSON-based configuration
- 🚀 **Background Processing** - Async agent response handling

## Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- OpenRouter API key (or other LLM provider)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/teamclaw.git
cd teamclaw

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Configure
cp config/default.json config/local.json
# Edit config/local.json with your API keys
```

### Configuration

Edit `config/local.json`:

```json
{
  "providers": {
    "openrouter": {
      "apiKey": "your-api-key-here"
    }
  },
  "model": "openai/gpt-4o-mini",
  "agents": {
    "dev": {
      "name": "Dev Agent",
      "description": "Expert developer for coding tasks",
      "systemPrompt": "You are a senior software developer..."
    },
    "review": {
      "name": "Review Agent", 
      "description": "Code review specialist",
      "systemPrompt": "You are a code review expert..."
    }
  }
}
```

### Running

```bash
# Start the web portal
pnpm dev

# Open http://localhost:12345
```

## Architecture

```
teamclaw/
├── packages/
│   ├── core/          # Message routing and orchestration
│   ├── agent/         # Agent instance wrapper
│   ├── workflow/      # Workflow agent for complex tasks
│   ├── channels/      # Channel adapters (Web, Slack)
│   ├── memory/        # Memory storage (LanceDB)
│   ├── gateway/       # Next.js web portal
│   └── config/        # Configuration management
├── config/            # Default configuration files
└── docs/              # Documentation
```

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes, tRPC
- **AI:** Vercel AI SDK, OpenRouter
- **Database:** JSON file-based (LanceDB planned)
- **Build:** pnpm, Turborepo

## Usage

### Creating a Channel

1. Click the "+" button next to "Channels"
2. Enter a channel name (e.g., "dev-team")
3. Select agents to add to the channel
4. Click "Create Channel"

### Chatting with Agents

1. Select a channel from the sidebar
2. Type your message in the input box
3. Press Enter to send
4. All agents in the channel will respond in parallel

### Direct Messages

1. Click on an agent in the "Agents" section
2. Start chatting directly with that agent

## API

### Send Message

```bash
curl -X POST http://localhost:12345/api/agent-response/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "conversationId": "conv_123",
    "content": "Hello agents",
    "agentId": "dev",
    "memberIds": ["dev", "review"]
  }'
```

## Development

### Project Structure

Each package follows these conventions:
- `src/index.ts` - Main exports
- `src/*.ts` - Module implementations
- `test/*.test.ts` - Vitest tests

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests for specific package
cd packages/core && pnpm test
```

### Code Style

- TypeScript strict mode enabled
- No `any` types
- Explicit function return types
- kebab-case for files, PascalCase for classes

See [AGENTS.md](AGENTS.md) for detailed development guidelines.

## Roadmap

### v0.1.0 (Current)
- ✅ Multi-agent chat interface
- ✅ Channel-based conversations
- ✅ Parallel agent responses
- ✅ Web portal
- ✅ Basic configuration

### v0.2.0 (Planned)
- 🔲 Slack integration
- 🔲 Agent memory/persistence
- 🔲 Tool calling support
- 🔲 Workflow orchestration

### v0.3.0 (Planned)
- 🔲 LanceDB vector search
- 🔲 File attachments
- 🔲 Agent collaboration protocols
- 🔲 Plugin system

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Commit: `git commit -m 'feat: add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- [nanobot](https://github.com/HKUDS/nanobot) - Inspiration for lightweight agent architecture
- [pi-mono](https://github.com/badlogic/pi-mono) - Agent framework inspiration
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI streaming and chat
- [OpenRouter](https://openrouter.ai/) - LLM API aggregation

## Support

- 📖 [Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/yourusername/teamclaw/issues)
- 💬 [Discussions](https://github.com/yourusername/teamclaw/discussions)

---

**Made with ❤️ by the TeamClaw community**
