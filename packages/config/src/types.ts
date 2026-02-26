export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  model: string;
  provider: string;
  skills?: string[];
}

export interface ChannelConfig {
  type: 'slack' | 'web' | 'discord';
  enabled: boolean;
  config: Record<string, unknown>;
}

export interface ProviderConfig {
  [key: string]: {
    apiKey: string;
    apiBase?: string;
  };
}

export interface TeamClawConfig {
  agents: Record<string, AgentConfig>;
  channels: Record<string, ChannelConfig>;
  providers: ProviderConfig;
  memory?: {
    lanceDbPath: string;
  };
}
