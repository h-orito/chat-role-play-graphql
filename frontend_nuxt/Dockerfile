FROM arm64v8/node:19.9-bullseye

WORKDIR /app

COPY src src
COPY tsconfig.json tsconfig.json
COPY package*.json ./
COPY nuxt.config.ts nuxt.config.ts

ARG AUTH0_AUDIENCE
ENV AUTH0_AUDIENCE=${AUTH0_AUDIENCE}
ARG AUTH0_CLIENT_ID
ENV AUTH0_CLIENT_ID=${AUTH0_CLIENT_ID}
ARG AUTH0_DOMAIN
ENV AUTH0_DOMAIN=${AUTH0_DOMAIN}
ARG GRAPHQL_ENDPOINT
ENV GRAPHQL_ENDPOINT=${GRAPHQL_ENDPOINT}

RUN npm ci
RUN npm run build

EXPOSE 3000
ENV PORT 3000
ENV HOST 0.0.0.0

ENTRYPOINT ["node", "/app/.output/server/index.mjs"] 