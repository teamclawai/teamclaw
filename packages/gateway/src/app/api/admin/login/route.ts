import { NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;
    
    const configPath = join(process.cwd(), 'config/local.json');
    
    if (!existsSync(configPath)) {
      return NextResponse.json({ error: 'Not configured' }, { status: 401 });
    }
    
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    
    if (config.admin?.password === password) {
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
