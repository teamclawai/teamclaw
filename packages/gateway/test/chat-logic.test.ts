import { describe, it, expect } from 'vitest';

describe('Chat API Logic', () => {
  describe('System Prompt Generation', () => {
    function generateSystemPrompt(
      agentId: string | undefined,
      agents: Record<string, { name: string; description: string; systemPrompt?: string }>,
      memberIds: string[]
    ): string {
      if (agentId) {
        const agentConfig = agents[agentId] || {};
        const otherAgents = (memberIds || [])
          .filter((id) => id !== agentId)
          .map((id) => {
            const a = agents[id] || {};
            return `@${id}: ${a.name || id} - ${a.description || ''}`;
          })
          .join('\n');

        return `${agentConfig.systemPrompt || `You are @${agentId}. ${agentConfig.description || 'You are a helpful AI assistant.'}`}

Only respond if you have something valuable to add to the conversation. Don't respond just to say you're paying attention.

Other agents in this conversation:
${otherAgents || 'None'}`;
      }

      const availableAgents = (memberIds || []).map((id) => {
        const agent = agents[id] || {};
        return `@${id}: ${agent.name || id} - ${agent.description || ''}`;
      }).join('\n');

      return `You are TeamClaw, a helpful AI assistant in a group chat.
Available agents in this conversation:
${availableAgents || 'None'}

You may respond if you have valuable input to add, but don't interrupt unnecessarily.`;
    }

    const mockAgents = {
      dev: {
        name: 'Developer',
        description: 'Codes things',
        systemPrompt: 'You are a senior developer',
      },
      review: {
        name: 'Reviewer',
        description: 'Reviews code',
      },
    };

    it('should generate prompt for specific agent', () => {
      const prompt = generateSystemPrompt('dev', mockAgents, ['dev', 'review']);
      expect(prompt).toContain('You are a senior developer');
      expect(prompt).toContain('@review');
    });

    it('should generate default prompt when no agent specified', () => {
      const prompt = generateSystemPrompt(undefined, mockAgents, ['dev', 'review']);
      expect(prompt).toContain('TeamClaw');
      expect(prompt).toContain('@dev');
      expect(prompt).toContain('@review');
    });

    it('should handle missing agent config', () => {
      const prompt = generateSystemPrompt('unknown', mockAgents, ['unknown']);
      expect(prompt).toContain('@unknown');
    });

    it('should handle empty member list', () => {
      const prompt = generateSystemPrompt('dev', mockAgents, []);
      expect(prompt).toContain('None');
    });

    it('should list other agents correctly', () => {
      const prompt = generateSystemPrompt('dev', mockAgents, ['dev', 'review', 'test']);
      expect(prompt).toContain('@review');
      expect(prompt).toContain('@test');
      expect(prompt).not.toContain('@dev: Developer');
    });
  });

  describe('Message Format Conversion', () => {
    function convertToModelMessages(messages: Array<{ role: string; content: string }>) {
      return (messages ?? []).map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: [{ type: 'text' as const, text: msg.content }],
      }));
    }

    it('should convert user message', () => {
      const result = convertToModelMessages([{ role: 'user', content: 'Hello' }]);
      expect(result).toHaveLength(1);
      expect(result[0].role).toBe('user');
      expect(result[0].content[0].text).toBe('Hello');
    });

    it('should convert assistant message', () => {
      const result = convertToModelMessages([{ role: 'assistant', content: 'Hi there' }]);
      expect(result[0].role).toBe('assistant');
    });

    it('should handle multiple messages', () => {
      const result = convertToModelMessages([
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi' },
        { role: 'user', content: 'How are you?' },
      ]);
      expect(result).toHaveLength(3);
    });

    it('should handle empty messages', () => {
      const result = convertToModelMessages([]);
      expect(result).toHaveLength(0);
    });

    it('should handle undefined messages', () => {
      const result = convertToModelMessages(undefined as any);
      expect(result).toHaveLength(0);
    });
  });
});
