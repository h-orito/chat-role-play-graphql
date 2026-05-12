FROM arm64v8/node:24-bookworm

# pnpm をインストール
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY src src
COPY tsconfig.json tsconfig.json
COPY package.json pnpm-lock.yaml .npmrc ./
COPY next.config.ts next.config.ts
COPY tailwind.config.js tailwind.config.js
COPY postcss.config.js postcss.config.js
COPY public public

ARG AUTH0_AUDIENCE
ENV NEXT_PUBLIC_AUTH0_AUDIENCE=${AUTH0_AUDIENCE}
ARG AUTH0_CLIENT_ID
ENV NEXT_PUBLIC_AUTH0_CLIENT_ID=${AUTH0_CLIENT_ID}
ARG AUTH0_DOMAIN
ENV NEXT_PUBLIC_AUTH0_DOMAIN=${AUTH0_DOMAIN}
ARG GRAPHQL_ENDPOINT
ENV NEXT_PUBLIC_GRAPHQL_ENDPOINT=${GRAPHQL_ENDPOINT}
ARG GRAPHQL_INNER_ENDPOINT
ENV NEXT_PUBLIC_GRAPHQL_INNER_ENDPOINT=${GRAPHQL_INNER_ENDPOINT}

RUN pnpm install --frozen-lockfile

ENV NODE_ENV=production
RUN pnpm build

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
ENV HOME=/home/nextjs
RUN mkdir -p /home/nextjs/.cache \
    && chown -R nextjs:nodejs /home/nextjs
# permission denied対策
RUN chown nextjs:nodejs /app/.next/cache

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0

CMD ["pnpm", "start"]
