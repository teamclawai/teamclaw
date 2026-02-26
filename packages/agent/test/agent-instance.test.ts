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

  it('should create agent instance', () => {
    const agent = new AgentInstance(mockConfig);
    expect(agent.id).toBe('dev');
  });
});
