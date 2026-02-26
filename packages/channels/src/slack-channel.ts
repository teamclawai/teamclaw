import type { Message } from '@teamclaw/core';
import type { ChannelAdapter } from './base-channel.js';

export class SlackChannel implements ChannelAdapter {
  readonly name = 'slack';
  private messageHandler: ((message: Message) => Promise<void>) | null = null;
  private token: string = '';
  private signingSecret: string = '';

  configure(token: string, signingSecret: string): void {
    this.token = token;
    this.signingSecret = signingSecret;
  }

  async start(): Promise<void> {
    console.log('Slack channel started');
  }

  async stop(): Promise<void> {
    console.log('Slack channel stopped');
  }

  async sendMessage(channelId: string, message: string): Promise<void> {
    console.log(`[Slack] ${channelId}: ${message}`);
  }

  onMessage(handler: (message: Message) => Promise<void>): void {
    this.messageHandler = handler;
  }
}
