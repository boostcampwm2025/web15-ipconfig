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

# Expose port
EXPOSE 3000


# Start development server with hot-reload
CMD ["npm", "run", "start:dev"]
