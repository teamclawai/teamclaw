import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export async function GET() {
  const configPath = join(process.cwd(), 'config/local.json');
  const defaultPath = join(process.cwd(), 'config/default.json');
  
  const hasLocal = existsSync(configPath);
  const config = hasLocal ? JSON.parse(readFileSync(configPath, 'utf-8')) : {};
  
  const hasApiKey = config.providers?.openrouter?.apiKey?.length > 0;
  
  const defaultConfig = existsSync(defaultPath) 
    ? JSON.parse(readFileSync(defaultPath, 'utf-8'))
    : { channels: { web: { config: { port: 12345 } } } };
  
  return NextResponse.json({
    configured: hasApiKey,
    port: config.channels?.web?.config?.port || defaultConfig.channels?.web?.config?.port || 12345,
    hasApiKey,
    agentsCount: config.agents ? Object.keys(config.agents).length : 0,
    domain: config.domain || ''
  });
}
