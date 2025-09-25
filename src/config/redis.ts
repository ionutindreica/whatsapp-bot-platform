import { config } from '../lib/config';

// Redis configuration for different providers
export const redisConfig = {
  // Development - Local Redis
  development: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  },

  // Staging - Upstash Redis
  staging: {
    url: process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  },

  // Production - Managed Redis
  production: {
    url: process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL,
    password: process.env.REDIS_PASSWORD,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    // Cluster configuration for high availability
    cluster: process.env.REDIS_CLUSTER_NODES ? {
      nodes: process.env.REDIS_CLUSTER_NODES.split(','),
      options: {
        redisOptions: {
          password: process.env.REDIS_PASSWORD,
        },
      },
    } : undefined,
  },
};

// Redis providers configuration
export const redisProviders = {
  upstash: {
    name: 'Upstash',
    features: ['serverless', 'global', 'persistence', 'pub-sub'],
    restUrl: process.env.UPSTASH_REDIS_REST_URL,
    restToken: process.env.UPSTASH_REDIS_REST_TOKEN,
    websocketUrl: process.env.UPSTASH_REDIS_WEBSOCKET_URL,
    setup: {
      enablePersistence: true,
      enableGlobalReplication: true,
      enablePubSub: true,
    },
  },

  aws_elasticache: {
    name: 'AWS ElastiCache',
    features: ['cluster-mode', 'multi-az', 'backup', 'monitoring'],
    clusterEndpoint: process.env.ELASTICACHE_CLUSTER_ENDPOINT,
    password: process.env.ELASTICACHE_PASSWORD,
    setup: {
      enableMultiAZ: true,
      enableBackup: true,
      enableMonitoring: true,
      nodeType: 'cache.r6g.large',
    },
  },

  redis_cloud: {
    name: 'Redis Cloud',
    features: ['enterprise', 'clustering', 'modules', 'backup'],
    url: process.env.REDIS_CLOUD_URL,
    password: process.env.REDIS_CLOUD_PASSWORD,
    setup: {
      enableClustering: true,
      enableModules: true,
      enableBackup: true,
    },
  },

  local: {
    name: 'Local Redis',
    features: ['development', 'testing'],
    host: 'localhost',
    port: 6379,
    setup: {
      enablePersistence: false,
      maxMemory: '256mb',
    },
  },
};

// Cache configuration
export const cacheConfig = {
  // Session cache
  session: {
    ttl: 24 * 60 * 60, // 24 hours
    prefix: 'session:',
    maxSize: 10000,
  },

  // User cache
  user: {
    ttl: 60 * 60, // 1 hour
    prefix: 'user:',
    maxSize: 5000,
  },

  // Workspace cache
  workspace: {
    ttl: 30 * 60, // 30 minutes
    prefix: 'workspace:',
    maxSize: 1000,
  },

  // API response cache
  api: {
    ttl: 5 * 60, // 5 minutes
    prefix: 'api:',
    maxSize: 10000,
  },

  // Rate limiting cache
  rateLimit: {
    ttl: 60, // 1 minute
    prefix: 'rate_limit:',
    maxSize: 50000,
  },
};

// Queue configuration
export const queueConfig = {
  // Email queue
  email: {
    name: 'email',
    concurrency: 5,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  },

  // Webhook queue
  webhook: {
    name: 'webhook',
    concurrency: 10,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: 200,
    removeOnFail: 100,
  },

  // Analytics queue
  analytics: {
    name: 'analytics',
    concurrency: 3,
    attempts: 2,
    backoff: {
      type: 'fixed',
      delay: 5000,
    },
    removeOnComplete: 500,
    removeOnFail: 200,
  },

  // AI processing queue
  ai: {
    name: 'ai',
    concurrency: 2,
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 10000,
    },
    removeOnComplete: 50,
    removeOnFail: 25,
  },

  // Broadcast queue
  broadcast: {
    name: 'broadcast',
    concurrency: 1,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: 20,
    removeOnFail: 10,
  },
};

// Get current Redis configuration
export function getRedisConfig() {
  const env = process.env.NODE_ENV || 'development';
  const provider = process.env.REDIS_PROVIDER || 'upstash';
  
  const baseConfig = redisConfig[env as keyof typeof redisConfig];
  const providerConfig = redisProviders[provider as keyof typeof redisProviders];
  
  return {
    ...baseConfig,
    provider: providerConfig,
  };
}

// Redis health check
export async function checkRedisHealth() {
  const { redis } = await import('../lib/redis');
  
  try {
    const start = Date.now();
    await redis.ping();
    const duration = Date.now() - start;
    
    return {
      status: 'healthy',
      responseTime: duration,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

// Queue health check
export async function checkQueueHealth() {
  const { queueManager } = await import('../services/jobs/queue');
  
  try {
    const stats = await queueManager.getQueueStats();
    
    return {
      status: 'healthy',
      queues: stats,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

export default redisConfig;
