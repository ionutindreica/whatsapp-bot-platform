import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Bot, 
  MessageSquare, 
  Activity, 
  Zap,
  DollarSign,
  Clock,
  Globe,
  Shield,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCcw,
  Calendar,
  Eye
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalBots: number;
    activeBots: number;
    totalMessages: number;
    messagesToday: number;
    revenue: number;
    revenueGrowth: number;
  };
  platformStats: {
    whatsapp: { users: number; messages: number; growth: number };
    messenger: { users: number; messages: number; growth: number };
    instagram: { users: number; messages: number; growth: number };
    website: { users: number; messages: number; growth: number };
  };
  topWorkspaces: Array<{
    id: string;
    name: string;
    users: number;
    bots: number;
    messages: number;
    revenue: number;
    growth: number;
  }>;
  systemHealth: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    activeConnections: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'user_registration' | 'bot_created' | 'message_sent' | 'payment_received' | 'error_occurred';
    description: string;
    timestamp: string;
    severity: 'info' | 'warning' | 'error';
  }>;
}

const SystemAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    // Mock data for analytics
    const mockData: AnalyticsData = {
      overview: {
        totalUsers: 2847,
        activeUsers: 1923,
        totalBots: 156,
        activeBots: 134,
        totalMessages: 2847293,
        messagesToday: 45230,
        revenue: 45680,
        revenueGrowth: 12.5
      },
      platformStats: {
        whatsapp: { users: 1200, messages: 1450000, growth: 8.2 },
        messenger: { users: 800, messages: 980000, growth: 15.3 },
        instagram: { users: 450, messages: 320000, growth: 22.1 },
        website: { users: 397, messages: 97393, growth: 5.7 }
      },
      topWorkspaces: [
        {
          id: 'ws-1',
          name: 'Alpha Corp',
          users: 45,
          bots: 12,
          messages: 234000,
          revenue: 8900,
          growth: 18.5
        },
        {
          id: 'ws-2',
          name: 'Beta Solutions',
          users: 32,
          bots: 8,
          messages: 156000,
          revenue: 6200,
          growth: 12.3
        },
        {
          id: 'ws-3',
          name: 'Gamma Innovations',
          users: 28,
          bots: 6,
          messages: 98000,
          revenue: 4800,
          growth: 8.7
        },
        {
          id: 'ws-4',
          name: 'Delta Marketing',
          users: 25,
          bots: 5,
          messages: 87000,
          revenue: 4200,
          growth: 15.2
        }
      ],
      systemHealth: {
        uptime: 99.9,
        responseTime: 245,
        errorRate: 0.02,
        activeConnections: 2847
      },
      recentActivity: [
        {
          id: 'act-1',
          type: 'user_registration',
          description: 'New user registered: john@example.com',
          timestamp: '2024-01-20T14:30:00Z',
          severity: 'info'
        },
        {
          id: 'act-2',
          type: 'bot_created',
          description: 'Bot "Customer Support Bot" created in Alpha Corp',
          timestamp: '2024-01-20T13:45:00Z',
          severity: 'info'
        },
        {
          id: 'act-3',
          type: 'payment_received',
          description: 'Payment of $299 received from Beta Solutions',
          timestamp: '2024-01-20T12:15:00Z',
          severity: 'info'
        },
        {
          id: 'act-4',
          type: 'error_occurred',
          description: 'API rate limit exceeded for workspace Gamma Innovations',
          timestamp: '2024-01-20T11:30:00Z',
          severity: 'warning'
        },
        {
          id: 'act-5',
          type: 'message_sent',
          description: 'High message volume detected: 1000+ messages in 1 hour',
          timestamp: '2024-01-20T10:45:00Z',
          severity: 'info'
        }
      ]
    };
    
    // Simulate loading delay
    setTimeout(() => {
      setAnalyticsData(mockData);
      setIsLoading(false);
    }, 1000);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration': return <Users className="h-4 w-4 text-blue-500" />;
      case 'bot_created': return <Bot className="h-4 w-4 text-green-500" />;
      case 'message_sent': return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'payment_received': return <DollarSign className="h-4 w-4 text-yellow-500" />;
      case 'error_occurred': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const exportData = () => {
    toast({
      title: "Export Started",
      description: "Analytics data export has been initiated.",
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCcw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!analyticsData) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-muted-foreground">Failed to load analytics data</p>
            <Button onClick={fetchAnalytics} className="mt-4">
              <RefreshCcw className="h-4 w-4 mr-2" /> Retry
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <BarChart3 className="w-7 h-7 mr-3" /> System Analytics
            </h1>
            <p className="text-muted-foreground">Comprehensive analytics and insights for the platform</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
            <Button variant="outline" onClick={fetchAnalytics}>
              <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{analyticsData.overview.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{analyticsData.overview.totalUsers - analyticsData.overview.activeUsers} this period
                  </p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Bots</p>
                  <p className="text-2xl font-bold">{analyticsData.overview.activeBots}</p>
                  <p className="text-xs text-muted-foreground">
                    {analyticsData.overview.totalBots} total
                  </p>
                </div>
                <Bot className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Messages Today</p>
                  <p className="text-2xl font-bold">{analyticsData.overview.messagesToday.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {analyticsData.overview.totalMessages.toLocaleString()} total
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">${analyticsData.overview.revenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{analyticsData.overview.revenueGrowth}%
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Statistics</CardTitle>
            <CardDescription>Usage statistics across different platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(analyticsData.platformStats).map(([platform, stats]) => (
                <div key={platform} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold capitalize">{platform}</h3>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="text-sm">+{stats.growth}%</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Users:</span>
                      <span className="font-medium">{stats.users}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Messages:</span>
                      <span className="font-medium">{stats.messages.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Workspaces */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Workspaces</CardTitle>
            <CardDescription>Workspaces with highest engagement and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topWorkspaces.map((workspace, index) => (
                <div key={workspace.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold">{workspace.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{workspace.users} users</span>
                        <span>{workspace.bots} bots</span>
                        <span>{workspace.messages.toLocaleString()} messages</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${workspace.revenue.toLocaleString()}</div>
                    <div className="flex items-center text-green-600 text-sm">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +{workspace.growth}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Current system performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Uptime</span>
                </div>
                <span className="font-semibold">{analyticsData.systemHealth.uptime}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span>Response Time</span>
                </div>
                <span className="font-semibold">{analyticsData.systemHealth.responseTime}ms</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span>Error Rate</span>
                </div>
                <span className="font-semibold">{analyticsData.systemHealth.errorRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-purple-500" />
                  <span>Active Connections</span>
                </div>
                <span className="font-semibold">{analyticsData.systemHealth.activeConnections.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform events and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                        <Badge className={`text-xs ${getSeverityColor(activity.severity)}`}>
                          {activity.severity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SystemAnalytics;
