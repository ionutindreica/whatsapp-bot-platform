import { config } from '../lib/config';

// Object storage configuration for different providers
export const storageConfig = {
  // Development - Local storage
  development: {
    provider: 'local',
    path: process.env.LOCAL_STORAGE_PATH || './uploads',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'],
  },

  // Staging - AWS S3
  staging: {
    provider: 's3',
    bucket: process.env.S3_BUCKET || 'whatsapp-bot-staging',
    region: process.env.S3_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain', 'video/mp4', 'audio/mpeg'],
  },

  // Production - Multi-provider setup
  production: {
    provider: process.env.STORAGE_PROVIDER || 's3',
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain', 'video/mp4', 'audio/mpeg', 'application/zip'],
  },
};

// Storage providers configuration
export const storageProviders = {
  aws_s3: {
    name: 'AWS S3',
    features: ['versioning', 'lifecycle', 'encryption', 'cdn'],
    bucket: process.env.S3_BUCKET,
    region: process.env.S3_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    setup: {
      enableVersioning: true,
      enableLifecycle: true,
      enableEncryption: true,
      enableCloudFront: true,
      cors: {
        allowedOrigins: ['*'],
        allowedMethods: ['GET', 'PUT', 'POST', 'DELETE'],
        allowedHeaders: ['*'],
        maxAge: 3600,
      },
    },
  },

  digitalocean_spaces: {
    name: 'DigitalOcean Spaces',
    features: ['cdn', 'versioning', 'lifecycle'],
    bucket: process.env.DO_SPACES_BUCKET,
    region: process.env.DO_SPACES_REGION || 'nyc3',
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY,
    endpoint: process.env.DO_SPACES_ENDPOINT,
    setup: {
      enableCDN: true,
      enableVersioning: true,
      enableLifecycle: true,
    },
  },

  backblaze_b2: {
    name: 'Backblaze B2',
    features: ['low-cost', 'api', 'lifecycle'],
    bucket: process.env.B2_BUCKET,
    applicationKeyId: process.env.B2_APPLICATION_KEY_ID,
    applicationKey: process.env.B2_APPLICATION_KEY,
    setup: {
      enableLifecycle: true,
      enableApiAccess: true,
    },
  },

  cloudflare_r2: {
    name: 'Cloudflare R2',
    features: ['zero-egress', 'global', 'lifecycle'],
    bucket: process.env.R2_BUCKET,
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    setup: {
      enableLifecycle: true,
      enableGlobalDistribution: true,
    },
  },

  local: {
    name: 'Local Storage',
    features: ['development', 'testing'],
    path: './uploads',
    setup: {
      enableCompression: false,
      maxFileSize: 10 * 1024 * 1024,
    },
  },
};

// File upload configuration
export const uploadConfig = {
  // Image processing
  images: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    resize: {
      thumbnails: [
        { width: 150, height: 150, quality: 80 },
        { width: 300, height: 300, quality: 85 },
        { width: 600, height: 600, quality: 90 },
      ],
    },
  },

  // Document processing
  documents: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },

  // Media files
  media: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['video/mp4', 'audio/mpeg', 'audio/wav'],
  },

  // Archives
  archives: {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['application/zip', 'application/x-rar-compressed'],
  },
};

// CDN configuration
export const cdnConfig = {
  cloudflare: {
    zoneId: process.env.CLOUDFLARE_ZONE_ID,
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
    domain: process.env.CLOUDFLARE_DOMAIN,
    setup: {
      enableCaching: true,
      cacheLevel: 'aggressive',
      browserCacheTtl: 31536000, // 1 year
      edgeCacheTtl: 86400, // 1 day
    },
  },

  aws_cloudfront: {
    distributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
    domain: process.env.CLOUDFRONT_DOMAIN,
    setup: {
      enableCaching: true,
      defaultCacheBehavior: {
        viewerProtocolPolicy: 'redirect-to-https',
        cachePolicyId: '4135ea2d-6df8-44a3-9df3-4b5a84be39ad', // CachingOptimized
      },
    },
  },
};

// Get current storage configuration
export function getStorageConfig() {
  const env = process.env.NODE_ENV || 'development';
  const provider = process.env.STORAGE_PROVIDER || 'local';
  
  const baseConfig = storageConfig[env as keyof typeof storageConfig];
  const providerConfig = storageProviders[provider as keyof typeof storageProviders];
  
  return {
    ...baseConfig,
    provider: providerConfig,
  };
}

// Storage health check
export async function checkStorageHealth() {
  const { storageService } = await import('../services/storage');
  
  try {
    const start = Date.now();
    // Test upload a small file
    const testFile = Buffer.from('test');
    const uploadResult = await storageService.upload('health-check.txt', testFile, 'text/plain');
    const duration = Date.now() - start;
    
    // Clean up test file
    await storageService.delete(uploadResult.key);
    
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

export default storageConfig;
