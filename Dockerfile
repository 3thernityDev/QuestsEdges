# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY tsconfig.json ./
COPY src ./src/

# Generate Prisma client and build
ARG DATABASE_URL=mysql://user:pass@localhost:3306/db
ENV DATABASE_URL=${DATABASE_URL}
RUN npx prisma generate && npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files and install ALL dependencies (tsx needed for runtime)
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy Prisma schema and generate client
COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY tsconfig.json ./
ARG DATABASE_URL=mysql://user:pass@localhost:3306/db
ENV DATABASE_URL=${DATABASE_URL}
RUN npx prisma generate

# Copy source code (tsx runs TypeScript directly)
COPY --from=builder /app/src ./src

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start application with tsx (handles ESM imports properly)
CMD ["npx", "tsx", "src/index.ts"]
