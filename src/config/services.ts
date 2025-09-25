// Centralized service configuration
import { databaseConfig } from './database';
import { redisConfig } from './redis';
import { storageConfig } from './storage';
import { secretsConfig } from './secrets';
import { monitoringConfig } from './monitoring';
import { cdnWafConfig } from './cdn-waf';
import { featureFlagsConfig } from './feature-flags';

// Service configuration for different environments
export const servicesConfig = {
  development: {
    database: {
      provider: 'local',
      url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/whatsapp_bot_dev',
      pooling: 'none',
    },
    redis: {
      provider: 'local',
      url: 'redis://localhost:6379',
    },
    storage: {
      provider: 'local',
      path: './uploads',
    },
    secrets: {
      provider: 'env',
    },
    monitoring: {
      provider: 'console',
      level: 'debug',
    },
    cdn: {
      provider: 'none',
    },
    features: {
      provider: 'local',
    },
  },

  staging: {
    database: {
      provider: 'neon',
      url: process.env.NEON_DATABASE_URL,
      pooling: 'prisma-data-proxy',
    },
    redis: {
      provider: 'upstash',
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    },
    storage: {
      provider: 's3',
      bucket: process.env.S3_BUCKET,
      region: process.env.S3_REGION,
    },
    secrets: {
      provider: 'aws-secrets-manager',
      region: process.env.AWS_REGION,
    },
    monitoring: {
      provider: 'sentry',
      dsn: process.env.SENTRY_DSN,
      level: 'info',
    },
    cdn: {
      provider: 'cloudflare',
      zoneId: process.env.CLOUDFLARE_ZONE_ID,
    },
    features: {
      provider: 'unleash',
      url: process.env.UNLEASH_URL,
    },
  },

  production: {
    database: {
      provider: 'aws-rds',
      primary: process.env.DATABASE_PRIMARY_URL,
      replica: process.env.DATABASE_REPLICA_URL,
      pooling: 'pgbouncer',
    },
    redis: {
      provider: 'aws-elasticache',
      cluster: process.env.ELASTICACHE_CLUSTER_ENDPOINT,
      password: process.env.ELASTICACHE_PASSWORD,
    },
    storage: {
      provider: 's3',
      bucket: process.env.S3_BUCKET,
      region: process.env.S3_REGION,
      cdn: process.env.CLOUDFRONT_DISTRIBUTION_ID,
    },
    secrets: {
      provider: 'vault',
      url: process.env.VAULT_URL,
      token: process.env.VAULT_TOKEN,
    },
    monitoring: {
      provider: 'full',
      sentry: process.env.SENTRY_DSN,
      prometheus: true,
      grafana: true,
      level: 'warn',
    },
    cdn: {
      provider: 'cloudflare',
      zoneId: process.env.CLOUDFLARE_ZONE_ID,
      waf: true,
      workers: true,
    },
    features: {
      provider: 'launchdarkly',
      sdkKey: process.env.LAUNCHDARKLY_SDK_KEY,
    },
  },
};

// Service health configuration
export const healthConfig = {
  endpoints: [
    {
      name: 'database',
      check: 'database',
      interval: 30000,
      timeout: 5000,
    },
    {
      name: 'redis',
      check: 'redis',
      interval: 30000,
      timeout: 5000,
    },
    {
      name: 'storage',
      check: 'storage',
      interval: 60000,
      timeout: 10000,
    },
    {
      name: 'cdn',
      check: 'cdn',
      interval: 120000,
      timeout: 15000,
    },
    {
      name: 'external-apis',
      check: 'external',
      interval: 300000,
      timeout: 20000,
    },
  ],
  thresholds: {
    consecutiveFailures: 3,
    responseTime: 5000,
  },
};

// Service initialization order
export const initializationOrder = [
  'secrets',
  'database',
  'redis',
  'storage',
  'monitoring',
  'cdn',
  'features',
];

// Get current service configuration
export function getServiceConfig() {
  const env = process.env.NODE_ENV || 'development';
  return servicesConfig[env as keyof typeof servicesConfig];
}

// Initialize all services
export async function initializeServices() {
  const config = getServiceConfig();
  const results: Record<string, { status: 'success' | 'error'; error?: string }> = {};

  console.log('🚀 Initializing services...');

  for (const service of initializationOrder) {
    try {
      console.log(`📦 Initializing ${service}...`);
      
      switch (service) {
        case 'secrets':
          await initializeSecrets(config.secrets);
          break;
        case 'database':
          await initializeDatabase(config.database);
          break;
        case 'redis':
          await initializeRedis(config.redis);
          break;
        case 'storage':
          await initializeStorage(config.storage);
          break;
        case 'monitoring':
          await initializeMonitoring(config.monitoring);
          break;
        case 'cdn':
          await initializeCdn(config.cdn);
          break;
        case 'features':
          await initializeFeatures(config.features);
          break;
      }
      
      results[service] = { status: 'success' };
      console.log(`✅ ${service} initialized successfully`);
    } catch (error) {
      results[service] = { status: 'error', error: error.message };
      console.error(`❌ ${service} initialization failed:`, error.message);
      
      // Don't fail the entire startup for non-critical services
      if (service === 'cdn' || service === 'features') {
        console.warn(`⚠️  Continuing without ${service}`);
      } else {
        throw error;
      }
    }
  }

  console.log('🎉 Service initialization completed');
  return results;
}

// Service initialization functions
async function initializeSecrets(config: any) {
  const { secretsManager } = await import('./secrets');
  await secretsManager.validateSecrets();
}

async function initializeDatabase(config: any) {
  const { prisma } = await import('../lib/prisma');
  await prisma.$connect();
}

async function initializeRedis(config: any) {
  const { redis } = await import('../lib/redis');
  await redis.connect();
}

async function initializeStorage(config: any) {
  const { storageService } = await import('../services/storage');
  await storageService.initialize();
}

async function initializeMonitoring(config: any) {
  const { initializeMonitoring } = await import('./monitoring');
  initializeMonitoring();
}

async function initializeCdn(config: any) {
  if (config.provider === 'cloudflare') {
    const { checkCdnHealth } = await import('./cdn-waf');
    await checkCdnHealth();
  }
}

async function initializeFeatures(config: any) {
  const { featureFlags } = await import('./feature-flags');
  // Feature flags are initialized in the constructor
}

// Health check for all services
export async function checkAllServicesHealth() {
  const config = getServiceConfig();
  const results: Record<string, any> = {};

  for (const endpoint of healthConfig.endpoints) {
    try {
      switch (endpoint.check) {
        case 'database':
          const { checkDatabaseHealth } = await import('./database');
          results.database = await checkDatabaseHealth();
          break;
        case 'redis':
          const { checkRedisHealth } = await import('./redis');
          results.redis = await checkRedisHealth();
          break;
        case 'storage':
          const { checkStorageHealth } = await import('./storage');
          results.storage = await checkStorageHealth();
          break;
        case 'cdn':
          const { checkCdnHealth } = await import('./cdn-waf');
          results.cdn = await checkCdnHealth();
          break;
        case 'external':
          results.external = await checkExternalServices();
          break;
      }
    } catch (error) {
      results[endpoint.check] = {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  return results;
}

// Check external services
async function checkExternalServices() {
  const services = [
    { name: 'WhatsApp API', url: 'https://graph.facebook.com/v18.0' },
    { name: 'OpenAI API', url: 'https://api.openai.com/v1' },
  ];

  const results = [];

  for (const service of services) {
    try {
      const start = Date.now();
      const response = await fetch(service.url, { method: 'HEAD' });
      const duration = Date.now() - start;

      results.push({
        name: service.name,
        status: response.ok ? 'healthy' : 'unhealthy',
        responseTime: duration,
        httpStatus: response.status,
      });
    } catch (error) {
      results.push({
        name: service.name,
        status: 'unhealthy',
        error: error.message,
      });
    }
  }

  return {
    status: results.every(r => r.status === 'healthy') ? 'healthy' : 'unhealthy',
    services: results,
    timestamp: new Date().toISOString(),
  };
}

// Service shutdown
export async function shutdownServices() {
  console.log('🛑 Shutting down services...');

  try {
    const { prisma } = await import('../lib/prisma');
    await prisma.$disconnect();
    console.log('✅ Database disconnected');
  } catch (error) {
    console.error('❌ Database disconnect failed:', error.message);
  }

  try {
    const { redis } = await import('../lib/redis');
    await redis.disconnect();
    console.log('✅ Redis disconnected');
  } catch (error) {
    console.error('❌ Redis disconnect failed:', error.message);
  }

  console.log('🎉 Service shutdown completed');
}

export default servicesConfig;
