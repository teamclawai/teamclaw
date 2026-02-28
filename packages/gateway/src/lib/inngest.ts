import { Inngest } from 'inngest';
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

export const inngest = new Inngest({
  id: 'teamclaw',
  eventKey: process.env.INNGEST_EVENT_KEY || 'teamclaw-dev-key',
});

interface ProcessAgentMessageEvent {
  name: 'agent/message.process';
  data: {
    conversationId: string;
    messageId: string;
    content: string;
    agentId: string;
    memberIds: string[];
  };
}

export const processAgentMessage = inngest.createFunction(
  { id: 'process-agent-message' },
  { event: 'agent/message.process' },
  async ({ event }) => {
    const { conversationId, content, agentId, memberIds } = event.data;
    
    const config = loadConfig();
    const apiKey = config?.providers?.openrouter?.apiKey;
    
    if (!apiKey) {
      console.error('[INNGEST] No API key configured');
      return { success: false, error: 'API not configured' };
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

    console.log('[INNGEST] Processing for agent:', agentId);

    const result = streamText({
      model: openai(model),
      system: systemPrompt,
      messages: modelMessages,
    });

    let fullContent = '';
    
    for await (const chunk of result.textStream) {
      fullContent += chunk;
    }

    console.log('[INNGEST] Response for', agentId, ':', fullContent.slice(0, 100));

    if (fullContent.length > 0 && fullContent.length < 500) {
      const lowerContent = fullContent.toLowerCase();
      if (lowerContent.includes("don't have") || 
          lowerContent.includes("nothing to add") ||
          lowerContent.includes("no response") ||
          lowerContent.includes("i won't respond") ||
          lowerContent.includes("i'll pass") ||
          lowerContent.includes("no code") ||
          lowerContent.includes("provide the code")) {
        console.log('[INNGEST] Agent chose not to respond');
        return { success: true, responded: false };
      }
    }

    return {
      success: true,
      responded: true,
      content: fullContent,
      agentId,
      conversationId,
    };
  }
);
