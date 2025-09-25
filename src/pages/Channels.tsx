import React, { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  Globe, 
  Smartphone, 
  Mail, 
  Plus, 
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  Users,
  Clock,
  Zap
} from "lucide-react";

const Channels = () => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  
  const handleAddChannel = () => {
    console.log("Adding new channel...");
    // Here you would typically open a modal or navigate to channel setup
  };

  const handleChannelSettings = () => {
    console.log("Opening channel settings...");
    // Here you would typically open settings modal or navigate to settings
  };
  
  const channels = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: MessageCircle,
      status: "connected",
      description: "Connect your WhatsApp Business account",
      users: 1247,
      messages: 8943,
      lastActivity: "2 minutes ago",
      color: "text-green-600"
    },
    {
      id: "website",
      name: "Website Chat",
      icon: Globe,
      status: "active",
      description: "Embed chat widget on your website",
      users: 892,
      messages: 3456,
      lastActivity: "5 minutes ago",
      color: "text-blue-600"
    },
    {
      id: "mobile",
      name: "Mobile App",
      icon: Smartphone,
      status: "inactive",
      description: "Integrate with your mobile application",
      users: 0,
      messages: 0,
      lastActivity: "Never",
      color: "text-purple-600"
    },
    {
      id: "email",
      name: "Email",
      icon: Mail,
      status: "pending",
      description: "Send and receive emails as messages",
      users: 234,
      messages: 1234,
      lastActivity: "1 hour ago",
      color: "text-orange-600"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-muted text-muted-foreground";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "inactive":
        return <XCircle className="w-4 h-4 text-gray-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-blue-600" />;
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
              <MessageCircle className="w-8 h-8 text-whatsapp" />
              Communication Channels
            </h1>
            <p className="text-muted-foreground">Manage your communication channels and integrations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleChannelSettings}>
              <Settings className="mr-2 w-4 h-4" />
              Settings
            </Button>
            <Button className="bg-whatsapp hover:bg-whatsapp/90" onClick={handleAddChannel}>
              <Plus className="mr-2 w-4 h-4" />
              Add Channel
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
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
                      <p className="text-sm text-muted-foreground">Total Channels</p>
                      <p className="text-2xl font-bold">{channels.length}</p>
                      <p className="text-sm text-green-600">+1 this month</p>
                    </div>
                    <MessageCircle className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold">2,373</p>
                      <p className="text-sm text-green-600">+15.2% this week</p>
                    </div>
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Messages Today</p>
                      <p className="text-2xl font-bold">1,247</p>
                      <p className="text-sm text-green-600">+8.5% vs yesterday</p>
                    </div>
                    <Activity className="w-8 h-8 text-whatsapp" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Response Time</p>
                      <p className="text-2xl font-bold">2.3s</p>
                      <p className="text-sm text-green-600">-0.5s improvement</p>
                    </div>
                    <Zap className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Channel Status</CardTitle>
                <CardDescription>Overview of all your communication channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {channels.map((channel) => (
                    <div key={channel.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <channel.icon className={`w-6 h-6 ${channel.color}`} />
                        <div>
                          <h4 className="font-medium">{channel.name}</h4>
                          <p className="text-sm text-muted-foreground">{channel.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(channel.status)}
                        <Badge className={getStatusColor(channel.status)}>
                          {channel.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Channels Tab */}
          <TabsContent value="channels" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {channels.map((channel) => (
                <Card key={channel.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <channel.icon className={`w-6 h-6 ${channel.color}`} />
                        <div>
                          <CardTitle className="text-lg">{channel.name}</CardTitle>
                          <CardDescription>{channel.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(channel.status)}
                        <Badge className={getStatusColor(channel.status)}>
                          {channel.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Users</p>
                        <p className="text-2xl font-bold">{channel.users.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Messages</p>
                        <p className="text-2xl font-bold">{channel.messages.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Last activity: {channel.lastActivity}</span>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
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
                  <CardTitle>Channel Performance</CardTitle>
                  <CardDescription>Compare performance across channels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {channels.map((channel) => (
                      <div key={channel.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <channel.icon className={`w-5 h-5 ${channel.color}`} />
                          <span className="font-medium">{channel.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{channel.messages} messages</div>
                          <div className="text-xs text-muted-foreground">{channel.users} users</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Message Volume</CardTitle>
                  <CardDescription>Daily message volume by channel</CardDescription>
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
                  <CardTitle>Channel Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-connect new channels</span>
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
                      <span className="text-sm">Backup messages</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Integration Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Enable webhook notifications",
                      "Sync user data across channels",
                      "Enable cross-channel messaging",
                      "Set up message templates",
                      "Configure auto-responses"
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

export default Channels;
