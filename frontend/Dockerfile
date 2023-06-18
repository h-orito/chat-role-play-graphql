FROM arm64v8/node:19.9-bullseye

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY src src
COPY tsconfig.json tsconfig.json
COPY package*.json ./
COPY next.config.js next.config.js
COPY public public

ARG AUTH0_AUDIENCE
ENV NEXT_PUBLIC_AUTH0_AUDIENCE=${AUTH0_AUDIENCE}
ARG AUTH0_CLIENT_ID
ENV NEXT_PUBLIC_AUTH0_CLIENT_ID=${AUTH0_CLIENT_ID}
ARG AUTH0_DOMAIN
ENV NEXT_PUBLIC_AUTH0_DOMAIN=${AUTH0_DOMAIN}
ARG GRAPHQL_ENDPOINT
ENV NEXT_PUBLIC_GRAPHQL_ENDPOINT=${GRAPHQL_ENDPOINT}

RUN npm ci
RUN npm run build

ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOST 0.0.0.0

CMD ["npm", "start"]