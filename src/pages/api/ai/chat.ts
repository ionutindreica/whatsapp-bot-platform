// AI Chat API - Main endpoint for AI-powered conversations
// Integrates with AI Orchestrator for context-aware responses

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

    // Initialize AI Orchestrator
    const ai = await initializeAI();
    
    // Process the request
    const response = await ai.processRequest({
      message,
      userId,
      sessionId: sessionId || `session_${Date.now()}`,
      context
    });

    // Log the interaction
    console.log(`🤖 AI Response for user ${userId}:`, {
      message: message.substring(0, 100) + '...',
      responseLength: response.text.length,
      confidence: response.confidence,
      model: response.model,
      processingTime: response.processingTime
    });

    return res.status(200).json({
      success: true,
      response: response.text,
      confidence: response.confidence,
      sources: response.sources,
      actions: response.actions,
      model: response.model,
      processingTime: response.processingTime,
      tokens: response.tokens
    });

  } catch (error) {
    console.error('❌ AI Chat API error:', error);
    return res.status(500).json({ 
      error: 'Failed to process AI request',
      details: error.message 
    });
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
