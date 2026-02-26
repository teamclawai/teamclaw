import type { AgentConfig } from '@teamclaw/config';
import type { AgentContext, AgentExecutionResult } from './types.js';

export class AgentInstance {
  readonly id: string;
  private config: AgentConfig;
  private context: AgentContext | null = null;

  constructor(config: AgentConfig) {
    this.id = config.id;
    this.config = config;
  }

  async initialize(sessionId: string): Promise<void> {
    this.context = {
      id: this.id,
      config: this.config,
      sessionId,
    };
  }

  async execute(task: string): Promise<AgentExecutionResult> {
    return {
      success: true,
      content: `[Agent ${this.id}] Executed: ${task}`,
    };
  }

  getConfig(): AgentConfig {
    return this.config;
  }
}
