# syntax=docker/dockerfile:1
FROM --platform=$BUILDPLATFORM node:18-slim AS base
WORKDIR /app

# 1) Copy only manifest so you could install prod deps here if desired:
COPY package.json pnpm-lock.yaml ./

# 2) Option A: install prod-only deps in the image (still no build):
RUN npm install -g pnpm \
    && pnpm install --prod

# 3) Copy the built Next.js output from the runner:
COPY .next .next
COPY public public
COPY next.config.js ./

# 4) (Optional) If you pruned on the runner instead, you could instead:
COPY node_modules node_modules

EXPOSE 3000
CMD ["pnpm", "start"]
