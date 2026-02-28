import { describe, it, expect, beforeEach } from 'vitest';
import { WorkflowAgent } from '../src/workflow-agent.js';
import { AgentInstance } from '@teamclaw/agent';

describe('WorkflowAgent', () => {
  let agent: AgentInstance;
  let workflow: WorkflowAgent;

  beforeEach(() => {
    agent = new AgentInstance({
      id: 'workflow',
      name: 'Workflow',
      description: 'Decomposes tasks',
      model: 'anthropic/claude-3.5-sonnet',
      provider: 'openrouter',
    });
    workflow = new WorkflowAgent(agent);
  });

  describe('constructor', () => {
    it('should create workflow agent', () => {
      expect(workflow).toBeTruthy();
    });
  });

  describe('decompose', () => {
    it('should decompose simple task', async () => {
      const result = await workflow.decompose('fix the bug');
      expect(result.success).toBe(true);
      expect(result.subtasks.length).toBeGreaterThan(0);
    });

    it('should decompose complex task', async () => {
      const result = await workflow.decompose('first do this and then do that');
      expect(result.success).toBe(true);
      expect(result.subtasks.length).toBeGreaterThan(0);
    });

    it('should include task in subtask description', async () => {
      const task = 'implement login feature';
      const result = await workflow.decompose(task);
      expect(result.subtasks[0].description).toBe(task);
    });

    it('should assign default agent', async () => {
      const result = await workflow.decompose('test task');
      expect(result.subtasks[0].assignedAgentId).toBe('agent-1');
    });

    it('should set pending status', async () => {
      const result = await workflow.decompose('test task');
      expect(result.subtasks[0].status).toBe('pending');
    });

    it('should generate subtask IDs', async () => {
      const result1 = await workflow.decompose('task 1');
      expect(result1.subtasks[0].id).toBeTruthy();
      expect(result1.subtasks[0].id).toContain('subtask');
    });

    it('should handle empty task', async () => {
      const result = await workflow.decompose('');
      expect(result.success).toBe(true);
    });

    it('should handle long task descriptions', async () => {
      const longTask = 'a'.repeat(1000);
      const result = await workflow.decompose(longTask);
      expect(result.success).toBe(true);
      expect(result.subtasks[0].description).toBe(longTask);
    });
  });

  describe('execute', () => {
    it('should execute workflow', async () => {
      const result = await workflow.execute();
      expect(result.success).toBe(true);
    });

    it('should return empty subtasks by default', async () => {
      const result = await workflow.execute();
      expect(result.subtasks).toEqual([]);
    });
  });
});
