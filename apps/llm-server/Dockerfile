# LLM Server Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create models directory
RUN mkdir -p models

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
