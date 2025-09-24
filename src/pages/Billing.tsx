import { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Download, 
  Upload,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Receipt,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Zap,
  Users,
  Bot,
  MessageSquare,
  Database,
  Shield,
  Crown
} from "lucide-react";

const Billing = () => {
  const [selectedPlan, setSelectedPlan] = useState("professional");
  
  const currentPlan = {
    name: "Professional",
    price: 99,
    period: "monthly",
    features: [
      "10,000 conversations/month",
      "Unlimited bots",
      "Advanced analytics",
      "Priority support",
      "API access",
      "Custom integrations"
    ],
    usage: {
      conversations: 7847,
      limit: 10000,
      bots: 12,
      storage: 2.4,
      limitStorage: 10
    }
  };

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: 29,
      period: "monthly",
      description: "Perfect for small businesses",
      features: [
        "1,000 conversations/month",
        "3 bots",
        "Basic analytics",
        "Email support",
        "Standard templates"
      ],
      popular: false,
      current: false
    },
    {
      id: "professional",
      name: "Professional",
      price: 99,
      period: "monthly",
      description: "Best for growing businesses",
      features: [
        "10,000 conversations/month",
        "Unlimited bots",
        "Advanced analytics",
        "Priority support",
        "API access",
        "Custom integrations"
      ],
      popular: true,
      current: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 299,
      period: "monthly",
      description: "For large organizations",
      features: [
        "Unlimited conversations",
        "Unlimited bots",
        "Custom analytics",
        "24/7 phone support",
        "White-label options",
        "Custom integrations",
        "Dedicated account manager"
      ],
      popular: false,
      current: false
    }
  ];

  const invoices = [
    {
      id: "INV-2024-001",
      date: "2024-03-01",
      amount: 99.00,
      status: "paid",
      description: "Professional Plan - March 2024"
    },
    {
      id: "INV-2024-002",
      date: "2024-02-01",
      amount: 99.00,
      status: "paid",
      description: "Professional Plan - February 2024"
    },
    {
      id: "INV-2024-003",
      date: "2024-01-01",
      amount: 99.00,
      status: "paid",
      description: "Professional Plan - January 2024"
    }
  ];

  const paymentMethods = [
    {
      id: 1,
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiry: "12/26",
      isDefault: true
    },
    {
      id: 2,
      type: "card",
      last4: "5555",
      brand: "Mastercard",
      expiry: "08/25",
      isDefault: false
    }
  ];

  const usageStats = [
    {
      name: "Conversations",
      used: currentPlan.usage.conversations,
      limit: currentPlan.usage.limit,
      percentage: (currentPlan.usage.conversations / currentPlan.usage.limit) * 100,
      icon: MessageSquare,
      color: "text-blue-600"
    },
    {
      name: "Bots",
      used: currentPlan.usage.bots,
      limit: "Unlimited",
      percentage: 0,
      icon: Bot,
      color: "text-whatsapp"
    },
    {
      name: "Storage",
      used: currentPlan.usage.storage,
      limit: currentPlan.usage.limitStorage,
      percentage: (currentPlan.usage.storage / currentPlan.usage.limitStorage) * 100,
      icon: Database,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back to Dashboard */}
        <BackToDashboard title="Back to Dashboard" />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <CreditCard className="w-8 h-8 text-whatsapp" />
              Billing & Subscription
            </h1>
            <p className="text-muted-foreground">Manage your subscription and billing information</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 w-4 h-4" />
              Export Invoices
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 w-4 h-4" />
              Billing Settings
            </Button>
          </div>
        </div>

        {/* Current Plan Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                    <p className="text-muted-foreground">${currentPlan.price}/{currentPlan.period}</p>
                  </div>
                  <Badge className="bg-whatsapp text-white">Active</Badge>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {currentPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Usage This Month</h4>
                  {usageStats.map((stat) => (
                    <div key={stat.name} className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          <stat.icon className={`w-4 h-4 ${stat.color}`} />
                          {stat.name}
                        </span>
                        <span>{stat.used} / {stat.limit}</span>
                      </div>
                      {stat.percentage > 0 && (
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              stat.percentage > 80 ? 'bg-red-500' : 
                              stat.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(stat.percentage, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Cost</p>
                      <p className="text-2xl font-bold">${currentPlan.price}</p>
                      <p className="text-sm text-green-600">No overages this month</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Next Billing</p>
                      <p className="text-2xl font-bold">Apr 1, 2024</p>
                      <p className="text-sm text-muted-foreground">Auto-renewal enabled</p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Saved</p>
                      <p className="text-2xl font-bold">$1,188</p>
                      <p className="text-sm text-green-600">vs. pay-per-use</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative hover:shadow-lg transition-shadow ${
                    plan.popular ? 'ring-2 ring-whatsapp' : ''
                  } ${plan.current ? 'bg-whatsapp/5' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-whatsapp text-white">Most Popular</Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      {plan.current && (
                        <Badge className="bg-green-100 text-green-800">Current Plan</Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold">${plan.price}</div>
                      <div className="text-sm text-muted-foreground">per {plan.period}</div>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4">
                      {plan.current ? (
                        <Button className="w-full" disabled>
                          Current Plan
                        </Button>
                      ) : (
                        <Button 
                          className="w-full"
                          variant={plan.popular ? "default" : "outline"}
                        >
                          {plan.price > currentPlan.price ? "Upgrade" : "Downgrade"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Billing History
                </CardTitle>
                <CardDescription>View and download your invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-medium">{invoice.id}</h4>
                          <p className="text-sm text-muted-foreground">{invoice.description}</p>
                          <p className="text-xs text-muted-foreground">{invoice.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                          <Badge 
                            variant={invoice.status === 'paid' ? 'default' : 'destructive'}
                            className={invoice.status === 'paid' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {invoice.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Methods
                </CardTitle>
                <CardDescription>Manage your payment methods and billing information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-medium">{method.brand} •••• {method.last4}</h4>
                          <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.isDefault && (
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Default
                          </Badge>
                        )}
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <Button variant="outline">
                    <Plus className="mr-2 w-4 h-4" />
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>Update your billing address and tax information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Billing Settings</h3>
                  <p className="text-muted-foreground mb-4">
                    Update your billing address, tax information, and billing preferences
                  </p>
                  <Button>
                    <Settings className="mr-2 w-4 h-4" />
                    Update Billing Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Billing;
