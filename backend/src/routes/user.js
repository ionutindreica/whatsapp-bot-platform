const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: true,
        billingInfo: true,
        usageStats: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile could not be found'
      });
    }

    // Remove sensitive data
    const { password, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Profile fetch failed',
      message: 'An error occurred while fetching user profile'
    });
  }
});

// Update user profile
router.put('/profile', [
  authenticateToken,
  body('firstName').optional().trim().isLength({ min: 1 }),
  body('lastName').optional().trim().isLength({ min: 1 }),
  body('company').optional().trim(),
  body('phone').optional().trim(),
  body('timezone').optional().trim(),
  body('language').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Invalid input data',
        details: errors.array()
      });
    }

    const { firstName, lastName, company, phone, timezone, language, preferences } = req.body;

    // Update or create user profile
    const profile = await prisma.userProfile.upsert({
      where: { userId: req.user.id },
      update: {
        firstName,
        lastName,
        company,
        phone,
        timezone,
        language,
        preferences,
        updatedAt: new Date()
      },
      create: {
        userId: req.user.id,
        firstName,
        lastName,
        company,
        phone,
        timezone,
        language,
        preferences
      }
    });

    res.json({
      message: 'Profile updated successfully',
      profile
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Profile update failed',
      message: 'An error occurred while updating profile'
    });
  }
});

// Get user usage statistics
router.get('/usage', authenticateToken, async (req, res) => {
  try {
    const usage = await prisma.usageStats.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 12 // Last 12 months
    });

    res.json({
      usage
    });

  } catch (error) {
    console.error('Get usage error:', error);
    res.status(500).json({
      error: 'Usage fetch failed',
      message: 'An error occurred while fetching usage statistics'
    });
  }
});

// Get user subscription info
router.get('/subscription', authenticateToken, async (req, res) => {
  try {
    const billingInfo = await prisma.billingInfo.findUnique({
      where: { userId: req.user.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    if (!billingInfo) {
      return res.status(404).json({
        error: 'Subscription not found',
        message: 'No subscription information found for this user'
      });
    }

    res.json({
      subscription: billingInfo
    });

  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      error: 'Subscription fetch failed',
      message: 'An error occurred while fetching subscription information'
    });
  }
});

// Change password
router.put('/change-password', [
  authenticateToken,
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Invalid input data',
        details: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User could not be found'
      });
    }

    // Verify current password
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'Password change failed',
      message: 'An error occurred while changing password'
    });
  }
});

module.exports = router;
