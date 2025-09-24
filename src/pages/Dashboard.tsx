import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, MessageSquare, Users, TrendingUp, Phone, Settings, Play, Pause, MoreVertical } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const Dashboard = () => {
  const [bots, setBots] = useState([
    {
      id: 1,
      name: "Customer Support Bot",
      phone: "+1 (555) 123-4567",
      status: "active",
      messages: 1247,
      users: 89,
      uptime: "99.9%",
      lastActive: "2 minutes ago"
    },
    {
      id: 2,
      name: "Sales Assistant",
      phone: "+1 (555) 765-4321",
      status: "paused",
      messages: 856,
      users: 67,
      uptime: "98.2%",
      lastActive: "1 hour ago"
    },
    {
      id: 3,
      name: "Lead Qualifier",
      phone: "+1 (555) 987-6543",
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
      color: "text-green-600"
    },
    {
      title: "Active Bots",
      value: "8",
      change: "+2",
      icon: Bot,
      color: "text-whatsapp"
    },
    {
      title: "Conversion Rate",
      value: "23.4%",
      change: "+3.1%",
      icon: TrendingUp,
      color: "text-purple-600"
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
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Manage your WhatsApp AI agents</p>
              </div>
              <Button 
                className="bg-whatsapp hover:bg-whatsapp/90"
                onClick={handleCreateBot}
              >
                <Bot className="mr-2 w-4 h-4" />
                Create New Bot
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-green-600">{stat.change}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bots Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Your AI Agents
                </CardTitle>
                <CardDescription>
                  Manage and monitor your WhatsApp AI bots
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
                              <div className="w-12 h-12 bg-gradient-whatsapp rounded-lg flex items-center justify-center">
                                <Bot className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{bot.name}</h3>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <Phone className="w-4 h-4" />
                                  <span>{bot.phone}</span>
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
                                className={bot.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                              >
                                {bot.status}
                              </Badge>

                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={bot.status === 'active' ? 'text-orange-600' : 'text-green-600'}
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
                          <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                          <p className="text-muted-foreground">
                            Connect to Supabase to unlock detailed analytics and insights
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
                          <h3 className="text-lg font-semibold mb-2">Conversation History</h3>
                          <p className="text-muted-foreground">
                            View and manage all bot conversations here
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
                          <h3 className="text-lg font-semibold mb-2">Bot Settings</h3>
                          <p className="text-muted-foreground">
                            Configure your bots' behavior and responses
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