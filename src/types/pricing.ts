// Pricing and feature management types
export type PlanType = 'starter' | 'pro' | 'enterprise';

export interface PlanFeature {
  id: string;
  name: string;
  description: string;
  category: string;
  available: boolean;
  limits?: {
    [key: string]: number;
  };
}

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  billing: 'monthly' | 'yearly';
  features: PlanFeature[];
  limits: {
    users: number;
    messages: number;
    flows: number;
    platforms: number;
    integrations: number;
    storage: number; // in MB
  };
  popular?: boolean;
}

export interface FeatureMatrix {
  [category: string]: {
    [feature: string]: {
      starter: boolean;
      pro: boolean;
      enterprise: boolean;
    };
  };
}

// Feature definitions
export const FEATURES = {
  // 1. OMNICHANNEL CONVERSATIONS
  'unified-inbox': {
    id: 'unified-inbox',
    name: 'Unified Inbox',
    description: 'Single inbox for WhatsApp, Instagram, Messenger, Website',
    category: 'omnichannel'
  },
  'client-360': {
    id: 'client-360',
    name: '360° Client Profile',
    description: 'Complete conversation history, tags, notes',
    category: 'omnichannel'
  },
  'global-search': {
    id: 'global-search',
    name: 'Global Conversation Search',
    description: 'Search across all conversations and platforms',
    category: 'omnichannel'
  },
  'auto-segmentation': {
    id: 'auto-segmentation',
    name: 'Automatic Client Segmentation',
    description: 'Auto-segment clients by channel, actions, etc.',
    category: 'omnichannel'
  },
  'cross-channel': {
    id: 'cross-channel',
    name: 'Cross-Channel Conversations',
    description: 'Continue conversations across platforms (IG → WhatsApp)',
    category: 'omnichannel'
  },
  'chat-assignment': {
    id: 'chat-assignment',
    name: 'Chat Assignment',
    description: 'Assign conversations to team members',
    category: 'omnichannel'
  },
  'sla-routing': {
    id: 'sla-routing',
    name: 'SLA & Smart Routing',
    description: 'Automatic distribution with SLA management',
    category: 'omnichannel'
  },
  'inbox-api': {
    id: 'inbox-api',
    name: 'Inbox API',
    description: 'Integrate inbox into your own applications',
    category: 'omnichannel'
  },

  // 2. AI CHATBOTS & AUTOMATION
  'flow-builder': {
    id: 'flow-builder',
    name: 'Visual Flow Builder',
    description: 'Drag & drop conversation flow builder',
    category: 'ai-automation'
  },
  'quick-replies': {
    id: 'quick-replies',
    name: 'Quick Replies & Keywords',
    description: 'Quick replies and keyword triggers',
    category: 'ai-automation'
  },
  'gpt-autoreply': {
    id: 'gpt-autoreply',
    name: 'GPT Auto-Reply',
    description: 'AI responses based on LLM',
    category: 'ai-automation'
  },
  'business-context': {
    id: 'business-context',
    name: 'AI with Business Context',
    description: 'AI learns from your business data',
    category: 'ai-automation'
  },
  'multilingual': {
    id: 'multilingual',
    name: 'Multi-language Conversations',
    description: 'Support for multiple languages',
    category: 'ai-automation'
  },
  'intent-detection': {
    id: 'intent-detection',
    name: 'Intent Detection',
    description: 'Automatic intent detection and classification',
    category: 'ai-automation'
  },
  'ai-memory': {
    id: 'ai-memory',
    name: 'AI Memory per User',
    description: 'AI remembers each user individually',
    category: 'ai-automation'
  },
  'rag-search': {
    id: 'rag-search',
    name: 'RAG Document Search',
    description: 'Search and respond based on your documents',
    category: 'ai-automation'
  },
  'custom-gpt': {
    id: 'custom-gpt',
    name: 'Custom Fine-tuned GPT',
    description: 'Custom GPT trained for your business',
    category: 'ai-automation'
  },

  // 3. WHATSAPP BUSINESS
  'whatsapp-templates': {
    id: 'whatsapp-templates',
    name: 'Template Messages',
    description: 'Broadcast template messages',
    category: 'whatsapp'
  },
  'whatsapp-flows': {
    id: 'whatsapp-flows',
    name: 'Conversational Flows',
    description: 'Automated conversation flows',
    category: 'whatsapp'
  },
  'whatsapp-forms': {
    id: 'whatsapp-forms',
    name: 'Forms & Lead Capture',
    description: 'Interactive forms and lead capture',
    category: 'whatsapp'
  },
  'whatsapp-tracking': {
    id: 'whatsapp-tracking',
    name: 'Order Status & Tracking',
    description: 'Order status and tracking functionality',
    category: 'whatsapp'
  },
  'whatsapp-catalog': {
    id: 'whatsapp-catalog',
    name: 'Catalog & Commerce',
    description: 'Product catalog and commerce flows',
    category: 'whatsapp'
  },
  'whatsapp-contextual': {
    id: 'whatsapp-contextual',
    name: 'Contextual Auto-responder',
    description: 'AI auto-responder with context',
    category: 'whatsapp'
  },
  'whatsapp-multimedia': {
    id: 'whatsapp-multimedia',
    name: 'Multimedia Support',
    description: 'Images, PDFs, videos support',
    category: 'whatsapp'
  },
  'whatsapp-proactive': {
    id: 'whatsapp-proactive',
    name: 'Proactive Conversations',
    description: 'Event-triggered proactive messages',
    category: 'whatsapp'
  },

  // 4. MESSENGER
  'messenger-autoreply': {
    id: 'messenger-autoreply',
    name: 'Auto-reply & Flow Builder',
    description: 'Automated responses and flow building',
    category: 'messenger'
  },
  'messenger-broadcast': {
    id: 'messenger-broadcast',
    name: 'Broadcast & Drip Campaigns',
    description: 'Broadcast messages and drip sequences',
    category: 'messenger'
  },
  'messenger-crm': {
    id: 'messenger-crm',
    name: 'Tagging & CRM',
    description: 'User tagging and CRM integration',
    category: 'messenger'
  },
  'messenger-funnel': {
    id: 'messenger-funnel',
    name: 'Conversational Funnel',
    description: 'Complete conversational sales funnel',
    category: 'messenger'
  },
  'messenger-meta-ads': {
    id: 'messenger-meta-ads',
    name: 'Meta Ads Integration',
    description: 'Automatic bot follow-up from Meta Ads',
    category: 'messenger'
  },
  'messenger-ab-testing': {
    id: 'messenger-ab-testing',
    name: 'A/B Testing',
    description: 'A/B testing for messages and flows',
    category: 'messenger'
  },
  'messenger-checkout': {
    id: 'messenger-checkout',
    name: 'Conversational Checkout',
    description: 'Complete checkout flow in Messenger',
    category: 'messenger'
  },

  // 5. INSTAGRAM
  'instagram-autoreply': {
    id: 'instagram-autoreply',
    name: 'Auto-reply to DM & Stories',
    description: 'Automatic replies to DMs and story interactions',
    category: 'instagram'
  },
  'instagram-keywords': {
    id: 'instagram-keywords',
    name: 'Keyword Automation',
    description: 'DM triggers based on keywords',
    category: 'instagram'
  },
  'instagram-leads': {
    id: 'instagram-leads',
    name: 'DM Lead Capture',
    description: 'Capture leads directly in DMs',
    category: 'instagram'
  },
  'instagram-comments': {
    id: 'instagram-comments',
    name: 'Comment Automation',
    description: 'DM automation after comments',
    category: 'instagram'
  },
  'instagram-shopping': {
    id: 'instagram-shopping',
    name: 'Conversational Shopping',
    description: 'Shopping experience in DMs',
    category: 'instagram'
  },
  'instagram-ads': {
    id: 'instagram-ads',
    name: 'Ads → DM Automation',
    description: 'DM automation after ad clicks',
    category: 'instagram'
  },
  'instagram-ai-content': {
    id: 'instagram-ai-content',
    name: 'AI Content Personalization',
    description: 'AI personalized content for Instagram',
    category: 'instagram'
  },

  // 6. WEBSITE CHAT
  'website-widget': {
    id: 'website-widget',
    name: 'Customizable Chat Widget',
    description: 'Fully customizable chat widget',
    category: 'website'
  },
  'website-flow': {
    id: 'website-flow',
    name: 'Flow & AI Chatbot',
    description: 'Conversation flows and AI chatbot',
    category: 'website'
  },
  'website-forms': {
    id: 'website-forms',
    name: 'Forms & Lead Capture',
    description: 'Interactive forms and lead capture',
    category: 'website'
  },
  'website-notifications': {
    id: 'website-notifications',
    name: 'Email/WhatsApp Follow-up',
    description: 'Email and WhatsApp follow-up notifications',
    category: 'website'
  },
  'website-rag': {
    id: 'website-rag',
    name: 'Document-based Responses',
    description: 'RAG responses based on documents',
    category: 'website'
  },
  'website-livechat': {
    id: 'website-livechat',
    name: 'Live Chat Takeover',
    description: 'Human agent takeover capability',
    category: 'website'
  },
  'website-integrations': {
    id: 'website-integrations',
    name: 'Slack/Notion/CRM Integration',
    description: 'Integrations with Slack, Notion, CRM',
    category: 'website'
  },
  'website-multibrand': {
    id: 'website-multibrand',
    name: 'Multi-brand/Multi-site',
    description: 'Support for multiple brands/sites',
    category: 'website'
  },

  // 7. BROADCAST & MARKETING
  'broadcast-manual': {
    id: 'broadcast-manual',
    name: 'Manual Broadcast',
    description: 'Send manual broadcast messages',
    category: 'broadcast'
  },
  'broadcast-scheduled': {
    id: 'broadcast-scheduled',
    name: 'Scheduled Messages',
    description: 'Schedule messages for later',
    category: 'broadcast'
  },
  'broadcast-segments': {
    id: 'broadcast-segments',
    name: 'Dynamic Segments & Lists',
    description: 'Dynamic segmentation and list management',
    category: 'broadcast'
  },
  'broadcast-drip': {
    id: 'broadcast-drip',
    name: 'Drip Sequences',
    description: 'Automated drip email sequences',
    category: 'broadcast'
  },
  'broadcast-events': {
    id: 'broadcast-events',
    name: 'Event-triggered Campaigns',
    description: 'Campaigns triggered by user events',
    category: 'broadcast'
  },
  'broadcast-multichannel': {
    id: 'broadcast-multichannel',
    name: 'Multi-channel Synchronized',
    description: 'Synchronized conversations across channels',
    category: 'broadcast'
  },
  'broadcast-ai-copy': {
    id: 'broadcast-ai-copy',
    name: 'AI Copywriter',
    description: 'AI copywriter for campaigns',
    category: 'broadcast'
  },

  // 8. ANALYTICS
  'analytics-dashboard': {
    id: 'analytics-dashboard',
    name: 'Conversation Dashboard',
    description: 'Main analytics dashboard',
    category: 'analytics'
  },
  'analytics-engagement': {
    id: 'analytics-engagement',
    name: 'Response Rate & Engagement',
    description: 'Response rates and engagement metrics',
    category: 'analytics'
  },
  'analytics-leads': {
    id: 'analytics-leads',
    name: 'Lead & Conversion KPIs',
    description: 'Lead generation and conversion metrics',
    category: 'analytics'
  },
  'analytics-platform': {
    id: 'analytics-platform',
    name: 'Per-platform Analytics',
    description: 'Analytics broken down by platform',
    category: 'analytics'
  },
  'analytics-predictive': {
    id: 'analytics-predictive',
    name: 'Predictive Insights',
    description: 'AI-powered predictive analytics',
    category: 'analytics'
  },
  'analytics-clv': {
    id: 'analytics-clv',
    name: 'Customer Lifetime Value',
    description: 'CLV and customer scoring',
    category: 'analytics'
  },

  // 9. TEAM MANAGEMENT
  'team-single-user': {
    id: 'team-single-user',
    name: 'Single User Account',
    description: 'One user account only',
    category: 'team'
  },
  'team-multi-user': {
    id: 'team-multi-user',
    name: 'Multi-user with Roles',
    description: 'Multiple users with roles and permissions',
    category: 'team'
  },
  'team-collaboration': {
    id: 'team-collaboration',
    name: 'Team Collaboration',
    description: 'Notes, assignments, team collaboration',
    category: 'team'
  },
  'team-audit': {
    id: 'team-audit',
    name: 'Audit Logs',
    description: 'Activity tracking and audit logs',
    category: 'team'
  },
  'team-sso': {
    id: 'team-sso',
    name: 'SSO Integration',
    description: 'Single Sign-On with Google/Microsoft',
    category: 'team'
  },
  'team-rbac': {
    id: 'team-rbac',
    name: 'Advanced RBAC',
    description: 'Custom roles and permissions',
    category: 'team'
  },

  // 10. SECURITY
  'security-basic': {
    id: 'security-basic',
    name: 'Basic Security',
    description: 'HTTPS, JWT auth, session management',
    category: 'security'
  },
  'security-2fa': {
    id: 'security-2fa',
    name: '2FA / MFA',
    description: 'Two-factor and multi-factor authentication',
    category: 'security'
  },
  'security-rate-limit': {
    id: 'security-rate-limit',
    name: 'Rate Limiting & Bot Protection',
    description: 'Rate limiting and bot protection',
    category: 'security'
  },
  'security-gdpr': {
    id: 'security-gdpr',
    name: 'GDPR / CCPA Compliance',
    description: 'GDPR and CCPA compliance features',
    category: 'security'
  },
  'security-audit': {
    id: 'security-audit',
    name: 'Audit Logs & Reports',
    description: 'Security audit logs and access reports',
    category: 'security'
  },
  'security-advanced': {
    id: 'security-advanced',
    name: 'Advanced Security',
    description: 'SSO, SCIM, IP whitelisting',
    category: 'security'
  },
  'security-vpc': {
    id: 'security-vpc',
    name: 'Private VPC / On-premise',
    description: 'Private VPC or on-premise deployment',
    category: 'security'
  },

  // 11. INTEGRATIONS
  'integrations-basic': {
    id: 'integrations-basic',
    name: 'Basic Webhooks & API',
    description: 'Basic webhooks and API access',
    category: 'integrations'
  },
  'integrations-keys': {
    id: 'integrations-keys',
    name: 'Custom API Keys',
    description: 'Custom API key management',
    category: 'integrations'
  },
  'integrations-connectors': {
    id: 'integrations-connectors',
    name: 'Zapier/Make/n8n Connectors',
    description: 'Connectors for automation platforms',
    category: 'integrations'
  },
  'integrations-crm': {
    id: 'integrations-crm',
    name: 'CRM Integrations',
    description: 'HubSpot, Pipedrive, Salesforce integration',
    category: 'integrations'
  },
  'integrations-ecommerce': {
    id: 'integrations-ecommerce',
    name: 'E-commerce Integrations',
    description: 'Shopify, WooCommerce integration',
    category: 'integrations'
  },
  'integrations-advanced': {
    id: 'integrations-advanced',
    name: 'Advanced API',
    description: 'Advanced API with higher rate limits',
    category: 'integrations'
  },
  'integrations-sandbox': {
    id: 'integrations-sandbox',
    name: 'Dedicated Sandbox',
    description: 'Dedicated sandbox and staging environment',
    category: 'integrations'
  },

  // 12. SUPPORT
  'support-email': {
    id: 'support-email',
    name: 'Email Support (48h)',
    description: 'Email support with 48-hour response',
    category: 'support'
  },
  'support-livechat': {
    id: 'support-livechat',
    name: 'Live Chat Support (24h)',
    description: 'Live chat support with 24-hour response',
    category: 'support'
  },
  'support-onboarding': {
    id: 'support-onboarding',
    name: 'Onboarding Call',
    description: 'Personal onboarding call',
    category: 'support'
  },
  'support-dedicated': {
    id: 'support-dedicated',
    name: 'Dedicated Account Manager',
    description: 'Dedicated account manager',
    category: 'support'
  },
  'support-white-label': {
    id: 'support-white-label',
    name: 'White-label Platform',
    description: 'White-label platform solution',
    category: 'support'
  },
  'support-custom-domain': {
    id: 'support-custom-domain',
    name: 'Custom Domain & Branding',
    description: 'Custom domain and branding',
    category: 'support'
  }
};

// Plan definitions
export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    billing: 'monthly',
    features: Object.values(FEATURES).filter(feature => 
      feature.category === 'omnichannel' && ['unified-inbox', 'client-360', 'global-search'].includes(feature.id) ||
      feature.category === 'ai-automation' && ['flow-builder', 'quick-replies', 'gpt-autoreply'].includes(feature.id) ||
      feature.category === 'whatsapp' && ['whatsapp-templates', 'whatsapp-flows', 'whatsapp-forms'].includes(feature.id) ||
      feature.category === 'messenger' && ['messenger-autoreply', 'messenger-broadcast', 'messenger-crm'].includes(feature.id) ||
      feature.category === 'instagram' && ['instagram-autoreply', 'instagram-keywords', 'instagram-leads'].includes(feature.id) ||
      feature.category === 'website' && ['website-widget', 'website-flow', 'website-forms'].includes(feature.id) ||
      feature.category === 'broadcast' && ['broadcast-manual', 'broadcast-scheduled'].includes(feature.id) ||
      feature.category === 'analytics' && ['analytics-dashboard', 'analytics-engagement'].includes(feature.id) ||
      feature.category === 'team' && ['team-single-user'].includes(feature.id) ||
      feature.category === 'security' && ['security-basic', 'security-gdpr'].includes(feature.id) ||
      feature.category === 'integrations' && ['integrations-basic'].includes(feature.id) ||
      feature.category === 'support' && ['support-email'].includes(feature.id)
    ),
    limits: {
      users: 1,
      messages: 1000,
      flows: 5,
      platforms: 2,
      integrations: 3,
      storage: 1000
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 79,
    billing: 'monthly',
    popular: true,
    features: Object.values(FEATURES).filter(feature => 
      !['team-single-user', 'support-email'].includes(feature.id) &&
      !feature.category.includes('enterprise-only')
    ),
    limits: {
      users: 5,
      messages: 5000,
      flows: 20,
      platforms: 4,
      integrations: 10,
      storage: 10000
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    billing: 'monthly',
    features: Object.values(FEATURES),
    limits: {
      users: -1, // unlimited
      messages: -1, // unlimited
      flows: -1, // unlimited
      platforms: -1, // unlimited
      integrations: -1, // unlimited
      storage: 100000
    }
  }
];

// Feature matrix for comparison
export const FEATURE_MATRIX: FeatureMatrix = {
  'Omnichannel Conversations': {
    'Unified Inbox': { starter: true, pro: true, enterprise: true },
    '360° Client Profile': { starter: true, pro: true, enterprise: true },
    'Global Search': { starter: true, pro: true, enterprise: true },
    'Auto Segmentation': { starter: false, pro: true, enterprise: true },
    'Cross-channel': { starter: false, pro: true, enterprise: true },
    'Chat Assignment': { starter: false, pro: true, enterprise: true },
    'SLA & Smart Routing': { starter: false, pro: false, enterprise: true },
    'Inbox API': { starter: false, pro: false, enterprise: true }
  },
  'AI & Automation': {
    'Flow Builder': { starter: true, pro: true, enterprise: true },
    'Quick Replies': { starter: true, pro: true, enterprise: true },
    'GPT Auto-Reply': { starter: true, pro: true, enterprise: true },
    'Business Context': { starter: false, pro: true, enterprise: true },
    'Multi-language': { starter: false, pro: true, enterprise: true },
    'Intent Detection': { starter: false, pro: true, enterprise: true },
    'AI Memory': { starter: false, pro: false, enterprise: true },
    'RAG Search': { starter: false, pro: false, enterprise: true },
    'Custom GPT': { starter: false, pro: false, enterprise: true }
  },
  'WhatsApp Business': {
    'Template Messages': { starter: true, pro: true, enterprise: true },
    'Conversational Flows': { starter: true, pro: true, enterprise: true },
    'Forms & Lead Capture': { starter: true, pro: true, enterprise: true },
    'Order Tracking': { starter: false, pro: true, enterprise: true },
    'Catalog & Commerce': { starter: false, pro: true, enterprise: true },
    'Contextual Auto-reply': { starter: false, pro: true, enterprise: true },
    'Multimedia Support': { starter: false, pro: true, enterprise: true },
    'Proactive Conversations': { starter: false, pro: false, enterprise: true }
  },
  'Facebook Messenger': {
    'Auto-reply & Flows': { starter: true, pro: true, enterprise: true },
    'Broadcast & Drip': { starter: true, pro: true, enterprise: true },
    'Tagging & CRM': { starter: true, pro: true, enterprise: true },
    'Conversational Funnel': { starter: false, pro: true, enterprise: true },
    'Meta Ads Integration': { starter: false, pro: true, enterprise: true },
    'A/B Testing': { starter: false, pro: true, enterprise: true },
    'Conversational Checkout': { starter: false, pro: false, enterprise: true }
  },
  'Instagram DM': {
    'Auto-reply DM & Stories': { starter: true, pro: true, enterprise: true },
    'Keyword Automation': { starter: true, pro: true, enterprise: true },
    'Lead Capture': { starter: true, pro: true, enterprise: true },
    'Comment Automation': { starter: false, pro: true, enterprise: true },
    'Conversational Shopping': { starter: false, pro: true, enterprise: true },
    'Ads → DM Automation': { starter: false, pro: true, enterprise: true },
    'AI Content Personalization': { starter: false, pro: false, enterprise: true }
  },
  'Website Chat': {
    'Customizable Widget': { starter: true, pro: true, enterprise: true },
    'Flow & AI Chatbot': { starter: true, pro: true, enterprise: true },
    'Forms & Lead Capture': { starter: true, pro: true, enterprise: true },
    'Email/WhatsApp Follow-up': { starter: false, pro: true, enterprise: true },
    'Document-based Responses': { starter: false, pro: true, enterprise: true },
    'Live Chat Takeover': { starter: false, pro: true, enterprise: true },
    'Slack/Notion/CRM Integration': { starter: false, pro: true, enterprise: true },
    'Multi-brand/Multi-site': { starter: false, pro: false, enterprise: true }
  },
  'Broadcast & Marketing': {
    'Manual Broadcast': { starter: true, pro: true, enterprise: true },
    'Scheduled Messages': { starter: true, pro: true, enterprise: true },
    'Dynamic Segments': { starter: false, pro: true, enterprise: true },
    'Drip Sequences': { starter: false, pro: true, enterprise: true },
    'Event-triggered Campaigns': { starter: false, pro: true, enterprise: true },
    'Multi-channel Sync': { starter: false, pro: false, enterprise: true },
    'AI Copywriter': { starter: false, pro: false, enterprise: true }
  },
  'Analytics & Intelligence': {
    'Conversation Dashboard': { starter: true, pro: true, enterprise: true },
    'Response Rate & Engagement': { starter: true, pro: true, enterprise: true },
    'Lead & Conversion KPIs': { starter: false, pro: true, enterprise: true },
    'Per-platform Analytics': { starter: false, pro: true, enterprise: true },
    'Predictive Insights': { starter: false, pro: false, enterprise: true },
    'Customer Lifetime Value': { starter: false, pro: false, enterprise: true }
  },
  'Team Management': {
    'Single User': { starter: true, pro: false, enterprise: false },
    'Multi-user with Roles': { starter: false, pro: true, enterprise: true },
    'Team Collaboration': { starter: false, pro: true, enterprise: true },
    'Audit Logs': { starter: false, pro: true, enterprise: true },
    'SSO Integration': { starter: false, pro: false, enterprise: true },
    'Advanced RBAC': { starter: false, pro: false, enterprise: true }
  },
  'Security & Compliance': {
    'Basic Security': { starter: true, pro: true, enterprise: true },
    '2FA / MFA': { starter: false, pro: true, enterprise: true },
    'Rate Limiting': { starter: false, pro: true, enterprise: true },
    'GDPR / CCPA': { starter: true, pro: true, enterprise: true },
    'Audit Logs': { starter: false, pro: true, enterprise: true },
    'Advanced Security': { starter: false, pro: false, enterprise: true },
    'Private VPC': { starter: false, pro: false, enterprise: true }
  },
  'Integrations': {
    'Basic Webhooks & API': { starter: true, pro: true, enterprise: true },
    'Custom API Keys': { starter: false, pro: true, enterprise: true },
    'Zapier/Make/n8n': { starter: false, pro: true, enterprise: true },
    'CRM Integrations': { starter: false, pro: true, enterprise: true },
    'E-commerce': { starter: false, pro: true, enterprise: true },
    'Advanced API': { starter: false, pro: false, enterprise: true },
    'Dedicated Sandbox': { starter: false, pro: false, enterprise: true }
  },
  'Support': {
    'Email Support (48h)': { starter: true, pro: true, enterprise: true },
    'Live Chat (24h)': { starter: false, pro: true, enterprise: true },
    'Onboarding Call': { starter: false, pro: true, enterprise: true },
    'Dedicated Manager': { starter: false, pro: false, enterprise: true },
    'White-label': { starter: false, pro: false, enterprise: true },
    'Custom Domain': { starter: false, pro: false, enterprise: true }
  }
};
