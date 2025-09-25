// Platform types and configurations
export type Platform = 'whatsapp' | 'messenger' | 'instagram' | 'website' | 'telegram' | 'email' | 'sms';

export interface PlatformConfig {
  id: Platform;
  name: string;
  displayName: string;
  icon: string;
  color: string;
  status: 'active' | 'inactive' | 'connected' | 'disconnected';
  features: PlatformFeatures;
  pricing: PricingTier;
}

export interface PlatformFeatures {
  basic: string[];
  premium: string[];
  enterprise: string[];
}

export interface PricingTier {
  basic: {
    price: number;
    features: string[];
    limits: {
      messages: number;
      users: number;
      flows: number;
    };
  };
  premium: {
    price: number;
    features: string[];
    limits: {
      messages: number;
      users: number;
      flows: number;
    };
  };
  enterprise: {
    price: number;
    features: string[];
    limits: {
      messages: number;
      users: number;
      flows: number;
    };
  };
}

// WhatsApp Business Configuration
export const WHATSAPP_CONFIG: PlatformConfig = {
  id: 'whatsapp',
  name: 'whatsapp',
  displayName: 'WhatsApp Business',
  icon: 'MessageCircle',
  color: '#25D366',
  status: 'inactive',
  features: {
    basic: [
      'Auto-reply',
      'Lead capture',
      'Basic flow builder',
      'Template messages',
      'Contact management'
    ],
    premium: [
      'AI with business memory',
      'Interactive catalog',
      'Media support',
      'Intent detection',
      'Multi-agent inbox',
      'Advanced analytics'
    ],
    enterprise: [
      'Custom integrations',
      'White-label solution',
      'Priority support',
      'Custom AI training',
      'Advanced security'
    ]
  },
  pricing: {
    basic: {
      price: 29,
      features: ['Basic chatbot', '1000 messages/month', '5 flows', 'Basic analytics'],
      limits: { messages: 1000, users: 500, flows: 5 }
    },
    premium: {
      price: 79,
      features: ['AI chatbot', '5000 messages/month', '20 flows', 'Advanced analytics', 'CRM integration'],
      limits: { messages: 5000, users: 2000, flows: 20 }
    },
    enterprise: {
      price: 199,
      features: ['Custom AI', 'Unlimited messages', 'Unlimited flows', 'White-label', 'Priority support'],
      limits: { messages: -1, users: -1, flows: -1 }
    }
  }
};

// Facebook Messenger Configuration
export const MESSENGER_CONFIG: PlatformConfig = {
  id: 'messenger',
  name: 'messenger',
  displayName: 'Facebook Messenger',
  icon: 'Facebook',
  color: '#0084FF',
  status: 'inactive',
  features: {
    basic: [
      'Flow builder',
      'Quick replies',
      'Auto-responder',
      'Lead generation',
      'Basic broadcasts'
    ],
    premium: [
      'Chat commerce',
      'Meta Ads integration',
      'A/B testing',
      'Conversational funnels',
      'Advanced analytics'
    ],
    enterprise: [
      'Custom integrations',
      'Advanced AI',
      'White-label',
      'Priority support'
    ]
  },
  pricing: {
    basic: {
      price: 19,
      features: ['Basic chatbot', '500 messages/month', '3 flows', 'Basic analytics'],
      limits: { messages: 500, users: 300, flows: 3 }
    },
    premium: {
      price: 59,
      features: ['AI chatbot', '2000 messages/month', '15 flows', 'Advanced analytics', 'Meta Ads'],
      limits: { messages: 2000, users: 1000, flows: 15 }
    },
    enterprise: {
      price: 149,
      features: ['Custom AI', 'Unlimited messages', 'Unlimited flows', 'White-label', 'Priority support'],
      limits: { messages: -1, users: -1, flows: -1 }
    }
  }
};

// Instagram Configuration
export const INSTAGRAM_CONFIG: PlatformConfig = {
  id: 'instagram',
  name: 'instagram',
  displayName: 'Instagram Messenger',
  icon: 'Instagram',
  color: '#E4405F',
  status: 'inactive',
  features: {
    basic: [
      'DM automation',
      'Story replies',
      'Keyword flows',
      'Lead capture',
      'Basic broadcasts'
    ],
    premium: [
      'Story triggers',
      'Conversational shopping',
      'Influencer automation',
      'Advanced analytics',
      'Cross-platform sync'
    ],
    enterprise: [
      'Custom integrations',
      'Advanced AI',
      'White-label',
      'Priority support'
    ]
  },
  pricing: {
    basic: {
      price: 15,
      features: ['Basic automation', '300 messages/month', '2 flows', 'Basic analytics'],
      limits: { messages: 300, users: 200, flows: 2 }
    },
    premium: {
      price: 49,
      features: ['AI automation', '1500 messages/month', '10 flows', 'Advanced analytics', 'Shopping'],
      limits: { messages: 1500, users: 800, flows: 10 }
    },
    enterprise: {
      price: 129,
      features: ['Custom AI', 'Unlimited messages', 'Unlimited flows', 'White-label', 'Priority support'],
      limits: { messages: -1, users: -1, flows: -1 }
    }
  }
};

// Website Chat Configuration
export const WEBSITE_CONFIG: PlatformConfig = {
  id: 'website',
  name: 'website',
  displayName: 'Website Chat',
  icon: 'Globe',
  color: '#4F46E5',
  status: 'inactive',
  features: {
    basic: [
      'Chat widget',
      'Basic AI bot',
      'Lead form',
      'Email notifications',
      'Basic analytics'
    ],
    premium: [
      'RAG AI',
      'File upload',
      'CRM integration',
      'Live chat takeover',
      'Advanced analytics'
    ],
    enterprise: [
      'Custom integrations',
      'White-label widget',
      'Advanced AI',
      'Priority support'
    ]
  },
  pricing: {
    basic: {
      price: 25,
      features: ['Chat widget', 'Basic AI', '500 chats/month', '3 flows', 'Email integration'],
      limits: { messages: 500, users: 400, flows: 3 }
    },
    premium: {
      price: 69,
      features: ['Advanced AI', '2000 chats/month', '15 flows', 'CRM integration', 'Live chat'],
      limits: { messages: 2000, users: 1500, flows: 15 }
    },
    enterprise: {
      price: 179,
      features: ['Custom AI', 'Unlimited chats', 'Unlimited flows', 'White-label', 'Priority support'],
      limits: { messages: -1, users: -1, flows: -1 }
    }
  }
};

// Telegram Configuration
export const TELEGRAM_CONFIG: PlatformConfig = {
  id: 'telegram',
  name: 'telegram',
  displayName: 'Telegram',
  icon: 'Send',
  color: '#0088CC',
  status: 'inactive',
  features: {
    basic: [
      'Group automation',
      'Basic replies',
      'File sharing',
      'Channel management',
      'Basic analytics'
    ],
    premium: [
      'Lead funnels',
      'Broadcast automation',
      'Webhook integration',
      'Advanced analytics',
      'Custom bots'
    ],
    enterprise: [
      'Custom integrations',
      'Advanced AI',
      'White-label',
      'Priority support'
    ]
  },
  pricing: {
    basic: {
      price: 12,
      features: ['Basic automation', '200 messages/month', '2 flows', 'Basic analytics'],
      limits: { messages: 200, users: 150, flows: 2 }
    },
    premium: {
      price: 39,
      features: ['AI automation', '1000 messages/month', '8 flows', 'Advanced analytics', 'Webhooks'],
      limits: { messages: 1000, users: 500, flows: 8 }
    },
    enterprise: {
      price: 99,
      features: ['Custom AI', 'Unlimited messages', 'Unlimited flows', 'White-label', 'Priority support'],
      limits: { messages: -1, users: -1, flows: -1 }
    }
  }
};

// All platforms configuration
export const PLATFORM_CONFIGS: Record<Platform, PlatformConfig> = {
  whatsapp: WHATSAPP_CONFIG,
  messenger: MESSENGER_CONFIG,
  instagram: INSTAGRAM_CONFIG,
  website: WEBSITE_CONFIG,
  telegram: TELEGRAM_CONFIG,
  email: {
    id: 'email',
    name: 'email',
    displayName: 'Email AI',
    icon: 'Mail',
    color: '#EA4335',
    status: 'inactive',
    features: { basic: [], premium: [], enterprise: [] },
    pricing: { basic: { price: 0, features: [], limits: { messages: 0, users: 0, flows: 0 } }, premium: { price: 0, features: [], limits: { messages: 0, users: 0, flows: 0 } }, enterprise: { price: 0, features: [], limits: { messages: 0, users: 0, flows: 0 } } }
  },
  sms: {
    id: 'sms',
    name: 'sms',
    displayName: 'SMS',
    icon: 'MessageSquare',
    color: '#FF6B35',
    status: 'inactive',
    features: { basic: [], premium: [], enterprise: [] },
    pricing: { basic: { price: 0, features: [], limits: { messages: 0, users: 0, flows: 0 } }, premium: { price: 0, features: [], limits: { messages: 0, users: 0, flows: 0 } }, enterprise: { price: 0, features: [], limits: { messages: 0, users: 0, flows: 0 } } }
  }
};

// Platform status types
export type PlatformStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

// Platform connection interface
export interface PlatformConnection {
  platform: Platform;
  status: PlatformStatus;
  credentials?: any;
  lastConnected?: string;
  error?: string;
  settings?: any;
}
