import type { AgentInstance } from '@teamclaw/agent';
import type { WorkflowResult } from './types.js';
export declare class WorkflowAgent {
    private agent;
    constructor(agent: AgentInstance);
    decompose(task: string): Promise<WorkflowResult>;
    execute(): Promise<WorkflowResult>;
}
//# sourceMappingURL=workflow-agent.d.ts.map