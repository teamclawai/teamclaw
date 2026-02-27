FROM node:22-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Dependencies
FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml ./
COPY package.json ./
RUN pnpm install --frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 teamclaw

COPY --from=builder /app/packages/gateway/standalone ./
COPY --from=builder /app/packages/gateway/.next/static ./.next/static
COPY --from=builder /app/config ./config
COPY --from=builder /app/data ./data

USER teamclaw

EXPOSE 12345

ENV PORT=12345
ENV HOST=0.0.0.0

CMD ["node", "server.js"]
