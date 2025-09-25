import { prisma } from './prisma';
import { auditLogger } from './logger';
import { config } from './config';

export interface AuditLogData {
  action: string;
  resource: string;
  userId?: string;
  workspaceId?: string;
  metadata?: Record<string, any>;
  ip?: string;
  userAgent?: string;
}

export async function auditLog(data: AuditLogData): Promise<void> {
  try {
    // Log to Winston audit logger
    auditLogger.info('Audit Event', {
      timestamp: new Date().toISOString(),
      ...data,
    });

    // Store in database if audit logs are enabled
    if (config.features.ENABLE_AUDIT_LOGS) {
      await prisma.auditLog.create({
        data: {
          action: data.action,
          resource: data.resource,
          userId: data.userId,
          workspaceId: data.workspaceId,
          metadata: data.metadata || {},
          ip: data.ip,
          userAgent: data.userAgent,
          createdAt: new Date(),
        },
      });
    }
  } catch (error) {
    // Don't throw errors from audit logging to avoid breaking the main flow
    auditLogger.error('Audit log failed', {
      error: error.message,
      originalData: data,
    });
  }
}

// Specific audit log functions for common actions
export const auditActions = {
  // Authentication
  async login(userId: string, ip: string, userAgent: string, metadata?: Record<string, any>) {
    await auditLog({
      action: 'USER_LOGIN',
      resource: 'auth',
      userId,
      ip,
      userAgent,
      metadata,
    });
  },

  async logout(userId: string, ip: string, userAgent: string) {
    await auditLog({
      action: 'USER_LOGOUT',
      resource: 'auth',
      userId,
      ip,
      userAgent,
    });
  },

  async loginFailed(email: string, ip: string, userAgent: string, reason: string) {
    await auditLog({
      action: 'LOGIN_FAILED',
      resource: 'auth',
      metadata: { email, reason },
      ip,
      userAgent,
    });
  },

  // User Management
  async userCreated(userId: string, createdBy: string, metadata?: Record<string, any>) {
    await auditLog({
      action: 'USER_CREATED',
      resource: 'users',
      userId,
      metadata: { createdBy, ...metadata },
    });
  },

  async userUpdated(userId: string, updatedBy: string, changes: Record<string, any>) {
    await auditLog({
      action: 'USER_UPDATED',
      resource: 'users',
      userId,
      metadata: { updatedBy, changes },
    });
  },

  async userDeleted(userId: string, deletedBy: string) {
    await auditLog({
      action: 'USER_DELETED',
      resource: 'users',
      userId,
      metadata: { deletedBy },
    });
  },

  // Workspace Management
  async workspaceCreated(workspaceId: string, createdBy: string, metadata?: Record<string, any>) {
    await auditLog({
      action: 'WORKSPACE_CREATED',
      resource: 'workspaces',
      workspaceId,
      userId: createdBy,
      metadata,
    });
  },

  async workspaceUpdated(workspaceId: string, updatedBy: string, changes: Record<string, any>) {
    await auditLog({
      action: 'WORKSPACE_UPDATED',
      resource: 'workspaces',
      workspaceId,
      userId: updatedBy,
      metadata: { changes },
    });
  },

  // Bot Management
  async botCreated(botId: string, workspaceId: string, createdBy: string, metadata?: Record<string, any>) {
    await auditLog({
      action: 'BOT_CREATED',
      resource: 'bots',
      workspaceId,
      userId: createdBy,
      metadata: { botId, ...metadata },
    });
  },

  async botUpdated(botId: string, workspaceId: string, updatedBy: string, changes: Record<string, any>) {
    await auditLog({
      action: 'BOT_UPDATED',
      resource: 'bots',
      workspaceId,
      userId: updatedBy,
      metadata: { botId, changes },
    });
  },

  // API Usage
  async apiCall(apiKeyId: string, endpoint: string, method: string, ip: string, userAgent: string) {
    await auditLog({
      action: 'API_CALL',
      resource: 'api',
      metadata: { apiKeyId, endpoint, method },
      ip,
      userAgent,
    });
  },

  async apiKeyCreated(apiKeyId: string, createdBy: string, workspaceId?: string) {
    await auditLog({
      action: 'API_KEY_CREATED',
      resource: 'api_keys',
      userId: createdBy,
      workspaceId,
      metadata: { apiKeyId },
    });
  },

  // Security Events
  async suspiciousActivity(userId: string, activity: string, metadata?: Record<string, any>) {
    await auditLog({
      action: 'SUSPICIOUS_ACTIVITY',
      resource: 'security',
      userId,
      metadata: { activity, ...metadata },
    });
  },

  async permissionDenied(userId: string, resource: string, action: string, metadata?: Record<string, any>) {
    await auditLog({
      action: 'PERMISSION_DENIED',
      resource,
      userId,
      metadata: { action, ...metadata },
    });
  },

  // Data Access
  async dataExported(userId: string, workspaceId: string, dataType: string, recordCount: number) {
    await auditLog({
      action: 'DATA_EXPORTED',
      resource: 'data',
      userId,
      workspaceId,
      metadata: { dataType, recordCount },
    });
  },

  async dataDeleted(userId: string, workspaceId: string, dataType: string, recordCount: number) {
    await auditLog({
      action: 'DATA_DELETED',
      resource: 'data',
      userId,
      workspaceId,
      metadata: { dataType, recordCount },
    });
  },
};

// Audit log query functions
export async function getAuditLogs(filters: {
  userId?: string;
  workspaceId?: string;
  action?: string;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) {
  const where: any = {};

  if (filters.userId) where.userId = filters.userId;
  if (filters.workspaceId) where.workspaceId = filters.workspaceId;
  if (filters.action) where.action = filters.action;
  if (filters.resource) where.resource = filters.resource;
  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) where.createdAt.gte = filters.startDate;
    if (filters.endDate) where.createdAt.lte = filters.endDate;
  }

  return await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: filters.limit || 100,
    skip: filters.offset || 0,
  });
}

export async function getAuditStats(workspaceId?: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const where: any = {
    createdAt: { gte: startDate },
  };

  if (workspaceId) where.workspaceId = workspaceId;

  const stats = await prisma.auditLog.groupBy({
    by: ['action'],
    where,
    _count: { action: true },
  });

  return stats.map(stat => ({
    action: stat.action,
    count: stat._count.action,
  }));
}
