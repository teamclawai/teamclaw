import type { Message, AgentResponse, ChannelAdapter } from './types.js';
import type { AgentInstance } from '@teamclaw/agent';
import type { MemoryStore } from '@teamclaw/memory';
import { routeMessage, parseMentions } from './router.js';

export class AgentOrchestrator {
  private channels: Map<string, ChannelAdapter> = new Map();
  private agents: Map<string, AgentInstance> = new Map();
  private memory: MemoryStore;

  constructor(memory: MemoryStore) {
    this.memory = memory;
  }

  registerChannel(name: string, channel: ChannelAdapter): void {
    this.channels.set(name, channel);
    channel.onMessage(this.handleMessage.bind(this));
  }

  registerAgent(agent: AgentInstance): void {
    this.agents.set(agent.id, agent);
  }

  async start(): Promise<void> {
    for (const channel of this.channels.values()) {
      await channel.start();
    }
  }

  async stop(): Promise<void> {
    for (const channel of this.channels.values()) {
      await channel.stop();
    }
  }

  private async handleMessage(message: Message): Promise<void> {
    const mentions = parseMentions(message.content);
    const agentIds = Array.from(this.agents.keys());
    const route = routeMessage({ ...message, mentions }, agentIds);

    if (route.type === 'direct' && route.agentId) {
      const agent = this.agents.get(route.agentId);
      if (agent) {
        const result = await agent.execute(route.task || '');
        const response: AgentResponse = {
          agentId: route.agentId,
          content: result.content,
          toolCalls: result.toolCalls,
        };
        await this.sendResponse(message.channel, response);
      }
    }
  }

  private async sendResponse(
    channelId: string,
    response: AgentResponse
  ): Promise<void> {
    const channel = this.channels.get(channelId);
    if (channel) {
      await channel.sendMessage(channelId, response.content);
    }
  }
}
