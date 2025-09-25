import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  Shield, 
  Users, 
  MessageSquare, 
  BarChart3,
  Globe,
  Smartphone,
  Instagram,
  Send,
  Crown,
  Rocket,
  CheckCircle2
} from 'lucide-react';
import { PLANS, FEATURE_MATRIX, PlanType } from '@/types/pricing';
import AdminPageLayout from '@/components/AdminPageLayout';

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('pro');

  const getPlanIcon = (planId: PlanType) => {
    switch (planId) {
      case 'starter':
        return <Zap className="w-6 h-6" />;
      case 'pro':
        return <Crown className="w-6 h-6" />;
      case 'enterprise':
        return <Rocket className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getPlanColor = (planId: PlanType) => {
    switch (planId) {
      case 'starter':
        return 'bg-blue-500';
      case 'pro':
        return 'bg-purple-500';
      case 'enterprise':
        return 'bg-gradient-to-r from-purple-600 to-pink-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'WhatsApp':
        return <Smartphone className="w-4 h-4" />;
      case 'Messenger':
        return <MessageSquare className="w-4 h-4" />;
      case 'Instagram':
        return <Instagram className="w-4 h-4" />;
      case 'Website':
        return <Globe className="w-4 h-4" />;
      case 'Telegram':
        return <Send className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const formatPrice = (price: number) => {
    if (billingCycle === 'yearly') {
      return Math.round(price * 12 * 0.8); // 20% discount for yearly
    }
    return price;
  };

  const formatBillingPeriod = () => {
    return billingCycle === 'yearly' ? '/year' : '/month';
  };

  return (
    <AdminPageLayout 
      title="Pricing & Plans"
      description="Choose the perfect plan for your business needs"
    >
      <Tabs value="pricing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pricing">Plans & Pricing</TabsTrigger>
          <TabsTrigger value="features">Feature Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="space-y-8">
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={billingCycle === 'monthly' ? 'font-medium' : 'text-muted-foreground'}>
              Monthly
            </span>
            <Switch
              checked={billingCycle === 'yearly'}
              onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
            />
            <span className={billingCycle === 'yearly' ? 'font-medium' : 'text-muted-foreground'}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <Badge variant="default" className="bg-green-500">
                Save 20%
              </Badge>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {PLANS.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative ${plan.popular ? 'ring-2 ring-purple-500 shadow-xl scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${getPlanColor(plan.id)} text-white mb-4 mx-auto`}>
                    {getPlanIcon(plan.id)}
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">
                    {plan.id === 'starter' && 'Perfect for small businesses getting started'}
                    {plan.id === 'pro' && 'Ideal for growing businesses with teams'}
                    {plan.id === 'enterprise' && 'Advanced features for large organizations'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Price */}
                  <div className="text-center">
                    <div className="text-4xl font-bold">
                      ${formatPrice(plan.price)}
                      <span className="text-lg font-normal text-muted-foreground">
                        {formatBillingPeriod()}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Billed annually (${plan.price}/month)
                      </div>
                    )}
                  </div>

                  {/* Limits */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Users</span>
                      <span className="font-medium">
                        {plan.limits.users === -1 ? 'Unlimited' : plan.limits.users}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Messages/month</span>
                      <span className="font-medium">
                        {plan.limits.messages === -1 ? 'Unlimited' : plan.limits.messages.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Flows</span>
                      <span className="font-medium">
                        {plan.limits.flows === -1 ? 'Unlimited' : plan.limits.flows}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Platforms</span>
                      <span className="font-medium">
                        {plan.limits.platforms === -1 ? 'All' : plan.limits.platforms}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Integrations</span>
                      <span className="font-medium">
                        {plan.limits.integrations === -1 ? 'Unlimited' : plan.limits.integrations}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    className={`w-full ${plan.id === 'pro' ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                    variant={plan.id === 'pro' ? 'default' : 'outline'}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.id === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                  </Button>

                  {/* Key Features */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Key Features:</h4>
                    <div className="space-y-1">
                      {plan.features.slice(0, 5).map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                          <span>{feature.name}</span>
                        </div>
                      ))}
                      {plan.features.length > 5 && (
                        <div className="text-xs text-muted-foreground">
                          +{plan.features.length - 5} more features
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              All plans include 14-day free trial. No credit card required.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                <span>No setup fees</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Comparison</CardTitle>
              <CardDescription>
                Compare features across all plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Features</th>
                      <th className="text-center py-3 px-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Zap className="w-4 h-4 text-blue-500" />
                          <span>Starter</span>
                        </div>
                      </th>
                      <th className="text-center py-3 px-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Crown className="w-4 h-4 text-purple-500" />
                          <span>Pro</span>
                        </div>
                      </th>
                      <th className="text-center py-3 px-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Rocket className="w-4 h-4 text-purple-600" />
                          <span>Enterprise</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(FEATURE_MATRIX).map(([category, features]) => (
                      <React.Fragment key={category}>
                        <tr className="bg-muted/50">
                          <td colSpan={4} className="py-2 px-4 font-medium">
                            {category}
                          </td>
                        </tr>
                        {Object.entries(features).map(([featureName, availability]) => (
                          <tr key={featureName} className="border-b">
                            <td className="py-3 px-4 text-sm">{featureName}</td>
                            <td className="text-center py-3 px-4">
                              {availability.starter ? (
                                <Check className="w-4 h-4 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-4 h-4 text-red-500 mx-auto" />
                              )}
                            </td>
                            <td className="text-center py-3 px-4">
                              {availability.pro ? (
                                <Check className="w-4 h-4 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-4 h-4 text-red-500 mx-auto" />
                              )}
                            </td>
                            <td className="text-center py-3 px-4">
                              {availability.enterprise ? (
                                <Check className="w-4 h-4 text-green-500 mx-auto" />
                              ) : (
                                <X className="w-4 h-4 text-red-500 mx-auto" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Platform-specific Features */}
          <Card>
            <CardHeader>
              <CardTitle>Platform-Specific Features</CardTitle>
              <CardDescription>
                Features available for each communication platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: 'WhatsApp Business', icon: <Smartphone className="w-6 h-6" />, color: 'text-green-500' },
                  { name: 'Facebook Messenger', icon: <MessageSquare className="w-6 h-6" />, color: 'text-blue-500' },
                  { name: 'Instagram DM', icon: <Instagram className="w-6 h-6" />, color: 'text-pink-500' },
                  { name: 'Website Chat', icon: <Globe className="w-6 h-6" />, color: 'text-purple-500' }
                ].map((platform) => (
                  <div key={platform.name} className="text-center p-4 border rounded-lg">
                    <div className={`${platform.color} mb-2 flex justify-center`}>
                      {platform.icon}
                    </div>
                    <h3 className="font-medium mb-2">{platform.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Full feature set available on all plans
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminPageLayout>
  );
};

export default Pricing;