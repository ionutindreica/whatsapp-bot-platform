import React, { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  Plus, 
  Play, 
  Pause, 
  Edit, 
  Trash2,
  MessageSquare,
  Users,
  Activity,
  Settings,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";

const Bots = () => {
  const [selectedBot, setSelectedBot] = useState<string | null>(null);
  const [bots, setBots] = useState([
    {
      id: "1",
      name: "Customer Support Bot",
      description: "Handles customer inquiries and support tickets",
      status: "active",
      conversations: 1247,
      messages: 8943,
      lastActivity: "2 minutes ago",
      type: "Support",
      language: "English"
    },
    {
      id: "2",
      name: "Sales Assistant",
      description: "Helps with product information and sales",
      status: "active",
      conversations: 892,
      messages: 3456,
      lastActivity: "5 minutes ago",
      type: "Sales",
      language: "English"
    },
    {
      id: "3",
      name: "Lead Generator",
      description: "Collects leads and contact information",
      status: "inactive",
      conversations: 234,
      messages: 1234,
      lastActivity: "1 hour ago",
      type: "Lead Generation",
      language: "Spanish"
    }
  ]);

  const handleCreateBot = () => {
    console.log("Creating new bot...");
    // Navigate to bot builder page
    window.location.href = '/bot-builder';
  };

  const handleBotSettings = () => {
    console.log("Opening bot settings...");
    // Navigate to settings page
    window.location.href = '/settings/account';
  };

  const handleBotToggle = (botId: string) => {
    setBots(prevBots => 
      prevBots.map(bot => 
        bot.id === botId 
          ? { ...bot, status: bot.status === 'active' ? 'inactive' : 'active' }
          : bot
      )
    );
  };

  const handleBotEdit = (botId: string) => {
    console.log(`Editing bot ${botId}`);
    // Navigate to bot edit page
    window.location.href = `/bots?edit=${botId}`;
  };

  const handleBotDelete = (botId: string) => {
    if (confirm('Are you sure you want to delete this bot?')) {
      setBots(prevBots => prevBots.filter(bot => bot.id !== botId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-muted text-muted-foreground";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "inactive":
        return <XCircle className="w-4 h-4 text-gray-600" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back to Dashboard */}
        <BackToDashboard title="Back to Dashboard" />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bot className="w-8 h-8 text-whatsapp" />
              My Bots
            </h1>
            <p className="text-muted-foreground">Manage your AI bots and their configurations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBotSettings}>
              <Settings className="mr-2 w-4 h-4" />
              Settings
            </Button>
            <Button className="bg-whatsapp hover:bg-whatsapp/90" onClick={handleCreateBot}>
              <Plus className="mr-2 w-4 h-4" />
              Create Bot
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bots">Bots</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Bots</p>
                      <p className="text-2xl font-bold">{bots.length}</p>
                      <p className="text-sm text-green-600">+1 this month</p>
                    </div>
                    <Bot className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Bots</p>
                      <p className="text-2xl font-bold">{bots.filter(b => b.status === 'active').length}</p>
                      <p className="text-sm text-green-600">100% uptime</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Conversations</p>
                      <p className="text-2xl font-bold">{bots.reduce((sum, bot) => sum + bot.conversations, 0).toLocaleString()}</p>
                      <p className="text-sm text-green-600">+12.5% this week</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-whatsapp" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Messages Today</p>
                      <p className="text-2xl font-bold">{bots.reduce((sum, bot) => sum + bot.messages, 0).toLocaleString()}</p>
                      <p className="text-sm text-green-600">+8.5% vs yesterday</p>
                    </div>
                    <Activity className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Bot Status</CardTitle>
                <CardDescription>Overview of all your bots</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {bots.map((bot) => (
                    <div key={bot.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bot className="w-6 h-6 text-whatsapp" />
                        <div>
                          <h4 className="font-medium">{bot.name}</h4>
                          <p className="text-sm text-muted-foreground">{bot.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(bot.status)}
                        <Badge className={getStatusColor(bot.status)}>
                          {bot.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bots Tab */}
          <TabsContent value="bots" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {bots.map((bot) => (
                <Card key={bot.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bot className="w-6 h-6 text-whatsapp" />
                        <div>
                          <CardTitle className="text-lg">{bot.name}</CardTitle>
                          <CardDescription>{bot.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(bot.status)}
                        <Badge className={getStatusColor(bot.status)}>
                          {bot.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Conversations</p>
                        <p className="text-2xl font-bold">{bot.conversations.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Messages</p>
                        <p className="text-2xl font-bold">{bot.messages.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>Type: {bot.type}</span>
                      <span>Language: {bot.language}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Last activity: {bot.lastActivity}</span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleBotToggle(bot.id)}
                        >
                          {bot.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleBotEdit(bot.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleBotDelete(bot.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bot Performance</CardTitle>
                  <CardDescription>Compare performance across bots</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bots.map((bot) => (
                      <div key={bot.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Bot className="w-5 h-5 text-whatsapp" />
                          <span className="font-medium">{bot.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{bot.conversations} conversations</div>
                          <div className="text-xs text-muted-foreground">{bot.messages} messages</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage Analytics</CardTitle>
                  <CardDescription>Bot usage over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Analytics Chart</h3>
                    <p className="text-muted-foreground">
                      Connect to analytics service for detailed insights
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bot Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-start new bots</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Message encryption</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rate limiting</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">1000/hour</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Backup conversations</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Enable bot analytics",
                      "Set up custom responses",
                      "Configure AI training",
                      "Set up webhooks",
                      "Enable multi-language support"
                    ].map((setting, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-whatsapp rounded-full mt-2" />
                        <span className="text-sm">{setting}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Bots;
