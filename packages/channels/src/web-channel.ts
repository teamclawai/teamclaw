import type { Message } from '@teamclaw/core';
import type { ChannelAdapter } from './base-channel.js';

export class WebChannel implements ChannelAdapter {
  readonly name = 'web';
  private messageHandler: ((message: Message) => Promise<void>) | null = null;

  async start(): Promise<void> {
    console.log('Web channel started');
  }

  async stop(): Promise<void> {
    console.log('Web channel stopped');
  }

  async sendMessage(channelId: string, message: string): Promise<void> {
    console.log(`[Web] ${channelId}: ${message}`);
  }

  onMessage(handler: (message: Message) => Promise<void>): void {
    this.messageHandler = handler;
  }

  async simulateMessage(content: string): Promise<void> {
    if (this.messageHandler) {
      const message: Message = {
        id: `msg-${Date.now()}`,
        channel: 'web',
        user: 'user',
        content,
        timestamp: Date.now(),
        mentions: [],
      };
      await this.messageHandler(message);
    }
  }
}
