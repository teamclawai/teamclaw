import { initTRPC } from '@trpc/server';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const configPath = join(process.cwd(), 'config/local.json');
const rootConfigPath = join(process.cwd(), '../config/local.json');

export function loadConfig() {
  if (existsSync(configPath)) {
    return JSON.parse(readFileSync(configPath, 'utf-8'));
  } else if (existsSync(rootConfigPath)) {
    return JSON.parse(readFileSync(rootConfigPath, 'utf-8'));
  }
  return null;
}

export function saveConfig(config: any) {
  const dir = join(process.cwd(), 'config');
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export type Context = {
  config: ReturnType<typeof loadConfig>;
};

export const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
