import React, { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  Bot,
  Globe,
  Smartphone,
  Mail,
  Phone
} from "lucide-react";

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  
  const handleExportData = () => {
    console.log("Exporting analytics data...");
    // Create and download CSV file
    const csvData = "Date,Metric,Value\n2024-01-01,Conversations,100\n2024-01-02,Conversations,150";
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleGenerateReport = () => {
    console.log("Generating analytics report...");
    // Generate and download PDF report
    const reportData = `
      Analytics Report
      Generated: ${new Date().toLocaleDateString()}
      
      Total Conversations: 2,847
      Active Users: 1,234
      Response Time: 2.3s
      Success Rate: 94.2%
    `;
    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics-report.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  const metrics = [
    {
      title: "Total Conversations",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: MessageSquare,
      color: "text-blue-600"
    },
    {
      title: "Active Users",
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Messages Sent",
      value: "15,678",
      change: "+15.3%",
      trend: "up",
      icon: MessageSquare,
      color: "text-whatsapp"
    },
    {
      title: "Response Time",
      value: "2.3s",
      change: "-0.5s",
      trend: "down",
      icon: Clock,
      color: "text-purple-600"
    }
  ];

  const channelStats = [
    {
      channel: "WhatsApp",
      icon: Phone,
      conversations: 1247,
      messages: 8943,
      users: 892,
      satisfaction: 98.5,
      color: "text-green-600"
    },
    {
      channel: "Website Chat",
      icon: Globe,
      conversations: 892,
      messages: 3456,
      users: 456,
      satisfaction: 95.2,
      color: "text-blue-600"
    },
    {
      channel: "Email",
      icon: Mail,
      conversations: 456,
      messages: 1234,
      users: 234,
      satisfaction: 92.8,
      color: "text-orange-600"
    },
    {
      channel: "Mobile App",
      icon: Smartphone,
      conversations: 234,
      messages: 567,
      users: 123,
      satisfaction: 89.1,
      color: "text-purple-600"
    }
  ];

  const botPerformance = [
    {
      bot: "Customer Support Bot",
      conversations: 1247,
      satisfaction: 98.5,
      responseTime: "1.2s",
      uptime: "99.9%",
      status: "excellent"
    },
    {
      bot: "Sales Assistant",
      conversations: 892,
      satisfaction: 95.2,
      responseTime: "2.1s",
      uptime: "99.7%",
      status: "good"
    },
    {
      bot: "Lead Generator",
      conversations: 456,
      satisfaction: 92.8,
      responseTime: "3.4s",
      uptime: "98.9%",
      status: "good"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "fair":
        return "bg-blue-100 text-blue-800";
      case "poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-muted text-muted-foreground";
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
              <BarChart3 className="w-8 h-8 text-whatsapp" />
              Analytics
            </h1>
            <p className="text-muted-foreground">Monitor your bot performance and user engagement</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportData}>
              <Activity className="mr-2 w-4 h-4" />
              Export Data
            </Button>
            <Button className="bg-whatsapp hover:bg-whatsapp/90" onClick={handleGenerateReport}>
              <BarChart3 className="mr-2 w-4 h-4" />
              Generate Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="bots">Bots</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{metric.title}</p>
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {metric.trend === "up" ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                          <span className={`text-sm ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                            {metric.change}
                          </span>
                        </div>
                      </div>
                      <metric.icon className={`w-8 h-8 ${metric.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Channel Performance</CardTitle>
                  <CardDescription>Compare performance across channels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {channelStats.map((channel, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <channel.icon className={`w-5 h-5 ${channel.color}`} />
                          <span className="font-medium">{channel.channel}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{channel.conversations} conversations</div>
                          <div className="text-xs text-muted-foreground">{channel.messages} messages</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bot Performance</CardTitle>
                  <CardDescription>Performance metrics for each bot</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {botPerformance.map((bot, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Bot className="w-5 h-5 text-whatsapp" />
                          <span className="font-medium">{bot.bot}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{bot.satisfaction}% satisfaction</div>
                          <div className="text-xs text-muted-foreground">{bot.responseTime} avg response</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Channels Tab */}
          <TabsContent value="channels" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {channelStats.map((channel, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <channel.icon className={`w-5 h-5 ${channel.color}`} />
                      {channel.channel}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Conversations</p>
                        <p className="text-2xl font-bold">{channel.conversations.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Messages</p>
                        <p className="text-2xl font-bold">{channel.messages.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Users</p>
                        <p className="text-lg font-semibold">{channel.users.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Satisfaction</p>
                        <p className="text-lg font-semibold">{channel.satisfaction}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Bots Tab */}
          <TabsContent value="bots" className="space-y-6">
            <div className="space-y-4">
              {botPerformance.map((bot, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Bot className="w-8 h-8 text-whatsapp" />
                        <div>
                          <h4 className="font-medium text-lg">{bot.bot}</h4>
                          <p className="text-sm text-muted-foreground">{bot.conversations} conversations</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Satisfaction</p>
                          <p className="text-lg font-semibold">{bot.satisfaction}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Response Time</p>
                          <p className="text-lg font-semibold">{bot.responseTime}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Uptime</p>
                          <p className="text-lg font-semibold">{bot.uptime}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(bot.status)}>
                        {bot.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Chart</CardTitle>
                  <CardDescription>Visual representation of your data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Analytics Chart</h3>
                    <p className="text-muted-foreground">
                      Connect to analytics service for detailed insights
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export Options</CardTitle>
                  <CardDescription>Download your analytics data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Export to CSV",
                      "Export to PDF",
                      "Export to Excel",
                      "Schedule reports",
                      "Custom date ranges"
                    ].map((option, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-whatsapp rounded-full mt-2" />
                        <span className="text-sm">{option}</span>
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

export default Analytics;
