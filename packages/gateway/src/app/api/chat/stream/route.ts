import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const configPath = join(process.cwd(), 'config/local.json');
const rootConfigPath = join(process.cwd(), '../config/local.json');

function loadConfig() {
  if (existsSync(configPath)) {
    return JSON.parse(readFileSync(configPath, 'utf-8'));
  } else if (existsSync(rootConfigPath)) {
    return JSON.parse(readFileSync(rootConfigPath, 'utf-8'));
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const { message, mentionedAgents, memberIds } = await request.json();
    
    const config = loadConfig();
    const apiKey = config?.providers?.openrouter?.apiKey;
    
    if (!apiKey) {
      return new Response('API not configured', { status: 401 });
    }

    const model = config?.model || 'openai/gpt-4o-mini';
    const agents = config?.agents || {};
    const mentioned = mentionedAgents || [];
    
    let systemPrompt = '';
    
    if (mentioned.length > 0) {
      const primaryAgent = mentioned[0];
      const agentConfig = agents[primaryAgent] || {};
      
      systemPrompt = agentConfig.systemPrompt || `You are @${primaryAgent}. ${agentConfig.description || 'You are a helpful AI assistant.'}`;
      
      if (mentioned.length > 1) {
        const otherAgents = mentioned.slice(1).map((id: string) => {
          const a = agents[id] || {};
          return `@${id}: ${a.name || id} - ${a.description || ''}`;
        }).join('\n');
        
        systemPrompt += `\n\nOther agents in this conversation: ${otherAgents}`;
      }
    } else {
      const availableAgents = (memberIds || []).map((id: string) => {
        const agent = agents[id] || {};
        return `@${id}: ${agent.name || id} - ${agent.description || ''}`;
      }).join('\n');
      
      systemPrompt = `You are TeamClaw, a helpful AI assistant in a group chat.
Available agents in this conversation:
${availableAgents || 'None'}

You may respond if you have valuable input to add, but don't interrupt unnecessarily.`;
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://teamclaw.io',
        'X-Title': 'TeamClaw',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 4096,
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(error, { status: 500 });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat stream error:', error);
    return new Response('Error processing request', { status: 500 });
  }
}
