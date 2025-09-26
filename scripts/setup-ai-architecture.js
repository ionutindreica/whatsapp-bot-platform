#!/usr/bin/env node

/**
 * AI Architecture Setup Script
 * Sets up the complete AI-centric architecture with Llama 3, Vector DB, and RAG
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AI_CONFIG = {
  models: {
    'llama-3.1-8b': {
      name: 'Llama 3.1 8B',
      size: '8B parameters',
      ram: '8GB',
      description: 'Fast and efficient for general use'
    },
    'llama-3.1-70b': {
      name: 'Llama 3.1 70B',
      size: '70B parameters', 
      ram: '32GB',
      description: 'High-quality model for complex tasks'
    }
  },
  vectorDBs: {
    'qdrant': {
      name: 'Qdrant',
      description: 'Open-source vector database',
      setup: 'docker-compose up -d qdrant'
    },
    'pinecone': {
      name: 'Pinecone',
      description: 'Managed vector database service',
      setup: 'npm install @pinecone-database/pinecone'
    },
    'weaviate': {
      name: 'Weaviate',
      description: 'Open-source vector search engine',
      setup: 'docker-compose up -d weaviate'
    }
  }
};

function createAIDirectoryStructure() {
  console.log('📁 Creating AI architecture directory structure...');
  
  const directories = [
    'src/lib/ai',
    'src/lib/ai/orchestration',
    'src/lib/ai/vector',
    'src/lib/ai/embeddings',
    'src/lib/ai/models',
    'src/lib/ai/prompts',
    'src/lib/ai/actions',
    'src/pages/api/ai',
    'src/pages/api/ai/stream',
    'src/pages/api/ai/embeddings',
    'src/pages/api/ai/actions',
    'models',
    'data/vector',
    'data/knowledge',
    'data/conversations'
  ];
  
  directories.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Created: ${dir}`);
    }
  });
}

function createDockerCompose() {
  console.log('🐳 Creating Docker Compose for AI services...');
  
  const dockerCompose = `version: '3.8'

services:
  # Vector Database - Qdrant
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
    restart: unless-stopped

  # Vector Database - Weaviate (alternative)
  weaviate:
    image: semitechnologies/weaviate:latest
    ports:
      - "8080:8080"
    environment:
      - QUERY_DEFAULTS_LIMIT=25
      - AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED=true
      - PERSISTENCE_DATA_PATH=/var/lib/weaviate
      - DEFAULT_VECTORIZER_MODULE=none
      - ENABLE_MODULES=text2vec-openai,text2vec-cohere,text2vec-huggingface
      - CLUSTER_HOSTNAME=node1
    volumes:
      - weaviate_data:/var/lib/weaviate
    restart: unless-stopped

  # Redis for caching and queues
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  # PostgreSQL for main database
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=ai_bot
      - POSTGRES_USER=ai_user
      - POSTGRES_PASSWORD=ai_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  qdrant_storage:
  weaviate_data:
  redis_data:
  postgres_data:
`;

  fs.writeFileSync(path.join(__dirname, '../docker-compose.ai.yml'), dockerCompose);
  console.log('✅ Docker Compose created');
}

function createAIConfig() {
  console.log('⚙️ Creating AI configuration...');
  
  const config = {
    ai: {
      orchestrator: {
        model: 'llama-3.1-8b',
        temperature: 0.7,
        maxTokens: 2048,
        enableRAG: true,
        enableBusinessLogic: true,
        enableStreaming: true
      },
      vectorDB: {
        provider: 'qdrant',
        endpoint: 'http://localhost:6333',
        collectionName: 'bot_knowledge',
        dimensions: 1536
      },
      embeddings: {
        provider: 'openai',
        model: 'text-embedding-ada-002',
        dimensions: 1536
      },
      llama: {
        modelPath: './models/llama-3.1-8b-instruct.gguf',
        contextLength: 8192,
        temperature: 0.7,
        topP: 0.9
      }
    },
    database: {
      postgres: {
        host: 'localhost',
        port: 5432,
        database: 'ai_bot',
        username: 'ai_user',
        password: 'ai_password'
      },
      redis: {
        host: 'localhost',
        port: 6379,
        db: 0
      }
    },
    monitoring: {
      enabled: true,
      metrics: {
        responseTime: true,
        tokenUsage: true,
        errorRate: true,
        userSatisfaction: true
      }
    }
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../src/config/ai.json'), 
    JSON.stringify(config, null, 2)
  );
  console.log('✅ AI configuration created');
}

function createKnowledgeBase() {
  console.log('📚 Creating knowledge base structure...');
  
  const knowledgeBase = {
    categories: [
      {
        name: 'Product Information',
        documents: [
          'product-features.md',
          'pricing-plans.md',
          'integration-guides.md'
        ]
      },
      {
        name: 'Support',
        documents: [
          'faq.md',
          'troubleshooting.md',
          'contact-support.md'
        ]
      },
      {
        name: 'Business',
        documents: [
          'company-info.md',
          'policies.md',
          'terms-of-service.md'
        ]
      }
    ],
    embeddings: {
      provider: 'openai',
      model: 'text-embedding-ada-002',
      batchSize: 100
    },
    indexing: {
      autoIndex: true,
      updateInterval: '1h',
      similarityThreshold: 0.7
    }
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../src/config/knowledge-base.json'),
    JSON.stringify(knowledgeBase, null, 2)
  );
  console.log('✅ Knowledge base configuration created');
}

function createPackageJson() {
  console.log('📦 Updating package.json with AI dependencies...');
  
  const packagePath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Add AI dependencies
  const aiDependencies = {
    '@pinecone-database/pinecone': '^1.1.0',
    'qdrant-client': '^1.7.0',
    'weaviate-ts-client': '^1.5.0',
    'openai': '^4.20.0',
    'langchain': '^0.1.0',
    'llamaindex': '^0.0.1',
    'redis': '^4.6.0',
    'bullmq': '^4.15.0',
    'pg': '^8.11.0',
    'prisma': '^5.6.0',
    '@prisma/client': '^5.6.0'
  };
  
  packageJson.dependencies = {
    ...packageJson.dependencies,
    ...aiDependencies
  };
  
  // Add AI scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    'ai:setup': 'node scripts/setup-ai-architecture.js',
    'ai:start': 'docker-compose -f docker-compose.ai.yml up -d',
    'ai:stop': 'docker-compose -f docker-compose.ai.yml down',
    'ai:index': 'node scripts/index-knowledge-base.js',
    'ai:test': 'node scripts/test-ai-integration.js'
  };
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Package.json updated with AI dependencies');
}

function createIndexingScript() {
  console.log('📝 Creating knowledge base indexing script...');
  
  const indexingScript = `#!/usr/bin/env node

/**
 * Knowledge Base Indexing Script
 * Indexes documents into vector database for RAG
 */

const fs = require('fs');
const path = require('path');
const { QdrantClient } = require('qdrant-client');
const OpenAI = require('openai');

const QDRANT_URL = 'http://localhost:6333';
const COLLECTION_NAME = 'bot_knowledge';

class KnowledgeIndexer {
  constructor() {
    this.qdrant = new QdrantClient({ url: QDRANT_URL });
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async initialize() {
    try {
      console.log('🔍 Initializing knowledge indexer...');
      
      // Create collection if it doesn't exist
      const collections = await this.qdrant.getCollections();
      if (!collections.collections.find(c => c.name === COLLECTION_NAME)) {
        await this.qdrant.createCollection(COLLECTION_NAME, {
          vectors: { size: 1536, distance: 'Cosine' }
        });
        console.log(\`✅ Collection \${COLLECTION_NAME} created\`);
      }
      
      console.log('✅ Knowledge indexer initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize indexer:', error);
      return false;
    }
  }

  async generateEmbedding(text) {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('❌ Embedding generation failed:', error);
      return null;
    }
  }

  async indexDocument(content, metadata = {}) {
    try {
      const embedding = await this.generateEmbedding(content);
      if (!embedding) return false;

      const document = {
        id: \`doc_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`,
        vector: embedding,
        payload: {
          content,
          ...metadata,
          indexed_at: new Date().toISOString()
        }
      };

      await this.qdrant.upsert(COLLECTION_NAME, {
        wait: true,
        points: [document]
      });

      console.log(\`✅ Document indexed: \${document.id}\`);
      return true;
    } catch (error) {
      console.error('❌ Document indexing failed:', error);
      return false;
    }
  }

  async indexKnowledgeBase() {
    try {
      console.log('📚 Indexing knowledge base...');
      
      const knowledgeDir = path.join(__dirname, '../data/knowledge');
      if (!fs.existsSync(knowledgeDir)) {
        fs.mkdirSync(knowledgeDir, { recursive: true });
      }

      // Index sample documents
      const sampleDocs = [
        {
          content: 'Our AI bot platform supports WhatsApp, Telegram, Instagram, and Facebook Messenger integrations.',
          metadata: { type: 'features', category: 'integrations' }
        },
        {
          content: 'We offer three pricing plans: Starter ($29/month), Pro ($99/month), and Enterprise (custom pricing).',
          metadata: { type: 'pricing', category: 'plans' }
        },
        {
          content: 'For technical support, please contact our support team at support@company.com or use the in-app chat.',
          metadata: { type: 'support', category: 'contact' }
        }
      ];

      for (const doc of sampleDocs) {
        await this.indexDocument(doc.content, doc.metadata);
      }

      console.log('✅ Knowledge base indexing complete');
      return true;
    } catch (error) {
      console.error('❌ Knowledge base indexing failed:', error);
      return false;
    }
  }
}

async function main() {
  const indexer = new KnowledgeIndexer();
  
  const initialized = await indexer.initialize();
  if (!initialized) {
    console.error('❌ Failed to initialize indexer');
    process.exit(1);
  }

  const success = await indexer.indexKnowledgeBase();
  if (success) {
    console.log('🎉 Knowledge base indexing completed successfully!');
  } else {
    console.error('❌ Knowledge base indexing failed');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { KnowledgeIndexer };
`;

  fs.writeFileSync(path.join(__dirname, '../scripts/index-knowledge-base.js'), indexingScript);
  console.log('✅ Knowledge base indexing script created');
}

function createTestScript() {
  console.log('🧪 Creating AI integration test script...');
  
  const testScript = `#!/usr/bin/env node

/**
 * AI Integration Test Script
 * Tests the complete AI architecture
 */

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/api/ai';

async function testAIChat() {
  console.log('🧪 Testing AI Chat API...');
  
  try {
    const response = await fetch(\`\${API_BASE}/chat\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello, can you help me with pricing information?',
        userId: 'test-user-123',
        sessionId: 'test-session-456'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ AI Chat API working');
      console.log('Response:', data.response.substring(0, 100) + '...');
      console.log('Confidence:', data.confidence);
      console.log('Model:', data.model);
    } else {
      console.error('❌ AI Chat API failed:', response.status);
    }
  } catch (error) {
    console.error('❌ AI Chat API error:', error);
  }
}

async function testVectorDB() {
  console.log('🧪 Testing Vector DB connection...');
  
  try {
    const response = await fetch('http://localhost:6333/collections');
    if (response.ok) {
      console.log('✅ Vector DB (Qdrant) is running');
    } else {
      console.error('❌ Vector DB connection failed');
    }
  } catch (error) {
    console.error('❌ Vector DB error:', error);
  }
}

async function testRedis() {
  console.log('🧪 Testing Redis connection...');
  
  try {
    const response = await fetch('http://localhost:6379');
    console.log('✅ Redis is accessible');
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
  }
}

async function runAllTests() {
  console.log('🚀 Running AI Architecture Tests...');
  console.log('');
  
  await testVectorDB();
  await testRedis();
  await testAIChat();
  
  console.log('');
  console.log('🎉 AI Architecture tests completed!');
}

if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testAIChat, testVectorDB, testRedis };
`;

  fs.writeFileSync(path.join(__dirname, '../scripts/test-ai-integration.js'), testScript);
  console.log('✅ AI integration test script created');
}

function createEnvironmentTemplate() {
  console.log('🔐 Creating environment template...');
  
  const envTemplate = `# AI Architecture Environment Variables

# OpenAI API Key (for embeddings)
OPENAI_API_KEY=your_openai_api_key_here

# Vector Database Configuration
QDRANT_URL=http://localhost:6333
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment_here

# Database Configuration
DATABASE_URL=postgresql://ai_user:ai_password@localhost:5432/ai_bot
REDIS_URL=redis://localhost:6379

# AI Model Configuration
LLAMA_MODEL_PATH=./models/llama-3.1-8b-instruct.gguf
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=2048

# Monitoring and Analytics
ENABLE_AI_MONITORING=true
AI_METRICS_ENDPOINT=http://localhost:9090/metrics

# Security
AI_API_KEY=your_ai_api_key_here
ENABLE_AI_RATE_LIMITING=true
AI_RATE_LIMIT_PER_MINUTE=60
`;

  fs.writeFileSync(path.join(__dirname, '../.env.ai.template'), envTemplate);
  console.log('✅ Environment template created');
}

async function main() {
  console.log('🧠 AI Architecture Setup Script');
  console.log('📖 Setting up complete AI-centric architecture');
  console.log('');
  
  console.log('Starting setup process...');

  try {
    createAIDirectoryStructure();
    createDockerCompose();
    createAIConfig();
    createKnowledgeBase();
    createPackageJson();
    createIndexingScript();
    createTestScript();
    createEnvironmentTemplate();

    console.log('');
    console.log('🎉 AI Architecture setup completed!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Copy .env.ai.template to .env.local and configure your API keys');
    console.log('2. Install dependencies: npm install');
    console.log('3. Start AI services: npm run ai:start');
    console.log('4. Index knowledge base: npm run ai:index');
    console.log('5. Test the integration: npm run ai:test');
    console.log('');
    console.log('💡 For production deployment, consider using managed services:');
    console.log('- Pinecone for vector database');
    console.log('- OpenAI for embeddings');
    console.log('- Replicate or Hugging Face for Llama 3 hosting');
    console.log('');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the main function if this script is executed directly
console.log('Script started...');
console.log('Import meta URL:', import.meta.url);
console.log('Process argv:', process.argv[1]);

// Always run main for now
console.log('Running main function...');
main().catch(console.error);

export { main, AI_CONFIG };
