// scripts/setup-rag.js - RAG Setup Script
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Setting up RAG system...');

// 1. Install required dependencies
console.log('📦 Installing dependencies...');
const dependencies = [
  'openai',
  '@qdrant/js-client-rest',
  'ioredis',
  'uuid',
  'bullmq'
];

try {
  dependencies.forEach(dep => {
    console.log(`Installing ${dep}...`);
    execSync(`npm install ${dep}`, { stdio: 'inherit' });
  });
} catch (error) {
  console.error('Error installing dependencies:', error);
  process.exit(1);
}

// 2. Create environment variables template
console.log('🔧 Creating environment template...');
const envTemplate = `
# RAG System Configuration
OPENAI_API_KEY=your_openai_api_key_here
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your_qdrant_api_key_here
REDIS_URL=redis://localhost:6379

# RAG Settings
EMBEDDING_MODEL=text-embedding-3-small
LLM_MODEL=gpt-4o-mini
SIMILARITY_THRESHOLD=0.75
TOP_K=5
RATE_LIMIT_POINTS=20
RATE_LIMIT_DURATION=60
`;

const envPath = path.join(process.cwd(), '.env.rag');
fs.writeFileSync(envPath, envTemplate);
console.log(`✅ Environment template created: ${envPath}`);

// 3. Create Docker Compose for Qdrant and Redis
console.log('🐳 Creating Docker Compose for services...');
const dockerCompose = `version: '3.8'
services:
  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_storage:/qdrant/storage
    environment:
      - QDRANT__SERVICE__HTTP_PORT=6333
      - QDRANT__SERVICE__GRPC_PORT=6334

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

volumes:
  qdrant_storage:
  redis_data:`;

const dockerPath = path.join(process.cwd(), 'docker-compose.rag.yml');
fs.writeFileSync(dockerPath, dockerCompose);
console.log(`✅ Docker Compose created: ${dockerPath}`);

// 4. Create setup instructions
console.log('📝 Creating setup instructions...');
const instructions = `# RAG System Setup Instructions

## 1. Environment Setup
1. Copy .env.rag to .env.local
2. Add your OpenAI API key
3. Configure Qdrant and Redis URLs

## 2. Start Services
\`\`\`bash
# Start Qdrant and Redis
docker-compose -f docker-compose.rag.yml up -d

# Or start individually:
# docker run -p 6333:6333 qdrant/qdrant
# docker run -p 6379:6379 redis:7-alpine
\`\`\`

## 3. Initialize Vector Database
\`\`\`bash
# Create collection (this will be done automatically on first API call)
curl -X POST http://localhost:3004/api/rag/ingest \\
  -H "Content-Type: application/json" \\
  -d '{"text": "This is a test document", "metadata": {"source": "test"}}'
\`\`\`

## 4. Test RAG System
\`\`\`bash
# Test chat endpoint
curl -X POST http://localhost:3004/api/rag/chat \\
  -H "Content-Type: application/json" \\
  -d '{"message": "What is this about?", "sessionId": "test"}'
\`\`\`

## 5. Monitor Services
- Qdrant UI: http://localhost:6333/dashboard
- Redis CLI: redis-cli -h localhost -p 6379

## 6. Production Deployment
For production, consider:
- Managed Qdrant Cloud or Pinecone
- Managed Redis (AWS ElastiCache, etc.)
- Proper environment variable management
- SSL/TLS configuration
- Load balancing`;

const instructionsPath = path.join(process.cwd(), 'RAG-SETUP.md');
fs.writeFileSync(instructionsPath, instructions);
console.log(`✅ Setup instructions created: ${instructionsPath}`);

console.log('🎉 RAG system setup complete!');
console.log('📖 Next steps:');
console.log('1. Review .env.rag and configure your API keys');
console.log('2. Start services with: docker-compose -f docker-compose.rag.yml up -d');
console.log('3. Test the system with the provided examples');
console.log('4. Read RAG-SETUP.md for detailed instructions');
