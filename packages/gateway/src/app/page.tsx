'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatInput } from '@/components/chat-input';
import { MessageList } from '@/components/message-list';
import { triggerAgentResponses } from '@/lib/agent-events';
import { 
  Bot, 
  User, 
  Settings, 
  Sparkles,
  Plus,
  Hash,
  Trash2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Agent {
  id: string;
  name: string;
  description: string;
  systemPrompt?: string;
  enabled?: boolean;
}

interface Conversation {
  id: string;
  name: string;
  type: 'group' | 'dm';
  memberIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  conversationId: string;
  content: string;
  senderId: string;
  senderType: 'user' | 'agent';
  mentions: string[];
  timestamp: string;
}

interface StreamingMessage {
  agentId: string;
  content: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: agents = [] } = trpc.agent.list.useQuery();
  const { data: conversations = [], refetch: refetchConversations } = trpc.conversation.list.useQuery();
  const { data: messages = [], refetch: refetchMessages } = trpc.message.list.useQuery(
    selectedConversationId || '',
    { enabled: !!selectedConversationId }
  );

  const createConversation = trpc.conversation.create.useMutation({
    onSuccess: (data) => {
      refetchConversations();
      setIsCreatingGroup(false);
      setNewGroupName('');
      setSelectedMembers([]);
      setSelectedConversationId(data.id);
    },
  });

  const sendMessage = trpc.message.send.useMutation({
    onSuccess: () => {
      refetchMessages();
    },
  });

  const deleteConversation = trpc.conversation.delete.useMutation({
    onSuccess: () => {
      refetchConversations();
      if (selectedConversationId) {
        setSelectedConversationId(null);
      }
    },
  });

  const selectedConversation = conversations.find((c: Conversation) => c.id === selectedConversationId);
  const enabledAgents = agents.filter((a: Agent) => a.enabled !== false);

  useEffect(() => {
    if (conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCreateGroup = () => {
    if (!newGroupName.trim() || selectedMembers.length === 0) return;
    
    createConversation.mutate({
      name: newGroupName,
      type: 'group',
      memberIds: selectedMembers,
    });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !selectedConversationId || isLoading) return;

    const mentions = extractMentions(content);
    const mentionedAgents = mentions.filter(m => selectedConversation?.memberIds.includes(m));

    const agentIds = mentionedAgents.length > 0 
      ? mentionedAgents 
      : selectedConversation?.memberIds.filter((id: string) => enabledAgents.some((a: Agent) => a.id === id)) || [];

    await sendMessage.mutateAsync({
      conversationId: selectedConversationId,
      content,
      senderId: 'user',
      senderType: 'user',
      mentions,
    });

    if (agentIds.length > 0) {
      setIsLoading(true);
      await triggerAgentResponses({
        conversationId: selectedConversationId,
        messageId: `msg_${Date.now()}`,
        content,
        agentIds,
        memberIds: selectedConversation?.memberIds || [],
      });
      
      setTimeout(() => {
        refetchMessages();
        setIsLoading(false);
      }, 3000);
    } else {
      refetchMessages();
    }
  };

  const extractMentions = (content: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]);
    }
    return mentions;
  };

  const startDM = (agentId: string) => {
    const existingDM = conversations.find(
      (c: Conversation) => c.type === 'dm' && c.memberIds.includes(agentId) && c.memberIds.length === 1
    );

    if (existingDM) {
      setSelectedConversationId(existingDM.id);
      return;
    }

    createConversation.mutate({
      name: `@${agentId}`,
      type: 'dm',
      memberIds: [agentId],
    });
  };

  const toggleMemberSelection = (agentId: string) => {
    setSelectedMembers(prev => 
      prev.includes(agentId) 
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    );
  };

  const groupConversations = conversations.filter((c: Conversation) => c.type === 'group');
  const dmConversations = conversations.filter((c: Conversation) => c.type === 'dm');

  const isAgentMember = (memberId: string) => {
    return enabledAgents.some((a: Agent) => a.id === memberId);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900">TeamClaw</h1>
              <p className="text-xs text-slate-500">Multi-Agent Chat</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => router.push('/admin')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Admin Settings
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Channels</h3>
              <Dialog open={isCreatingGroup} onOpenChange={setIsCreatingGroup}>
                <DialogTrigger asChild>
                  <button className="text-slate-400 hover:text-slate-600">
                    <Plus className="w-4 h-4" />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Channel</DialogTitle>
                    <DialogDescription>
                      Create a group channel to chat with multiple agents.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Channel Name</label>
                      <Input 
                        placeholder="e.g., dev-team" 
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Add Agents</label>
                      <div className="flex flex-wrap gap-2">
                        {enabledAgents.map((agent: Agent) => (
                          <Badge
                            key={agent.id}
                            variant={selectedMembers.includes(agent.id) ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => toggleMemberSelection(agent.id)}
                          >
                            @{agent.id}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreatingGroup(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateGroup}
                      disabled={!newGroupName.trim() || selectedMembers.length === 0}
                    >
                      Create Channel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-1 mb-6">
              {groupConversations.map((conv: Conversation) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversationId(conv.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedConversationId === conv.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Hash className="w-4 h-4" />
                  <span className="flex-1 text-left truncate">{conv.name}</span>
                  <div className="flex items-center gap-1">
                    {conv.memberIds.slice(0, 2).map((memberId: string) => (
                      <span key={memberId}>
                        {isAgentMember(memberId) ? (
                          <Bot className="w-3 h-3 text-blue-500" />
                        ) : (
                          <User className="w-3 h-3 text-slate-400" />
                        )}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
              {groupConversations.length === 0 && (
                <p className="text-xs text-slate-400 px-3">No channels yet</p>
              )}
            </div>

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Direct Messages</h3>
            </div>

            <div className="space-y-1 mb-6">
              {dmConversations.map((conv: Conversation) => {
                const agentId = conv.memberIds[0];
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversationId(conv.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedConversationId === conv.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Bot className="w-4 h-4 text-blue-500" />
                    <span className="flex-1 text-left truncate">@{agentId}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Agents</h3>
            </div>

            <div className="space-y-1">
              {enabledAgents.map((agent: Agent) => (
                <button
                  key={agent.id}
                  onClick={() => startDM(agent.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Avatar className="w-5 h-5">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                      {agent.id[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1 text-left">@{agent.id}</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                {selectedConversation.type === 'group' ? (
                  <Hash className="w-5 h-5 text-slate-400" />
                ) : (
                  <Bot className="w-5 h-5 text-blue-500" />
                )}
                <div>
                  <h2 className="font-bold text-slate-900">
                    {selectedConversation.type === 'group' ? '# ' : '@'}{selectedConversation.name}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{selectedConversation.memberIds.length} members:</span>
                    <div className="flex items-center gap-1">
                      {selectedConversation.memberIds.slice(0, 4).map((memberId: string) => (
                        <span key={memberId}>
                          {isAgentMember(memberId) ? (
                            <Bot className="w-3 h-3 text-blue-500" />
                          ) : (
                            <User className="w-3 h-3 text-slate-400" />
                          )}
                        </span>
                      ))}
                      {selectedConversation.memberIds.length > 4 && (
                        <span>+{selectedConversation.memberIds.length - 4}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {selectedConversation.memberIds.slice(0, 3).map((memberId: string) => (
                    <Avatar key={memberId} className="w-7 h-7 border-2 border-white">
                      <AvatarFallback className={isAgentMember(memberId) ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs" : "bg-slate-200 text-slate-600 text-xs"}>
                        {memberId[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {selectedConversation.memberIds.length > 3 && (
                    <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs text-slate-600">
                      +{selectedConversation.memberIds.length - 3}
                    </div>
                  )}
                </div>
                {selectedConversation.type === 'group' && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteConversation.mutate(selectedConversation.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
            </div>

            <MessageList 
              messages={messages.map((m: Message) => ({
                id: m.id,
                content: m.content,
                senderId: m.senderId,
                senderType: m.senderType,
                timestamp: m.timestamp,
              }))}
            />

            <div className="p-4 bg-white border-t border-slate-200">
              <div className="max-w-4xl mx-auto">
                <ChatInput 
                  onSend={handleSendMessage}
                  isLoading={isLoading}
                  placeholder={`Message ${selectedConversation.type === 'group' ? '#' : '@'}${selectedConversation.name}...`}
                />
                <p className="text-xs text-slate-400 mt-2 text-center">
                  Press Enter to send, Shift+Enter for new line
                  {selectedConversation.type === 'group' && ' • All agents will respond in parallel'}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Welcome to TeamClaw</h3>
              <p className="text-slate-500 mb-4">Select a channel or start a new conversation</p>
              <Button onClick={() => setIsCreatingGroup(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Channel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
