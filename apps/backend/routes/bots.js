// Bot management routes for MVP
import express from 'express';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get all bots for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const bots = await req.prisma.bot.findMany({
      where: { userId: req.user.userId },
      include: {
        _count: {
          select: { messages: true, knowledge: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ bots });
  } catch (error) {
    console.error('Get bots error:', error);
    res.status(500).json({ error: 'Failed to fetch bots' });
  }
});

// Create new bot
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Bot name is required' });
    }

    const bot = await req.prisma.bot.create({
      data: {
        name,
        description: description || '',
        userId: req.user.userId
      }
    });

    res.status(201).json({
      message: 'Bot created successfully',
      bot
    });
  } catch (error) {
    console.error('Create bot error:', error);
    res.status(500).json({ error: 'Failed to create bot' });
  }
});

// Get specific bot
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const bot = await req.prisma.bot.findFirst({
      where: { 
        id,
        userId: req.user.userId 
      },
      include: {
        _count: {
          select: { messages: true, knowledge: true }
        }
      }
    });

    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    res.json({ bot });
  } catch (error) {
    console.error('Get bot error:', error);
    res.status(500).json({ error: 'Failed to fetch bot' });
  }
});

// Update bot
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const bot = await req.prisma.bot.findFirst({
      where: { 
        id,
        userId: req.user.userId 
      }
    });

    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    const updatedBot = await req.prisma.bot.update({
      where: { id },
      data: {
        name: name || bot.name,
        description: description !== undefined ? description : bot.description,
        isActive: isActive !== undefined ? isActive : bot.isActive
      }
    });

    res.json({
      message: 'Bot updated successfully',
      bot: updatedBot
    });
  } catch (error) {
    console.error('Update bot error:', error);
    res.status(500).json({ error: 'Failed to update bot' });
  }
});

// Delete bot
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const bot = await req.prisma.bot.findFirst({
      where: { 
        id,
        userId: req.user.userId 
      }
    });

    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    await req.prisma.bot.delete({
      where: { id }
    });

    res.json({ message: 'Bot deleted successfully' });
  } catch (error) {
    console.error('Delete bot error:', error);
    res.status(500).json({ error: 'Failed to delete bot' });
  }
});

export default router;
