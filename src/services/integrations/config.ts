import { config as appConfig } from '../../lib/config';

export const config = {
  // WhatsApp Configuration
  WHATSAPP: {
    API_KEY: appConfig.WHATSAPP_API_KEY || process.env.WHATSAPP_API_KEY,
    PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
    VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN,
    WEBHOOK_URL: process.env.WHATSAPP_WEBHOOK_URL,
  },

  // Facebook Messenger Configuration
  MESSENGER: {
    APP_ID: appConfig.FACEBOOK_APP_ID || process.env.FACEBOOK_APP_ID,
    APP_SECRET: appConfig.FACEBOOK_APP_SECRET || process.env.FACEBOOK_APP_SECRET,
    PAGE_ID: process.env.FACEBOOK_PAGE_ID,
    VERIFY_TOKEN: process.env.FACEBOOK_VERIFY_TOKEN,
    WEBHOOK_URL: process.env.FACEBOOK_WEBHOOK_URL,
  },

  // Instagram Configuration
  INSTAGRAM: {
    ACCESS_TOKEN: appConfig.INSTAGRAM_ACCESS_TOKEN || process.env.INSTAGRAM_ACCESS_TOKEN,
    USER_ID: process.env.INSTAGRAM_USER_ID,
    WEBHOOK_URL: process.env.INSTAGRAM_WEBHOOK_URL,
  },

  // OpenAI Configuration
  OPENAI: {
    API_KEY: appConfig.OPENAI_API_KEY || process.env.OPENAI_API_KEY,
    MODEL: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    MAX_TOKENS: parseInt(process.env.OPENAI_MAX_TOKENS || '1000'),
    TEMPERATURE: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
  },

  // Email Configuration
  EMAIL: {
    SMTP_HOST: appConfig.SMTP_HOST || process.env.SMTP_HOST,
    SMTP_PORT: parseInt(appConfig.SMTP_PORT || process.env.SMTP_PORT || '587'),
    SMTP_USER: appConfig.SMTP_USER || process.env.SMTP_USER,
    SMTP_PASS: appConfig.SMTP_PASS || process.env.SMTP_PASS,
    FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
    FROM_NAME: process.env.FROM_NAME || 'WhatsApp Bot Platform',
  },

  // File Storage Configuration
  STORAGE: {
    TYPE: process.env.STORAGE_TYPE || 'local', // 'local', 's3', 'gcs'
    AWS_ACCESS_KEY_ID: appConfig.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: appConfig.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: appConfig.AWS_REGION || process.env.AWS_REGION || 'us-east-1',
    AWS_S3_BUCKET: appConfig.AWS_S3_BUCKET || process.env.AWS_S3_BUCKET,
    LOCAL_STORAGE_PATH: process.env.LOCAL_STORAGE_PATH || './uploads',
  },

  // Webhook Configuration
  WEBHOOK: {
    SECRET: process.env.WEBHOOK_SECRET,
    TIMEOUT: parseInt(process.env.WEBHOOK_TIMEOUT || '10000'),
    MAX_RETRIES: parseInt(process.env.WEBHOOK_MAX_RETRIES || '3'),
    RETRY_DELAY: parseInt(process.env.WEBHOOK_RETRY_DELAY || '1000'),
  },

  // Rate Limiting Configuration
  RATE_LIMIT: {
    ENABLED: process.env.RATE_LIMIT_ENABLED === 'true',
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    SKIP_SUCCESSFUL_REQUESTS: process.env.RATE_LIMIT_SKIP_SUCCESSFUL === 'true',
    SKIP_FAILED_REQUESTS: process.env.RATE_LIMIT_SKIP_FAILED === 'true',
  },

  // Security Configuration
  SECURITY: {
    CORS_ORIGIN: appConfig.CORS_ORIGIN || process.env.CORS_ORIGIN,
    TRUSTED_PROXIES: appConfig.TRUSTED_PROXIES || process.env.TRUSTED_PROXIES,
    SESSION_SECRET: process.env.SESSION_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  },

  // Monitoring Configuration
  MONITORING: {
    SENTRY_DSN: appConfig.SENTRY_DSN || process.env.SENTRY_DSN,
    LOG_LEVEL: appConfig.LOG_LEVEL || process.env.LOG_LEVEL || 'info',
    ENABLE_METRICS: process.env.ENABLE_METRICS === 'true',
    METRICS_PORT: parseInt(process.env.METRICS_PORT || '9090'),
  },

  // Feature Flags
  FEATURES: {
    ENABLE_WHATSAPP: process.env.ENABLE_WHATSAPP !== 'false',
    ENABLE_MESSENGER: process.env.ENABLE_MESSENGER !== 'false',
    ENABLE_INSTAGRAM: process.env.ENABLE_INSTAGRAM !== 'false',
    ENABLE_AI: process.env.ENABLE_AI !== 'false',
    ENABLE_WEBHOOKS: process.env.ENABLE_WEBHOOKS !== 'false',
    ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS !== 'false',
    ENABLE_BROADCAST: process.env.ENABLE_BROADCAST !== 'false',
  },
};

export default config;
