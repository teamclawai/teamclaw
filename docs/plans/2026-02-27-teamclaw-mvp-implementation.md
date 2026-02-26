# TeamClaw MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build TeamClaw MVP - a lightweight multi-agent platform with Slack channel, Web portal, task routing, and Workflow Agent

**Architecture:** Monorepo with packages for core, agent, workflow, skills, channels, memory, gateway, config. Uses pi-agent-core for agent runtime, pi-ai for LLM calls, LanceDB for vector storage.

**Tech Stack:** TypeScript, pnpm, Vitest, Next.js, pi-agent-core, pi-ai, LanceDB

---

## Phase 1: Project Scaffolding

### Task 1: Initialize Monorepo Structure

**Files:**
- Create: `package.json` (root)
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `biome.json`

**Step 1: Create root package.json**

```json
{
  "name": "teamclaw",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "pnpm -r run build",
    "check": "pnpm -r run check",
    "test": "vitest run"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "vitest": "^2.0.0",
    "biome": "^1.9.0"
  }
}
```

**Step 2: Create pnpm-workspace.yaml**

```yaml
packages:
  - 'packages/*'
```

**Step 3: Create tsconfig.base.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

**Step 4: Commit**

```bash
git add package.json pnpm-workspace.yaml tsconfig.base.json
git commit -m "chore: scaffold monorepo structure"
```

---

### Task 2: Create Config Package

**Files:**
- Create: `packages/config/package.json`
- Create: `packages/config/tsconfig.json`
- Create: `packages/config/src/index.ts`
- Create: `packages/config/src/types.ts`
- Create: `config/default.json`

**Step 1: Create packages/config/package.json**

```json
{
  "name": "@teamclaw/config",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "check": "biome check . && tsc --noEmit"
  },
  "dependencies": {
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.0.0"
  }
}
```

**Step 2: Create packages/config/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

**Step 3: Create packages/config/src/types.ts**

```typescript
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
```

**Step 4: Create packages/config/src/index.ts**

```typescript
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { z } from 'zod';
import type { TeamClawConfig } from './types.js';

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

export type { TeamClawConfig, AgentConfig, ChannelConfig, ProviderConfig };
```

**Step 5: Create config/default.json**

```json
{
  "agents": {},
  "channels": {
    "web": {
      "type": "web",
      "enabled": true,
      "config": {
        "port": 3000
      }
    }
  },
  "providers": {
    "openrouter": {
      "apiKey": ""
    }
  },
  "memory": {
    "lanceDbPath": "./data/memory"
  }
}
```

**Step 6: Commit**

```bash
git add packages/config config/default.json
git commit -m "feat(config): add config package with types"
```

---

### Task 3: Create Core Package - AgentOrchestrator

**Files:**
- Create: `packages/core/package.json`
- Create: `packages/core/tsconfig.json`
- Create: `packages/core/src/index.ts`
- Create: `packages/core/src/orchestrator.ts`
- Create: `packages/core/src/router.ts`
- Create: `packages/core/test/orchestrator.test.ts`

**Step 1: Create packages/core/package.json**

```json
{
  "name": "@teamclaw/core",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "check": "biome check . && tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@teamclaw/config": "workspace:*",
    "@mariozechner/pi-agent-core": "^0.55.0",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.0.0",
    "vitest": "^2.0.0"
  }
}
```

**Step 2: Create packages/core/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

**Step 3: Create packages/core/src/types.ts**

```typescript
import type { AgentConfig } from '@teamclaw/config';

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
```

**Step 4: Create packages/core/src/router.ts**

```typescript
import type { Message, RouteResult } from './types.js';

const MENTION_REGEX = /@(\w+)/g;

export function parseMentions(content: string): string[] {
  const matches = content.matchAll(MENTION_REGEX);
  return Array.from(matches, (m) => m[1]);
}

export function classifyTask(content: string): 'simple' | 'complex' {
  const complexIndicators = [
    'and then',
    'also need to',
    'multiple',
    'several',
    'workflow',
    'step',
    'first',
    'then',
    'after that',
    'subtask',
  ];
  const lower = content.toLowerCase();
  return complexIndicators.some((ind) => lower.includes(ind)) ? 'complex' : 'simple';
}

export function routeMessage(
  message: Message,
  agentIds: string[]
): RouteResult {
  const mentions = message.mentions;
  
  if (mentions.length === 0) {
    return { type: 'direct', agentId: agentIds[0], task: message.content };
  }

  const targetAgent = mentions[0];
  if (!agentIds.includes(targetAgent)) {
    return { type: 'direct', agentId: agentIds[0], task: message.content };
  }

  const taskType = classifyTask(message.content);
  
  if (taskType === 'simple') {
    return { type: 'direct', agentId: targetAgent, task: message.content };
  }

  return { type: 'workflow', task: message.content };
}
```

**Step 5: Write failing test - packages/core/test/router.test.ts**

```typescript
import { describe, it, expect } from 'vitest';
import { parseMentions, classifyTask, routeMessage } from '../src/router.js';
import type { Message } from '../src/types.js';

describe('router', () => {
  describe('parseMentions', () => {
    it('should parse single mention', () => {
      const result = parseMentions('@dev fix the bug');
      expect(result).toEqual(['dev']);
    });

    it('should parse multiple mentions', () => {
      const result = parseMentions('@dev and @review check this');
      expect(result).toEqual(['dev', 'review']);
    });

    it('should return empty for no mentions', () => {
      const result = parseMentions('just a message');
      expect(result).toEqual([]);
    });
  });

  describe('classifyTask', () => {
    it('should classify simple task', () => {
      const result = classifyTask('fix the bug');
      expect(result).toBe('simple');
    });

    it('should classify complex task', () => {
      const result = classifyTask('first do this and then do that');
      expect(result).toBe('complex');
    });
  });

  describe('routeMessage', () => {
    const message: Message = {
      id: '1',
      channel: 'slack',
      user: 'user1',
      content: '@dev fix the bug',
      timestamp: Date.now(),
      mentions: ['dev'],
    };

    it('should route to mentioned agent', () => {
      const result = routeMessage(message, ['dev', 'review']);
      expect(result.type).toBe('direct');
      expect(result.agentId).toBe('dev');
    });
  });
});
```

**Step 6: Run test to verify it fails**

```bash
cd packages/core && pnpm test
# Expected: FAIL - functions not defined
```

**Step 7: Create packages/core/src/index.ts**

```typescript
export * from './types.js';
export * from './router.js';
```

**Step 8: Run test to verify it passes**

```bash
cd packages/core && pnpm test
# Expected: PASS
```

**Step 9: Commit**

```bash
git add packages/core
git commit -m "feat(core): add router with message parsing and task classification"
```

---

### Task 4: Create Agent Package

**Files:**
- Create: `packages/agent/package.json`
- Create: `packages/agent/tsconfig.json`
- Create: `packages/agent/src/index.ts`
- Create: `packages/agent/src/agent-instance.ts`
- Create: `packages/agent/test/agent-instance.test.ts`

**Step 1: Create packages/agent/package.json**

```json
{
  "name": "@teamclaw/agent",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "check": "biome check . && tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@teamclaw/config": "workspace:*",
    "@mariozechner/pi-agent-core": "^0.55.0",
    "@mariozechner/pi-ai": "^0.55.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.0.0",
    "vitest": "^2.0.0"
  }
}
```

**Step 2: Create packages/agent/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

**Step 3: Create packages/agent/src/types.ts**

```typescript
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
```

**Step 4: Write failing test - packages/agent/test/agent-instance.test.ts**

```typescript
import { describe, it, expect } from 'vitest';
import { AgentInstance } from '../src/agent-instance.js';
import type { AgentConfig } from '@teamclaw/config';

describe('AgentInstance', () => {
  const mockConfig: AgentConfig = {
    id: 'dev',
    name: 'Developer',
    description: 'Can write code',
    model: 'anthropic/claude-3.5-sonnet',
    provider: 'openrouter',
  };

  it('should create agent instance', () => {
    const agent = new AgentInstance(mockConfig);
    expect(agent.id).toBe('dev');
  });
});
```

**Step 5: Run test to verify it fails**

```bash
cd packages/agent && pnpm test
# Expected: FAIL - AgentInstance not defined
```

**Step 6: Create packages/agent/src/agent-instance.ts**

```typescript
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
```

**Step 7: Create packages/agent/src/index.ts**

```typescript
export * from './types.js';
export * from './agent-instance.js';
```

**Step 8: Run test to verify it passes**

```bash
cd packages/agent && pnpm test
# Expected: PASS
```

**Step 9: Commit**

```bash
git add packages/agent
git commit -m "feat(agent): add AgentInstance class"
```

---

### Task 5: Create Workflow Package

**Files:**
- Create: `packages/workflow/package.json`
- Create: `packages/workflow/tsconfig.json`
- Create: `packages/workflow/src/index.ts`
- Create: `packages/workflow/src/workflow-agent.ts`
- Create: `packages/workflow/test/workflow-agent.test.ts`

**Step 1: Create packages/workflow/package.json**

```json
{
  "name": "@teamclaw/workflow",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "check": "biome check . && tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@teamclaw/agent": "workspace:*",
    "@teamclaw/config": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.0.0",
    "vitest": "^2.0.0"
  }
}
```

**Step 2: Create packages/workflow/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

**Step 3: Write failing test - packages/workflow/test/workflow-agent.test.ts**

```typescript
import { describe, it, expect } from 'vitest';
import { WorkflowAgent } from '../src/workflow-agent.js';
import { AgentInstance } from '@teamclaw/agent';

describe('WorkflowAgent', () => {
  it('should decompose complex task', async () => {
    const agent = new AgentInstance({
      id: 'workflow',
      name: 'Workflow',
      description: 'Decomposes tasks',
      model: 'anthropic/claude-3.5-sonnet',
      provider: 'openrouter',
    });
    await agent.initialize('session-1');
    
    const workflow = new WorkflowAgent(agent);
    const result = await workflow.decompose('first fix bug then write test');
    
    expect(result.subtasks.length).toBeGreaterThan(0);
  });
});
```

**Step 4: Run test to verify it fails**

```bash
cd packages/workflow && pnpm test
# Expected: FAIL - WorkflowAgent not defined
```

**Step 5: Create packages/workflow/src/types.ts**

```typescript
import type { Subtask } from '@teamclaw/core';

export interface WorkflowResult {
  success: boolean;
  subtasks: Subtask[];
  finalResult?: string;
}
```

**Step 6: Create packages/workflow/src/workflow-agent.ts**

```typescript
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
```

**Step 7: Create packages/workflow/src/index.ts**

```typescript
export * from './types.js';
export * from './workflow-agent.js';
```

**Step 8: Run test to verify it passes**

```bash
cd packages/workflow && pnpm test
# Expected: PASS
```

**Step 9: Commit**

```bash
git add packages/workflow
git commit -m "feat(workflow): add WorkflowAgent with task decomposition"
```

---

### Task 6: Create Channels Package

**Files:**
- Create: `packages/channels/package.json`
- Create: `packages/channels/tsconfig.json`
- Create: `packages/channels/src/index.ts`
- Create: `packages/channels/src/base-channel.ts`
- Create: `packages/channels/src/web-channel.ts`
- Create: `packages/channels/src/slack-channel.ts`
- Create: `packages/channels/test/channel.test.ts`

**Step 1: Create packages/channels/package.json**

```json
{
  "name": "@teamclaw/channels",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "check": "biome check . && tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@teamclaw/core": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.0.0",
    "vitest": "^2.0.0"
  }
}
```

**Step 2: Create packages/channels/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

**Step 3: Create packages/channels/src/base-channel.ts**

```typescript
import type { Message } from '@teamclaw/core';

export interface ChannelAdapter {
  name: string;
  start(): Promise<void>;
  stop(): Promise<void>;
  sendMessage(channelId: string, message: string): Promise<void>;
  onMessage(handler: (message: Message) => Promise<void>): void;
}
```

**Step 4: Create packages/channels/src/web-channel.ts**

```typescript
import type { Message } from '@teamclaw/core';
import type { ChannelAdapter } from './base-channel.js';

export class WebChannel implements ChannelAdapter {
  readonly name = 'web';
  private messageHandler: ((message: Message) => Promise<void>) | null = null;

  async start(): Promise<void> {
    console.log('Web channel started');
  }

  async stop(): Promise<void> {
    console.log('Web channel stopped');
  }

  async sendMessage(channelId: string, message: string): Promise<void> {
    console.log(`[Web] ${channelId}: ${message}`);
  }

  onMessage(handler: (message: Message) => Promise<void>): void {
    this.messageHandler = handler;
  }

  async simulateMessage(content: string): Promise<void> {
    if (this.messageHandler) {
      const message: Message = {
        id: `msg-${Date.now()}`,
        channel: 'web',
        user: 'user',
        content,
        timestamp: Date.now(),
        mentions: [],
      };
      await this.messageHandler(message);
    }
  }
}
```

**Step 5: Create packages/channels/src/index.ts**

```typescript
export * from './base-channel.js';
export * from './web-channel.js';
export * from './slack-channel.js';
```

**Step 6: Write failing test - packages/channels/test/channel.test.ts**

```typescript
import { describe, it, expect } from 'vitest';
import { WebChannel } from '../src/web-channel.js';

describe('WebChannel', () => {
  it('should create web channel', () => {
    const channel = new WebChannel();
    expect(channel.name).toBe('web');
  });

  it('should start and stop', async () => {
    const channel = new WebChannel();
    await channel.start();
    await channel.stop();
  });
});
```

**Step 7: Run test to verify it passes**

```bash
cd packages/channels && pnpm test
# Expected: PASS
```

**Step 8: Commit**

```bash
git add packages/channels
git commit -m "feat(channels): add WebChannel adapter"
```

---

## Phase 2: Integration

### Task 7: Create Memory Package

**Files:**
- Create: `packages/memory/package.json`
- Create: `packages/memory/src/index.ts`
- Create: `packages/memory/src/memory-store.ts`
- Create: `packages/memory/test/memory.test.ts`

**Step 1: Create packages/memory/package.json**

```json
{
  "name": "@teamclaw/memory",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "check": "biome check . && tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "@lancedb/lancedb": "^0.19.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.0.0",
    "vitest": "^2.0.0"
  }
}
```

**Step 2: Create packages/memory/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

**Step 3: Create packages/memory/src/memory-store.ts**

```typescript
export interface MemoryEntry {
  id: string;
  type: 'team' | 'agent';
  agentId?: string;
  content: string;
  embedding?: number[];
  timestamp: number;
}

export class MemoryStore {
  private entries: MemoryEntry[] = [];

  async add(entry: Omit<MemoryEntry, 'id' | 'timestamp'>): Promise<string> {
    const id = `mem-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    this.entries.push({
      ...entry,
      id,
      timestamp: Date.now(),
    });
    return id;
  }

  async getByAgent(agentId: string): Promise<MemoryEntry[]> {
    return this.entries.filter(
      (e) => e.type === 'agent' && e.agentId === agentId
    );
  }

  async getTeamKnowledge(): Promise<MemoryEntry[]> {
    return this.entries.filter((e) => e.type === 'team');
  }

  async search(query: string, limit = 10): Promise<MemoryEntry[]> {
    return this.entries.slice(0, limit);
  }
}
```

**Step 4: Create packages/memory/src/index.ts**

```typescript
export * from './memory-store.js';
export type { MemoryEntry } from './memory-store.js';
```

**Step 5: Write failing test - packages/memory/test/memory.test.ts**

```typescript
import { describe, it, expect } from 'vitest';
import { MemoryStore } from '../src/memory-store.js';

describe('MemoryStore', () => {
  it('should add and retrieve memory', async () => {
    const store = new MemoryStore();
    const id = await store.add({
      type: 'team',
      content: 'Team knowledge: we use TypeScript',
    });
    
    const entries = await store.getTeamKnowledge();
    expect(entries.length).toBe(1);
    expect(entries[0].content).toBe('Team knowledge: we use TypeScript');
  });
});
```

**Step 6: Run test to verify it passes**

```bash
cd packages/memory && pnpm test
# Expected: PASS
```

**Step 7: Commit**

```bash
git add packages/memory
git commit -m "feat(memory): add MemoryStore for team and agent knowledge"
```

---

### Task 8: Create Gateway Web Portal

**Files:**
- Create: `packages/gateway/package.json`
- Create: `packages/gateway/next.config.js`
- Create: `packages/gateway/src/app/page.tsx`
- Create: `packages/gateway/src/app/layout.tsx`
- Create: `packages/gateway/src/app/api/messages/route.ts`

**Step 1: Create packages/gateway/package.json**

```json
{
  "name": "@teamclaw/gateway",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "check": "biome check . && tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0"
  }
}
```

**Step 2: Create packages/gateway/next.config.js**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
};

export default nextConfig;
```

**Step 3: Create packages/gateway/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Step 4: Create packages/gateway/src/app/layout.tsx**

```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TeamClaw',
  description: 'Multi-Agent Collaboration Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

**Step 5: Create packages/gateway/src/app/page.tsx**

```typescript
export default function Home() {
  return (
    <main>
      <h1>TeamClaw</h1>
      <p>Multi-Agent Collaboration Platform</p>
    </main>
  );
}
```

**Step 6: Commit**

```bash
git add packages/gateway
git commit -m "feat(gateway): scaffold Next.js web portal"
```

---

### Task 9: Integration - Connect All Components

**Files:**
- Create: `packages/core/src/orchestrator.ts`
- Create: `packages/core/test/orchestrator.test.ts`

**Step 1: Create packages/core/src/orchestrator.ts**

```typescript
import type { Message, AgentResponse } from './types.js';
import type { ChannelAdapter } from '@teamclaw/channels';
import type { AgentInstance } from '@teamclaw/agent';
import type { MemoryStore } from '@teamclaw/memory';
import { routeMessage, parseMentions } from './router.js';

export class AgentOrchestrator {
  private channels: Map<string, ChannelAdapter> = new Map();
  private agents: Map<string, AgentInstance> = new Map();
  private memory: MemoryStore;

  constructor(memory: MemoryStore) {
    this.memory = memory;
  }

  registerChannel(name: string, channel: ChannelAdapter): void {
    this.channels.set(name, channel);
    channel.onMessage(this.handleMessage.bind(this));
  }

  registerAgent(agent: AgentInstance): void {
    this.agents.set(agent.id, agent);
  }

  async start(): Promise<void> {
    for (const channel of this.channels.values()) {
      await channel.start();
    }
  }

  async stop(): Promise<void> {
    for (const channel of this.channels.values()) {
      await channel.stop();
    }
  }

  private async handleMessage(message: Message): Promise<void> {
    const mentions = parseMentions(message.content);
    const agentIds = Array.from(this.agents.keys());
    const route = routeMessage({ ...message, mentions }, agentIds);

    if (route.type === 'direct' && route.agentId) {
      const agent = this.agents.get(route.agentId);
      if (agent) {
        const result = await agent.execute(route.task || '');
        await this.sendResponse(message.channel, result);
      }
    }
  }

  private async sendResponse(
    channelId: string,
    response: AgentResponse
  ): Promise<void> {
    const channel = this.channels.get(channelId);
    if (channel) {
      await channel.sendMessage(channelId, response.content);
    }
  }
}
```

**Step 2: Commit**

```bash
git add packages/core
git commit -m "feat(core): add AgentOrchestrator integration"
```

---

## Summary

This plan creates:
1. Monorepo structure with pnpm workspace
2. Config package with Zod validation
3. Core package with MessageRouter and TaskClassifier
4. Agent package with AgentInstance wrapper
5. Workflow package with WorkflowAgent
6. Channels package with WebChannel adapter
7. Memory package with in-memory store
8. Gateway package with Next.js web portal
9. Integration of all components via AgentOrchestrator

**Total Tasks:** 9 major tasks, ~30 steps
