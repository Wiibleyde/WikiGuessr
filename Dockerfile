# ============================================
# Stage 1: Dependencies Installation Stage
# ============================================
FROM oven/bun:1 AS dependencies

WORKDIR /app

COPY package.json bun.lock* ./

RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --no-save --frozen-lockfile --ignore-scripts

# ============================================
# Stage 2: Build Next.js application in standalone mode
# ============================================
FROM oven/bun:1 AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

# Generate Prisma client
RUN bunx prisma generate

RUN bun run build

# ============================================
# Stage 3: Run Next.js application
# ============================================
FROM oven/bun:1 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy Prisma schema and migrations for runtime migrate
COPY --from=builder --chown=bun:bun /app/prisma ./prisma
COPY --from=builder --chown=bun:bun /app/prisma.config.ts ./prisma.config.ts

# Copy production assets
COPY --from=builder --chown=bun:bun /app/public ./public

RUN mkdir .next
RUN chown bun:bun .next

# Copy standalone output and static files
COPY --from=builder --chown=bun:bun /app/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/.next/static ./.next/static

# Copy generated Prisma client (needed at runtime)
COPY --from=builder --chown=bun:bun /app/generated ./generated

# Copy node_modules needed for prisma migrate at runtime
COPY --from=builder --chown=bun:bun /app/node_modules ./node_modules

# Copy entrypoint script
COPY --from=builder --chown=bun:bun /app/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh

USER bun

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["bun", "server.js"]
