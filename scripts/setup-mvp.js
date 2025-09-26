#!/usr/bin/env node

/**
 * MVP Setup Script
 * Sets up the minimal AI SaaS platform
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createDirectories() {
  console.log('📁 Creating MVP directory structure...');
  
  const directories = [
    'apps/frontend/app',
    'apps/frontend/components',
    'apps/frontend/lib',
    'apps/backend/routes',
    'apps/backend/middleware',
    'apps/backend/lib',
    'apps/llm-server/models',
    'apps/workers/jobs',
    'docker',
    'db/migrations',
    'scripts'
  ];
  
  directories.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Created: ${dir}`);
    }
  });
}

function createPackageJson() {
  console.log('📦 Creating root package.json...');
  
  const packageJson = {
    "name": "ai-saas-mvp",
    "version": "1.0.0",
    "description": "Minimal AI SaaS Platform with Llama 3 and RAG",
    "private": true,
    "workspaces": [
      "apps/*"
    ],
    "scripts": {
      "dev": "docker-compose -f docker/docker-compose.yml up",
      "dev:backend": "cd apps/backend && npm run dev",
      "dev:frontend": "cd apps/frontend && npm run dev",
      "dev:llm": "cd apps/llm-server && npm run dev",
      "dev:workers": "cd apps/workers && npm run dev",
      "build": "npm run build --workspaces",
      "start": "docker-compose -f docker/docker-compose.yml up -d",
      "stop": "docker-compose -f docker/docker-compose.yml down",
      "db:setup": "cd apps/backend && npm run db:push",
      "db:seed": "cd apps/backend && npm run db:seed",
      "install:all": "npm install && npm install --workspaces",
      "clean": "docker-compose -f docker/docker-compose.yml down -v && docker system prune -f"
    },
    "devDependencies": {
      "concurrently": "^8.2.0"
    }
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  console.log('✅ Root package.json created');
}

function createReadme() {
  console.log('📖 Creating MVP README...');
  
  const readme = `# AI SaaS MVP Platform

Minimal AI SaaS platform with Llama 3, RAG, and vector search.

## 🏗️ Architecture

\`\`\`
apps/
├─ frontend/           # Next.js UI (dashboard + chat UI)
├─ backend/            # API server (Express + Prisma)
├─ llm-server/        # Llama runtime (llama.cpp / vLLM)
└─ workers/            # Embeddings + ingestion jobs

docker/
├─ docker-compose.yml  # runs everything locally
└─ Dockerfile.*        # individual Docker files

db/
├─ migrations/
└─ schema.prisma       # database models
\`\`\`

## 🚀 Quick Start

### 1. Setup Environment
\`\`\`bash
cp env.example .env
# Edit .env with your API keys
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm run install:all
\`\`\`

### 3. Start Services
\`\`\`bash
# Start all services with Docker
npm run dev

# Or start individually
npm run dev:backend    # Backend API (port 5000)
npm run dev:frontend   # Frontend (port 3000)
npm run dev:llm        # LLM Server (port 8080)
npm run dev:workers    # Workers (port 3001)
\`\`\`

### 4. Setup Database
\`\`\`bash
npm run db:setup
npm run db:seed
\`\`\`

## 📊 Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | Next.js dashboard |
| Backend | 5000 | Express API |
| LLM Server | 8080 | Llama 3 inference |
| Workers | 3001 | Background jobs |
| PostgreSQL | 5432 | Main database |
| Qdrant | 6333 | Vector database |
| Redis | 6379 | Cache & queues |

## 🔧 API Endpoints

### Authentication
- \`POST /api/auth/register\` - Create account
- \`POST /api/auth/login\` - Login

### Bots
- \`GET /api/bots\` - List bots
- \`POST /api/bots\` - Create bot
- \`GET /api/bots/:id\` - Get bot
- \`PUT /api/bots/:id\` - Update bot
- \`DELETE /api/bots/:id\` - Delete bot

### Chat
- \`POST /api/chat\` - Send message
- \`GET /api/chat/:botId\` - Get chat history

### Knowledge Base
- \`POST /api/knowledge/upload\` - Upload document
- \`GET /api/knowledge/:botId\` - Get knowledge base
- \`DELETE /api/knowledge/:id\` - Delete document

## 🧠 AI Features

- **Llama 3 Integration**: Local LLM inference
- **RAG Pipeline**: Context retrieval from documents
- **Vector Search**: Semantic similarity search
- **Streaming Responses**: Real-time chat experience
- **Document Processing**: PDF, TXT, DOCX support

## 🐳 Docker Services

- **PostgreSQL**: Main database
- **Qdrant**: Vector database
- **Redis**: Cache and job queues
- **Backend**: Express API server
- **LLM Server**: Llama 3 inference
- **Frontend**: Next.js application
- **Workers**: Background processing

## 📈 MVP Roadmap

- [x] Setup backend + DB
- [x] Integrate Llama + RAG
- [x] Dashboard Next.js
- [x] Upload KB + Vector DB
- [ ] QA + Deploy

## 🔑 Environment Variables

See \`env.example\` for all required environment variables.

## 📝 License

MIT License
`;

  fs.writeFileSync(path.join(__dirname, '../README-MVP.md'), readme);
  console.log('✅ MVP README created');
}

function createStartScript() {
  console.log('🚀 Creating start script...');
  
  const startScript = `#!/bin/bash

# AI SaaS MVP Start Script

echo "🚀 Starting AI SaaS MVP Platform..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from env.example..."
    cp env.example .env
    echo "📝 Please edit .env with your API keys before continuing."
    echo "   Required: OPENAI_API_KEY"
    read -p "Press Enter to continue after editing .env..."
fi

# Start services
echo "🐳 Starting Docker services..."
docker-compose -f docker/docker-compose.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."

# Check PostgreSQL
if docker-compose -f docker/docker-compose.yml exec postgres pg_isready -U app -d aiapp > /dev/null 2>&1; then
    echo "✅ PostgreSQL is ready"
else
    echo "❌ PostgreSQL is not ready"
fi

# Check Qdrant
if curl -s http://localhost:6333/health > /dev/null 2>&1; then
    echo "✅ Qdrant is ready"
else
    echo "❌ Qdrant is not ready"
fi

# Check Redis
if docker-compose -f docker/docker-compose.yml exec redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is ready"
else
    echo "❌ Redis is not ready"
fi

echo ""
echo "🎉 AI SaaS MVP Platform is starting!"
echo ""
echo "📊 Services:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:5000"
echo "   LLM:       http://localhost:8080"
echo "   Workers:   http://localhost:3001"
echo ""
echo "🔧 Next steps:"
echo "   1. Setup database: npm run db:setup"
echo "   2. Seed database: npm run db:seed"
echo "   3. Open frontend: http://localhost:3000"
echo ""
`;

  fs.writeFileSync(path.join(__dirname, '../start-mvp.sh'), startScript);
  
  // Make it executable
  try {
    execSync('chmod +x start-mvp.sh', { cwd: path.join(__dirname, '..') });
  } catch (error) {
    console.log('⚠️  Could not make start script executable (Windows)');
  }
  
  console.log('✅ Start script created');
}

async function main() {
  console.log('🧠 AI SaaS MVP Setup Script');
  console.log('📖 Setting up minimal AI SaaS platform');
  console.log('');

  try {
    createDirectories();
    createPackageJson();
    createReadme();
    createStartScript();

    console.log('');
    console.log('🎉 MVP setup completed!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Copy env.example to .env and configure your API keys');
    console.log('2. Install dependencies: npm run install:all');
    console.log('3. Start services: npm run dev');
    console.log('4. Setup database: npm run db:setup');
    console.log('5. Open frontend: http://localhost:3000');
    console.log('');
    console.log('💡 For development:');
    console.log('- Backend API: http://localhost:5000');
    console.log('- LLM Server: http://localhost:8080');
    console.log('- Workers: http://localhost:3001');
    console.log('');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(console.error);
