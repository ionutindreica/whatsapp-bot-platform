#!/usr/bin/env node

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
        console.log(`✅ Collection ${COLLECTION_NAME} created`);
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
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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

      console.log(`✅ Document indexed: ${document.id}`);
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
