// Background Workers for AI SaaS
// Handles embeddings generation and document ingestion

import express from 'express';
import { Queue, Worker } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { QdrantClient } from 'qdrant-client';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.WORKER_PORT || 3001;

// Initialize services
const prisma = new PrismaClient();
const qdrant = new QdrantClient({ url: process.env.QDRANT_URL || 'http://localhost:6333' });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Redis connection for BullMQ
const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD
};

// Create queues
const embeddingQueue = new Queue('embeddings', { connection: redisConnection });
const ingestionQueue = new Queue('ingestion', { connection: redisConnection });

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    queues: ['embeddings', 'ingestion']
  });
});

// Queue status
app.get('/queues', async (req, res) => {
  try {
    const embeddingStats = await embeddingQueue.getJobCounts();
    const ingestionStats = await ingestionQueue.getJobCounts();
    
    res.json({
      embeddings: embeddingStats,
      ingestion: ingestionStats
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get queue stats' });
  }
});

// Start workers
startWorkers();

function startWorkers() {
  console.log('🚀 Starting background workers...');

  // Embedding worker
  const embeddingWorker = new Worker('embeddings', async (job) => {
    console.log(`Processing embedding job: ${job.id}`);
    
    const { content, documentId, botId } = job.data;
    
    try {
      // Generate embedding using OpenAI
      const embedding = await generateEmbedding(content);
      
      // Store in Qdrant
      await storeEmbedding(embedding, content, documentId, botId);
      
      // Update database
      await prisma.knowledgeBase.update({
        where: { id: documentId },
        data: { embeddingVector: embedding }
      });
      
      console.log(`✅ Embedding generated for document: ${documentId}`);
      
    } catch (error) {
      console.error(`❌ Embedding job failed: ${error.message}`);
      throw error;
    }
  }, { connection: redisConnection });

  // Ingestion worker
  const ingestionWorker = new Worker('ingestion', async (job) => {
    console.log(`Processing ingestion job: ${job.id}`);
    
    const { filePath, botId, fileName } = job.data;
    
    try {
      // Extract text from file
      const content = await extractTextFromFile(filePath);
      
      // Create knowledge base entry
      const knowledgeEntry = await prisma.knowledgeBase.create({
        data: {
          botId,
          fileName,
          fileUrl: filePath,
          content: content.substring(0, 10000), // Limit content size
          fileType: 'text/plain'
        }
      });
      
      // Queue embedding generation
      await embeddingQueue.add('generate-embedding', {
        content,
        documentId: knowledgeEntry.id,
        botId
      });
      
      console.log(`✅ Document ingested: ${fileName}`);
      
    } catch (error) {
      console.error(`❌ Ingestion job failed: ${error.message}`);
      throw error;
    }
  }, { connection: redisConnection });

  // Worker event handlers
  embeddingWorker.on('completed', (job) => {
    console.log(`✅ Embedding job completed: ${job.id}`);
  });

  embeddingWorker.on('failed', (job, err) => {
    console.error(`❌ Embedding job failed: ${job.id}`, err);
  });

  ingestionWorker.on('completed', (job) => {
    console.log(`✅ Ingestion job completed: ${job.id}`);
  });

  ingestionWorker.on('failed', (job, err) => {
    console.error(`❌ Ingestion job failed: ${job.id}`, err);
  });

  console.log('✅ Workers started successfully');
}

// Helper function to generate embeddings
async function generateEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Embedding generation error:', error);
    throw error;
  }
}

// Helper function to store embedding in Qdrant
async function storeEmbedding(embedding, content, documentId, botId) {
  try {
    await qdrant.upsert('bot_knowledge', {
      wait: true,
      points: [{
        id: documentId,
        vector: embedding,
        payload: {
          content,
          botId,
          documentId,
          timestamp: new Date().toISOString()
        }
      }]
    });
  } catch (error) {
    console.error('Qdrant storage error:', error);
    throw error;
  }
}

// Helper function to extract text from files
async function extractTextFromFile(filePath) {
  try {
    // For MVP, return placeholder text
    // In production, implement PDF, DOCX, TXT parsing
    return `Document content from: ${filePath}`;
  } catch (error) {
    console.error('Text extraction error:', error);
    throw error;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down workers...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`👷 Workers server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;
