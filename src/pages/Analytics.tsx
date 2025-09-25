import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Filter,
  Calendar,
  Smartphone,
  Facebook,
  Instagram,
  Globe,
  Send,
  Eye,
  MousePointer,
  Heart,
  Share2,
  Bot,
  UserCheck,
  Timer,
  Zap
} from 'lucide-react';
import AdminPageLayout from '@/components/AdminPageLayout';

interface MetricCard {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  description: string;
}

interface PlatformStats {
  platform: string;
  icon: React.ReactNode;
  conversations: number;
  messages: number;
  responseTime: string;
  satisfaction: number;
  trend: 'up' | 'down' | 'stable';
}

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const metricCards: MetricCard[] = [
    {
      title: 'Total Conversations',
      value: '2,847',
      change: 12.5,
      changeType: 'increase',
      icon: <MessageSquare className="w-5 h-5" />,
      description: 'Active conversations across all platforms'
    },
    {
      title: 'Messages Sent',
      value: '15,432',
      change: 8.3,
      changeType: 'increase',
      icon: <Send className="w-5 h-5" />,
      description: 'Total messages sent this period'
    },
    {
      title: 'Response Rate',
      value: '94.2%',
      change: 2.1,
      changeType: 'increase',
      icon: <CheckCircle className="w-5 h-5" />,
      description: 'Average response rate across platforms'
    },
    {
      title: 'Avg Response Time',
      value: '2.3 min',
      change: 15.2,
      changeType: 'decrease',
      icon: <Clock className="w-5 h-5" />,
      description: 'Average time to first response'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8/5',
      change: 0.3,
      changeType: 'increase',
      icon: <Heart className="w-5 h-5" />,
      description: 'Average customer satisfaction score'
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: 18.7,
      changeType: 'increase',
      icon: <Users className="w-5 h-5" />,
      description: 'Unique users engaged this period'
    }
  ];

  const platformStats: PlatformStats[] = [
    {
      platform: 'WhatsApp',
      icon: <Smartphone className="w-5 h-5 text-green-500" />,
      conversations: 1247,
      messages: 8923,
      responseTime: '1.8 min',
      satisfaction: 4.9,
      trend: 'up'
    },
    {
      platform: 'Facebook Messenger',
      icon: <Facebook className="w-5 h-5 text-blue-500" />,
      conversations: 892,
      messages: 3456,
      responseTime: '2.1 min',
      satisfaction: 4.7,
      trend: 'up'
    },
    {
      platform: 'Instagram DM',
      icon: <Instagram className="w-5 h-5 text-pink-500" />,
      conversations: 456,
      messages: 1890,
      responseTime: '3.2 min',
      satisfaction: 4.6,
      trend: 'stable'
    },
    {
      platform: 'Website Chat',
      icon: <Globe className="w-5 h-5 text-purple-500" />,
      conversations: 252,
      messages: 1163,
      responseTime: '2.8 min',
      satisfaction: 4.8,
      trend: 'up'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-500" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    return changeType === 'increase' ? 'text-green-500' : 'text-red-500';
  };

  return (
    <AdminPageLayout 
      title="Analytics Dashboard"
      description="Monitor performance and insights across all platforms"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Header Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="messenger">Messenger</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="website">Website</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metricCards.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.title}
                  </CardTitle>
                  {metric.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${getChangeColor(metric.changeType)}`}>
                      {metric.changeType === 'increase' ? '+' : '-'}{metric.change}%
                    </span>
                    <span className="text-xs text-muted-foreground">from last period</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversation Volume</CardTitle>
                <CardDescription>
                  Daily conversation trends over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chart visualization would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
                <CardDescription>
                  Average response time by platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Chart visualization would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversation Status</CardTitle>
                <CardDescription>
                  Distribution of conversation statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Resolved</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">1,847</span>
                      <Badge variant="secondary">65%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">In Progress</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">623</span>
                      <Badge variant="secondary">22%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm">Pending</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">377</span>
                      <Badge variant="secondary">13%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI vs Human Responses</CardTitle>
                <CardDescription>
                  Distribution of AI vs human agent responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">AI Responses</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">12,847</span>
                      <Badge variant="secondary">78%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Human Responses</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">3,585</span>
                      <Badge variant="secondary">22%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">First Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.3 min</div>
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-500">-15.2%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Resolution Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.7 min</div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-red-500">+5.1%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Customer Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8/5</div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-500">+0.3</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Agent Productivity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-500">+2.1%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platformStats.map((platform, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {platform.icon}
                      <div>
                        <CardTitle className="text-lg">{platform.platform}</CardTitle>
                        <CardDescription>Platform performance metrics</CardDescription>
                      </div>
                    </div>
                    {getTrendIcon(platform.trend)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold">{platform.conversations.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Conversations</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{platform.messages.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Messages</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-lg font-semibold">{platform.responseTime}</div>
                      <div className="text-sm text-muted-foreground">Avg Response Time</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">{platform.satisfaction}/5</div>
                      <div className="text-sm text-muted-foreground">Satisfaction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  AI Insights
                </CardTitle>
                <CardDescription>
                  AI-generated insights and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Peak Hours Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Most conversations occur between 2-4 PM. Consider scheduling more agents during this time.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium mb-2">Customer Satisfaction</h4>
                  <p className="text-sm text-muted-foreground">
                    WhatsApp users show 15% higher satisfaction. Consider promoting WhatsApp as preferred channel.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium mb-2">Response Time Alert</h4>
                  <p className="text-sm text-muted-foreground">
                    Instagram DM response times are 40% slower than average. Review automation rules.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Growth Metrics
                </CardTitle>
                <CardDescription>
                  Growth and trend analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">User Growth</div>
                      <div className="text-sm text-muted-foreground">New users this month</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-500">+23%</div>
                      <div className="text-sm">1,847 users</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Engagement Rate</div>
                      <div className="text-sm text-muted-foreground">Messages per conversation</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-500">5.4</div>
                      <div className="text-sm">+0.8 this month</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Retention Rate</div>
                      <div className="text-sm text-muted-foreground">Returning customers</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-purple-500">87%</div>
                      <div className="text-sm">+3% this month</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AdminPageLayout>
  );
};

export default Analytics;