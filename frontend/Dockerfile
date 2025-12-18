# Development Dockerfile for NestJS Server
FROM node:24.12.0-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy source code
# Note: For hot-reload, mount source as volume in docker-compose
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
