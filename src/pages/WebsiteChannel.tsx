import React, { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  Monitor, 
  Settings, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  MessageSquare,
  Clock,
  Activity,
  Zap,
  Shield,
  Code,
  Palette
} from "lucide-react";

const WebsiteChannel = () => {
  const [isActive, setIsActive] = useState(true);
  
  const stats = [
    {
      title: "Website Visitors",
      value: "8,942",
      change: "+12.3%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Chat Sessions",
      value: "2,156",
      change: "+8.7%",
      icon: MessageSquare,
      color: "text-green-600"
    },
    {
      title: "Response Time",
      value: "1.8s",
      change: "-0.4s",
      icon: Clock,
      color: "text-purple-600"
    },
    {
      title: "Conversion Rate",
      value: "15.2%",
      change: "+3.1%",
      icon: Zap,
      color: "text-whatsapp"
    }
  ];

  const widgets = [
    {
      id: "1",
      name: "Main Chat Widget",
      status: "active",
      visitors: 1247,
      sessions: 892,
      lastActivity: "2 minutes ago",
      position: "bottom-right"
    },
    {
      id: "2",
      name: "Support Widget",
      status: "active",
      visitors: 456,
      sessions: 234,
      lastActivity: "15 minutes ago",
      position: "bottom-left"
    },
    {
      id: "3",
      name: "Sales Widget",
      status: "inactive",
      visitors: 0,
      sessions: 0,
      lastActivity: "Never",
      position: "top-right"
    }
  ];

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
              <Globe className="w-8 h-8 text-whatsapp" />
              Website Chat Channel
            </h1>
            <p className="text-muted-foreground">Manage your website chat widgets and integrations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="mr-2 w-4 h-4" />
              Settings
            </Button>
            <Button className="bg-whatsapp hover:bg-whatsapp/90">
              <Code className="mr-2 w-4 h-4" />
              Embed Code
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
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

            <Card>
              <CardHeader>
                <CardTitle>Channel Status</CardTitle>
                <CardDescription>Current status of your website chat integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-whatsapp" />
                    <div>
                      <h4 className="font-medium">Website Chat</h4>
                      <p className="text-sm text-muted-foreground">Embedded on 3 websites</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <Badge className={isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Widgets Tab */}
          <TabsContent value="widgets" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {widgets.map((widget) => (
                <Card key={widget.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Monitor className="w-6 h-6 text-whatsapp" />
                        <div>
                          <CardTitle className="text-lg">{widget.name}</CardTitle>
                          <CardDescription>Position: {widget.position}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(widget.status)}
                        <Badge className={getStatusColor(widget.status)}>
                          {widget.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Visitors</p>
                        <p className="text-2xl font-bold">{widget.visitors.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Sessions</p>
                        <p className="text-2xl font-bold">{widget.sessions.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Last activity: {widget.lastActivity}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Palette className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4" />
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
                  <CardTitle>Website Analytics</CardTitle>
                  <CardDescription>Track your website chat performance</CardDescription>
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

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Widget Load Time</span>
                      <span className="font-semibold">1.2s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Engagement Rate</span>
                      <span className="font-semibold">24.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Conversion Rate</span>
                      <span className="font-semibold">15.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Bounce Rate</span>
                      <span className="font-semibold">8.7%</span>
                    </div>
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
                  <CardTitle>Widget Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-show widget</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mobile responsive</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sound notifications</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Typing indicators</span>
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
                      "Customize widget appearance",
                      "Set up auto-responses",
                      "Configure chat triggers",
                      "Enable file sharing",
                      "Set up chat routing"
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

export default WebsiteChannel;
