FROM arm64v8/node:17-bullseye as builder

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

FROM arm64v8/node:17-bullseye

RUN mkdir /app && \
    useradd -m user && \
    chown user:user /app

USER user
WORKDIR /app

ENV NPM_CONFIG_PREFIX /home/user/node_modules
ENV PATH /home/user/node_modules/bin:${PATH}
ENV NODE_ENV production

COPY --chown=user:user package*.json ./
COPY --from=builder --chown=user:user /app/.output ./.output

RUN mkdir /home/user/node_modules

RUN npm ci --only=production
EXPOSE 3000
ENV PORT 3000
ENV HOST 0.0.0.0

ENTRYPOINT ["node", ".output/server/index.mjs"] 