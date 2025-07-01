# ─── Single‐Stage Build & Run ─────────────────────────────────────────────────
FROM node:18-alpine

# 1) Set the working dir
WORKDIR /app

# 2) Copy manifest + lockfiles first (for caching if they change)
COPY package.json package-lock.json pnpm-lock.yaml ./

# 3) Install deps: npm ci → install pnpm → pnpm install
RUN npm ci -q \
    && npm install -g pnpm@latest \
    && pnpm install --frozen-lockfile --reporter=silent

# 4) Copy the rest of your source & build
COPY . .
RUN npm run build

# 5) Expose & run
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]
