export async function triggerAgentResponses(params: {
  conversationId: string;
  messageId: string;
  content: string;
  agentIds: string[];
  memberIds: string[];
}) {
  const { conversationId, messageId, content, agentIds, memberIds } = params;

  console.log('[TRIGGER] Processing agent responses for:', agentIds);

  for (const agentId of agentIds) {
    try {
      const res = await fetch('/api/agent-response/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          messageId,
          content,
          agentId,
          memberIds,
        }),
      });

      if (!res.ok) {
        console.error('[TRIGGER] Failed for agent:', agentId, await res.text());
      }
    } catch (error) {
      console.error('[TRIGGER] Error for agent:', agentId, error);
    }
  }
}
