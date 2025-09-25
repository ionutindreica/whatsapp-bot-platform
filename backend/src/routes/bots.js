const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const prisma = new PrismaClient();

// Get user's bots
router.get('/', authenticateToken, async (req, res) => {
  try {
    const bots = await prisma.bot.findMany({
      where: { userId: req.user.id },
      include: {
        _count: {
          select: { conversations: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ bots });

  } catch (error) {
    console.error('Get bots error:', error);
    res.status(500).json({
      error: 'Failed to fetch bots',
      message: 'An error occurred while loading bots'
    });
  }
});

// Get bot details
router.get('/:botId', authenticateToken, async (req, res) => {
  try {
    const { botId } = req.params;

    const bot = await prisma.bot.findFirst({
      where: { 
        id: botId,
        userId: req.user.id 
      },
      include: {
        conversations: {
          include: {
            _count: {
              select: { messages: true }
            }
          }
        }
      }
    });

    if (!bot) {
      return res.status(404).json({
        error: 'Bot not found',
        message: 'The requested bot does not exist'
      });
    }

    res.json({ bot });

  } catch (error) {
    console.error('Get bot details error:', error);
    res.status(500).json({
      error: 'Failed to fetch bot details',
      message: 'An error occurred while loading bot information'
    });
  }
});

// Create new bot
router.post('/', authenticateToken, [
  body('name').isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid input data',
        details: errors.array()
      });
    }

    const { name, description, channels = [] } = req.body;

    const bot = await prisma.bot.create({
      data: {
        name,
        description,
        channels,
        userId: req.user.id,
        status: 'DRAFT'
      }
    });

    res.status(201).json({
      message: 'Bot created successfully',
      bot
    });

  } catch (error) {
    console.error('Create bot error:', error);
    res.status(500).json({
      error: 'Failed to create bot',
      message: 'An error occurred while creating the bot'
    });
  }
});

// Update bot
router.put('/:botId', authenticateToken, [
  body('name').optional().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('status').optional().isIn(['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid input data',
        details: errors.array()
      });
    }

    const { botId } = req.params;
    const { name, description, status, channels, settings } = req.body;

    const bot = await prisma.bot.findFirst({
      where: { 
        id: botId,
        userId: req.user.id 
      }
    });

    if (!bot) {
      return res.status(404).json({
        error: 'Bot not found',
        message: 'The requested bot does not exist'
      });
    }

    const updatedBot = await prisma.bot.update({
      where: { id: botId },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(status && { status }),
        ...(channels && { channels }),
        ...(settings && { settings })
      }
    });

    res.json({
      message: 'Bot updated successfully',
      bot: updatedBot
    });

  } catch (error) {
    console.error('Update bot error:', error);
    res.status(500).json({
      error: 'Failed to update bot',
      message: 'An error occurred while updating the bot'
    });
  }
});

// Delete bot
router.delete('/:botId', authenticateToken, async (req, res) => {
  try {
    const { botId } = req.params;

    const bot = await prisma.bot.findFirst({
      where: { 
        id: botId,
        userId: req.user.id 
      }
    });

    if (!bot) {
      return res.status(404).json({
        error: 'Bot not found',
        message: 'The requested bot does not exist'
      });
    }

    await prisma.bot.delete({
      where: { id: botId }
    });

    res.json({
      message: 'Bot deleted successfully'
    });

  } catch (error) {
    console.error('Delete bot error:', error);
    res.status(500).json({
      error: 'Failed to delete bot',
      message: 'An error occurred while deleting the bot'
    });
  }
});

// Toggle bot status
router.post('/:botId/toggle', authenticateToken, async (req, res) => {
  try {
    const { botId } = req.params;

    const bot = await prisma.bot.findFirst({
      where: { 
        id: botId,
        userId: req.user.id 
      }
    });

    if (!bot) {
      return res.status(404).json({
        error: 'Bot not found',
        message: 'The requested bot does not exist'
      });
    }

    const newStatus = bot.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';

    const updatedBot = await prisma.bot.update({
      where: { id: botId },
      data: { status: newStatus }
    });

    res.json({
      message: `Bot ${newStatus.toLowerCase()} successfully`,
      bot: updatedBot
    });

  } catch (error) {
    console.error('Toggle bot status error:', error);
    res.status(500).json({
      error: 'Failed to toggle bot status',
      message: 'An error occurred while toggling bot status'
    });
  }
});

module.exports = router;
