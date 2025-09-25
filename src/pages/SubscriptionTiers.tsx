import React from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Crown, Zap, Users, BarChart3, Settings, Shield, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SubscriptionTiers = () => {
  const { currentPlan, userSubscription, getUsagePercentage, isFeatureAvailable } = useSubscription();
  const navigate = useNavigate();

  const tiers = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      icon: Zap,
      color: 'border-gray-200',
      bgColor: 'bg-muted',
      textColor: 'text-gray-700',
      features: [
        { name: '1 AI Bot', available: true },
        { name: '100 messages/month', available: true },
        { name: 'WhatsApp integration', available: true },
        { name: 'Basic analytics', available: true },
        { name: 'Email support', available: true },
        { name: 'Instagram integration', available: false },
        { name: 'Broadcast messages', available: false },
        { name: 'Advanced analytics', available: false },
        { name: 'Custom branding', available: false },
        { name: 'API access', available: false },
        { name: 'Priority support', available: false },
        { name: 'Team collaboration', available: false },
      ],
      limitations: [
        'Limited to 1 bot',
        'Basic features only',
        'No custom branding',
        'Standard support'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'For growing businesses',
      icon: Crown,
      color: 'border-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      popular: true,
      features: [
        { name: '5 AI Bots', available: true },
        { name: '5,000 messages/month', available: true },
        { name: 'All channel integrations', available: true },
        { name: 'Broadcast messages', available: true },
        { name: 'Advanced analytics', available: true },
        { name: 'Custom branding', available: true },
        { name: 'API access', available: true },
        { name: 'Priority support', available: true },
        { name: 'Polls & surveys', available: true },
        { name: 'Live agent transfer', available: true },
        { name: 'Instagram integration', available: true },
        { name: 'Messenger integration', available: true },
      ],
      limitations: [
        'Limited to 5 bots',
        'No team features',
        'Standard integrations'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'For large organizations',
      icon: Shield,
      color: 'border-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      features: [
        { name: 'Unlimited AI Bots', available: true },
        { name: 'Unlimited messages', available: true },
        { name: 'All features included', available: true },
        { name: 'Team collaboration', available: true },
        { name: 'Advanced security', available: true },
        { name: 'Custom integrations', available: true },
        { name: 'Dedicated support', available: true },
        { name: 'White-label solution', available: true },
        { name: 'Custom development', available: true },
        { name: 'SLA guarantee', available: true },
        { name: 'Advanced reporting', available: true },
        { name: 'Multi-tenant support', available: true },
      ],
      limitations: []
    }
  ];

  const getFeatureIcon = (available: boolean) => {
    if (available) {
      return <Check className="w-4 h-4 text-blue-600" />;
    }
    return <Lock className="w-4 h-4 text-gray-400" />;
  };

  const getUsageInfo = () => {
    const messagesUsed = userSubscription?.messagesUsed || 0;
    const messagesLimit = userSubscription?.messagesLimit || 100;
    const botsUsed = userSubscription?.botsUsed || 0;
    const botsLimit = userSubscription?.botsLimit || 1;
    
    return {
      messages: { used: messagesUsed, limit: messagesLimit, percentage: getUsagePercentage('messages') },
      bots: { used: botsUsed, limit: botsLimit, percentage: getUsagePercentage('bots') }
    };
  };

  const usage = getUsageInfo();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Subscription Tiers
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your omnichannel AI platform needs
          </p>
        </div>

        {/* Current Plan Status */}
        <div className="mb-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-blue-700">Current Plan: {currentPlan?.name}</CardTitle>
                  <CardDescription className="text-blue-600">
                    {currentPlan?.description}
                  </CardDescription>
                </div>
                <Badge className="bg-blue-100 text-blue-700">
                  {currentPlan?.price}{currentPlan?.period}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Messages Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">Messages</span>
                    <span className="text-sm text-blue-600">
                      {usage.messages.used.toLocaleString()} / {usage.messages.limit === -1 ? '∞' : usage.messages.limit.toLocaleString()}
                    </span>
                  </div>
                  {usage.messages.limit !== -1 && (
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(usage.messages.percentage, 100)}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Bots Usage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">AI Bots</span>
                    <span className="text-sm text-blue-600">
                      {usage.bots.used} / {usage.bots.limit === -1 ? '∞' : usage.bots.limit}
                    </span>
                  </div>
                  {usage.bots.limit !== -1 && (
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(usage.bots.percentage, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tiers Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {tiers.map((tier) => {
            const IconComponent = tier.icon;
            const isCurrentPlan = currentPlan?.id === tier.id;
            
            return (
              <Card 
                key={tier.id} 
                className={`relative ${tier.color} ${isCurrentPlan ? 'ring-2 ring-blue-500' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className={`text-center ${tier.bgColor} rounded-t-lg`}>
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-3 rounded-full ${tier.bgColor} border-2 ${tier.color}`}>
                      <IconComponent className={`w-6 h-6 ${tier.textColor}`} />
                    </div>
                  </div>
                  <CardTitle className={tier.textColor}>{tier.name}</CardTitle>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold">
                      <span className={tier.textColor}>{tier.price}</span>
                      <span className="text-muted-foreground text-lg">{tier.period}</span>
                    </div>
                    <CardDescription>{tier.description}</CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        {getFeatureIcon(feature.available)}
                        <span className={feature.available ? 'text-foreground' : 'text-muted-foreground line-through'}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Limitations */}
                  {tier.limitations.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Limitations:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {tier.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <span>•</span>
                            <span>{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button 
                    className={`w-full ${
                      isCurrentPlan 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : tier.id === 'pro' 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    }`}
                    onClick={() => {
                      if (isCurrentPlan) {
                        navigate('/billing');
                      } else {
                        navigate('/pricing');
                      }
                    }}
                  >
                    {isCurrentPlan ? 'Current Plan' : `Upgrade to ${tier.name}`}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Feature Comparison</CardTitle>
            <CardDescription>
              Compare all features across different subscription tiers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Feature</th>
                    <th className="text-center p-4">Free</th>
                    <th className="text-center p-4">Pro</th>
                    <th className="text-center p-4">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {tiers[0].features.map((feature, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-4 font-medium">{feature.name}</td>
                      {tiers.map((tier) => (
                        <td key={tier.id} className="p-4 text-center">
                          {tier.features[index]?.available ? (
                            <Check className="w-5 h-5 text-blue-600 mx-auto" />
                          ) : (
                            <Lock className="w-5 h-5 text-gray-400 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="text-center mt-12">
          <div className="space-x-4">
            <Button 
              onClick={() => navigate('/billing')}
              variant="outline"
            >
              Manage Billing
            </Button>
            <Button 
              onClick={() => navigate('/pricing')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              View Pricing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTiers;
