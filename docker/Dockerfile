FROM node:23-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PNPM_POSTINSTALL_ENABLE=false
ENV HOME=/usr/src/app 

RUN corepack enable

WORKDIR /usr/src/app

FROM base AS build

COPY package.json pnpm-lock.yaml ecosystem.config.cjs ./
COPY src/ src/
COPY tsconfig.json ./
COPY drizzle.config.ts ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm build

FROM base AS production

WORKDIR /usr/src/app

ENV COREPACK_HOME=/usr/src/app/.cache/corepack
RUN mkdir -p $COREPACK_HOME && chmod -R 777 $COREPACK_HOME

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=build --chown=hono:nodejs /usr/src/app/node_modules/ ./node_modules/
COPY --from=build --chown=hono:nodejs /usr/src/app/package.json ./
COPY --from=build --chown=hono:nodejs /usr/src/app/pnpm-lock.yaml ./
COPY --from=build --chown=hono:nodejs /usr/src/app/dist/ ./  

COPY --from=build --chown=hono:nodejs /usr/src/app/ecosystem.config.cjs ./
COPY scripts/entrypoint.sh /usr/src/app/entrypoint.sh

RUN chown -R hono:nodejs /usr/src/app
RUN chmod +x ./entrypoint.sh

USER hono
EXPOSE 3001

CMD ["/usr/src/app/entrypoint.sh"]
