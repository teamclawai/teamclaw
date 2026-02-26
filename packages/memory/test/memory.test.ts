import { describe, it, expect } from 'vitest';
import { MemoryStore } from '../src/memory-store.js';

describe('MemoryStore', () => {
  it('should add and retrieve memory', async () => {
    const store = new MemoryStore();
    const id = await store.add({
      type: 'team',
      content: 'Team knowledge: we use TypeScript',
    });
    
    const entries = await store.getTeamKnowledge();
    expect(entries.length).toBe(1);
    expect(entries[0].content).toBe('Team knowledge: we use TypeScript');
  });
});
