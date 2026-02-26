import { describe, it, expect } from 'vitest';
import { parseMentions, classifyTask, routeMessage } from '../src/router.js';
import type { Message } from '../src/types.js';

describe('router', () => {
  describe('parseMentions', () => {
    it('should parse single mention', () => {
      const result = parseMentions('@dev fix the bug');
      expect(result).toEqual(['dev']);
    });

    it('should parse multiple mentions', () => {
      const result = parseMentions('@dev and @review check this');
      expect(result).toEqual(['dev', 'review']);
    });

    it('should return empty for no mentions', () => {
      const result = parseMentions('just a message');
      expect(result).toEqual([]);
    });
  });

  describe('classifyTask', () => {
    it('should classify simple task', () => {
      const result = classifyTask('fix the bug');
      expect(result).toBe('simple');
    });

    it('should classify complex task', () => {
      const result = classifyTask('first do this and then do that');
      expect(result).toBe('complex');
    });
  });

  describe('routeMessage', () => {
    const message: Message = {
      id: '1',
      channel: 'slack',
      user: 'user1',
      content: '@dev fix the bug',
      timestamp: Date.now(),
      mentions: ['dev'],
    };

    it('should route to mentioned agent', () => {
      const result = routeMessage(message, ['dev', 'review']);
      expect(result.type).toBe('direct');
      expect(result.agentId).toBe('dev');
    });
  });
});
