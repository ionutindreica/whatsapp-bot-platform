#!/bin/bash

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
