import { describe, it, expect } from 'vitest';
import { WorkflowAgent } from '../src/workflow-agent.js';
import { AgentInstance } from '@teamclaw/agent';

describe('WorkflowAgent', () => {
  it('should decompose complex task', async () => {
    const agent = new AgentInstance({
      id: 'workflow',
      name: 'Workflow',
      description: 'Decomposes tasks',
      model: 'anthropic/claude-3.5-sonnet',
      provider: 'openrouter',
    });
    await agent.initialize('session-1');
    
    const workflow = new WorkflowAgent(agent);
    const result = await workflow.decompose('first fix bug then write test');
    
    expect(result.subtasks.length).toBeGreaterThan(0);
  });
});
