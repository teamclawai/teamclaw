import type { AgentConfig } from '@teamclaw/config';
export interface AgentContext {
    id: string;
    config: AgentConfig;
    sessionId: string;
}
export interface AgentExecutionResult {
    success: boolean;
    content: string;
    toolCalls?: Array<{
        name: string;
        args: Record<string, unknown>;
    }>;
}
//# sourceMappingURL=types.d.ts.map