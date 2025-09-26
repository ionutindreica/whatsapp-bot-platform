# RAG System Setup Instructions

## 1. Environment Setup
1. Copy .env.rag to .env.local
2. Add your OpenAI API key
3. Configure Qdrant and Redis URLs

## 2. Start Services
```bash
# Start Qdrant and Redis
docker-compose -f docker-compose.rag.yml up -d

# Or start individually:
# docker run -p 6333:6333 qdrant/qdrant
# docker run -p 6379:6379 redis:7-alpine
```

## 3. Initialize Vector Database
```bash
# Create collection (this will be done automatically on first API call)
curl -X POST http://localhost:3004/api/rag/ingest \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a test document", "metadata": {"source": "test"}}'
```

## 4. Test RAG System
```bash
# Test chat endpoint
curl -X POST http://localhost:3004/api/rag/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is this about?", "sessionId": "test"}'
```

## 5. Monitor Services
- Qdrant UI: http://localhost:6333/dashboard
- Redis CLI: redis-cli -h localhost -p 6379

## 6. Production Deployment
For production, consider:
- Managed Qdrant Cloud or Pinecone
- Managed Redis (AWS ElastiCache, etc.)
- Proper environment variable management
- SSL/TLS configuration
- Load balancing