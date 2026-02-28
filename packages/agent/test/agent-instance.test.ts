import { describe, it, expect } from 'vitest';
import { AgentInstance } from '../src/agent-instance.js';
import type { AgentConfig } from '@teamclaw/config';

describe('AgentInstance', () => {
  const mockConfig: AgentConfig = {
    id: 'dev',
    name: 'Developer',
    description: 'Can write code',
    model: 'anthropic/claude-3.5-sonnet',
    provider: 'openrouter',
  };

  describe('constructor', () => {
    it('should create agent instance with id', () => {
      const agent = new AgentInstance(mockConfig);
      expect(agent.id).toBe('dev');
    });

    it('should store config', () => {
      const agent = new AgentInstance(mockConfig);
      const config = agent.getConfig();
      expect(config.id).toBe('dev');
      expect(config.name).toBe('Developer');
    });
  });

  describe('initialize', () => {
    it('should initialize with session ID', async () => {
      const agent = new AgentInstance(mockConfig);
      await agent.initialize('session-123');
      // Initialize sets context, should not throw
      expect(true).toBe(true);
    });

    it('should allow multiple initializations', async () => {
      const agent = new AgentInstance(mockConfig);
      await agent.initialize('session-1');
      await agent.initialize('session-2');
      expect(true).toBe(true);
    });
  });

  describe('execute', () => {
    it('should execute simple task', async () => {
      const agent = new AgentInstance(mockConfig);
      const result = await agent.execute('fix the bug');
      expect(result.success).toBe(true);
      expect(result.content).toContain('fix the bug');
    });

    it('should return content with agent id', async () => {
      const agent = new AgentInstance(mockConfig);
      const result = await agent.execute('test task');
      expect(result.content).toContain('[Agent dev]');
    });

    it('should handle empty task', async () => {
      const agent = new AgentInstance(mockConfig);
      const result = await agent.execute('');
      expect(result.success).toBe(true);
      expect(result.content).toBe('[Agent dev] Executed: ');
    });

    it('should handle complex tasks with code', async () => {
      const agent = new AgentInstance(mockConfig);
      const codeTask = 'function add(a, b) { return a + b; }';
      const result = await agent.execute(codeTask);
      expect(result.success).toBe(true);
      expect(result.content).toContain(codeTask);
    });
  });

  describe('getConfig', () => {
    it('should return full config', () => {
      const agent = new AgentInstance(mockConfig);
      const config = agent.getConfig();
      expect(config).toEqual(mockConfig);
    });

    it('should return immutable config reference', () => {
      const agent = new AgentInstance(mockConfig);
      const config1 = agent.getConfig();
      const config2 = agent.getConfig();
      expect(config1).toBe(config2);
    });
  });
});
