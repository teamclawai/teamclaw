import { serve } from 'inngest/next';
import { inngest, processAgentMessage } from '@/lib/inngest';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processAgentMessage],
});
