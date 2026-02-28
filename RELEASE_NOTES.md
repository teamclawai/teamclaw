# TeamClaw v0.1.0 Release Notes

🎉 **TeamClaw v0.1.0 is here!** 🎉

We're excited to announce the first public release of TeamClaw - an open-source multi-agent AI collaboration platform.

## What's New

### Core Features
- **Multi-Agent Chat Interface** - Chat with multiple AI agents simultaneously in a modern web interface
- **Channel-Based Conversations** - Create group channels and direct messages, just like Slack
- **Parallel Agent Responses** - All agents in a channel respond at the same time
- **Smart Response Filtering** - Agents intelligently decide whether to respond based on context
- **Web Portal** - Beautiful Next.js-based chat interface with real-time updates

### Technical Highlights
- **7 Packages** - Modular architecture with pnpm workspaces
- **AI SDK Integration** - Built on Vercel AI SDK for streaming responses
- **OpenRouter Support** - Works with any LLM provider via OpenRouter
- **TypeScript Throughout** - Strict mode enabled for maximum type safety
- **Background Processing** - Async agent response handling
- **JSON Configuration** - Simple, human-readable config system

## Quick Start

```bash
# Clone
git clone https://github.com/yourusername/teamclaw.git
cd teamclaw

# Install & Build
pnpm install
pnpm build

# Configure
cp config/default.json config/local.json
# Add your OpenRouter API key

# Run
pnpm dev
```

Visit http://localhost:12345 and start chatting with your AI team!

## Architecture

TeamClaw is organized as a monorepo with 7 packages:

- `@teamclaw/core` - Message routing and orchestration
- `@teamclaw/agent` - Agent instance management
- `@teamclaw/workflow` - Workflow handling for complex tasks
- `@teamclaw/channels` - Channel adapters (Web, Slack planned)
- `@teamclaw/memory` - Memory storage (LanceDB planned)
- `@teamclaw/gateway` - Next.js web portal
- `@teamclaw/config` - Configuration management

## Configuration Example

```json
{
  "providers": {
    "openrouter": {
      "apiKey": "your-key-here"
    }
  },
  "model": "openai/gpt-4o-mini",
  "agents": {
    "dev": {
      "name": "Dev Agent",
      "description": "Coding expert",
      "systemPrompt": "You are a senior developer..."
    }
  }
}
```

## Documentation

- 📖 [README](README.md) - Overview and quick start
- 🤖 [AGENTS.md](AGENTS.md) - Development guidelines
- 🤝 [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute
- 📝 [CHANGELOG.md](CHANGELOG.md) - Version history

## Roadmap

### v0.2.0 (Coming Soon)
- Slack integration
- Agent memory/persistence
- Tool calling support
- Workflow orchestration

### v0.3.0 (Planned)
- LanceDB vector search
- File attachments
- Agent collaboration protocols
- Plugin system

## Known Issues

- Streaming responses require proper parsing (see implementation notes)
- Agent responses are processed in parallel but saved sequentially
- UI could use typing indicators for better UX

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Special thanks to our early adopters and contributors! 🙏

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**Links:**
- 🌐 Repository: https://github.com/yourusername/teamclaw
- 🐛 Issues: https://github.com/yourusername/teamclaw/issues
- 💬 Discussions: https://github.com/yourusername/teamclaw/discussions

**Made with ❤️ by the TeamClaw community**
