import { config } from '../lib/config';

// Database configuration for different environments
export const databaseConfig = {
  // Development - Local PostgreSQL
  development: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/whatsapp_bot_dev',
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    },
  },

  // Staging - Neon/Supabase with connection pooling
  staging: {
    url: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.SUPABASE_DATABASE_URL,
    pool: {
      min: 5,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    },
  },

  // Production - Managed PostgreSQL with read replicas
  production: {
    primary: {
      url: process.env.DATABASE_PRIMARY_URL || process.env.DATABASE_URL,
      pool: {
        min: 10,
        max: 50,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      },
    },
    replica: {
      url: process.env.DATABASE_REPLICA_URL,
      pool: {
        min: 5,
        max: 25,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      },
    },
  },
};

// Connection pooling strategies
export const poolingStrategies = {
  // For serverless (Vercel, Netlify)
  serverless: {
    provider: 'prisma-data-proxy',
    config: {
      url: process.env.DATABASE_URL,
      // Prisma Data Proxy handles pooling automatically
    },
  },

  // For serverful (Docker, VMs, K8s)
  serverful: {
    provider: 'pgbouncer',
    config: {
      url: process.env.DATABASE_URL_WITH_PGBOUNCER || process.env.DATABASE_URL,
      pool_mode: 'transaction', // or 'session' for long-lived connections
      max_client_conn: 1000,
      default_pool_size: 25,
    },
  },

  // For managed services (Railway, Render, Heroku)
  managed: {
    provider: 'native-pooling',
    config: {
      url: process.env.DATABASE_URL,
      pool: {
        min: 5,
        max: 20,
        acquireTimeoutMillis: 60000,
        createTimeoutMillis: 30000,
        destroyTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 200,
      },
    },
  },
};

// Database providers configuration
export const databaseProviders = {
  neon: {
    name: 'Neon',
    features: ['serverless', 'autoscaling', 'branching', 'point-in-time-recovery'],
    connectionString: process.env.NEON_DATABASE_URL,
    poolerUrl: process.env.NEON_POOLER_URL,
    setup: {
      enableLogging: true,
      enableMetrics: true,
      enableBackups: true,
    },
  },

  supabase: {
    name: 'Supabase',
    features: ['realtime', 'auth', 'storage', 'edge-functions'],
    connectionString: process.env.SUPABASE_DATABASE_URL,
    poolerUrl: process.env.SUPABASE_POOLER_URL,
    setup: {
      enableRealtime: true,
      enableRLS: true,
      enableBackups: true,
    },
  },

  aws_rds: {
    name: 'Amazon RDS',
    features: ['multi-az', 'read-replicas', 'automated-backups', 'performance-insights'],
    connectionString: process.env.AWS_RDS_DATABASE_URL,
    setup: {
      enableMultiAZ: true,
      enableReadReplicas: true,
      enableAutomatedBackups: true,
      backupRetentionPeriod: 7,
    },
  },

  planet_scale: {
    name: 'PlanetScale',
    features: ['serverless', 'branching', 'vitess', 'zero-downtime-schema-changes'],
    connectionString: process.env.PLANETSCALE_DATABASE_URL,
    setup: {
      enableBranching: true,
      enableVitess: true,
      enableSchemaMigrations: true,
    },
  },
};

// Get current database configuration
export function getDatabaseConfig() {
  const env = process.env.NODE_ENV || 'development';
  const provider = process.env.DATABASE_PROVIDER || 'neon';
  
  const baseConfig = databaseConfig[env as keyof typeof databaseConfig];
  const providerConfig = databaseProviders[provider as keyof typeof databaseProviders];
  
  return {
    ...baseConfig,
    provider: providerConfig,
    pooling: poolingStrategies[process.env.POOLING_STRATEGY as keyof typeof poolingStrategies] || poolingStrategies.serverless,
  };
}

// Database health check
export async function checkDatabaseHealth() {
  const { prisma } = await import('../lib/prisma');
  
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
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

// Read replica configuration for read-heavy operations
export function getReadReplicaConfig() {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'production' && process.env.DATABASE_REPLICA_URL) {
    return {
      url: process.env.DATABASE_REPLICA_URL,
      pool: {
        min: 5,
        max: 25,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      },
    };
  }
  
  // Fallback to primary database
  return databaseConfig[env as keyof typeof databaseConfig];
}

export default databaseConfig;
