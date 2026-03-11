FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build
RUN npm run build

# Prune dev dependencies for smaller image
RUN npm prune --production

# Expose port
EXPOSE 10000

# Run migrations then start
CMD ["sh", "-c", "npx prisma migrate resolve --rolled-back 20260227051129_sync_game_categories 2>/dev/null; npx prisma migrate deploy && node dist/main.js"]
