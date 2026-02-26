import { readFileSync } from 'fs';
import { resolve } from 'path';
import { z } from 'zod';
import type { TeamClawConfig, AgentConfig, ChannelConfig, ProviderConfig } from './types.js';

export type { TeamClawConfig, AgentConfig, ChannelConfig, ProviderConfig };

const ConfigSchema = z.object({
  agents: z.record(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    model: z.string(),
    provider: z.string(),
    skills: z.array(z.string()).optional(),
  })),
  channels: z.record(z.object({
    type: z.enum(['slack', 'web', 'discord']),
    enabled: z.boolean(),
    config: z.record(z.unknown()),
  })),
  providers: z.record(z.object({
    apiKey: z.string(),
    apiBase: z.string().optional(),
  })),
  memory: z.object({
    lanceDbPath: z.string(),
  }).optional(),
});

export function loadConfig(path: string): TeamClawConfig {
  const content = readFileSync(path, 'utf-8');
  const parsed = JSON.parse(content);
  return ConfigSchema.parse(parsed);
}

export function getConfigPath(): string {
  return resolve(process.cwd(), 'config/local.json');
}
