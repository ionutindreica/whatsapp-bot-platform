import React, { useState, useEffect } from 'react';
import AdminPageLayout from '@/components/AdminPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  CreditCard, 
  DollarSign, 
  Users, 
  Bot, 
  MessageSquare, 
  BarChart3,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCcw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Star,
  Crown,
  Zap
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
  features: string[];
  limits: {
    users: number;
    bots: number;
    messages: number;
    storage: number; // GB
    workspaces: number;
  };
  isActive: boolean;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Subscription {
  id: string;
  workspaceId: string;
  workspaceName: string;
  planId: string;
  planName: string;
  status: 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'TRIAL' | 'PENDING';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  amount: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
  customerEmail: string;
  createdAt: string;
  lastPaymentAt?: string;
  nextBillingDate?: string;
}

const PlansSubscriptions: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeTab, setActiveTab] = useState<'plans' | 'subscriptions'>('plans');
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'TRIAL'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
    fetchSubscriptions();
  }, []);

  const fetchPlans = async () => {
    // Mock data for plans
    const mockPlans: Plan[] = [
      {
        id: 'plan-1',
        name: 'Starter',
        description: 'Perfect for small teams getting started',
        price: 29,
        billingCycle: 'MONTHLY',
        features: [
          'Up to 3 team members',
          '2 bots',
          '5,000 messages/month',
          'Basic analytics',
          'Email support'
        ],
        limits: {
          users: 3,
          bots: 2,
          messages: 5000,
          storage: 1,
          workspaces: 1
        },
        isActive: true,
        isPopular: false,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      },
      {
        id: 'plan-2',
        name: 'Pro',
        description: 'Advanced features for growing businesses',
        price: 99,
        billingCycle: 'MONTHLY',
        features: [
          'Up to 15 team members',
          '10 bots',
          '50,000 messages/month',
          'Advanced analytics',
          'Priority support',
          'Custom integrations',
          'API access'
        ],
        limits: {
          users: 15,
          bots: 10,
          messages: 50000,
          storage: 10,
          workspaces: 3
        },
        isActive: true,
        isPopular: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      },
      {
        id: 'plan-3',
        name: 'Enterprise',
        description: 'Full-scale solution for large organizations',
        price: 299,
        billingCycle: 'MONTHLY',
        features: [
          'Unlimited team members',
          'Unlimited bots',
          '500,000 messages/month',
          'Enterprise analytics',
          '24/7 phone support',
          'Custom integrations',
          'Advanced API access',
          'SSO integration',
          'Custom branding',
          'Dedicated account manager'
        ],
        limits: {
          users: -1, // unlimited
          bots: -1,
          messages: 500000,
          storage: 100,
          workspaces: -1
        },
        isActive: true,
        isPopular: false,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      }
    ];
    setPlans(mockPlans);
  };

  const fetchSubscriptions = async () => {
    // Mock data for subscriptions
    const mockSubscriptions: Subscription[] = [
      {
        id: 'sub-1',
        workspaceId: 'ws-1',
        workspaceName: 'Alpha Corp',
        planId: 'plan-2',
        planName: 'Pro',
        status: 'ACTIVE',
        currentPeriodStart: '2024-01-01T00:00:00Z',
        currentPeriodEnd: '2024-02-01T00:00:00Z',
        amount: 99,
        billingCycle: 'MONTHLY',
        customerEmail: 'owner1@alphacorp.com',
        createdAt: '2023-12-01T00:00:00Z',
        lastPaymentAt: '2024-01-01T00:00:00Z',
        nextBillingDate: '2024-02-01T00:00:00Z'
      },
      {
        id: 'sub-2',
        workspaceId: 'ws-2',
        workspaceName: 'Beta Solutions',
        planId: 'plan-1',
        planName: 'Starter',
        status: 'TRIAL',
        currentPeriodStart: '2024-01-15T00:00:00Z',
        currentPeriodEnd: '2024-02-15T00:00:00Z',
        amount: 0,
        billingCycle: 'MONTHLY',
        customerEmail: 'owner2@betasolutions.com',
        createdAt: '2024-01-15T00:00:00Z',
        nextBillingDate: '2024-02-15T00:00:00Z'
      },
      {
        id: 'sub-3',
        workspaceId: 'ws-3',
        workspaceName: 'Gamma Innovations',
        planId: 'plan-3',
        planName: 'Enterprise',
        status: 'ACTIVE',
        currentPeriodStart: '2024-01-01T00:00:00Z',
        currentPeriodEnd: '2024-02-01T00:00:00Z',
        amount: 299,
        billingCycle: 'MONTHLY',
        customerEmail: 'owner3@gammainnovations.com',
        createdAt: '2023-11-01T00:00:00Z',
        lastPaymentAt: '2024-01-01T00:00:00Z',
        nextBillingDate: '2024-02-01T00:00:00Z'
      },
      {
        id: 'sub-4',
        workspaceId: 'ws-4',
        workspaceName: 'Delta Marketing',
        planId: 'plan-2',
        planName: 'Pro',
        status: 'PAST_DUE',
        currentPeriodStart: '2023-12-01T00:00:00Z',
        currentPeriodEnd: '2024-01-01T00:00:00Z',
        amount: 99,
        billingCycle: 'MONTHLY',
        customerEmail: 'owner4@deltamarketing.com',
        createdAt: '2023-10-01T00:00:00Z',
        lastPaymentAt: '2023-12-01T00:00:00Z'
      }
    ];
    setSubscriptions(mockSubscriptions);
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.workspaceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handlePlanToggle = (planId: string) => {
    setPlans(plans.map(plan => 
      plan.id === planId 
        ? { ...plan, isActive: !plan.isActive }
        : plan
    ));
    toast({
      title: "Plan Updated",
      description: "Plan status has been updated.",
    });
  };

  const handleSubscriptionAction = (subscriptionId: string, action: string) => {
    console.log(`Subscription ${subscriptionId} - Action: ${action}`);
    toast({
      title: "Action Successful",
      description: `Subscription ${action.toLowerCase()}d. (Mock action)`,
    });
    fetchSubscriptions();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'TRIAL': return 'info';
      case 'PAST_DUE': return 'destructive';
      case 'CANCELLED': return 'outline';
      case 'PENDING': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="h-4 w-4" />;
      case 'TRIAL': return <Star className="h-4 w-4" />;
      case 'PAST_DUE': return <AlertTriangle className="h-4 w-4" />;
      case 'CANCELLED': return <XCircle className="h-4 w-4" />;
      case 'PENDING': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'starter': return <Zap className="h-5 w-5 text-blue-500" />;
      case 'pro': return <Star className="h-5 w-5 text-purple-500" />;
      case 'enterprise': return <Crown className="h-5 w-5 text-yellow-500" />;
      default: return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <AdminPageLayout 
      title="Plans & Subscriptions"
      description="Manage subscription plans and billing"
    >
      <div className="space-y-6">

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'plans' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Plans
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'subscriptions' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Subscriptions
          </button>
        </div>

        {activeTab === 'plans' && (
          <div className="space-y-6">
            {/* Plans Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Plans</p>
                      <p className="text-2xl font-bold">{plans.length}</p>
                    </div>
                    <CreditCard className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Plans</p>
                      <p className="text-2xl font-bold">{plans.filter(p => p.isActive).length}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Popular Plan</p>
                      <p className="text-2xl font-bold">{plans.find(p => p.isPopular)?.name || 'None'}</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.id} className={`relative ${plan.isPopular ? 'ring-2 ring-purple-500' : ''}`}>
                  {plan.isPopular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-500 text-white">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getPlanIcon(plan.name)}
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                      </div>
                      <Switch
                        checked={plan.isActive}
                        onCheckedChange={() => handlePlanToggle(plan.id)}
                      />
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/{plan.billingCycle.toLowerCase()}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Features:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Limits:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span>{plan.limits.users === -1 ? 'Unlimited' : plan.limits.users} users</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Bot className="h-4 w-4 text-green-500" />
                          <span>{plan.limits.bots === -1 ? 'Unlimited' : plan.limits.bots} bots</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="h-4 w-4 text-purple-500" />
                          <span>{plan.limits.messages.toLocaleString()} messages</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-4 w-4 text-orange-500" />
                          <span>{plan.limits.storage}GB storage</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 pt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center">
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create New Plan</span>
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            {/* Subscriptions Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Subscriptions</p>
                      <p className="text-2xl font-bold">{subscriptions.length}</p>
                    </div>
                    <CreditCard className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active</p>
                      <p className="text-2xl font-bold text-green-600">{subscriptions.filter(s => s.status === 'ACTIVE').length}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Trials</p>
                      <p className="text-2xl font-bold text-blue-600">{subscriptions.filter(s => s.status === 'TRIAL').length}</p>
                    </div>
                    <Star className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Past Due</p>
                      <p className="text-2xl font-bold text-red-600">{subscriptions.filter(s => s.status === 'PAST_DUE').length}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="Search subscriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="ACTIVE">Active</option>
                    <option value="TRIAL">Trial</option>
                    <option value="PAST_DUE">Past Due</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <Button variant="outline" onClick={fetchSubscriptions}>
                    <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Subscriptions Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Subscriptions</CardTitle>
                <CardDescription>Manage and monitor all customer subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Workspace</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Billing Cycle</TableHead>
                      <TableHead>Next Billing</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">{sub.workspaceName}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getPlanIcon(sub.planName)}
                            <span>{sub.planName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(sub.status)} className="flex items-center space-x-1 w-fit">
                            {getStatusIcon(sub.status)}
                            <span>{sub.status.replace('_', ' ')}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">${sub.amount}</span>
                        </TableCell>
                        <TableCell>{sub.billingCycle}</TableCell>
                        <TableCell>
                          {sub.nextBillingDate ? new Date(sub.nextBillingDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>{sub.customerEmail}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleSubscriptionAction(sub.id, 'View')}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleSubscriptionAction(sub.id, 'Edit')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            {sub.status === 'ACTIVE' && (
                              <Button variant="ghost" size="sm" onClick={() => handleSubscriptionAction(sub.id, 'Cancel')}>
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            )}
                            {sub.status === 'CANCELLED' && (
                              <Button variant="ghost" size="sm" onClick={() => handleSubscriptionAction(sub.id, 'Reactivate')}>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
};

export default PlansSubscriptions;
