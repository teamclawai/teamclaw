import { NextResponse } from 'next/server';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function GET() {
  const configPath = join(process.cwd(), 'config/local.json');
  const rootConfigPath = join(process.cwd(), '../config/local.json');
  
  const hasLocal = existsSync(configPath) || existsSync(rootConfigPath);
  
  let apiKey = '';
  if (existsSync(configPath)) {
    apiKey = JSON.parse(readFileSync(configPath, 'utf-8')).providers?.openrouter?.apiKey || '';
  } else if (existsSync(rootConfigPath)) {
    apiKey = JSON.parse(readFileSync(rootConfigPath, 'utf-8')).providers?.openrouter?.apiKey || '';
  }
  
  const hasApiKey = apiKey.length > 0;
  
  const defaultPath = join(process.cwd(), 'config/default.json');
  const defaultConfig = existsSync(defaultPath) 
    ? JSON.parse(readFileSync(defaultPath, 'utf-8'))
    : { channels: { web: { config: { port: 12345 } } } };
  
  return NextResponse.json({
    configured: hasApiKey,
    port: defaultConfig.channels?.web?.config?.port || 12345
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { apiKey, adminPassword, domain, model } = body;
    
    if (!apiKey || apiKey.length < 10) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 400 });
    }
    
    if (!adminPassword || adminPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    
    const configDir = join(process.cwd(), 'config');
    const rootConfigDir = join(process.cwd(), '../config');
    
    if (!existsSync(configDir)) {
      mkdirSync(configDir, { recursive: true });
    }
    
    const configPath = join(configDir, 'local.json');
    const rootConfigPath = join(rootConfigDir, 'local.json');
    const defaultPath = join(configDir, 'default.json');
    
    let baseConfig: any = {
      agents: {},
      channels: {
        web: {
          type: 'web',
          enabled: true,
          config: {
            port: 12345
          }
        }
      },
      providers: {
        openrouter: {
          apiKey: ""
        }
      },
      memory: {
        lanceDbPath: "./data/memory"
      },
      admin: {
        passwordHash: ""
      }
    };
    
    if (existsSync(configPath)) {
      baseConfig = JSON.parse(readFileSync(configPath, 'utf-8'));
    } else if (existsSync(rootConfigPath)) {
      baseConfig = JSON.parse(readFileSync(rootConfigPath, 'utf-8'));
    }
    
    const passwordHash = hashPassword(adminPassword);
    baseConfig.providers = baseConfig.providers || {};
    baseConfig.providers.openrouter = { apiKey };
    baseConfig.model = model || 'openai/gpt-4o-mini';
    baseConfig.admin = { passwordHash };
    if (domain) {
      baseConfig.domain = domain;
    }
    
    writeFileSync(configPath, JSON.stringify(baseConfig, null, 2));
    
    if (existsSync(rootConfigDir)) {
      writeFileSync(rootConfigPath, JSON.stringify(baseConfig, null, 2));
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
  }
}
