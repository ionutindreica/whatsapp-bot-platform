import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  DollarSign, 
  Activity, 
  Shield, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Database,
  Settings,
  BarChart3,
  UserCheck,
  UserX,
  CreditCard,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalBots: 0,
    totalMessages: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Mock data - replace with real API calls
      setStats({
        totalUsers: 1250,
        activeUsers: 890,
        totalRevenue: 45600,
        monthlyRevenue: 8900,
        totalBots: 3400,
        totalMessages: 125000
      });

      setUsers([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'USER',
          status: 'ACTIVE',
          plan: 'Pro',
          createdAt: '2024-01-15',
          lastLogin: '2024-01-20',
          bots: 3,
          messages: 1250
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'ADMIN',
          status: 'ACTIVE',
          plan: 'Enterprise',
          createdAt: '2024-01-10',
          lastLogin: '2024-01-19',
          bots: 8,
          messages: 5600
        },
        {
          id: '3',
          name: 'Bob Johnson',
          email: 'bob@example.com',
          role: 'USER',
          status: 'SUSPENDED',
          plan: 'Free',
          createdAt: '2024-01-05',
          lastLogin: '2024-01-18',
          bots: 1,
          messages: 45
        }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      console.log(`Performing ${action} on user ${userId}`);
      
      // Update local state for demo
      if (action === 'suspend') {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, status: 'SUSPENDED' } : user
        ));
        alert(`User ${userId} has been suspended`);
      } else if (action === 'activate') {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, status: 'ACTIVE' } : user
        ));
        alert(`User ${userId} has been activated`);
      } else if (action === 'edit') {
        const user = users.find(u => u.id === userId);
        const newName = prompt('Enter new name:', user?.name || '');
        if (newName) {
          setUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, name: newName } : user
          ));
          alert(`User ${userId} has been updated`);
        }
      } else if (action === 'delete') {
        if (confirm(`Are you sure you want to delete user ${userId}?`)) {
          setUsers(prev => prev.filter(user => user.id !== userId));
          alert(`User ${userId} has been deleted`);
        }
      }
    } catch (error) {
      console.error('Error performing user action:', error);
      alert('Error performing action');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'SUSPENDED': return 'bg-red-100 text-red-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-800';
      case 'ADMIN': return 'bg-blue-100 text-blue-800';
      case 'USER': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SuperAdmin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SuperAdmin Dashboard</h1>
              <p className="text-gray-600 mt-2">Complete system oversight and user management</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-red-100 text-red-800">
                <Shield className="w-4 h-4 mr-1" />
                SuperAdmin Access
              </Badge>
              <Button 
                variant="outline"
                onClick={() => alert('Opening System Settings...')}
                className="hover:bg-blue-50 hover:border-blue-300"
              >
                <Settings className="w-4 h-4 mr-2" />
                System Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.activeUsers} active users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +${stats.monthlyRevenue} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bots</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBots.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across all users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                All time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {/* User Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage all users, their accounts, and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => alert('Filter options:\n- By Role: USER, ADMIN, SUPER_ADMIN\n- By Status: ACTIVE, INACTIVE, SUSPENDED\n- By Plan: Free, Pro, Enterprise')}
                    className="hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>

                {/* Users Table */}
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <Card key={user.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getRoleColor(user.role)}>
                                {user.role}
                              </Badge>
                              <Badge className={getStatusColor(user.status)}>
                                {user.status}
                              </Badge>
                              <Badge variant="outline">
                                {user.plan}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {user.bots} bots • {user.messages} messages
                          </p>
                          <p className="text-xs text-gray-500">
                            Last login: {user.lastLogin}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedUser(user)}
                            className="hover:bg-blue-50 hover:border-blue-300"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'edit')}
                            className="hover:bg-green-50 hover:border-green-300"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {user.status === 'ACTIVE' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserAction(user.id, 'suspend')}
                              className="hover:bg-red-50 hover:border-red-300"
                              title="Suspend User"
                            >
                              <Ban className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserAction(user.id, 'activate')}
                              className="hover:bg-green-50 hover:border-green-300"
                              title="Activate User"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'delete')}
                            className="hover:bg-red-50 hover:border-red-300"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Analytics</CardTitle>
                <CardDescription>
                  Detailed analytics and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">User Growth</h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Chart placeholder</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Revenue Trends</h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Chart placeholder</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>
                  Configure system-wide settings and parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Email Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">SMTP Host</label>
                        <Input placeholder="smtp.sendgrid.net" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">SMTP Port</label>
                        <Input placeholder="587" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Payment Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Stripe Secret Key</label>
                        <Input placeholder="sk_test_..." type="password" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Stripe Publishable Key</label>
                        <Input placeholder="pk_test_..." />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">System Limits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">Max Users</label>
                        <Input placeholder="10000" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Max Bots per User</label>
                        <Input placeholder="50" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Max Messages per Day</label>
                        <Input placeholder="1000000" />
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => alert('System settings saved successfully!')}
                  >
                    Save System Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
                <CardDescription>
                  Monitor all system activities and admin actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: '1',
                      admin: 'SuperAdmin',
                      action: 'USER_SUSPENDED',
                      target: 'john@example.com',
                      timestamp: '2024-01-20 14:30:25',
                      ip: '192.168.1.100'
                    },
                    {
                      id: '2',
                      admin: 'SuperAdmin',
                      action: 'SUBSCRIPTION_CHANGED',
                      target: 'jane@example.com',
                      timestamp: '2024-01-20 13:15:42',
                      ip: '192.168.1.100'
                    },
                    {
                      id: '3',
                      admin: 'SuperAdmin',
                      action: 'SYSTEM_CONFIGURED',
                      target: 'Email Settings',
                      timestamp: '2024-01-20 12:00:15',
                      ip: '192.168.1.100'
                    }
                  ].map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Shield className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{log.admin} {log.action.replace('_', ' ').toLowerCase()}</p>
                          <p className="text-sm text-gray-600">Target: {log.target}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{log.timestamp}</p>
                        <p className="text-xs text-gray-500">IP: {log.ip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
