import React, { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  Phone, 
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
  Key
} from "lucide-react";

const WhatsAppChannel = () => {
  const [isConnected, setIsConnected] = useState(false);
  
  const connectionSteps = [
    {
      step: 1,
      title: "Connect WhatsApp Business Account",
      description: "Link your WhatsApp Business account to start receiving messages",
      status: "completed",
      icon: Phone
    },
    {
      step: 2,
      title: "Verify Phone Number",
      description: "Verify your business phone number with WhatsApp",
      status: "completed",
      icon: CheckCircle
    },
    {
      step: 3,
      title: "Configure Webhook",
      description: "Set up webhook URL for receiving messages",
      status: "pending",
      icon: Settings
    },
    {
      step: 4,
      title: "Test Connection",
      description: "Send a test message to verify everything works",
      status: "pending",
      icon: Zap
    }
  ];

  const stats = [
    {
      title: "Total Messages",
      value: "12,847",
      change: "+15.2%",
      icon: MessageSquare,
      color: "text-blue-600"
    },
    {
      title: "Active Users",
      value: "2,341",
      change: "+8.5%",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Response Time",
      value: "1.2s",
      change: "-0.3s",
      icon: Clock,
      color: "text-purple-600"
    },
    {
      title: "Success Rate",
      value: "98.7%",
      change: "+2.1%",
      icon: CheckCircle,
      color: "text-whatsapp"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
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
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
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
              WhatsApp Channel
            </h1>
            <p className="text-muted-foreground">Manage your WhatsApp Business integration</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="mr-2 w-4 h-4" />
              Settings
            </Button>
            <Button className="bg-whatsapp hover:bg-whatsapp/90">
              <Phone className="mr-2 w-4 h-4" />
              {isConnected ? "Disconnect" : "Connect"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="setup">Setup</TabsTrigger>
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
                <CardTitle>Connection Status</CardTitle>
                <CardDescription>Current status of your WhatsApp integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-6 h-6 text-whatsapp" />
                    <div>
                      <h4 className="font-medium">WhatsApp Business</h4>
                      <p className="text-sm text-muted-foreground">Connected to +1 234 567 8900</p>
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

          {/* Setup Tab */}
          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Setup Steps</CardTitle>
                <CardDescription>Follow these steps to connect your WhatsApp Business account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {connectionSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-whatsapp/10 rounded-full flex items-center justify-center">
                          <step.icon className="w-4 h-4 text-whatsapp" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(step.status)}
                        <Badge className={getStatusColor(step.status)}>
                          {step.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Message Analytics</CardTitle>
                  <CardDescription>Track your WhatsApp message performance</CardDescription>
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
                      <span className="text-sm">Message Delivery Rate</span>
                      <span className="font-semibold">98.7%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Response Time</span>
                      <span className="font-semibold">1.2s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User Satisfaction</span>
                      <span className="font-semibold">94.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Uptime</span>
                      <span className="font-semibold">99.9%</span>
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
                  <CardTitle>WhatsApp Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-reply messages</span>
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
                      <span className="text-sm">Webhook verification</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Enable message encryption",
                      "Set up webhook verification",
                      "Configure rate limiting",
                      "Enable message logging",
                      "Set up backup procedures"
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

export default WhatsAppChannel;
