import { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Bot, 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Server,
  Database,
  Globe,
  MessageSquare,
  BarChart3,
  UserPlus,
  UserMinus,
  Crown,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw
} from "lucide-react";

const SuperAdmin = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Mock data for demonstration
  const platformStats = {
    totalUsers: 2847,
    activeUsers: 1923,
    totalBots: 12456,
    totalConversations: 2847392,
    totalRevenue: 89456,
    monthlyGrowth: 23.4,
    systemUptime: 99.9
  };

  const users = [
    {
      id: 1,
      name: "John Smith",
      email: "john@company.com",
      plan: "Professional",
      status: "active",
      bots: 12,
      conversations: 2847,
      revenue: 299,
      lastActive: "2 hours ago",
      joinDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@startup.io",
      plan: "Enterprise",
      status: "active",
      bots: 45,
      conversations: 12847,
      revenue: 1299,
      lastActive: "1 hour ago",
      joinDate: "2024-02-20"
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike@tech.com",
      plan: "Starter",
      status: "suspended",
      bots: 3,
      conversations: 456,
      revenue: 29,
      lastActive: "1 day ago",
      joinDate: "2024-03-10"
    }
  ];

  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      message: "High CPU usage on server-2",
      timestamp: "5 minutes ago",
      severity: "medium"
    },
    {
      id: 2,
      type: "error",
      message: "Database connection timeout",
      timestamp: "15 minutes ago",
      severity: "high"
    },
    {
      id: 3,
      type: "info",
      message: "Scheduled maintenance in 2 hours",
      timestamp: "1 hour ago",
      severity: "low"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back to Dashboard */}
        <BackToDashboard title="Back to Dashboard" />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Crown className="w-8 h-8 text-blue-500" />
              Super Admin Panel
            </h1>
            <p className="text-muted-foreground">Manage the entire platform and all users</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 w-4 h-4" />
              Export Data
            </Button>
            <Button variant="outline">
              <RefreshCw className="mr-2 w-4 h-4" />
              Refresh
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              <Shield className="mr-2 w-4 h-4" />
              Emergency Mode
            </Button>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{platformStats.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+{platformStats.monthlyGrowth}% this month</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Bots</p>
                  <p className="text-2xl font-bold">{platformStats.totalBots.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+15.2% this month</p>
                </div>
                <Bot className="w-8 h-8 text-whatsapp" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">${platformStats.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+28.7% this month</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">System Uptime</p>
                  <p className="text-2xl font-bold">{platformStats.systemUptime}%</p>
                  <p className="text-sm text-green-600">Last 30 days</p>
                </div>
                <Activity className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </CardTitle>
                <CardDescription>Manage all platform users and their accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search and Filters */}
                  <div className="flex gap-4">
                    <Input placeholder="Search users..." className="flex-1" />
                    <Button variant="outline">Filter</Button>
                    <Button variant="outline">Export</Button>
                  </div>

                  {/* Users Table */}
                  <div className="border rounded-lg">
                    <div className="grid grid-cols-8 gap-4 p-4 bg-muted/50 font-medium text-sm">
                      <div>User</div>
                      <div>Plan</div>
                      <div>Status</div>
                      <div>Bots</div>
                      <div>Conversations</div>
                      <div>Revenue</div>
                      <div>Last Active</div>
                      <div>Actions</div>
                    </div>
                    
                    {users.map((user) => (
                      <div key={user.id} className="grid grid-cols-8 gap-4 p-4 border-t hover:bg-muted/25">
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                        <div>
                          <Badge variant={user.plan === 'Enterprise' ? 'default' : 'secondary'}>
                            {user.plan}
                          </Badge>
                        </div>
                        <div>
                          <Badge 
                            variant={user.status === 'active' ? 'default' : 'destructive'}
                            className={user.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {user.status}
                          </Badge>
                        </div>
                        <div className="text-sm">{user.bots}</div>
                        <div className="text-sm">{user.conversations.toLocaleString()}</div>
                        <div className="text-sm font-medium">${user.revenue}</div>
                        <div className="text-sm text-muted-foreground">{user.lastActive}</div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <UserMinus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    User Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Growth Analytics</h3>
                    <p className="text-muted-foreground">
                      Connect to analytics service for detailed insights
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Conversation Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Message Analytics</h3>
                    <p className="text-muted-foreground">
                      Track conversation patterns and bot performance
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Monitoring */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Server</span>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database</span>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">AI Service</span>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">CDN</span>
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systemAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          alert.severity === 'high' ? 'bg-red-500' : 
                          alert.severity === 'medium' ? 'bg-blue-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                        </div>
                        <Button size="sm" variant="ghost">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Database Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Backup Status</h4>
                    <p className="text-sm text-muted-foreground mb-2">Last backup: 2 hours ago</p>
                    <Button size="sm" variant="outline">Create Backup</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Database Size</h4>
                    <p className="text-sm text-muted-foreground mb-2">2.4 GB / 10 GB used</p>
                    <Button size="sm" variant="outline">Optimize</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Performance</h4>
                    <p className="text-sm text-muted-foreground mb-2">Avg response: 45ms</p>
                    <Button size="sm" variant="outline">Monitor</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Management */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Recurring Revenue</p>
                      <p className="text-2xl font-bold">$89,456</p>
                      <p className="text-sm text-green-600">+28.7% from last month</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Average Revenue Per User</p>
                      <p className="text-2xl font-bold">$31.45</p>
                      <p className="text-sm text-green-600">+12.3% from last month</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Churn Rate</p>
                      <p className="text-2xl font-bold">2.4%</p>
                      <p className="text-sm text-green-600">-0.8% from last month</p>
                    </div>
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Track revenue growth and user spending patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Revenue Dashboard</h3>
                  <p className="text-muted-foreground">
                    Connect to analytics service for detailed revenue insights
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SSL Certificates</span>
                      <Badge className="bg-green-100 text-green-800">Valid</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Firewall</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">DDoS Protection</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data Encryption</span>
                      <Badge className="bg-green-100 text-green-800">AES-256</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Security Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">All Systems Secure</h3>
                    <p className="text-muted-foreground">
                      No security threats detected
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Platform Settings
                </CardTitle>
                <CardDescription>Configure global platform settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Platform Configuration</h3>
                  <p className="text-muted-foreground">
                    Configure global settings, feature flags, and system parameters
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SuperAdmin;
