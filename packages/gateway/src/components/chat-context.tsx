'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Chat } from '@ai-sdk/react';
import { DefaultChatTransport, UIMessage } from 'ai';

interface Agent {
  id: string;
  name: string;
  systemPrompt?: string;
}

interface ChatContextValue {
  getChatForAgent: (agentId: string) => Chat<UIMessage>;
  createAgentChat: (agentId: string, systemPrompt: string) => Chat<UIMessage>;
  clearChats: () => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

function createChat(agentId: string) {
  return new Chat<UIMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Map<string, Chat<UIMessage>>>(new Map());

  const getChatForAgent = useCallback((agentId: string): Chat<UIMessage> => {
    if (!chats.has(agentId)) {
      return createChat(agentId);
    }
    return chats.get(agentId)!;
  }, [chats]);

  const createAgentChat = useCallback((agentId: string, _systemPrompt: string): Chat<UIMessage> => {
    const chat = createChat(agentId);
    setChats(prev => new Map(prev).set(agentId, chat));
    return chat;
  }, []);

  const clearChats = useCallback(() => {
    setChats(new Map());
  }, []);

  return (
    <ChatContext.Provider
      value={{
        getChatForAgent,
        createAgentChat,
        clearChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useTeamChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useTeamChat must be used within a ChatProvider');
  }
  return context;
}
