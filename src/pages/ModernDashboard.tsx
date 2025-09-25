import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import Topbar from '@/components/Topbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SidebarProvider } from '@/components/ui/sidebar';
import { 
  MessageSquare, 
  Bot, 
  Users, 
  TrendingUp, 
  Play, 
  Pause, 
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Globe,
  Smartphone
} from 'lucide-react';

const ModernDashboard = () => {
  const { user } = useAuth();
  const { currentPlan, userSubscription, getUsagePercentage, isFeatureAvailable } = useSubscription();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalConversations: 0,
    activeAgents: 0,
    conversionRate: 0,
    messagesToday: 0
  });
  
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setError('');
      
      if (!user) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        navigate('/login');
        return;
      }

      // Load user stats
      const statsResponse = await fetch('http://localhost:3001/api/user/usage', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats({
          totalConversations: statsData.totalMessages || 0,
          activeAgents: statsData.totalBots || 0,
          conversionRate: 12.5,
          messagesToday: statsData.totalMessages || 0
        });
      }

      // Load user's bots
      const botsResponse = await fetch('http://localhost:3001/api/bots', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (botsResponse.ok) {
        const botsData = await botsResponse.json();
        setBots(botsData.bots || []);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
      setStats({
        totalConversations: 0,
        activeAgents: 0,
        conversionRate: 0,
        messagesToday: 0
      });
      setBots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBotToggle = async (botId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/bots/${botId}/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Reload bots data
        loadDashboardData();
      }
    } catch (error) {
      console.error('Error toggling bot:', error);
    }
  };

  const handleUpgrade = () => {
    navigate('/subscription-tiers');
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col">
            <Topbar />
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col">
            <Topbar />
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => navigate('/login')}>Go to Login</Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  const kpiCards = [
    {
      title: 'Total Conversations',
      value: stats.totalConversations.toLocaleString(),
      change: '+12%',
      trend: 'up',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Active Agents',
      value: stats.activeAgents.toString(),
      change: '+2',
      trend: 'up',
      icon: Bot,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Messages Today',
      value: stats.messagesToday.toLocaleString(),
      change: '+8%',
      trend: 'up',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6 space-y-6">
              {/* Breadcrumbs */}
              <Breadcrumbs />
              
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                  <p className="text-muted-foreground">
                    Welcome back, {user?.name || 'User'}! Here's what's happening with your AI agents.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-sm">
                    {currentPlan?.name || 'Free'} Plan
                  </Badge>
                  {currentPlan?.name === 'Free' && (
                    <Button onClick={handleUpgrade} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Upgrade Plan
                    </Button>
                  )}
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((card, index) => {
                  const IconComponent = card.icon;
                  return (
                    <Card key={index} className="relative overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">
                              {card.title}
                            </p>
                            <p className="text-2xl font-bold">{card.value}</p>
                            <div className="flex items-center text-sm">
                              {card.trend === 'up' ? (
                                <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                              )}
                              <span className={card.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                                {card.change}
                              </span>
                              <span className="text-muted-foreground ml-1">vs last month</span>
                            </div>
                          </div>
                          <div className={`p-3 rounded-2xl ${card.bgColor} ${card.borderColor} border`}>
                            <IconComponent className={`h-6 w-6 ${card.color}`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Conversations Chart */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Conversation Trends</CardTitle>
                    <CardDescription>
                      Last 30 days conversation volume
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                      <div className="text-center">
                        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Chart visualization coming soon</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Agent Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>AI Agent Status</CardTitle>
                    <CardDescription>
                      Manage your active agents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {bots.length > 0 ? (
                      bots.map((bot: any) => (
                        <div key={bot.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-blue-50">
                              <Bot className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{bot.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {bot.messages?.toLocaleString() || 0} messages
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleBotToggle(bot.id)}
                              className={bot.isActive ? 'text-green-600' : 'text-gray-400'}
                            >
                              {bot.isActive ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">No AI agents yet</p>
                        <Button onClick={() => navigate('/bots')} className="w-full">
                          Create Your First Agent
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Latest Conversations */}
              <Card>
                <CardHeader>
                  <CardTitle>Latest Conversations</CardTitle>
                  <CardDescription>
                    Recent customer interactions across all channels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Sarah Johnson', message: 'Hi, I need help with my order...', time: '2 min ago', channel: 'WhatsApp', status: 'active' },
                      { name: 'Mike Chen', message: 'Can you explain your pricing?', time: '5 min ago', channel: 'Instagram', status: 'resolved' },
                      { name: 'Emma Wilson', message: 'Thank you for the quick response!', time: '12 min ago', channel: 'Website', status: 'resolved' }
                    ].map((conversation, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                            {conversation.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{conversation.name}</p>
                            <p className="text-sm text-muted-foreground">{conversation.message}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline" className="text-xs">
                            {conversation.channel}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{conversation.time}</span>
                          <div className={`h-2 w-2 rounded-full ${
                            conversation.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ModernDashboard;
