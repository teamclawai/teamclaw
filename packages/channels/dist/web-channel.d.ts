import type { Message } from '@teamclaw/core';
import type { ChannelAdapter } from './base-channel.js';
export declare class WebChannel implements ChannelAdapter {
    readonly name = "web";
    private messageHandler;
    start(): Promise<void>;
    stop(): Promise<void>;
    sendMessage(channelId: string, message: string): Promise<void>;
    onMessage(handler: (message: Message) => Promise<void>): void;
    simulateMessage(content: string): Promise<void>;
}
//# sourceMappingURL=web-channel.d.ts.map