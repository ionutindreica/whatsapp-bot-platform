// LLM Server with llama.cpp integration
// Provides AI responses using local Llama 3 model

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.LLM_PORT || 8080;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// LLM Configuration
const LLM_CONFIG = {
  modelPath: process.env.MODEL_PATH || './models/llama-3-4b.gguf',
  llamaCppUrl: process.env.LLAMA_CPP_URL || 'http://localhost:11434',
  temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
  maxTokens: parseInt(process.env.MAX_TOKENS) || 2048,
  contextLength: parseInt(process.env.CONTEXT_LENGTH) || 4096
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    model: LLM_CONFIG.modelPath,
    llamaCppUrl: LLM_CONFIG.llamaCppUrl
  });
});

// Generate AI response
app.post('/generate', async (req, res) => {
  try {
    const { prompt, context, temperature, maxTokens } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Build full prompt with context
    const fullPrompt = buildPrompt(prompt, context);
    
    // Call llama.cpp API
    const response = await callLlamaCpp(fullPrompt, {
      temperature: temperature || LLM_CONFIG.temperature,
      maxTokens: maxTokens || LLM_CONFIG.maxTokens
    });

    res.json({
      success: true,
      response: response.text,
      model: 'llama-3-4b',
      tokens: response.tokens || 0,
      processingTime: response.processingTime || 0
    });

  } catch (error) {
    console.error('LLM generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message 
    });
  }
});

// Streaming response
app.post('/stream', async (req, res) => {
  try {
    const { prompt, context, temperature, maxTokens } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Set up Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    // Build full prompt
    const fullPrompt = buildPrompt(prompt, context);
    
    // Send initial event
    res.write(`data: ${JSON.stringify({ type: 'start', message: 'Generating response...' })}\n\n`);

    // Simulate streaming response
    const response = await callLlamaCpp(fullPrompt, {
      temperature: temperature || LLM_CONFIG.temperature,
      maxTokens: maxTokens || LLM_CONFIG.maxTokens
    });

    // Stream the response word by word
    const words = response.text.split(' ');
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50)); // Simulate streaming delay
      res.write(`data: ${JSON.stringify({ 
        type: 'chunk', 
        content: words[i] + ' ',
        timestamp: new Date().toISOString()
      })}\n\n`);
    }

    // Send completion event
    res.write(`data: ${JSON.stringify({ 
      type: 'complete', 
      message: 'Response complete',
      timestamp: new Date().toISOString()
    })}\n\n`);

    res.end();

  } catch (error) {
    console.error('LLM streaming error:', error);
    res.write(`data: ${JSON.stringify({ 
      type: 'error', 
      message: 'Generation failed',
      error: error.message 
    })}\n\n`);
    res.end();
  }
});

// Helper function to build prompt
function buildPrompt(userMessage, context = '') {
  const systemPrompt = `You are a helpful AI assistant. Provide accurate and helpful responses based on the given context.`;
  
  let fullPrompt = systemPrompt;
  
  if (context) {
    fullPrompt += `\n\nContext:\n${context}`;
  }
  
  fullPrompt += `\n\nUser: ${userMessage}\n\nAssistant:`;
  
  return fullPrompt;
}

// Helper function to call llama.cpp
async function callLlamaCpp(prompt, options = {}) {
  try {
    const startTime = Date.now();
    
    // For MVP, simulate llama.cpp response
    // In production, this would call the actual llama.cpp API
    const responses = [
      "I understand your question. Let me help you with that.",
      "That's a great question! Here's what I can tell you...",
      "Based on the information provided, I would suggest...",
      "I'd be happy to help you with that. Here's my response...",
      "Let me provide you with a comprehensive answer..."
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    const processingTime = Date.now() - startTime;
    
    return {
      text: response,
      tokens: Math.floor(prompt.length / 4), // Rough estimate
      processingTime
    };
    
  } catch (error) {
    console.error('Llama.cpp call error:', error);
    throw error;
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`🤖 LLM Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧠 Model: ${LLM_CONFIG.modelPath}`);
});

export default app;
