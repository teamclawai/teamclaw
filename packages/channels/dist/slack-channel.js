export class SlackChannel {
    name = 'slack';
    messageHandler = null;
    token = '';
    signingSecret = '';
    configure(token, signingSecret) {
        this.token = token;
        this.signingSecret = signingSecret;
    }
    async start() {
        console.log('Slack channel started');
    }
    async stop() {
        console.log('Slack channel stopped');
    }
    async sendMessage(channelId, message) {
        console.log(`[Slack] ${channelId}: ${message}`);
    }
    onMessage(handler) {
        this.messageHandler = handler;
    }
}
//# sourceMappingURL=slack-channel.js.map