FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages

RUN corepack enable && corepack prepare pnpm@latest && pnpm install

COPY . .

RUN pnpm build

ENV NODE_ENV=production
ENV PORT=12345

EXPOSE 12345

CMD ["sh", "-c", "cd packages/gateway && pnpm start"]
