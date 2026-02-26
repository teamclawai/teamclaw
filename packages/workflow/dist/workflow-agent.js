export class WorkflowAgent {
    agent;
    constructor(agent) {
        this.agent = agent;
    }
    async decompose(task) {
        const subtasks = [
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
    async execute() {
        return {
            success: true,
            subtasks: [],
        };
    }
}
//# sourceMappingURL=workflow-agent.js.map