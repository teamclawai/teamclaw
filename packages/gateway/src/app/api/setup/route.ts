import { NextResponse } from 'next/server';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

export async function GET() {
  const configPath = join(process.cwd(), 'config/local.json');
  const defaultPath = join(process.cwd(), 'config/default.json');
  
  const hasLocal = existsSync(configPath);
  const hasApiKey = existsSync(configPath) 
    ? JSON.parse(readFileSync(configPath, 'utf-8')).providers?.openrouter?.apiKey?.length > 0
    : false;
  
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
    const { apiKey, adminPassword, domain } = body;
    
    if (!apiKey || apiKey.length < 10) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 400 });
    }
    
    if (!adminPassword || adminPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    
    const configDir = join(process.cwd(), 'config');
    if (!existsSync(configDir)) {
      mkdirSync(configDir, { recursive: true });
    }
    
    const configPath = join(configDir, 'local.json');
    const defaultPath = join(configDir, 'default.json');
    
    let baseConfig = {
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
        password: ""
      }
    };
    
    if (existsSync(defaultPath)) {
      baseConfig = JSON.parse(readFileSync(defaultPath, 'utf-8'));
    }
    
    baseConfig.providers.openrouter.apiKey = apiKey;
    baseConfig.admin = { password: adminPassword };
    if (domain) {
      (baseConfig as any).domain = domain;
    }
    
    writeFileSync(configPath, JSON.stringify(baseConfig, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
  }
}
