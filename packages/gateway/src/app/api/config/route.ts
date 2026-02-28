import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { createHash } from 'crypto';

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

function loadConfig(): any {
  const configPath = join(process.cwd(), 'config/local.json');
  const rootConfigPath = join(process.cwd(), '../config/local.json');
  
  if (existsSync(configPath)) {
    return JSON.parse(readFileSync(configPath, 'utf-8'));
  } else if (existsSync(rootConfigPath)) {
    return JSON.parse(readFileSync(rootConfigPath, 'utf-8'));
  }
  return null;
}

export async function GET() {
  const config = loadConfig();
  
  const hasApiKey = config?.providers?.openrouter?.apiKey?.length > 0;
  
  return NextResponse.json({
    configured: hasApiKey,
    port: config?.channels?.web?.config?.port || 12345,
    hasApiKey,
    agentsCount: config?.agents ? Object.keys(config.agents).length : 0,
    domain: config?.domain || '',
    providers: config?.providers ? { openrouter: { apiKey: '' } } : undefined,
    model: config?.model || 'openai/gpt-4o-mini',
    channels: config?.channels,
    agents: config?.agents || {},
    memory: config?.memory || { lanceDbPath: './data/memory' },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agents, channels, providers, model, memory, domain, adminPassword } = body;
    
    const configPath = join(process.cwd(), 'config/local.json');
    const rootConfigPath = join(process.cwd(), '../config/local.json');
    const configDir = dirname(configPath);
    
    let config: any = loadConfig();
    
    if (!config) {
      config = {
        agents: {},
        channels: { web: { type: 'web', enabled: true, config: { port: 12345 } } },
        providers: { openrouter: { apiKey: '' } },
        model: 'openai/gpt-4o-mini',
        memory: { lanceDbPath: './data/memory' },
        admin: { passwordHash: '' }
      };
    }
    
    if (agents !== undefined) config.agents = agents;
    if (channels !== undefined) config.channels = channels;
    if (providers !== undefined) config.providers = providers;
    if (model !== undefined) config.model = model;
    if (memory !== undefined) config.memory = memory;
    if (domain !== undefined) config.domain = domain;
    
    if (adminPassword && adminPassword.length >= 6) {
      config.admin = { passwordHash: hashPassword(adminPassword) };
    }
    
    if (!existsSync(configDir)) {
      mkdirSync(configDir, { recursive: true });
    }
    
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Config save error:', error);
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
  }
}
