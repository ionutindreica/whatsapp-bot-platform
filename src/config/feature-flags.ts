import { config } from '../lib/config';

// Feature flags configuration
export const featureFlagsConfig = {
  // Development - All features enabled
  development: {
    provider: 'unleash',
    environment: 'development',
    enableAllFeatures: true,
    cacheTtl: 60, // 1 minute
  },

  // Staging - Selective features
  staging: {
    provider: 'unleash',
    environment: 'staging',
    enableAllFeatures: false,
    cacheTtl: 300, // 5 minutes
  },

  // Production - Controlled rollout
  production: {
    provider: 'launchdarkly',
    environment: 'production',
    enableAllFeatures: false,
    cacheTtl: 600, // 10 minutes
  },
};

// Feature flags providers
export const featureFlagProviders = {
  launchdarkly: {
    name: 'LaunchDarkly',
    features: ['targeting', 'experiments', 'analytics', 'integrations'],
    sdkKey: process.env.LAUNCHDARKLY_SDK_KEY,
    clientSideId: process.env.LAUNCHDARKLY_CLIENT_SIDE_ID,
    setup: {
      enableAnalytics: true,
      enableExperiments: true,
      enableTargeting: true,
    },
  },

  unleash: {
    name: 'Unleash',
    features: ['open-source', 'self-hosted', 'targeting', 'experiments'],
    url: process.env.UNLEASH_URL || 'http://localhost:4242',
    apiToken: process.env.UNLEASH_API_TOKEN,
    setup: {
      enableMetrics: true,
      enableExperiments: true,
      enableTargeting: true,
    },
  },

  flagsmith: {
    name: 'Flagsmith',
    features: ['targeting', 'experiments', 'analytics'],
    apiUrl: process.env.FLAGSMITH_API_URL,
    environmentKey: process.env.FLAGSMITH_ENVIRONMENT_KEY,
    setup: {
      enableAnalytics: true,
      enableExperiments: true,
      enableTargeting: true,
    },
  },

  local: {
    name: 'Local Feature Flags',
    features: ['simple', 'fast'],
    setup: {
      enableValidation: true,
    },
  },
};

// Feature flags definitions
export const featureFlags = {
  // Authentication & Security
  auth: {
    enable2FA: {
      key: 'enable-2fa',
      description: 'Enable two-factor authentication',
      defaultValue: false,
      rollout: {
        percentage: 100,
        environments: ['production', 'staging'],
      },
    },
    enableSSO: {
      key: 'enable-sso',
      description: 'Enable Single Sign-On',
      defaultValue: false,
      rollout: {
        percentage: 50,
        environments: ['production'],
      },
    },
    enableMagicLink: {
      key: 'enable-magic-link',
      description: 'Enable magic link authentication',
      defaultValue: true,
      rollout: {
        percentage: 100,
        environments: ['production', 'staging', 'development'],
      },
    },
  },

  // Platform Features
  platform: {
    enableWhatsApp: {
      key: 'enable-whatsapp',
      description: 'Enable WhatsApp integration',
      defaultValue: true,
      rollout: {
        percentage: 100,
        environments: ['production', 'staging', 'development'],
      },
    },
    enableMessenger: {
      key: 'enable-messenger',
      description: 'Enable Facebook Messenger integration',
      defaultValue: true,
      rollout: {
        percentage: 100,
        environments: ['production', 'staging', 'development'],
      },
    },
    enableInstagram: {
      key: 'enable-instagram',
      description: 'Enable Instagram integration',
      defaultValue: true,
      rollout: {
        percentage: 100,
        environments: ['production', 'staging', 'development'],
      },
    },
    enableTelegram: {
      key: 'enable-telegram',
      description: 'Enable Telegram integration',
      defaultValue: false,
      rollout: {
        percentage: 0,
        environments: ['development'],
      },
    },
  },

  // AI Features
  ai: {
    enableGPT4: {
      key: 'enable-gpt4',
      description: 'Enable GPT-4 for AI responses',
      defaultValue: false,
      rollout: {
        percentage: 25,
        environments: ['production'],
        targeting: {
          planTier: ['PRO', 'ENTERPRISE'],
        },
      },
    },
    enableCustomGPT: {
      key: 'enable-custom-gpt',
      description: 'Enable custom GPT models',
      defaultValue: false,
      rollout: {
        percentage: 10,
        environments: ['production'],
        targeting: {
          planTier: ['ENTERPRISE'],
        },
      },
    },
    enableAITraining: {
      key: 'enable-ai-training',
      description: 'Enable AI model training',
      defaultValue: false,
      rollout: {
        percentage: 50,
        environments: ['production', 'staging'],
        targeting: {
          planTier: ['PRO', 'ENTERPRISE'],
        },
      },
    },
  },

  // Analytics & Reporting
  analytics: {
    enableAdvancedAnalytics: {
      key: 'enable-advanced-analytics',
      description: 'Enable advanced analytics dashboard',
      defaultValue: false,
      rollout: {
        percentage: 75,
        environments: ['production'],
        targeting: {
          planTier: ['PRO', 'ENTERPRISE'],
        },
      },
    },
    enableRealTimeAnalytics: {
      key: 'enable-real-time-analytics',
      description: 'Enable real-time analytics',
      defaultValue: false,
      rollout: {
        percentage: 50,
        environments: ['production'],
        targeting: {
          planTier: ['ENTERPRISE'],
        },
      },
    },
    enableCustomReports: {
      key: 'enable-custom-reports',
      description: 'Enable custom report builder',
      defaultValue: false,
      rollout: {
        percentage: 25,
        environments: ['production'],
        targeting: {
          planTier: ['ENTERPRISE'],
        },
      },
    },
  },

  // Enterprise Features
  enterprise: {
    enableWhiteLabel: {
      key: 'enable-white-label',
      description: 'Enable white-label customization',
      defaultValue: false,
      rollout: {
        percentage: 100,
        environments: ['production'],
        targeting: {
          planTier: ['ENTERPRISE'],
        },
      },
    },
    enableSSO: {
      key: 'enable-enterprise-sso',
      description: 'Enable enterprise SSO',
      defaultValue: false,
      rollout: {
        percentage: 100,
        environments: ['production'],
        targeting: {
          planTier: ['ENTERPRISE'],
        },
      },
    },
    enableSCIM: {
      key: 'enable-scim',
      description: 'Enable SCIM user provisioning',
      defaultValue: false,
      rollout: {
        percentage: 100,
        environments: ['production'],
        targeting: {
          planTier: ['ENTERPRISE'],
        },
      },
    },
  },

  // Performance & Optimization
  performance: {
    enableCDN: {
      key: 'enable-cdn',
      description: 'Enable CDN for static assets',
      defaultValue: true,
      rollout: {
        percentage: 100,
        environments: ['production', 'staging'],
      },
    },
    enableImageOptimization: {
      key: 'enable-image-optimization',
      description: 'Enable automatic image optimization',
      defaultValue: true,
      rollout: {
        percentage: 100,
        environments: ['production', 'staging'],
      },
    },
    enableCaching: {
      key: 'enable-caching',
      description: 'Enable advanced caching',
      defaultValue: true,
      rollout: {
        percentage: 100,
        environments: ['production', 'staging'],
      },
    },
  },

  // UI/UX Features
  ui: {
    enableDarkMode: {
      key: 'enable-dark-mode',
      description: 'Enable dark mode theme',
      defaultValue: true,
      rollout: {
        percentage: 100,
        environments: ['production', 'staging', 'development'],
      },
    },
    enableNewDashboard: {
      key: 'enable-new-dashboard',
      description: 'Enable new dashboard design',
      defaultValue: false,
      rollout: {
        percentage: 50,
        environments: ['production'],
      },
    },
    enableMobileApp: {
      key: 'enable-mobile-app',
      description: 'Enable mobile app features',
      defaultValue: false,
      rollout: {
        percentage: 25,
        environments: ['production'],
      },
    },
  },
};

// Feature flag manager class
export class FeatureFlagManager {
  private cache: Map<string, { value: boolean; expires: number }> = new Map();
  private config: any;
  private client: any;

  constructor() {
    this.config = featureFlagsConfig[process.env.NODE_ENV as keyof typeof featureFlagsConfig] || featureFlagsConfig.development;
    this.initializeClient();
  }

  private async initializeClient() {
    const provider = this.config.provider;

    switch (provider) {
      case 'launchdarkly':
        const LaunchDarkly = require('launchdarkly-node-server-sdk');
        this.client = LaunchDarkly.init(this.config.sdkKey);
        await this.client.waitForInitialization();
        break;
      case 'unleash':
        const { initialize } = require('unleash-client');
        this.client = initialize({
          appName: 'whatsapp-bot-platform',
          url: this.config.url,
          customHeaders: {
            Authorization: this.config.apiToken,
          },
        });
        break;
      case 'flagsmith':
        const Flagsmith = require('flagsmith-nodejs');
        this.client = Flagsmith({
          environmentKey: this.config.environmentKey,
          apiUrl: this.config.apiUrl,
        });
        break;
    }
  }

  async isEnabled(flagKey: string, context?: any): Promise<boolean> {
    // Check cache first
    const cached = this.cache.get(flagKey);
    if (cached && cached.expires > Date.now()) {
      return cached.value;
    }

    let value: boolean;

    try {
      switch (this.config.provider) {
        case 'launchdarkly':
          value = await this.client.variation(flagKey, { key: context?.userId || 'anonymous' }, false);
          break;
        case 'unleash':
          value = this.client.isEnabled(flagKey, { userId: context?.userId });
          break;
        case 'flagsmith':
          const flags = await this.client.getEnvironmentFlags();
          value = flags.isFeatureEnabled(flagKey);
          break;
        default:
          // Fallback to local configuration
          const flag = this.findFlag(flagKey);
          value = flag ? flag.defaultValue : false;
      }

      // Cache the result
      const ttl = this.config.cacheTtl * 1000;
      this.cache.set(flagKey, {
        value,
        expires: Date.now() + ttl,
      });

      return value;
    } catch (error) {
      console.error(`Feature flag error for ${flagKey}:`, error);
      // Return default value on error
      const flag = this.findFlag(flagKey);
      return flag ? flag.defaultValue : false;
    }
  }

  private findFlag(flagKey: string): any {
    for (const category of Object.values(featureFlags)) {
      for (const flag of Object.values(category)) {
        if (flag.key === flagKey) {
          return flag;
        }
      }
    }
    return null;
  }

  // Get all feature flags for a user
  async getAllFlags(context?: any): Promise<Record<string, boolean>> {
    const flags: Record<string, boolean> = {};

    for (const category of Object.values(featureFlags)) {
      for (const flag of Object.values(category)) {
        flags[flag.key] = await this.isEnabled(flag.key, context);
      }
    }

    return flags;
  }

  // Check if user has access to a feature based on targeting
  async hasAccess(flagKey: string, context: any): Promise<boolean> {
    const flag = this.findFlag(flagKey);
    if (!flag || !flag.rollout) {
      return true;
    }

    // Check environment
    if (!flag.rollout.environments?.includes(process.env.NODE_ENV || 'development')) {
      return false;
    }

    // Check percentage rollout
    if (flag.rollout.percentage < 100) {
      const hash = this.hashString(context.userId || 'anonymous');
      const percentage = hash % 100;
      if (percentage >= flag.rollout.percentage) {
        return false;
      }
    }

    // Check targeting rules
    if (flag.rollout.targeting) {
      for (const [key, values] of Object.entries(flag.rollout.targeting)) {
        if (!values.includes(context[key])) {
          return false;
        }
      }
    }

    return true;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}

// Global feature flag manager instance
export const featureFlags = new FeatureFlagManager();

// Helper functions
export async function isFeatureEnabled(flagKey: string, context?: any): Promise<boolean> {
  return await featureFlags.isEnabled(flagKey, context);
}

export async function getAllFeatures(context?: any): Promise<Record<string, boolean>> {
  return await featureFlags.getAllFlags(context);
}

export async function hasFeatureAccess(flagKey: string, context: any): Promise<boolean> {
  return await featureFlags.hasAccess(flagKey, context);
}

export default featureFlagsConfig;
