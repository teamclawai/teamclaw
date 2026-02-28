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

    it('should parse mentions at different positions', () => {
      const result = parseMentions('Hey @dev, can @review help?');
      expect(result).toEqual(['dev', 'review']);
    });

    it('should handle mentions with numbers', () => {
      const result = parseMentions('@dev1 check @review2');
      expect(result).toEqual(['dev1', 'review2']);
    });

    it('should handle duplicate mentions', () => {
      const result = parseMentions('@dev please help @dev');
      expect(result).toEqual(['dev', 'dev']);
    });
  });

  describe('classifyTask', () => {
    it('should classify simple task', () => {
      const result = classifyTask('fix the bug');
      expect(result).toBe('simple');
    });

    it('should classify complex task with "and then"', () => {
      const result = classifyTask('first do this and then do that');
      expect(result).toBe('complex');
    });

    it('should classify complex task with "also need to"', () => {
      const result = classifyTask('also need to refactor this');
      expect(result).toBe('complex');
    });

    it('should classify complex task with "multiple"', () => {
      const result = classifyTask('handle multiple requests');
      expect(result).toBe('complex');
    });

    it('should classify complex task with "workflow"', () => {
      const result = classifyTask('create a workflow for this');
      expect(result).toBe('complex');
    });

    it('should classify complex task with "step"', () => {
      const result = classifyTask('follow these steps');
      expect(result).toBe('complex');
    });

    it('should be case insensitive', () => {
      const result = classifyTask('First do this AND THEN do that');
      expect(result).toBe('complex');
    });

    it('should classify complex task with "after that"', () => {
      const result = classifyTask('do this after that');
      expect(result).toBe('complex');
    });
  });

  describe('routeMessage', () => {
    const baseMessage: Message = {
      id: '1',
      channel: 'web',
      user: 'user1',
      content: '',
      timestamp: Date.now(),
      mentions: [],
    };

    it('should route to mentioned agent for simple task', () => {
      const message: Message = {
        ...baseMessage,
        content: '@dev fix the bug',
        mentions: ['dev'],
      };
      const result = routeMessage(message, ['dev', 'review']);
      expect(result.type).toBe('direct');
      expect(result.agentId).toBe('dev');
    });

    it('should route to first agent when no mention', () => {
      const message: Message = {
        ...baseMessage,
        content: 'hello everyone',
        mentions: [],
      };
      const result = routeMessage(message, ['dev', 'review']);
      expect(result.type).toBe('direct');
      expect(result.agentId).toBe('dev');
    });

    it('should route to first agent when mention is not valid', () => {
      const message: Message = {
        ...baseMessage,
        content: '@unknown fix the bug',
        mentions: ['unknown'],
      };
      const result = routeMessage(message, ['dev', 'review']);
      expect(result.type).toBe('direct');
      expect(result.agentId).toBe('dev');
    });

    it('should route to workflow for complex task', () => {
      const message: Message = {
        ...baseMessage,
        content: '@dev first do this and then do that',
        mentions: ['dev'],
      };
      const result = routeMessage(message, ['dev', 'review']);
      expect(result.type).toBe('workflow');
    });

    it('should include task content in result', () => {
      const message: Message = {
        ...baseMessage,
        content: '@dev fix the login bug',
        mentions: ['dev'],
      };
      const result = routeMessage(message, ['dev', 'review']);
      expect(result.task).toBe('@dev fix the login bug');
    });
  });
});
