const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to check if user is super admin
const requireSuperAdmin = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Super admin access required'
      });
    }

    next();
  } catch (error) {
    console.error('Super admin check error:', error);
    res.status(500).json({
      error: 'Authorization failed',
      message: 'An error occurred while checking permissions'
    });
  }
};

// Log admin action
const logAdminAction = async (adminId, action, targetUserId = null, description = null, metadata = null) => {
  try {
    await prisma.adminAction.create({
      data: {
        adminId,
        targetUserId,
        action,
        description,
        metadata,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
};

// Get dashboard statistics
router.get('/dashboard', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalRevenue,
      monthlyRevenue,
      totalBots,
      totalMessages,
      recentUsers,
      recentActivity
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.billingInfo.aggregate({
        _sum: { totalPaid: true }
      }),
      prisma.billingInfo.aggregate({
        where: {
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
          }
        },
        _sum: { totalPaid: true }
      }),
      prisma.bot.count(),
      prisma.message.count(),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { profile: true }
      }),
      prisma.adminAction.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: { admin: true, targetUser: true }
      })
    ]);

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        totalRevenue: totalRevenue._sum.totalPaid || 0,
        monthlyRevenue: monthlyRevenue._sum.totalPaid || 0,
        totalBots,
        totalMessages
      },
      recentUsers,
      recentActivity
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch dashboard data',
      message: 'An error occurred while loading dashboard statistics'
    });
  }
});

// Get all users with pagination and filters
router.get('/users', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', role = '', status = '' } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (role) where.role = role;
    if (status) where.status = status;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          profile: true,
          bots: { select: { id: true } },
          _count: {
            select: {
              bots: true,
              conversations: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      message: 'An error occurred while loading users'
    });
  }
});

// Get user details
router.get('/users/:userId', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        bots: {
          include: {
            _count: {
              select: { conversations: true }
            }
          }
        },
        billingInfo: true,
        _count: {
          select: {
            conversations: true,
            bots: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    res.json({ user });

  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({
      error: 'Failed to fetch user details',
      message: 'An error occurred while loading user information'
    });
  }
});

// Update user
router.put('/users/:userId', authenticateToken, requireSuperAdmin, [
  body('name').optional().isLength({ min: 2, max: 100 }),
  body('email').optional().isEmail(),
  body('role').optional().isIn(['USER', 'ADMIN', 'SUPER_ADMIN']),
  body('status').optional().isIn(['ACTIVE', 'INACTIVE', 'SUSPENDED'])
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

    const { userId } = req.params;
    const { name, email, role, status } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
        ...(status && { status })
      },
      include: { profile: true }
    });

    // Log admin action
    await logAdminAction(req.user.id, 'USER_UPDATED', userId, `Updated user ${user.email}`, {
      changes: { name, email, role, status }
    });

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      error: 'Failed to update user',
      message: 'An error occurred while updating the user'
    });
  }
});

// Suspend user
router.post('/users/:userId/suspend', authenticateToken, requireSuperAdmin, [
  body('reason').optional().isLength({ max: 500 })
], async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { status: 'SUSPENDED' }
    });

    // Log admin action
    await logAdminAction(req.user.id, 'USER_SUSPENDED', userId, reason || 'User suspended by admin');

    res.json({
      message: 'User suspended successfully'
    });

  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({
      error: 'Failed to suspend user',
      message: 'An error occurred while suspending the user'
    });
  }
});

// Activate user
router.post('/users/:userId/activate', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { status: 'ACTIVE' }
    });

    // Log admin action
    await logAdminAction(req.user.id, 'USER_ACTIVATED', userId, 'User activated by admin');

    res.json({
      message: 'User activated successfully'
    });

  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({
      error: 'Failed to activate user',
      message: 'An error occurred while activating the user'
    });
  }
});

// Delete user
router.delete('/users/:userId', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    // Prevent deleting super admin
    if (user.role === 'SUPER_ADMIN') {
      return res.status(403).json({
        error: 'Cannot delete super admin',
        message: 'Super admin accounts cannot be deleted'
      });
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    // Log admin action
    await logAdminAction(req.user.id, 'USER_DELETED', userId, `Deleted user ${user.email}`);

    res.json({
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'Failed to delete user',
      message: 'An error occurred while deleting the user'
    });
  }
});

// Get system settings
router.get('/settings', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const settings = await prisma.systemSettings.findMany({
      orderBy: { key: 'asc' }
    });

    const settingsObject = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});

    res.json({ settings: settingsObject });

  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      error: 'Failed to fetch settings',
      message: 'An error occurred while loading system settings'
    });
  }
});

// Update system settings
router.put('/settings', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { settings } = req.body;

    for (const [key, value] of Object.entries(settings)) {
      await prisma.systemSettings.upsert({
        where: { key },
        update: { value, updatedBy: req.user.id },
        create: { key, value, updatedBy: req.user.id }
      });
    }

    // Log admin action
    await logAdminAction(req.user.id, 'SYSTEM_CONFIGURED', null, 'System settings updated', { settings });

    res.json({
      message: 'Settings updated successfully'
    });

  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      error: 'Failed to update settings',
      message: 'An error occurred while updating system settings'
    });
  }
});

// Get activity logs
router.get('/logs', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, action = '', adminId = '' } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (action) where.action = action;
    if (adminId) where.adminId = adminId;

    const [logs, total] = await Promise.all([
      prisma.adminAction.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          admin: { select: { name: true, email: true } },
          targetUser: { select: { name: true, email: true } }
        }
      }),
      prisma.adminAction.count({ where })
    ]);

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({
      error: 'Failed to fetch logs',
      message: 'An error occurred while loading activity logs'
    });
  }
});

module.exports = router;
