import { readFileSync, existsSync, writeFileSync } from 'fs';
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

function saveMessage(data: { conversationId: string; content: string; senderId: string; senderType: string; mentions: string[] }) {
  const messagesPath = join(process.cwd(), 'data/messages.json');
  let messages: any[] = [];
  
  if (existsSync(messagesPath)) {
    try {
      const parsed = JSON.parse(readFileSync(messagesPath, 'utf-8'));
      messages = Array.isArray(parsed) ? parsed : [];
    } catch {
      messages = [];
    }
  }
  
  const newMessage = {
    id: `msg_${Date.now()}`,
    ...data,
    timestamp: new Date().toISOString(),
  };
  
  messages.push(newMessage);
  writeFileSync(messagesPath, JSON.stringify(messages, null, 2));
  return newMessage;
}

export async function POST(req: Request) {
  try {
    const { conversationId, content, agentId, memberIds } = await req.json();

    console.log('[TRIGGER] Processing for agent:', agentId);

    const config = loadConfig();
    const apiKey = config?.providers?.openrouter?.apiKey;
    
    if (!apiKey) {
      return Response.json({ success: false, error: 'API not configured' }, { status: 401 });
    }

    const model = config?.model || 'openai/gpt-4o-mini';
    const agents = config?.agents || {};

    const openai = createOpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
    });

    const agentConfig = agents[agentId] || {};
    const otherAgents = (memberIds || [])
      .filter((id: string) => id !== agentId)
      .map((id: string) => {
        const a = agents[id] || {};
        return `@${id}: ${a.name || id} - ${a.description || ''}`;
      })
      .join('\n');

    const systemPrompt = `${agentConfig.systemPrompt || `You are @${agentId}. ${agentConfig.description || 'You are a helpful AI assistant.'}`}

Only respond if you have something valuable to add to the conversation. Don't respond just to say you're paying attention.

Other agents in this conversation:
${otherAgents || 'None'}`;

    const modelMessages = [{
      role: 'user' as const,
      content: [{ type: 'text' as const, text: content }],
    }];

    const result = streamText({
      model: openai(model),
      system: systemPrompt,
      messages: modelMessages,
    });

    let fullContent = '';
    
    for await (const chunk of result.textStream) {
      fullContent += chunk;
    }

    console.log('[TRIGGER] Response for', agentId, ':', fullContent.slice(0, 50));

    if (fullContent.length > 0 && fullContent.length < 500) {
      const lowerContent = fullContent.toLowerCase();
      if (lowerContent.includes("don't have") || 
          lowerContent.includes("nothing to add") ||
          lowerContent.includes("no response") ||
          lowerContent.includes("i won't respond") ||
          lowerContent.includes("i'll pass") ||
          lowerContent.includes("no code") ||
          lowerContent.includes("provide the code")) {
        console.log('[TRIGGER] Agent chose not to respond');
        return Response.json({ success: true, responded: false });
      }
    }

    if (fullContent.trim()) {
      saveMessage({
        conversationId,
        content: fullContent,
        senderId: agentId,
        senderType: 'agent',
        mentions: [],
      });
      console.log('[TRIGGER] Saved message from', agentId);
    }

    return Response.json({ success: true, responded: true });
  } catch (error) {
    console.error('[TRIGGER] Error:', error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
