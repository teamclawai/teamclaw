import { router, publicProcedure, loadConfig } from './trpc';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';

const dataDir = join(process.cwd(), 'data');
const conversationsPath = join(dataDir, 'conversations.json');
const messagesPath = join(dataDir, 'messages.json');

function ensureDataDir() {
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
}

function loadConversations() {
  ensureDataDir();
  if (existsSync(conversationsPath)) {
    return JSON.parse(readFileSync(conversationsPath, 'utf-8'));
  }
  return [];
}

function saveConversations(conversations: any[]) {
  ensureDataDir();
  writeFileSync(conversationsPath, JSON.stringify(conversations, null, 2));
}

function loadMessages() {
  ensureDataDir();
  if (existsSync(messagesPath)) {
    return JSON.parse(readFileSync(messagesPath, 'utf-8'));
  }
  return {};
}

function saveMessages(messages: Record<string, any[]>) {
  ensureDataDir();
  writeFileSync(messagesPath, JSON.stringify(messages, null, 2));
}

const conversationRouter = router({
  list: publicProcedure.query(() => {
    return loadConversations();
  }),

  byId: publicProcedure
    .input(z.string())
    .query(({ input }) => {
      const conversations = loadConversations();
      return conversations.find((c: any) => c.id === input) || null;
    }),

  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      type: z.enum(['group', 'dm']),
      memberIds: z.array(z.string()),
    }))
    .mutation(({ input }) => {
      const conversations = loadConversations();
      
      const newConversation = {
        id: `conv_${Date.now()}`,
        name: input.name,
        type: input.type,
        memberIds: input.memberIds,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      conversations.push(newConversation);
      saveConversations(conversations);

      const messages = loadMessages();
      messages[newConversation.id] = [];
      saveMessages(messages);

      return newConversation;
    }),

  addMember: publicProcedure
    .input(z.object({
      conversationId: z.string(),
      memberId: z.string(),
    }))
    .mutation(({ input }) => {
      const conversations = loadConversations();
      const index = conversations.findIndex((c: any) => c.id === input.conversationId);
      
      if (index === -1) {
        throw new Error('Conversation not found');
      }

      if (!conversations[index].memberIds.includes(input.memberId)) {
        conversations[index].memberIds.push(input.memberId);
        conversations[index].updatedAt = new Date().toISOString();
        saveConversations(conversations);
      }

      return conversations[index];
    }),

  removeMember: publicProcedure
    .input(z.object({
      conversationId: z.string(),
      memberId: z.string(),
    }))
    .mutation(({ input }) => {
      const conversations = loadConversations();
      const index = conversations.findIndex((c: any) => c.id === input.conversationId);
      
      if (index === -1) {
        throw new Error('Conversation not found');
      }

      conversations[index].memberIds = conversations[index].memberIds.filter(
        (id: string) => id !== input.memberId
      );
      conversations[index].updatedAt = new Date().toISOString();
      saveConversations(conversations);

      return conversations[index];
    }),

  delete: publicProcedure
    .input(z.string())
    .mutation(({ input }) => {
      let conversations = loadConversations();
      conversations = conversations.filter((c: any) => c.id !== input);
      saveConversations(conversations);

      const messages = loadMessages();
      delete messages[input];
      saveMessages(messages);

      return { success: true };
    }),
});

const messageRouter = router({
  list: publicProcedure
    .input(z.string())
    .query(({ input: conversationId }) => {
      const messages = loadMessages();
      return messages[conversationId] || [];
    }),

  send: publicProcedure
    .input(z.object({
      conversationId: z.string(),
      content: z.string(),
      senderId: z.string(),
      senderType: z.enum(['user', 'agent']),
      mentions: z.array(z.string()).optional(),
    }))
    .mutation(({ input }) => {
      const messages = loadMessages();
      
      if (!messages[input.conversationId]) {
        messages[input.conversationId] = [];
      }

      const newMessage = {
        id: `msg_${Date.now()}`,
        conversationId: input.conversationId,
        content: input.content,
        senderId: input.senderId,
        senderType: input.senderType,
        mentions: input.mentions || [],
        timestamp: new Date().toISOString(),
      };

      messages[input.conversationId].push(newMessage);
      saveMessages(messages);

      const conversations = loadConversations();
      const convIndex = conversations.findIndex((c: any) => c.id === input.conversationId);
      if (convIndex !== -1) {
        conversations[convIndex].updatedAt = new Date().toISOString();
        saveConversations(conversations);
      }

      return newMessage;
    }),
});

const agentRouter = router({
  list: publicProcedure.query(() => {
    const config = loadConfig();
    
    if (!config || !config.agents) {
      return [];
    }

    return Object.entries(config.agents)
      .filter(([_, agent]: [string, any]) => agent.enabled !== false)
      .map(([id, agent]: [string, any]) => ({
        id,
        name: agent.name || id,
        description: agent.description || '',
        systemPrompt: agent.systemPrompt || '',
      }));
  }),
});

export const appRouter = router({
  conversation: conversationRouter,
  message: messageRouter,
  agent: agentRouter,
});

export type AppRouter = typeof appRouter;
