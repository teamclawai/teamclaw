import type { Message } from '@teamclaw/core';

export interface ChannelAdapter {
  name: string;
  start(): Promise<void>;
  stop(): Promise<void>;
  sendMessage(channelId: string, message: string): Promise<void>;
  onMessage(handler: (message: Message) => Promise<void>): void;
}
