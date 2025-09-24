import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  limitations: string[];
  maxBots: number;
  maxMessages: number;
  maxChannels: number;
  hasAdvancedFeatures: boolean;
  hasBroadcast: boolean;
  hasTriggers: boolean;
  hasLiveAgent: boolean;
  hasPolls: boolean;
  hasAnalytics: boolean;
  hasAPI: boolean;
  supportLevel: 'community' | 'priority' | 'dedicated';
}

export interface UserSubscription {
  planId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  usage: {
    messages: number;
    bots: number;
    channels: number;
  };
}

interface SubscriptionContextType {
  currentPlan: SubscriptionPlan | null;
  userSubscription: UserSubscription | null;
  isLoading: boolean;
  upgradePlan: (planId: string) => Promise<void>;
  downgradePlan: (planId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  getFeatureAccess: (feature: string) => boolean;
  getUsagePercentage: (type: 'messages' | 'bots' | 'channels') => number;
  isFeatureAvailable: (feature: string) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const plans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      '1 WhatsApp Bot',
      '500 messages/month',
      'Basic AI responses',
      'Community support',
      'Basic dashboard',
      '1 channel integration',
      'Basic analytics',
      '7-day message history'
    ],
    limitations: [
      'Limited to 500 messages/month',
      'Basic support only',
      'No advanced features'
    ],
    maxBots: 1,
    maxMessages: 500,
    maxChannels: 1,
    hasAdvancedFeatures: false,
    hasBroadcast: false,
    hasTriggers: false,
    hasLiveAgent: false,
    hasPolls: false,
    hasAnalytics: false,
    hasAPI: false,
    supportLevel: 'community'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    features: [
      '5 WhatsApp Bots',
      '10,000 messages/month',
      'Advanced AI with personality',
      'Priority support',
      'Advanced analytics & reporting',
      'All channel integrations',
      'Broadcast messages',
      'Trigger system & automation',
      'Live agent transfer',
      'Polls & surveys',
      '90-day message history',
      'Custom branding'
    ],
    limitations: [
      'Limited to 10,000 messages/month',
      'Standard support response time'
    ],
    maxBots: 5,
    maxMessages: 10000,
    maxChannels: 5,
    hasAdvancedFeatures: true,
    hasBroadcast: true,
    hasTriggers: true,
    hasLiveAgent: true,
    hasPolls: true,
    hasAnalytics: true,
    hasAPI: false,
    supportLevel: 'priority'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    features: [
      'Unlimited WhatsApp Bots',
      '100,000 messages/month',
      'Custom AI training',
      'Dedicated account manager',
      'White-label solution',
      'Full API access',
      'Advanced security & compliance',
      'SLA guarantee (99.9%)',
      'Custom integrations',
      'Unlimited message history',
      'Advanced team collaboration',
      'Custom onboarding',
      'Priority feature requests'
    ],
    limitations: [
      'Contact sales for custom limits',
      'Minimum 12-month commitment'
    ],
    maxBots: 999,
    maxMessages: 100000,
    maxChannels: 999,
    hasAdvancedFeatures: true,
    hasBroadcast: true,
    hasTriggers: true,
    hasLiveAgent: true,
    hasPolls: true,
    hasAnalytics: true,
    hasAPI: true,
    supportLevel: 'dedicated'
  }
];

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in real app, this would come from your API
  useEffect(() => {
    const loadSubscription = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setUserSubscription({
          planId: 'pro',
          status: 'active',
          currentPeriodEnd: '2024-02-15',
          cancelAtPeriodEnd: false,
          usage: {
            messages: 7500,
            bots: 3,
            channels: 3
          }
        });
        setIsLoading(false);
      }, 1000);
    };

    loadSubscription();
  }, []);

  const currentPlan = userSubscription ? plans.find(p => p.id === userSubscription.planId) || null : null;

  const upgradePlan = async (planId: string) => {
    console.log(`Upgrading to plan: ${planId}`);
    // Implement upgrade logic with Stripe
    // This would typically redirect to Stripe checkout or update subscription
  };

  const downgradePlan = async (planId: string) => {
    console.log(`Downgrading to plan: ${planId}`);
    // Implement downgrade logic
    // This would typically schedule the downgrade for the next billing period
  };

  const cancelSubscription = async () => {
    console.log('Cancelling subscription');
    // Implement cancellation logic
    // This would typically cancel at the end of the current period
  };

  const getFeatureAccess = (feature: string): boolean => {
    if (!currentPlan) return false;
    
    switch (feature) {
      case 'broadcast':
        return currentPlan.hasBroadcast;
      case 'triggers':
        return currentPlan.hasTriggers;
      case 'live_agent':
        return currentPlan.hasLiveAgent;
      case 'polls':
        return currentPlan.hasPolls;
      case 'advanced_analytics':
        return currentPlan.hasAnalytics;
      case 'api':
        return currentPlan.hasAPI;
      case 'advanced_features':
        return currentPlan.hasAdvancedFeatures;
      default:
        return false;
    }
  };

  const getUsagePercentage = (type: 'messages' | 'bots' | 'channels'): number => {
    if (!userSubscription || !currentPlan) return 0;
    
    const usage = userSubscription.usage[type];
    const limit = currentPlan[`max${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof SubscriptionPlan] as number;
    
    return Math.min((usage / limit) * 100, 100);
  };

  const isFeatureAvailable = (feature: string): boolean => {
    return getFeatureAccess(feature);
  };

  const value: SubscriptionContextType = {
    currentPlan,
    userSubscription,
    isLoading,
    upgradePlan,
    downgradePlan,
    cancelSubscription,
    getFeatureAccess,
    getUsagePercentage,
    isFeatureAvailable
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
