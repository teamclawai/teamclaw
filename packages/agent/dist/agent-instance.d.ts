import type { AgentConfig } from '@teamclaw/config';
import type { AgentExecutionResult } from './types.js';
export declare class AgentInstance {
    readonly id: string;
    private config;
    private context;
    constructor(config: AgentConfig);
    initialize(sessionId: string): Promise<void>;
    execute(task: string): Promise<AgentExecutionResult>;
    getConfig(): AgentConfig;
}
//# sourceMappingURL=agent-instance.d.ts.map