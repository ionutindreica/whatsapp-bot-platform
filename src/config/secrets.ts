import { config } from '../lib/config';

// Secrets management configuration
export const secretsConfig = {
  // Development - Environment variables
  development: {
    provider: 'env',
    fallbackToEnv: true,
    cacheSecrets: false,
  },

  // Staging - AWS Secrets Manager
  staging: {
    provider: 'aws-secrets-manager',
    region: process.env.AWS_REGION || 'us-east-1',
    cacheSecrets: true,
    cacheTtl: 300, // 5 minutes
  },

  // Production - HashiCorp Vault
  production: {
    provider: 'vault',
    vaultUrl: process.env.VAULT_URL,
    vaultToken: process.env.VAULT_TOKEN,
    cacheSecrets: true,
    cacheTtl: 60, // 1 minute
  },
};

// Secrets providers configuration
export const secretsProviders = {
  'aws-secrets-manager': {
    name: 'AWS Secrets Manager',
    features: ['encryption', 'rotation', 'audit', 'integration'],
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    setup: {
      enableRotation: true,
      enableAudit: true,
      enableIntegration: true,
    },
  },

  'gcp-secret-manager': {
    name: 'Google Cloud Secret Manager',
    features: ['encryption', 'iam', 'audit', 'versioning'],
    projectId: process.env.GCP_PROJECT_ID,
    credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    setup: {
      enableIam: true,
      enableAudit: true,
      enableVersioning: true,
    },
  },

  vault: {
    name: 'HashiCorp Vault',
    features: ['encryption', 'dynamic-secrets', 'audit', 'policies'],
    url: process.env.VAULT_URL,
    token: process.env.VAULT_TOKEN,
    setup: {
      enableDynamicSecrets: true,
      enableAudit: true,
      enablePolicies: true,
    },
  },

  env: {
    name: 'Environment Variables',
    features: ['simple', 'fast'],
    setup: {
      enableValidation: true,
    },
  },
};

// Secret keys configuration
export const secretKeys = {
  // Database
  database: {
    primary: 'DATABASE_URL',
    replica: 'DATABASE_REPLICA_URL',
    pooler: 'DATABASE_POOLER_URL',
  },

  // Redis
  redis: {
    url: 'REDIS_URL',
    password: 'REDIS_PASSWORD',
    restUrl: 'UPSTASH_REDIS_REST_URL',
    restToken: 'UPSTASH_REDIS_REST_TOKEN',
  },

  // Authentication
  auth: {
    nextauthSecret: 'NEXTAUTH_SECRET',
    jwtSecret: 'JWT_SECRET',
    sessionSecret: 'SESSION_SECRET',
  },

  // API Keys
  apis: {
    openai: 'OPENAI_API_KEY',
    whatsapp: 'WHATSAPP_API_KEY',
    facebook: 'FACEBOOK_APP_SECRET',
    instagram: 'INSTAGRAM_ACCESS_TOKEN',
  },

  // Storage
  storage: {
    awsAccessKey: 'AWS_ACCESS_KEY_ID',
    awsSecretKey: 'AWS_SECRET_ACCESS_KEY',
    s3Bucket: 'S3_BUCKET',
    doSpacesKey: 'DO_SPACES_ACCESS_KEY',
    doSpacesSecret: 'DO_SPACES_SECRET_KEY',
  },

  // Monitoring
  monitoring: {
    sentryDsn: 'SENTRY_DSN',
    datadogApiKey: 'DATADOG_API_KEY',
    newRelicLicenseKey: 'NEW_RELIC_LICENSE_KEY',
  },

  // Email
  email: {
    smtpHost: 'SMTP_HOST',
    smtpUser: 'SMTP_USER',
    smtpPass: 'SMTP_PASS',
    sendgridApiKey: 'SENDGRID_API_KEY',
  },

  // Webhooks
  webhooks: {
    secret: 'WEBHOOK_SECRET',
    whatsappVerifyToken: 'WHATSAPP_VERIFY_TOKEN',
    facebookVerifyToken: 'FACEBOOK_VERIFY_TOKEN',
  },
};

// Secret rotation configuration
export const rotationConfig = {
  database: {
    enabled: true,
    rotationInterval: 90, // days
    notificationDays: [30, 14, 7, 1], // days before expiry
  },

  apiKeys: {
    enabled: true,
    rotationInterval: 365, // days
    notificationDays: [30, 14, 7, 1],
  },

  certificates: {
    enabled: true,
    rotationInterval: 365, // days
    notificationDays: [60, 30, 14, 7, 1],
  },
};

// Get current secrets configuration
export function getSecretsConfig() {
  const env = process.env.NODE_ENV || 'development';
  const provider = process.env.SECRETS_PROVIDER || 'env';
  
  const baseConfig = secretsConfig[env as keyof typeof secretsConfig];
  const providerConfig = secretsProviders[provider as keyof typeof secretsProviders];
  
  return {
    ...baseConfig,
    provider: providerConfig,
  };
}

// Secrets manager class
export class SecretsManager {
  private cache: Map<string, { value: string; expires: number }> = new Map();
  private config: any;

  constructor() {
    this.config = getSecretsConfig();
  }

  async getSecret(key: string): Promise<string> {
    // Check cache first
    if (this.config.cacheSecrets) {
      const cached = this.cache.get(key);
      if (cached && cached.expires > Date.now()) {
        return cached.value;
      }
    }

    let value: string;

    switch (this.config.provider.name) {
      case 'AWS Secrets Manager':
        value = await this.getAwsSecret(key);
        break;
      case 'Google Cloud Secret Manager':
        value = await this.getGcpSecret(key);
        break;
      case 'HashiCorp Vault':
        value = await this.getVaultSecret(key);
        break;
      default:
        value = process.env[key] || '';
    }

    // Cache the secret
    if (this.config.cacheSecrets && value) {
      const ttl = this.config.cacheTtl * 1000;
      this.cache.set(key, {
        value,
        expires: Date.now() + ttl,
      });
    }

    return value;
  }

  private async getAwsSecret(key: string): Promise<string> {
    const AWS = require('aws-sdk');
    const secretsManager = new AWS.SecretsManager({
      region: this.config.region,
    });

    try {
      const result = await secretsManager.getSecretValue({ SecretId: key }).promise();
      return result.SecretString;
    } catch (error) {
      console.error(`Failed to get secret ${key} from AWS Secrets Manager:`, error);
      return process.env[key] || '';
    }
  }

  private async getGcpSecret(key: string): Promise<string> {
    const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
    const client = new SecretManagerServiceClient();

    try {
      const [version] = await client.accessSecretVersion({
        name: `projects/${this.config.projectId}/secrets/${key}/versions/latest`,
      });
      return version.payload.data.toString();
    } catch (error) {
      console.error(`Failed to get secret ${key} from GCP Secret Manager:`, error);
      return process.env[key] || '';
    }
  }

  private async getVaultSecret(key: string): Promise<string> {
    const vault = require('node-vault')({
      apiVersion: 'v1',
      endpoint: this.config.vaultUrl,
      token: this.config.vaultToken,
    });

    try {
      const result = await vault.read(`secret/${key}`);
      return result.data.value;
    } catch (error) {
      console.error(`Failed to get secret ${key} from Vault:`, error);
      return process.env[key] || '';
    }
  }

  // Validate all required secrets
  async validateSecrets(): Promise<{ valid: boolean; missing: string[] }> {
    const missing: string[] = [];

    for (const [category, keys] of Object.entries(secretKeys)) {
      for (const [name, key] of Object.entries(keys)) {
        const value = await this.getSecret(key);
        if (!value) {
          missing.push(`${category}.${name} (${key})`);
        }
      }
    }

    return {
      valid: missing.length === 0,
      missing,
    };
  }
}

// Global secrets manager instance
export const secretsManager = new SecretsManager();

export default secretsConfig;
