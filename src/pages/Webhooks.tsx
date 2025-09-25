import React, { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Webhook, 
  Plus, 
  Copy, 
  Check, 
  Eye, 
  Trash2,
  Edit,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  RefreshCw,
  Zap
} from "lucide-react";

const Webhooks = () => {
  const [copied, setCopied] = useState<string | null>(null);
  
  const webhooks = [
    {
      id: "1",
      name: "Bot Messages",
      url: "https://your-domain.com/webhook/messages",
      events: ["message.received", "message.sent"],
      status: "active",
      lastTriggered: "2 minutes ago",
      successRate: 98.5,
      totalCalls: 1247
    },
    {
      id: "2",
      name: "User Events",
      url: "https://your-domain.com/webhook/users",
      events: ["user.created", "user.updated"],
      status: "active",
      lastTriggered: "1 hour ago",
      successRate: 100,
      totalCalls: 456
    },
    {
      id: "3",
      name: "Analytics",
      url: "https://your-domain.com/webhook/analytics",
      events: ["analytics.updated"],
      status: "inactive",
      lastTriggered: "3 days ago",
      successRate: 95.2,
      totalCalls: 89
    }
  ];

  const events = [
    { name: "message.received", description: "When a new message is received" },
    { name: "message.sent", description: "When a message is sent" },
    { name: "user.created", description: "When a new user is created" },
    { name: "user.updated", description: "When a user is updated" },
    { name: "bot.created", description: "When a new bot is created" },
    { name: "bot.updated", description: "When a bot is updated" },
    { name: "analytics.updated", description: "When analytics data is updated" },
    { name: "conversation.started", description: "When a conversation starts" },
    { name: "conversation.ended", description: "When a conversation ends" }
  ];

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCreateWebhook = () => {
    console.log("Creating new webhook...");
    // Here you would typically open a modal or form to create new webhook
  };

  const handleTestAll = () => {
    console.log("Testing all webhooks...");
    // Here you would typically test all webhooks
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
              <Webhook className="w-8 h-8 text-whatsapp" />
              Webhooks
            </h1>
            <p className="text-muted-foreground">Configure real-time event notifications</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleTestAll}>
              <RefreshCw className="mr-2 w-4 h-4" />
              Test All
            </Button>
            <Button className="bg-whatsapp hover:bg-whatsapp/90" onClick={handleCreateWebhook}>
              <Plus className="mr-2 w-4 h-4" />
              Create Webhook
            </Button>
          </div>
        </div>

        <Tabs defaultValue="webhooks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="w-5 h-5" />
                  Your Webhooks
                </CardTitle>
                <CardDescription>Manage your webhook endpoints and configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {webhooks.map((webhook) => (
                    <div key={webhook.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{webhook.name}</h4>
                          <Badge className={getStatusColor(webhook.status)}>
                            {webhook.status}
                          </Badge>
                          {getStatusIcon(webhook.status)}
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          <div className="font-mono">{webhook.url}</div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Last triggered: {webhook.lastTriggered}</span>
                          <span>•</span>
                          <span>Success rate: {webhook.successRate}%</span>
                          <span>•</span>
                          <span>{webhook.totalCalls} calls</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {webhook.events.map((event) => (
                            <Badge key={event} variant="secondary" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Zap className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Available Events
                </CardTitle>
                <CardDescription>Select events to trigger your webhooks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {events.map((event) => (
                    <div key={event.name} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-whatsapp rounded-full mt-2" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{event.name}</h4>
                        <p className="text-xs text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Calls</p>
                      <p className="text-2xl font-bold">1,792</p>
                      <p className="text-sm text-green-600">+8.2% this week</p>
                    </div>
                    <Activity className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold">97.8%</p>
                      <p className="text-sm text-green-600">+2.1% this week</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Failed Calls</p>
                      <p className="text-2xl font-bold">39</p>
                      <p className="text-sm text-red-600">-12.5% this week</p>
                    </div>
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Webhook Calls</CardTitle>
                <CardDescription>Monitor your webhook delivery status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { webhook: "Bot Messages", event: "message.received", status: "success", time: "2 minutes ago" },
                    { webhook: "User Events", event: "user.created", status: "success", time: "15 minutes ago" },
                    { webhook: "Analytics", event: "analytics.updated", status: "failed", time: "1 hour ago" },
                    { webhook: "Bot Messages", event: "message.sent", status: "success", time: "2 hours ago" },
                    { webhook: "User Events", event: "user.updated", status: "success", time: "3 hours ago" }
                  ].map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {log.status === "success" ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <div>
                          <div className="font-medium text-sm">{log.webhook}</div>
                          <div className="text-xs text-muted-foreground">{log.event}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={log.status === "success" ? "default" : "destructive"} className="text-xs">
                          {log.status}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">{log.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Webhook Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Retry Failed Calls</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Max Retries</span>
                      <Badge variant="outline">3</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Timeout</span>
                      <Badge variant="outline">30s</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Signature Verification</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Use HTTPS endpoints only",
                      "Verify webhook signatures",
                      "Set appropriate timeouts",
                      "Monitor for suspicious activity",
                      "Rotate webhook secrets regularly"
                    ].map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-whatsapp rounded-full mt-2" />
                        <span className="text-sm">{recommendation}</span>
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

export default Webhooks;
