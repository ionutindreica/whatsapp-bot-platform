# AI SaaS MVP Platform

Minimal AI SaaS platform with Llama 3, RAG, and vector search.

## 🏗️ Architecture

```
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
```

## 🚀 Quick Start

### 1. Setup Environment
```bash
cp env.example .env
# Edit .env with your API keys
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Start Services
```bash
# Start all services with Docker
npm run dev

# Or start individually
npm run dev:backend    # Backend API (port 5000)
npm run dev:frontend   # Frontend (port 3000)
npm run dev:llm        # LLM Server (port 8080)
npm run dev:workers    # Workers (port 3001)
```

### 4. Setup Database
```bash
npm run db:setup
npm run db:seed
```

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
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Bots
- `GET /api/bots` - List bots
- `POST /api/bots` - Create bot
- `GET /api/bots/:id` - Get bot
- `PUT /api/bots/:id` - Update bot
- `DELETE /api/bots/:id` - Delete bot

### Chat
- `POST /api/chat` - Send message
- `GET /api/chat/:botId` - Get chat history

### Knowledge Base
- `POST /api/knowledge/upload` - Upload document
- `GET /api/knowledge/:botId` - Get knowledge base
- `DELETE /api/knowledge/:id` - Delete document

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

See `env.example` for all required environment variables.

## 📝 License

MIT License
