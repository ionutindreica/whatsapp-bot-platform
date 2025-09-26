// AI Streaming API - Real-time AI responses
// Provides streaming responses for better user experience

import { NextApiRequest, NextApiResponse } from 'next';
import AIOrchestrator from '@/lib/ai/orchestration/AIOrchestrator';

// Initialize AI Orchestrator
let aiOrchestrator: AIOrchestrator | null = null;

async function initializeAI() {
  if (!aiOrchestrator) {
    aiOrchestrator = new AIOrchestrator({
      model: 'llama-3.1-8b',
      temperature: 0.7,
      maxTokens: 2048,
      enableRAG: true,
      enableBusinessLogic: true,
      enableStreaming: true
    });
    
    await aiOrchestrator.initialize();
  }
  return aiOrchestrator;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, userId, sessionId, context } = req.body;

    if (!message || !userId) {
      return res.status(400).json({ error: 'Message and userId are required' });
    }

    // Set up Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Initialize AI Orchestrator
    const ai = await initializeAI();
    
    // Send initial connection event
    res.write(`data: ${JSON.stringify({ type: 'connected', message: 'AI connected' })}\n\n`);

    // Process streaming request
    await ai.processStreamingRequest({
      message,
      userId,
      sessionId: sessionId || `session_${Date.now()}`,
      context
    }, (chunk: string) => {
      // Send chunk to client
      res.write(`data: ${JSON.stringify({ 
        type: 'chunk', 
        content: chunk,
        timestamp: new Date().toISOString()
      })}\n\n`);
    });

    // Send completion event
    res.write(`data: ${JSON.stringify({ 
      type: 'complete', 
      message: 'Response complete',
      timestamp: new Date().toISOString()
    })}\n\n`);

    res.end();

  } catch (error) {
    console.error('❌ AI Streaming API error:', error);
    
    // Send error event
    res.write(`data: ${JSON.stringify({ 
      type: 'error', 
      message: 'AI processing error',
      error: error.message 
    })}\n\n`);
    
    res.end();
  }
}

// Configure API route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
