import { NextRequest } from 'next/server';
import { redis } from './redis';
import { logger } from './logger';

interface RateLimitOptions {
  interval: number;
  uniqueTokenPerInterval: number;
}

export function rateLimit(options: RateLimitOptions) {
  return {
    check: async (limit: number, token: string): Promise<void> => {
      const key = `rate_limit:${token}`;
      
      try {
        const current = await redis.incr(key);
        
        if (current === 1) {
          await redis.expire(key, Math.floor(options.interval / 1000));
        }
        
        if (current > limit) {
          logger.warn('Rate limit exceeded', {
            token: token.substring(0, 8) + '...',
            current,
            limit,
            interval: options.interval
          });
          
          throw new Error('Rate limit exceeded');
        }
        
        logger.debug('Rate limit check passed', {
          token: token.substring(0, 8) + '...',
          current,
          limit
        });
      } catch (error) {
        if (error instanceof Error && error.message === 'Rate limit exceeded') {
          throw error;
        }
        
        logger.error('Rate limit check failed', { error: error.message, token: token.substring(0, 8) + '...' });
        // Allow request to proceed if Redis is down
      }
    }
  };
}

// API Key rate limiting
export async function checkApiKeyRateLimit(apiKey: string, limit: number, window: number): Promise<boolean> {
  const key = `api_rate_limit:${apiKey}`;
  
  try {
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, window);
    }
    
    return current <= limit;
  } catch (error) {
    logger.error('API key rate limit check failed', { error: error.message, apiKey: apiKey.substring(0, 8) + '...' });
    // Allow request to proceed if Redis is down
    return true;
  }
}

// IP-based rate limiting
export async function checkIpRateLimit(ip: string, limit: number, window: number): Promise<boolean> {
  const key = `ip_rate_limit:${ip}`;
  
  try {
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, window);
    }
    
    if (current > limit) {
      logger.warn('IP rate limit exceeded', { ip, current, limit });
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('IP rate limit check failed', { error: error.message, ip });
    // Allow request to proceed if Redis is down
    return true;
  }
}

// User-based rate limiting
export async function checkUserRateLimit(userId: string, limit: number, window: number): Promise<boolean> {
  const key = `user_rate_limit:${userId}`;
  
  try {
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, window);
    }
    
    if (current > limit) {
      logger.warn('User rate limit exceeded', { userId, current, limit });
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('User rate limit check failed', { error: error.message, userId });
    // Allow request to proceed if Redis is down
    return true;
  }
}

// Workspace-based rate limiting
export async function checkWorkspaceRateLimit(workspaceId: string, limit: number, window: number): Promise<boolean> {
  const key = `workspace_rate_limit:${workspaceId}`;
  
  try {
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, window);
    }
    
    if (current > limit) {
      logger.warn('Workspace rate limit exceeded', { workspaceId, current, limit });
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Workspace rate limit check failed', { error: error.message, workspaceId });
    // Allow request to proceed if Redis is down
    return true;
  }
}

// Dynamic rate limiting based on plan tier
export const planRateLimits = {
  STARTER: {
    api_calls: 1000,
    messages: 5000,
    webhooks: 100,
  },
  PRO: {
    api_calls: 10000,
    messages: 50000,
    webhooks: 1000,
  },
  ENTERPRISE: {
    api_calls: 100000,
    messages: 500000,
    webhooks: 10000,
  },
};

export async function checkPlanRateLimit(
  workspaceId: string, 
  planTier: keyof typeof planRateLimits,
  resource: keyof typeof planRateLimits.STARTER,
  window: number = 3600 // 1 hour
): Promise<boolean> {
  const limit = planRateLimits[planTier][resource];
  const key = `plan_rate_limit:${workspaceId}:${resource}`;
  
  try {
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, window);
    }
    
    if (current > limit) {
      logger.warn('Plan rate limit exceeded', { 
        workspaceId, 
        planTier, 
        resource, 
        current, 
        limit 
      });
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Plan rate limit check failed', { 
      error: error.message, 
      workspaceId, 
      planTier, 
      resource 
    });
    // Allow request to proceed if Redis is down
    return true;
  }
}
