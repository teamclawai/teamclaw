import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function GET() {
  const configPath = join(process.cwd(), 'config/local.json');
  const config = existsSync(configPath) 
    ? JSON.parse(readFileSync(configPath, 'utf-8'))
    : { agents: {} };
  
  const agents = Object.entries(config.agents || {}).map(([id, data]: [string, any]) => ({
    id,
    name: data.name || id,
    description: data.description || '',
    enabled: data.enabled !== false,
  }));

  return NextResponse.json(agents);
}
