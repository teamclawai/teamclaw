import type { Subtask } from '@teamclaw/core';

export interface WorkflowResult {
  success: boolean;
  subtasks: Subtask[];
  finalResult?: string;
}
