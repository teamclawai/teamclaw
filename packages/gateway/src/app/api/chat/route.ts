import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

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

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, agentId, conversationId, memberIds } = body;

    console.log('[CHAT] Request:', { agentId, memberIds, messageCount: messages?.length });

    const config = loadConfig();
    const apiKey = config?.providers?.openrouter?.apiKey;

    if (!apiKey) {
      return new Response('API not configured', { status: 401 });
    }

    const model = config?.model || 'openai/gpt-4o-mini';
    const agents = config?.agents || {};

    const openai = createOpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
    });

    let systemPrompt = '';

    if (agentId) {
      const agentConfig = agents[agentId] || {};
      const otherAgents = (memberIds || [])
        .filter((id: string) => id !== agentId)
        .map((id: string) => {
          const a = agents[id] || {};
          return `@${id}: ${a.name || id} - ${a.description || ''}`;
        })
        .join('\n');

      systemPrompt = `${agentConfig.systemPrompt || `You are @${agentId}. ${agentConfig.description || 'You are a helpful AI assistant.'}`}

Only respond if you have something valuable to add to the conversation. Don't respond just to say you're paying attention.

Other agents in this conversation:
${otherAgents || 'None'}`;
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

    console.log('[CHAT] System prompt:', systemPrompt);

    const modelMessages = (messages ?? []).map((msg: { role: string; content: string }) => ({
      role: msg.role as 'user' | 'assistant',
      content: [{ type: 'text' as const, text: msg.content }],
    }));

    console.log('[CHAT] Model messages:', JSON.stringify(modelMessages));

    const result = streamText({
      model: openai(model),
      system: systemPrompt,
      messages: modelMessages,
    });

    console.log('[CHAT] Streaming response...');

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('[CHAT] Error:', error);
    return new Response('Error processing request', { status: 500 });
  }
}
