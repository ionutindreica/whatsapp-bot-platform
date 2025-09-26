// Chat routes with AI integration for MVP
import express from 'express';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Chat endpoint with AI response
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { botId, message } = req.body;

    if (!botId || !message) {
      return res.status(400).json({ error: 'Bot ID and message are required' });
    }

    // Verify bot belongs to user
    const bot = await req.prisma.bot.findFirst({
      where: { 
        id: botId,
        userId: req.user.userId 
      }
    });

    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    if (!bot.isActive) {
      return res.status(400).json({ error: 'Bot is not active' });
    }

    // Get relevant context from knowledge base
    const context = await getRelevantContext(botId, message);

    // Generate AI response (simplified for MVP)
    const aiResponse = await generateAIResponse(message, context, bot);

    // Save conversation
    const conversation = await req.prisma.message.create({
      data: {
        botId,
        userId: req.user.userId,
        userMessage: message,
        aiResponse
      }
    });

    res.json({
      message: 'Chat processed successfully',
      response: aiResponse,
      conversationId: conversation.id,
      timestamp: conversation.createdAt
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat' });
  }
});

// Get chat history for a bot
router.get('/:botId', authenticateToken, async (req, res) => {
  try {
    const { botId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Verify bot belongs to user
    const bot = await req.prisma.bot.findFirst({
      where: { 
        id: botId,
        userId: req.user.userId 
      }
    });

    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    const messages = await req.prisma.message.findMany({
      where: { botId },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    res.json({ messages });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Helper function to get relevant context
async function getRelevantContext(botId, message) {
  try {
    // Get knowledge base documents for this bot
    const knowledgeDocs = await req.prisma.knowledgeBase.findMany({
      where: { botId },
      select: { content: true, fileName: true }
    });

    // Simple keyword matching for MVP
    // In production, this would use vector similarity search
    const relevantDocs = knowledgeDocs.filter(doc => 
      doc.content && 
      message.toLowerCase().includes(doc.content.toLowerCase().substring(0, 50))
    );

    return relevantDocs.map(doc => doc.content).join('\n\n');
  } catch (error) {
    console.error('Context retrieval error:', error);
    return '';
  }
}

// Helper function to generate AI response
async function generateAIResponse(message, context, bot) {
  try {
    // For MVP, use a simple response generator
    // In production, this would call the LLM server
    
    const responses = [
      `Hello! I'm ${bot.name}. How can I help you today?`,
      `Thanks for your message: "${message}". Let me help you with that.`,
      `I understand you're asking about: "${message}". Here's what I can tell you...`,
      `Great question! Based on my knowledge, here's what I think...`
    ];

    // Add context if available
    if (context) {
      return `Based on the information I have: ${context}\n\n${responses[Math.floor(Math.random() * responses.length)]}`;
    }

    return responses[Math.floor(Math.random() * responses.length)];
  } catch (error) {
    console.error('AI response generation error:', error);
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
  }
}

export default router;
