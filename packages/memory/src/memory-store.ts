export interface MemoryEntry {
  id: string;
  type: 'team' | 'agent';
  agentId?: string;
  content: string;
  embedding?: number[];
  timestamp: number;
}

export class MemoryStore {
  private entries: MemoryEntry[] = [];

  async add(entry: Omit<MemoryEntry, 'id' | 'timestamp'>): Promise<string> {
    const id = `mem-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    this.entries.push({
      ...entry,
      id,
      timestamp: Date.now(),
    });
    return id;
  }

  async getByAgent(agentId: string): Promise<MemoryEntry[]> {
    return this.entries.filter(
      (e) => e.type === 'agent' && e.agentId === agentId
    );
  }

  async getTeamKnowledge(): Promise<MemoryEntry[]> {
    return this.entries.filter((e) => e.type === 'team');
  }

  async search(query: string, limit = 10): Promise<MemoryEntry[]> {
    return this.entries.slice(0, limit);
  }
}
