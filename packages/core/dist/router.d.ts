import type { Message, RouteResult } from './types.js';
export declare function parseMentions(content: string): string[];
export declare function classifyTask(content: string): 'simple' | 'complex';
export declare function routeMessage(message: Message, agentIds: string[]): RouteResult;
//# sourceMappingURL=router.d.ts.map