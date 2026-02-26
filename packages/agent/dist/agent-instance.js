export class AgentInstance {
    id;
    config;
    context = null;
    constructor(config) {
        this.id = config.id;
        this.config = config;
    }
    async initialize(sessionId) {
        this.context = {
            id: this.id,
            config: this.config,
            sessionId,
        };
    }
    async execute(task) {
        return {
            success: true,
            content: `[Agent ${this.id}] Executed: ${task}`,
        };
    }
    getConfig() {
        return this.config;
    }
}
//# sourceMappingURL=agent-instance.js.map