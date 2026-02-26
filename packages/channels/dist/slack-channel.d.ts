import type { Message } from '@teamclaw/core';
import type { ChannelAdapter } from './base-channel.js';
export declare class SlackChannel implements ChannelAdapter {
    readonly name = "slack";
    private messageHandler;
    private token;
    private signingSecret;
    configure(token: string, signingSecret: string): void;
    start(): Promise<void>;
    stop(): Promise<void>;
    sendMessage(channelId: string, message: string): Promise<void>;
    onMessage(handler: (message: Message) => Promise<void>): void;
}
//# sourceMappingURL=slack-channel.d.ts.map