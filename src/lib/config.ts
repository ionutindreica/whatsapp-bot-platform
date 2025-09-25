import { z } from 'zod';

const configSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  
  // Redis
  REDIS_URL: z.string().url().optional(),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  
  // API Keys
  OPENAI_API_KEY: z.string().optional(),
  WHATSAPP_API_KEY: z.string().optional(),
  FACEBOOK_APP_ID: z.string().optional(),
  FACEBOOK_APP_SECRET: z.string().optional(),
  INSTAGRAM_ACCESS_TOKEN: z.string().optional(),
  
  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  
  // File Storage
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
  
  // Monitoring
  SENTRY_DSN: z.string().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('60000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
  
  // Security
  CORS_ORIGIN: z.string().optional(),
  TRUSTED_PROXIES: z.string().optional(),
});

const parseConfig = () => {
  try {
    return configSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment configuration:', error);
    process.exit(1);
  }
};

export const config = parseConfig();

// Additional configuration helpers
export const isDevelopment = config.NODE_ENV === 'development';
export const isProduction = config.NODE_ENV === 'production';
export const isTest = config.NODE_ENV === 'test';

// Feature flags
export const features = {
  ENABLE_2FA: process.env.ENABLE_2FA === 'true',
  ENABLE_SSO: process.env.ENABLE_SSO === 'true',
  ENABLE_WEBHOOKS: process.env.ENABLE_WEBHOOKS === 'true',
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS === 'true',
  ENABLE_AUDIT_LOGS: process.env.ENABLE_AUDIT_LOGS === 'true',
};

// API Configuration
export const apiConfig = {
  VERSION: 'v1',
  BASE_URL: process.env.API_BASE_URL || '/api',
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
};

// Database Configuration
export const dbConfig = {
  CONNECTION_LIMIT: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
  ACQUIRE_TIMEOUT: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '60000'),
  TIMEOUT: parseInt(process.env.DB_TIMEOUT || '60000'),
};

// Redis Configuration
export const redisConfig = {
  CONNECTION_TIMEOUT: 10000,
  COMMAND_TIMEOUT: 5000,
  RETRY_DELAY_ON_FAILURE: 100,
  MAX_RETRIES_PER_REQUEST: 3,
};

// Security Configuration
export const securityConfig = {
  SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_TOKEN_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SYMBOLS: true,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
};

export default config;
