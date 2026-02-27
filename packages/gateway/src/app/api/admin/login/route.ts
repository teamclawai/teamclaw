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
    
    if (!existsSync(configPath)) {
      return NextResponse.json({ error: 'Not configured' }, { status: 401 });
    }
    
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    const storedHash = config.admin?.passwordHash;
    
    if (!storedHash) {
      return NextResponse.json({ error: 'Not configured' }, { status: 401 });
    }
    
    const inputHash = hashPassword(password);
    
    if (constantTimeCompare(storedHash, inputHash)) {
      return NextResponse.json({ success: true, token: Buffer.from(`${password}:${Date.now()}`).toString('base64') });
    }
    
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
