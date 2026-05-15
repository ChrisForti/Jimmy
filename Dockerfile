# Multi-stage build for efficient image size
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY src ./src
COPY drizzle ./drizzle
COPY drizzle.config.ts ./
COPY migrate.ts ./

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built application and migration files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/migrate.ts ./

# Copy environment template (actual .env mounted as volume)
COPY .env.example ./

# Create data directory for agent sessions
RUN mkdir -p /app/data

# Set NODE_ENV
ENV NODE_ENV=production

# Expose port (if needed for health checks or API)
EXPOSE 3141

# Run the agent
CMD ["node", "dist/index.js"]
