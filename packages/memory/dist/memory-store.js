export class MemoryStore {
    entries = [];
    async add(entry) {
        const id = `mem-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        this.entries.push({
            ...entry,
            id,
            timestamp: Date.now(),
        });
        return id;
    }
    async getByAgent(agentId) {
        return this.entries.filter((e) => e.type === 'agent' && e.agentId === agentId);
    }
    async getTeamKnowledge() {
        return this.entries.filter((e) => e.type === 'team');
    }
    async search(query, limit = 10) {
        return this.entries.slice(0, limit);
    }
}
//# sourceMappingURL=memory-store.js.map