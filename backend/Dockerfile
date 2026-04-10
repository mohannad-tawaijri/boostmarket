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

# Make start script executable
RUN chmod +x start.sh

# Build
RUN npm run build

# Prune dev dependencies for smaller image
RUN npm prune --production

# Expose port
EXPOSE 10000

# Run migrations then start
CMD ["sh", "start.sh"]
