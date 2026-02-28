import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;
    
    const configPath = join(process.cwd(), 'config/local.json');
    const rootConfigPath = join(process.cwd(), '../config/local.json');
    
    let config = null;
    let configSource = '';
    
    if (existsSync(configPath)) {
      config = JSON.parse(readFileSync(configPath, 'utf-8'));
      configSource = configPath;
    } else if (existsSync(rootConfigPath)) {
      config = JSON.parse(readFileSync(rootConfigPath, 'utf-8'));
      configSource = rootConfigPath;
    }
    
    if (!config) {
      return NextResponse.json({ error: 'Not configured. Please run setup first.' }, { status: 401 });
    }
    
    const storedHash = config.admin?.passwordHash;
    
    if (!storedHash) {
      return NextResponse.json({ error: 'Not configured. Please run setup first.' }, { status: 401 });
    }
    
    const inputHash = hashPassword(password);
    
    if (constantTimeCompare(storedHash, inputHash)) {
      const token = Buffer.from(`${password}:${Date.now()}`).toString('base64');
      const response = NextResponse.json({ success: true, token });
      response.cookies.set('admin_token', token, { path: '/', maxAge: 86400 });
      return response;
    }
    
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
