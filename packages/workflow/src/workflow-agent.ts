import type { AgentInstance } from '@teamclaw/agent';
import type { Subtask } from '@teamclaw/core';
import type { WorkflowResult } from './types.js';

export class WorkflowAgent {
  private agent: AgentInstance;

  constructor(agent: AgentInstance) {
    this.agent = agent;
  }

  async decompose(task: string): Promise<WorkflowResult> {
    const subtasks: Subtask[] = [
      {
        id: 'subtask-1',
        description: task,
        assignedAgentId: 'agent-1',
        status: 'pending',
      },
    ];
    
    return {
      success: true,
      subtasks,
    };
  }

  async execute(): Promise<WorkflowResult> {
    return {
      success: true,
      subtasks: [],
    };
  }
}
