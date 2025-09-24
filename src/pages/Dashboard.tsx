import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Phone, 
  Settings, 
  Play, 
  Pause, 
  MoreVertical,
  Crown,
  Lock,
  AlertTriangle,
  Zap,
  Megaphone,
  Target,
  Headphones,
  BarChart3
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSubscription } from "@/contexts/SubscriptionContext";

const Dashboard = () => {
  const { currentPlan, userSubscription, getUsagePercentage, isFeatureAvailable } = useSubscription();
  
  const [bots, setBots] = useState([
    {
      id: 1,
      name: "Omnichannel Support Bot",
      channels: ["WhatsApp", "Instagram", "Website"],
      status: "active",
      messages: 1247,
      users: 89,
      uptime: "99.9%",
      lastActive: "2 minutes ago"
    },
    {
      id: 2,
      name: "Multi-Platform Sales Assistant",
      channels: ["Messenger", "WhatsApp", "Website"],
      status: "paused",
      messages: 856,
      users: 67,
      uptime: "98.2%",
      lastActive: "1 hour ago"
    },
    {
      id: 3,
      name: "Cross-Channel Lead Qualifier",
      channels: ["WhatsApp", "Instagram"],
      status: "active",
      messages: 423,
      users: 34,
      uptime: "100%",
      lastActive: "5 minutes ago"
    }
  ]);

  const handleBotToggle = (botId: number) => {
    console.log(`Toggling bot ${botId}`);
    setBots(prevBots => 
      prevBots.map(bot => 
        bot.id === botId 
          ? { ...bot, status: bot.status === 'active' ? 'paused' : 'active' }
          : bot
      )
    );
  };

  const handleUpgrade = () => {
    console.log('Upgrading plan');
    // Navigate to pricing or billing page
  };

  const FeatureLockCard = ({ feature, icon: Icon, title, description, upgradeText }: {
    feature: string;
    icon: any;
    title: string;
    description: string;
    upgradeText: string;
  }) => (
    <Card className="relative opacity-60">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg" />
      <div className="absolute top-2 right-2">
        <Lock className="w-4 h-4 text-gray-400" />
      </div>
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-gray-400" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleUpgrade}
          className="w-full"
        >
          <Crown className="w-4 h-4 mr-2" />
          {upgradeText}
        </Button>
      </CardContent>
    </Card>
  );

  const UsageWarning = () => {
    const messageUsage = getUsagePercentage('messages');
    const botUsage = getUsagePercentage('bots');
    
    if (messageUsage > 80 || botUsage > 80) {
      return (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div className="flex-1">
                <h4 className="font-medium text-orange-900">Usage Warning</h4>
                <p className="text-sm text-orange-700">
                  You're approaching your plan limits. Consider upgrading to avoid service interruptions.
                </p>
              </div>
              <Button size="sm" onClick={handleUpgrade}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Upgrade
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  const handleBotSettings = (botId: number) => {
    console.log(`Opening settings for bot ${botId}`);
    // Navigate to bot settings page
    window.location.href = `/bots?edit=${botId}`;
  };

  const handleBotMore = (botId: number) => {
    console.log(`Opening more options for bot ${botId}`);
    // Navigate to bot details page
    window.location.href = `/bots?view=${botId}`;
  };

  const handleCreateBot = () => {
    console.log("Creating new bot...");
    // Navigate to bot builder page
    window.location.href = '/bot-builder';
  };


  const stats = [
    {
      title: "Total Messages",
      value: "12,847",
      change: "+12.5%",
      icon: MessageSquare,
      color: "text-blue-600"
    },
    {
      title: "Active Users",
      value: "2,394",
      change: "+8.2%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Bots",
      value: "8",
      change: "+2",
      icon: Bot,
      color: "text-purple-600"
    },
    {
      title: "Channels Connected",
      value: "4",
      change: "+1",
      icon: TrendingUp,
      color: "text-indigo-600"
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">Dashboard</h1>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {currentPlan?.name} Plan
                  </Badge>
                </div>
                <p className="text-muted-foreground">Manage your omnichannel AI agents</p>
              </div>
              <div className="flex gap-2">
                {currentPlan?.id === 'free' && (
                  <Button variant="outline" onClick={handleUpgrade}>
                    <Crown className="mr-2 w-4 h-4" />
                    Upgrade Plan
                  </Button>
                )}
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={handleCreateBot}
                >
                  <Bot className="mr-2 w-4 h-4" />
                  Create New Bot
                </Button>
              </div>
            </div>

            {/* Usage Warning */}
            <UsageWarning />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-blue-600">{stat.change}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Premium Features Grid */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Advanced Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isFeatureAvailable('broadcast') ? (
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-blue-600" />
                        Broadcast Messages
                      </CardTitle>
                      <CardDescription>Send bulk messages to your subscribers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" variant="outline">
                        Access Feature
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <FeatureLockCard
                    feature="broadcast"
                    icon={Megaphone}
                    title="Broadcast Messages"
                    description="Send bulk messages to your subscribers"
                    upgradeText="Upgrade to Pro"
                  />
                )}

                {isFeatureAvailable('triggers') ? (
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        Trigger System
                      </CardTitle>
                      <CardDescription>Automate responses with keyword triggers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" variant="outline">
                        Access Feature
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <FeatureLockCard
                    feature="triggers"
                    icon={Target}
                    title="Trigger System"
                    description="Automate responses with keyword triggers"
                    upgradeText="Upgrade to Pro"
                  />
                )}

                {isFeatureAvailable('live_agent') ? (
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Headphones className="w-5 h-5 text-blue-600" />
                        Live Agent Transfer
                      </CardTitle>
                      <CardDescription>Transfer complex queries to human agents</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" variant="outline">
                        Access Feature
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <FeatureLockCard
                    feature="live_agent"
                    icon={Headphones}
                    title="Live Agent Transfer"
                    description="Transfer complex queries to human agents"
                    upgradeText="Upgrade to Pro"
                  />
                )}

                {isFeatureAvailable('advanced_analytics') ? (
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        Advanced Analytics
                      </CardTitle>
                      <CardDescription>Detailed insights and reporting</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" variant="outline">
                        Access Feature
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <FeatureLockCard
                    feature="advanced_analytics"
                    icon={BarChart3}
                    title="Advanced Analytics"
                    description="Detailed insights and reporting"
                    upgradeText="Upgrade to Pro"
                  />
                )}
              </div>
            </div>

            {/* Bots Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Your AI Agents
                </CardTitle>
                <CardDescription>
                  Manage and monitor your omnichannel AI bots across all platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="conversations">Conversations</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    {bots.map((bot) => (
                      <Card key={bot.id} className="border-border/50">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <Bot className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{bot.name}</h3>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    {bot.channels.map((channel, index) => (
                                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {channel}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-6">
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Messages</p>
                                <p className="font-semibold">{bot.messages.toLocaleString()}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Users</p>
                                <p className="font-semibold">{bot.users}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Uptime</p>
                                <p className="font-semibold">{bot.uptime}</p>
                              </div>
                              
                              <Badge 
                                variant={bot.status === 'active' ? 'default' : 'secondary'}
                                className={bot.status === 'active' ? 'bg-blue-100 text-blue-800' : ''}
                              >
                                {bot.status}
                              </Badge>

                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={bot.status === 'active' ? 'text-orange-600' : 'text-blue-600'}
                                  onClick={() => handleBotToggle(bot.id)}
                                >
                                  {bot.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleBotSettings(bot.id)}
                                >
                                  <Settings className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleBotMore(bot.id)}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                              Last active: {bot.lastActive}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="analytics">
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-center py-12">
                          <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Omnichannel Analytics Dashboard</h3>
                          <p className="text-muted-foreground">
                            Track performance across all channels with detailed analytics and insights
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="conversations">
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-center py-12">
                          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Cross-Channel Conversation History</h3>
                          <p className="text-muted-foreground">
                            View and manage conversations across all channels in one unified interface
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="settings">
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-center py-12">
                          <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Omnichannel Bot Settings</h3>
                          <p className="text-muted-foreground">
                            Configure your bots' behavior and responses across all channels
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;