import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Zap,
  Bot,
  Clock,
  Target,
  MessageSquare,
  Users,
  Tag,
  Filter,
  Play,
  Pause,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Activity,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Database,
  GitBranch,
  Workflow,
  ShoppingCart,
  Calendar,
  Timer,
  Bell,
  Mail,
  Phone,
  Globe,
  Hash,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import AdminPageLayout from '@/components/AdminPageLayout';

interface Automation {
  id: string;
  name: string;
  description: string;
  type: 'response' | 'tag' | 'trigger' | 'workflow' | 'campaign';
  status: 'active' | 'inactive' | 'draft';
  trigger: {
    type: string;
    condition: string;
    value: string;
  };
  action: {
    type: string;
    parameters: any;
  };
  conditions: string[];
  lastRun?: string;
  successRate: number;
  totalRuns: number;
  platforms: string[];
  tags: string[];
}

interface Trigger {
  id: string;
  name: string;
  description: string;
  type: 'keyword' | 'time' | 'behavior' | 'webhook' | 'schedule';
  conditions: string[];
  status: 'active' | 'inactive';
  occurrences: number;
  lastTriggered?: string;
}

interface Tag {
  id: string;
  name: string;
  color: string;
  description: string;
  usage: number;
  autoAssign: boolean;
  conditions: string[];
}

const AutomationCenter: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);

  const automations: Automation[] = [
    {
      id: 'auto-1',
      name: 'Welcome New Users',
      description: 'Automatically greet new users and provide helpful information',
      type: 'response',
      status: 'active',
      trigger: {
        type: 'first_message',
        condition: 'equals',
        value: 'any'
      },
      action: {
        type: 'send_message',
        parameters: {
          message: 'Welcome! How can I help you today?',
          delay: 2
        }
      },
      conditions: ['new_user', 'platform_whatsapp'],
      lastRun: '2 minutes ago',
      successRate: 98.5,
      totalRuns: 1247,
      platforms: ['WhatsApp', 'Messenger'],
      tags: ['welcome', 'onboarding']
    },
    {
      id: 'auto-2',
      name: 'Support Escalation',
      description: 'Escalate complex support issues to human agents',
      type: 'trigger',
      status: 'active',
      trigger: {
        type: 'keyword',
        condition: 'contains',
        value: 'urgent,help,problem,issue'
      },
      action: {
        type: 'escalate',
        parameters: {
          department: 'support',
          priority: 'high'
        }
      },
      conditions: ['sentiment_negative', 'complexity_high'],
      lastRun: '5 minutes ago',
      successRate: 94.2,
      totalRuns: 892,
      platforms: ['WhatsApp', 'Instagram', 'Website'],
      tags: ['support', 'escalation']
    },
    {
      id: 'auto-3',
      name: 'Lead Qualification',
      description: 'Automatically tag and qualify leads based on conversation',
      type: 'tag',
      status: 'active',
      trigger: {
        type: 'keyword',
        condition: 'contains',
        value: 'price,cost,budget,quote'
      },
      action: {
        type: 'add_tag',
        parameters: {
          tags: ['qualified_lead', 'pricing_inquiry'],
          notify: 'sales_team'
        }
      },
      conditions: ['intent_pricing', 'sentiment_positive'],
      lastRun: '1 hour ago',
      successRate: 89.7,
      totalRuns: 634,
      platforms: ['WhatsApp', 'Messenger', 'Instagram'],
      tags: ['sales', 'lead_qualification']
    },
    {
      id: 'auto-4',
      name: 'Follow-up Campaign',
      description: 'Send follow-up messages to users who showed interest',
      type: 'campaign',
      status: 'inactive',
      trigger: {
        type: 'schedule',
        condition: 'daily',
        value: '09:00'
      },
      action: {
        type: 'send_campaign',
        parameters: {
          message: 'Hi! Still interested in our services?',
          audience: 'interested_users'
        }
      },
      conditions: ['tag_interested', 'last_contact_3_days'],
      lastRun: '1 day ago',
      successRate: 76.3,
      totalRuns: 45,
      platforms: ['WhatsApp', 'Email'],
      tags: ['follow_up', 'marketing']
    }
  ];

  const triggers: Trigger[] = [
    {
      id: 'trigger-1',
      name: 'Keyword Detection',
      description: 'Triggers when specific keywords are mentioned',
      type: 'keyword',
      conditions: ['message_contains_keywords'],
      status: 'active',
      occurrences: 2847,
      lastTriggered: '2 minutes ago'
    },
    {
      id: 'trigger-2',
      name: 'Time-based Schedule',
      description: 'Triggers at specific times or intervals',
      type: 'time',
      conditions: ['daily_09:00', 'weekly_monday'],
      status: 'active',
      occurrences: 156,
      lastTriggered: '1 hour ago'
    },
    {
      id: 'trigger-3',
      name: 'User Behavior',
      description: 'Triggers based on user actions and behavior patterns',
      type: 'behavior',
      conditions: ['first_message', 'returning_user', 'inactive_7_days'],
      status: 'active',
      occurrences: 923,
      lastTriggered: '5 minutes ago'
    },
    {
      id: 'trigger-4',
      name: 'Webhook Integration',
      description: 'External system triggers via webhooks',
      type: 'webhook',
      conditions: ['crm_update', 'payment_received'],
      status: 'inactive',
      occurrences: 0
    }
  ];

  const tags: Tag[] = [
    {
      id: 'tag-1',
      name: 'New Customer',
      color: 'blue',
      description: 'First-time users',
      usage: 1247,
      autoAssign: true,
      conditions: ['first_interaction']
    },
    {
      id: 'tag-2',
      name: 'VIP Customer',
      color: 'gold',
      description: 'High-value customers',
      usage: 89,
      autoAssign: false,
      conditions: ['total_spent_1000+', 'repeat_customer']
    },
    {
      id: 'tag-3',
      name: 'Support Issue',
      color: 'red',
      description: 'Users with support requests',
      usage: 456,
      autoAssign: true,
      conditions: ['sentiment_negative', 'contains_help_keywords']
    },
    {
      id: 'tag-4',
      name: 'Lead',
      color: 'green',
      description: 'Potential customers',
      usage: 234,
      autoAssign: true,
      conditions: ['pricing_inquiry', 'demo_request']
    },
    {
      id: 'tag-5',
      name: 'Churned',
      color: 'gray',
      description: 'Inactive users',
      usage: 678,
      autoAssign: true,
      conditions: ['inactive_30_days']
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'response':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'tag':
        return <Tag className="w-4 h-4 text-green-500" />;
      case 'trigger':
        return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'workflow':
        return <Workflow className="w-4 h-4 text-purple-500" />;
      case 'campaign':
        return <Target className="w-4 h-4 text-red-500" />;
      default:
        return <Bot className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-yellow-500">Draft</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'keyword':
        return <Hash className="w-4 h-4 text-blue-500" />;
      case 'time':
        return <Clock className="w-4 h-4 text-green-500" />;
      case 'behavior':
        return <Users className="w-4 h-4 text-purple-500" />;
      case 'webhook':
        return <Globe className="w-4 h-4 text-orange-500" />;
      case 'schedule':
        return <Calendar className="w-4 h-4 text-red-500" />;
      default:
        return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleWorkflowConfigure = (workflowType: string) => {
    console.log('Configuring workflow:', workflowType);
    navigate(`/dashboard/workflow/${workflowType}`);
  };


  const getTagColor = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      purple: 'bg-purple-100 text-purple-800',
      pink: 'bg-pink-100 text-pink-800',
      gray: 'bg-gray-100 text-gray-800',
      gold: 'bg-yellow-200 text-yellow-900'
    };
    return colors[color] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminPageLayout 
      title="Automation Center"
      description="Build intelligent automations for responses, tags, triggers, and workflows"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="automations">Automations</TabsTrigger>
          <TabsTrigger value="triggers">Triggers</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Automation Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Automations</p>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-green-600">+3 this week</p>
                  </div>
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Executions</p>
                    <p className="text-2xl font-bold">28,547</p>
                    <p className="text-sm text-blue-600">+1,234 today</p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold">94.2%</p>
                    <p className="text-sm text-green-600">+2.1% this week</p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Time Saved</p>
                    <p className="text-2xl font-bold">847h</p>
                    <p className="text-sm text-purple-600">This month</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Automation Activity
              </CardTitle>
              <CardDescription>
                Latest automation executions and results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Welcome New Users</p>
                      <p className="text-sm text-muted-foreground">Triggered: New user message • Success</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600">✓ Success</p>
                    <p className="text-xs text-muted-foreground">2 min ago</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Tag className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Lead Qualification</p>
                      <p className="text-sm text-muted-foreground">Triggered: "pricing" keyword • Tagged as Lead</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600">✓ Success</p>
                    <p className="text-xs text-muted-foreground">5 min ago</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-medium">Support Escalation</p>
                      <p className="text-sm text-muted-foreground">Triggered: "urgent help" • Escalated to human</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600">✓ Success</p>
                    <p className="text-xs text-muted-foreground">8 min ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automations" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Automations</CardTitle>
                  <CardDescription>Manage your automated responses, tags, and workflows</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Automation
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automations.map((automation) => (
                  <div key={automation.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(automation.type)}
                        <div>
                          <h3 className="font-medium">{automation.name}</h3>
                          <p className="text-sm text-muted-foreground">{automation.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(automation.status)}
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Trigger</p>
                        <p className="font-medium">{automation.trigger.type}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Success Rate</p>
                        <p className="font-medium text-green-600">{automation.successRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Runs</p>
                        <p className="font-medium">{automation.totalRuns.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Run</p>
                        <p className="font-medium">{automation.lastRun}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {automation.platforms.map((platform) => (
                        <Badge key={platform} variant="outline" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                      {automation.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="triggers" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Trigger System</CardTitle>
                  <CardDescription>Configure what events trigger your automations</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Trigger
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {triggers.map((trigger) => (
                  <div key={trigger.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getTriggerIcon(trigger.type)}
                        <div>
                          <h3 className="font-medium">{trigger.name}</h3>
                          <p className="text-sm text-muted-foreground">{trigger.description}</p>
                        </div>
                      </div>
                      {getStatusBadge(trigger.status)}
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Conditions:</p>
                        <div className="flex flex-wrap gap-1">
                          {trigger.conditions.map((condition, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Occurrences</p>
                          <p className="font-medium">{trigger.occurrences.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Triggered</p>
                          <p className="font-medium">{trigger.lastTriggered || 'Never'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Type</p>
                          <p className="font-medium capitalize">{trigger.type}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Smart Tags</CardTitle>
                  <CardDescription>Automatically tag users based on behavior and conversations</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Tag
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tags.map((tag) => (
                  <div key={tag.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Tag className="w-5 h-5" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${getTagColor(tag.color)} border-0`}>
                              {tag.name}
                            </Badge>
                            {tag.autoAssign && (
                              <Badge variant="outline" className="text-xs">
                                Auto-assign
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{tag.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{tag.usage.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">users</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Auto-assign conditions:</p>
                      <div className="flex flex-wrap gap-1">
                        {tag.conditions.map((condition, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Complex Workflows</CardTitle>
                  <CardDescription>Build sophisticated multi-step automation workflows</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Workflow
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Workflow Templates */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-lg transition-all h-32 flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-500" />
                      Lead Qualification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <p className="text-xs text-muted-foreground mb-2">
                      Qualify and segment leads automatically
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="success">Active</Badge>
                      <Button size="sm" variant="outline" onClick={() => handleWorkflowConfigure('lead_qualification')}>Configure</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all h-32 flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      Follow-up Sequence
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <p className="text-xs text-muted-foreground mb-2">
                      Automated follow-up sequence
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="success">Active</Badge>
                      <Button size="sm" variant="outline" onClick={() => handleWorkflowConfigure('followup_sequence')}>Configure</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all h-32 flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-purple-500" />
                      Cart Recovery
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <p className="text-xs text-muted-foreground mb-2">
                      Recover abandoned carts automatically
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="success">Active</Badge>
                      <Button size="sm" variant="outline" onClick={() => handleWorkflowConfigure('cart_recovery')}>Configure</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all h-32 flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      Appointment Reminders
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <p className="text-xs text-muted-foreground mb-2">
                      Automated appointment reminders
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="success">Active</Badge>
                      <Button size="sm" variant="outline" onClick={() => handleWorkflowConfigure('appointment_reminders')}>Configure</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all h-32 flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-red-500" />
                      Marketing Campaigns
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <p className="text-xs text-muted-foreground mb-2">
                      Automated marketing campaigns
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Draft</Badge>
                      <Button size="sm" variant="outline" onClick={() => handleWorkflowConfigure('marketing_campaigns')}>Configure</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all h-32 flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Bot className="w-4 h-4 text-pink-500" />
                      AI Personalization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <p className="text-xs text-muted-foreground mb-2">
                      AI-powered personalization for recommendations
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Draft</Badge>
                      <Button size="sm" variant="outline" onClick={() => handleWorkflowConfigure('ai_personalization')}>Configure</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Workflow Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Workflow Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">12</div>
                      <div className="text-sm text-muted-foreground">Active Workflows</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">1,234</div>
                      <div className="text-sm text-muted-foreground">Executions Today</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-500">89%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">45</div>
                      <div className="text-sm text-muted-foreground">Leads Generated</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </AdminPageLayout>
  );
};

export default AutomationCenter;
