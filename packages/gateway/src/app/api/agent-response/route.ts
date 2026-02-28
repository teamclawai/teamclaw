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

function saveMessage(data: { conversationId: string; content: string; senderId: string; senderType: string; mentions: string[] }) {
  const messagesPath = join(process.cwd(), 'data/messages.json');
  const messages = existsSync(messagesPath) 
    ? JSON.parse(readFileSync(messagesPath, 'utf-8'))
    : [];
  
  const newMessage = {
    id: `msg_${Date.now()}`,
    ...data,
    timestamp: new Date().toISOString(),
  };
  
  messages.push(newMessage);
  require('fs').writeFileSync(messagesPath, JSON.stringify(messages, null, 2));
  return newMessage;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { conversationId, content, senderId, senderType, mentions } = body;

    const message = saveMessage({
      conversationId,
      content,
      senderId,
      senderType,
      mentions: mentions || [],
    });

    console.log('[API] Saved message from', senderId);

    return Response.json({ success: true, message });
  } catch (error) {
    console.error('[API] Error saving message:', error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
