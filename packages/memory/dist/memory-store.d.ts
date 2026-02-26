export interface MemoryEntry {
    id: string;
    type: 'team' | 'agent';
    agentId?: string;
    content: string;
    embedding?: number[];
    timestamp: number;
}
export declare class MemoryStore {
    private entries;
    add(entry: Omit<MemoryEntry, 'id' | 'timestamp'>): Promise<string>;
    getByAgent(agentId: string): Promise<MemoryEntry[]>;
    getTeamKnowledge(): Promise<MemoryEntry[]>;
    search(query: string, limit?: number): Promise<MemoryEntry[]>;
}
//# sourceMappingURL=memory-store.d.ts.map