import type { Message, RouteResult } from './types.js';

const MENTION_REGEX = /@(\w+)/g;

export function parseMentions(content: string): string[] {
  const matches = content.matchAll(MENTION_REGEX);
  return Array.from(matches, (m) => m[1]);
}

export function classifyTask(content: string): 'simple' | 'complex' {
  const complexIndicators = [
    'and then',
    'also need to',
    'multiple',
    'several',
    'workflow',
    'step',
    'first',
    'then',
    'after that',
    'subtask',
  ];
  const lower = content.toLowerCase();
  return complexIndicators.some((ind) => lower.includes(ind)) ? 'complex' : 'simple';
}

export function routeMessage(
  message: Message,
  agentIds: string[]
): RouteResult {
  const mentions = message.mentions;
  
  if (mentions.length === 0) {
    return { type: 'direct', agentId: agentIds[0], task: message.content };
  }

  const targetAgent = mentions[0];
  if (!agentIds.includes(targetAgent)) {
    return { type: 'direct', agentId: agentIds[0], task: message.content };
  }

  const taskType = classifyTask(message.content);
  
  if (taskType === 'simple') {
    return { type: 'direct', agentId: targetAgent, task: message.content };
  }

  return { type: 'workflow', task: message.content };
}
