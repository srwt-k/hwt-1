# Dockerfile
# ── Builder ──────────────────────────────────────────────────────────
FROM oven/bun:1 AS builder
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json bun.lock prisma.config.ts ./
RUN bun install --frozen-lockfile

COPY . .

ENV DATABASE_URL="mysql://dummy:dummy@localhost:3306/dummy"
RUN bunx prisma generate

RUN bun run build

# ── Runner ────────────────────────────────────────────────────────────────
FROM oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

# Set up necessary directories and permissions for Next.js
RUN mkdir -p .next && \
    chown nextjs:nodejs .next

# Copy built output
COPY --from=builder /app/public          ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static    ./.next/static

# Copy Prisma generated client
COPY --from=builder /app/prisma          ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/lib/db.ts      ./lib/db.ts
COPY --from=builder /app/node_modules   ./node_modules
COPY --from=builder /app/tsconfig.json  ./tsconfig.json

USER nextjs

ENV PORT=3000

CMD ["bun", "server.js"]
