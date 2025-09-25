import { createClient } from 'redis';
import { logger } from './logger';

const globalForRedis = globalThis as unknown as {
  redis: ReturnType<typeof createClient> | undefined;
};

export const redis =
  globalForRedis.redis ??
  createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
      reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
    },
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

// Redis connection management
export const connectRedis = async () => {
  if (!redis.isOpen) {
    try {
      await redis.connect();
      logger.info('Redis connected successfully');
    } catch (error) {
      logger.error('Redis connection failed:', error);
      throw error;
    }
  }
};

export const disconnectRedis = async () => {
  if (redis.isOpen) {
    await redis.disconnect();
    logger.info('Redis disconnected');
  }
};

// Redis utilities
export const redisUtils = {
  // Session management
  async setSession(sessionId: string, data: any, ttl: number = 3600) {
    await redis.setEx(`session:${sessionId}`, ttl, JSON.stringify(data));
  },

  async getSession(sessionId: string) {
    const data = await redis.get(`session:${sessionId}`);
    return data ? JSON.parse(data) : null;
  },

  async deleteSession(sessionId: string) {
    await redis.del(`session:${sessionId}`);
  },

  // Rate limiting
  async checkRateLimit(key: string, limit: number, window: number) {
    const current = await redis.incr(`rate_limit:${key}`);
    if (current === 1) {
      await redis.expire(`rate_limit:${key}`, window);
    }
    return current <= limit;
  },

  // Cache management
  async setCache(key: string, value: any, ttl: number = 300) {
    await redis.setEx(`cache:${key}`, ttl, JSON.stringify(value));
  },

  async getCache(key: string) {
    const data = await redis.get(`cache:${key}`);
    return data ? JSON.parse(data) : null;
  },

  async deleteCache(key: string) {
    await redis.del(`cache:${key}`);
  },

  // Pub/Sub for realtime features
  async publish(channel: string, message: any) {
    await redis.publish(channel, JSON.stringify(message));
  },

  async subscribe(channel: string, callback: (message: any) => void) {
    const subscriber = redis.duplicate();
    await subscriber.connect();
    await subscriber.subscribe(channel, (message) => {
      callback(JSON.parse(message));
    });
    return subscriber;
  },
};

export default redis;
