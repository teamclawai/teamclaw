export class WebChannel {
    name = 'web';
    messageHandler = null;
    async start() {
        console.log('Web channel started');
    }
    async stop() {
        console.log('Web channel stopped');
    }
    async sendMessage(channelId, message) {
        console.log(`[Web] ${channelId}: ${message}`);
    }
    onMessage(handler) {
        this.messageHandler = handler;
    }
    async simulateMessage(content) {
        if (this.messageHandler) {
            const message = {
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
//# sourceMappingURL=web-channel.js.map