'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderType: 'user' | 'agent';
  timestamp: string;
}

interface StreamingMessage {
  agentId: string;
  content: string;
}

interface MessageListProps {
  messages: Message[];
  streamingMessages?: StreamingMessage[];
}

export function MessageList({ messages, streamingMessages = [] }: MessageListProps) {
  return (
    <ScrollArea className="flex-1 p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.senderType === 'agent' && (
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            )}
            
            <div className={`flex flex-col max-w-[70%] ${message.senderType === 'user' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-slate-700">
                  {message.senderType === 'user' ? 'You' : `@${message.senderId}`}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <Card className={message.senderType === 'user' ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0' : 'bg-white'}>
                <CardContent className="p-3">
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                </CardContent>
              </Card>
            </div>

            {message.senderType === 'user' && (
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-slate-200">
                  <User className="w-4 h-4 text-slate-600" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {streamingMessages.map((msg) => (
          <div key={msg.agentId} className="flex gap-3 justify-start">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <Card className="bg-white">
              <CardContent className="p-3">
                <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                <Loader2 className="w-4 h-4 animate-spin mt-2 text-slate-400" />
              </CardContent>
            </Card>
          </div>
        ))}

        <div id="messages-end" />
      </div>
    </ScrollArea>
  );
}
