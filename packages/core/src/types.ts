export interface Message {
  id: string;
  channel: string;
  user: string;
  content: string;
  timestamp: number;
  mentions: string[];
}

export interface AgentResponse {
  agentId: string;
  content: string;
  toolCalls?: Array<{
    name: string;
    args: Record<string, unknown>;
  }>;
}

export interface RouteResult {
  type: 'direct' | 'workflow';
  agentId?: string;
  task?: string;
  subtasks?: Subtask[];
}

export interface Subtask {
  id: string;
  description: string;
  assignedAgentId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: string;
}

export interface ChannelAdapter {
  name: string;
  start(): Promise<void>;
  stop(): Promise<void>;
  sendMessage(channelId: string, message: string): Promise<void>;
  onMessage(handler: (message: Message) => Promise<void>): void;
}
