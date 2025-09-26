// Knowledge base management routes for MVP
import express from 'express';
import { authenticateToken } from './auth.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Upload document to knowledge base
router.post('/upload', authenticateToken, req.upload.single('file'), async (req, res) => {
  try {
    const { botId } = req.body;
    const file = req.file;

    if (!botId || !file) {
      return res.status(400).json({ error: 'Bot ID and file are required' });
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

    // Extract text content (simplified for MVP)
    let content = '';
    if (file.mimetype === 'text/plain') {
      content = fs.readFileSync(file.path, 'utf8');
    } else {
      // For other file types, you'd use libraries like pdf-parse, mammoth, etc.
      content = `Document: ${file.originalname} (${file.mimetype})`;
    }

    // Create knowledge base entry
    const knowledgeEntry = await req.prisma.knowledgeBase.create({
      data: {
        botId,
        fileName: file.originalname,
        fileUrl: file.path,
        fileType: file.mimetype,
        content: content.substring(0, 10000) // Limit content size
      }
    });

    // Clean up file after processing
    fs.unlinkSync(file.path);

    res.status(201).json({
      message: 'Document uploaded successfully',
      knowledge: knowledgeEntry
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// Get knowledge base for a bot
router.get('/:botId', authenticateToken, async (req, res) => {
  try {
    const { botId } = req.params;

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

    const knowledge = await req.prisma.knowledgeBase.findMany({
      where: { botId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ knowledge });
  } catch (error) {
    console.error('Get knowledge error:', error);
    res.status(500).json({ error: 'Failed to fetch knowledge base' });
  }
});

// Delete knowledge base entry
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const knowledge = await req.prisma.knowledgeBase.findFirst({
      where: { id },
      include: { bot: true }
    });

    if (!knowledge) {
      return res.status(404).json({ error: 'Knowledge entry not found' });
    }

    // Verify bot belongs to user
    if (knowledge.bot.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await req.prisma.knowledgeBase.delete({
      where: { id }
    });

    res.json({ message: 'Knowledge entry deleted successfully' });
  } catch (error) {
    console.error('Delete knowledge error:', error);
    res.status(500).json({ error: 'Failed to delete knowledge entry' });
  }
});

export default router;
