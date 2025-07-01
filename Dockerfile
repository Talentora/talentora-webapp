# ─── Stage 1: Build Stage ─────────────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# 1) Copy package manifests + lockfiles
COPY package.json package-lock.json pnpm-lock.yaml ./

# 2) Install npm deps, then pnpm deps
RUN npm ci -q \
    && npm install -g pnpm@latest \
    && pnpm install --frozen-lockfile --reporter=silent

# 3) Copy source & build
COPY . .
RUN npm run build

# ─── Stage 2: Runtime Stage ───────────────────────────────────────────────────
FROM node:18-alpine AS runner

WORKDIR /app

# 1) Bring in only what’s needed to run your built app:
COPY --from=builder /app/package.json       ./package.json
COPY --from=builder /app/node_modules       ./node_modules
COPY --from=builder /app/.next              ./.next
COPY --from=builder /app/public             ./public
COPY --from=builder /app/next.config.js     ./next.config.js

# 2) Runtime settings
ENV PORT=3000
EXPOSE 3000

# 3) Start the production server
CMD ["npm", "start"]

