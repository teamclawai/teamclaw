import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryStore, type MemoryEntry } from '../src/memory-store.js';

describe('MemoryStore', () => {
  let store: MemoryStore;

  beforeEach(() => {
    store = new MemoryStore();
  });

  describe('add', () => {
    it('should add team memory', async () => {
      const id = await store.add({
        type: 'team',
        content: 'Team uses TypeScript',
      });
      expect(id).toBeTruthy();
      expect(id).toContain('mem-');
    });

    it('should add agent memory', async () => {
      const id = await store.add({
        type: 'agent',
        agentId: 'dev',
        content: 'Dev agent specializes in React',
      });
      expect(id).toBeTruthy();
    });

    it('should generate unique IDs', async () => {
      const id1 = await store.add({ type: 'team', content: 'test 1' });
      const id2 = await store.add({ type: 'team', content: 'test 2' });
      expect(id1).not.toBe(id2);
    });

    it('should add memory with embeddings', async () => {
      const id = await store.add({
        type: 'team',
        content: 'test content',
        embedding: [0.1, 0.2, 0.3],
      });
      expect(id).toBeTruthy();
    });
  });

  describe('getTeamKnowledge', () => {
    it('should return empty for no memories', async () => {
      const entries = await store.getTeamKnowledge();
      expect(entries).toEqual([]);
    });

    it('should return team memories', async () => {
      await store.add({ type: 'team', content: 'team fact 1' });
      await store.add({ type: 'team', content: 'team fact 2' });
      await store.add({ type: 'agent', agentId: 'dev', content: 'agent fact' });

      const entries = await store.getTeamKnowledge();
      expect(entries).toHaveLength(2);
    });

    it('should not return agent memories', async () => {
      await store.add({ type: 'team', content: 'team fact' });
      await store.add({ type: 'agent', agentId: 'dev', content: 'agent fact' });

      const entries = await store.getTeamKnowledge();
      expect(entries.every(e => e.type === 'team')).toBe(true);
    });
  });

  describe('getByAgent', () => {
    it('should return empty for no memories', async () => {
      const entries = await store.getByAgent('dev');
      expect(entries).toEqual([]);
    });

    it('should return memories for specific agent', async () => {
      await store.add({ type: 'agent', agentId: 'dev', content: 'dev fact 1' });
      await store.add({ type: 'agent', agentId: 'dev', content: 'dev fact 2' });
      await store.add({ type: 'agent', agentId: 'review', content: 'review fact' });

      const entries = await store.getByAgent('dev');
      expect(entries).toHaveLength(2);
      expect(entries.every(e => e.agentId === 'dev')).toBe(true);
    });

    it('should return empty for non-existent agent', async () => {
      await store.add({ type: 'agent', agentId: 'dev', content: 'dev fact' });

      const entries = await store.getByAgent('unknown');
      expect(entries).toHaveLength(0);
    });
  });

  describe('search', () => {
    it('should return empty for no memories', async () => {
      const entries = await store.search('test');
      expect(entries).toEqual([]);
    });

    it('should return memories with default limit', async () => {
      for (let i = 0; i < 15; i++) {
        await store.add({ type: 'team', content: `fact ${i}` });
      }

      const entries = await store.search('fact');
      expect(entries).toHaveLength(10);
    });

    it('should respect custom limit', async () => {
      for (let i = 0; i < 5; i++) {
        await store.add({ type: 'team', content: `fact ${i}` });
      }

      const entries = await store.search('fact', 3);
      expect(entries).toHaveLength(3);
    });

    it('should return all when fewer than limit', async () => {
      await store.add({ type: 'team', content: 'fact 1' });
      await store.add({ type: 'team', content: 'fact 2' });

      const entries = await store.search('fact', 10);
      expect(entries).toHaveLength(2);
    });
  });
});
