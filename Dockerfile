#### Stage 1: Builder
FROM --platform=linux/amd64 node:18-slim AS builder
WORKDIR /app

# 1) Copy manifest and install ALL dependencies (including dev dependencies for building)
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm \
    && pnpm install --frozen-lockfile --ignore-scripts \
    && pnpm rebuild sharp || true

# 2) Inject build‑time secrets
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}

# 3) Copy source and build Next.js (with all dependencies available)
COPY . .
RUN pnpm build

#### Stage 2: Production Runner
FROM --platform=linux/amd64 node:18-slim AS base
WORKDIR /app

# 4) Copy only production dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm \
    && pnpm install --prod --frozen-lockfile --ignore-scripts \
    && pnpm rebuild sharp || true

# 5) Copy built output from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# 6) Runtime settings
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start", "--", "-p", "3000", "-H", "0.0.0.0"]
