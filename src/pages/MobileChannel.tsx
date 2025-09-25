import React, { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Smartphone, 
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
  Download,
  Upload
} from "lucide-react";

const MobileChannel = () => {
  const [isConnected, setIsConnected] = useState(false);
  
  const stats = [
    {
      title: "App Users",
      value: "3,456",
      change: "+18.2%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Push Notifications",
      value: "12,847",
      change: "+22.1%",
      icon: MessageSquare,
      color: "text-green-600"
    },
    {
      title: "Response Time",
      value: "0.8s",
      change: "-0.2s",
      icon: Clock,
      color: "text-purple-600"
    },
    {
      title: "Engagement Rate",
      value: "67.3%",
      change: "+5.4%",
      icon: Zap,
      color: "text-whatsapp"
    }
  ];

  const apps = [
    {
      id: "1",
      name: "iOS App",
      platform: "iOS",
      status: "connected",
      users: 1847,
      sessions: 3456,
      lastActivity: "5 minutes ago",
      version: "2.1.0"
    },
    {
      id: "2",
      name: "Android App",
      platform: "Android",
      status: "connected",
      users: 1609,
      sessions: 2891,
      lastActivity: "2 minutes ago",
      version: "2.1.0"
    },
    {
      id: "3",
      name: "React Native App",
      platform: "Cross-platform",
      status: "inactive",
      users: 0,
      sessions: 0,
      lastActivity: "Never",
      version: "1.0.0"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
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
      case "connected":
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
              <Smartphone className="w-8 h-8 text-whatsapp" />
              Mobile App Channel
            </h1>
            <p className="text-muted-foreground">Manage your mobile app integrations and push notifications</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="mr-2 w-4 h-4" />
              Settings
            </Button>
            <Button className="bg-whatsapp hover:bg-whatsapp/90">
              <Code className="mr-2 w-4 h-4" />
              SDK Integration
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="apps">Apps</TabsTrigger>
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
                <CardDescription>Current status of your mobile app integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-6 h-6 text-whatsapp" />
                    <div>
                      <h4 className="font-medium">Mobile Apps</h4>
                      <p className="text-sm text-muted-foreground">2 apps connected, 1 inactive</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isConnected ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <Badge className={isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {isConnected ? "Connected" : "Disconnected"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Apps Tab */}
          <TabsContent value="apps" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {apps.map((app) => (
                <Card key={app.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-6 h-6 text-whatsapp" />
                        <div>
                          <CardTitle className="text-lg">{app.name}</CardTitle>
                          <CardDescription>{app.platform} • v{app.version}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(app.status)}
                        <Badge className={getStatusColor(app.status)}>
                          {app.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Users</p>
                        <p className="text-2xl font-bold">{app.users.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Sessions</p>
                        <p className="text-2xl font-bold">{app.sessions.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Last activity: {app.lastActivity}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
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
                  <CardTitle>Mobile Analytics</CardTitle>
                  <CardDescription>Track your mobile app performance</CardDescription>
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
                      <span className="text-sm">App Load Time</span>
                      <span className="font-semibold">1.8s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Push Delivery Rate</span>
                      <span className="font-semibold">98.7%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User Retention</span>
                      <span className="font-semibold">67.3%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Crash Rate</span>
                      <span className="font-semibold">0.2%</span>
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
                  <CardTitle>App Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Push notifications</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Background sync</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Offline support</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-updates</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SDK Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "iOS SDK v2.1.0",
                      "Android SDK v2.1.0",
                      "React Native SDK v1.0.0",
                      "Flutter SDK v1.0.0",
                      "Xamarin SDK v1.0.0"
                    ].map((sdk, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-whatsapp rounded-full mt-2" />
                        <span className="text-sm">{sdk}</span>
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

export default MobileChannel;
