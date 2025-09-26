import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/services/api';
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
  Calendar,
  FileText,
  Monitor,
  Lock,
  Download,
  AlertCircle,
  Globe,
  Archive
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const { user } = useAuth();
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
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setError('');
      
      // Check if user is super admin or root owner
      if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ROOT_OWNER')) {
        setError('Access denied. Super admin privileges required.');
        setLoading(false);
        return;
      }

      // Load dashboard stats from API
      const statsResponse = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!statsResponse.ok) {
        throw new Error('Failed to load dashboard stats');
      }

      const statsData = await statsResponse.json();
      setStats(statsData.stats);

      // Load users from API
      const usersResponse = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!usersResponse.ok) {
        throw new Error('Failed to load users');
      }

      const usersData = await usersResponse.json();
      setUsers(usersData.users);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
      
      // Fallback to demo data if API fails
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        totalBots: 0,
        totalMessages: 0
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Authentication required');
        return;
      }

      let response;
      
      if (action === 'suspend') {
        response = await fetch(`http://localhost:5000/api/admin/users/${userId}/suspend`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reason: 'Suspended by SuperAdmin' })
        });
      } else if (action === 'activate') {
        response = await fetch(`http://localhost:5000/api/admin/users/${userId}/activate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else if (action === 'edit') {
        const user = users.find(u => u.id === userId);
        const newName = prompt('Enter new name:', user?.name || '');
        if (newName) {
          response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newName })
          });
        }
      } else if (action === 'delete') {
        if (confirm(`Are you sure you want to delete user ${userId}?`)) {
          response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        }
      }

      if (response && !response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Action failed');
      }

      // Reload data after successful action
      await loadDashboardData();
      alert(`User ${userId} ${action} action completed successfully`);

    } catch (error) {
      console.error('Error performing user action:', error);
      alert(`Error performing action: ${error.message}`);
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
      case 'INACTIVE': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-800';
      case 'ADMIN': return 'bg-blue-100 text-blue-800';
      case 'USER': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex w-full bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading SuperAdmin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex w-full bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.href = '/login'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Root Owner Dashboard</h1>
              <p className="text-muted-foreground mt-2">Complete system oversight and user management</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-red-100 text-red-800">
                <Crown className="w-4 h-4 mr-1" />
                Root Owner Access
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

        {/* Admin Management Quick Links */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-purple-600" />
                Admin Management Tools
              </CardTitle>
              <CardDescription>
                Quick access to all administrative functions and system management tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* User Management */}
                <Link to="/dashboard/admin/users">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">User Management</h3>
                          <p className="text-sm text-muted-foreground">Manage users, roles, and permissions</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Audit Logs */}
                <Link to="/dashboard/admin/audit-logs">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Audit Logs</h3>
                          <p className="text-sm text-muted-foreground">Monitor system activities and events</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Role Management */}
                <Link to="/dashboard/admin/roles">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Shield className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Role Management</h3>
                          <p className="text-sm text-muted-foreground">Configure roles and permissions</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Session Management */}
                <Link to="/dashboard/admin/sessions">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Monitor className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Session Management</h3>
                          <p className="text-sm text-muted-foreground">Monitor active sessions and devices</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Security Dashboard */}
                <Link to="/dashboard/admin/security">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <Lock className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Security Dashboard</h3>
                          <p className="text-sm text-muted-foreground">Monitor security events and threats</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* GDPR Tools */}
                <Link to="/dashboard/admin/gdpr">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-indigo-500">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Archive className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">GDPR Tools</h3>
                          <p className="text-sm text-muted-foreground">Data export, deletion, and compliance</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Access Control */}
                <Link to="/dashboard/admin/access-control">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-cyan-500">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-cyan-100 rounded-lg">
                          <Shield className="w-5 h-5 text-cyan-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Access Control</h3>
                          <p className="text-sm text-muted-foreground">RBAC system and permissions matrix</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
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
                            <p className="text-sm text-muted-foreground">{user.email}</p>
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
                          <p className="text-sm text-muted-foreground">
                            {user.bots} bots • {user.messages} messages
                          </p>
                          <p className="text-xs text-muted-foreground">
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
                    <h3 className="font-semibold">User Growth (Last 6 Months)</h3>
                    <div className="h-64 bg-muted rounded-lg p-4">
                      <div className="flex items-end justify-between h-full space-x-2">
                        {[120, 180, 220, 280, 320, 450].map((height, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div 
                              className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-t w-8 mb-2"
                              style={{ height: `${(height / 500) * 200}px` }}
                            />
                            <span className="text-xs text-muted-foreground">
                              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}
                            </span>
                            <span className="text-xs font-medium">{height}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Revenue Trends (Last 6 Months)</h3>
                    <div className="h-64 bg-muted rounded-lg p-4">
                      <div className="flex items-end justify-between h-full space-x-2">
                        {[8500, 12000, 15000, 18000, 22000, 28000].map((height, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div 
                              className="bg-gradient-to-t from-green-500 to-green-300 rounded-t w-8 mb-2"
                              style={{ height: `${(height / 30000) * 200}px` }}
                            />
                            <span className="text-xs text-muted-foreground">
                              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}
                            </span>
                            <span className="text-xs font-medium">${(height/1000).toFixed(0)}k</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Bot Usage Distribution</h3>
                    <div className="h-48 bg-muted rounded-lg p-4">
                      <div className="space-y-3">
                        {[
                          { label: 'Customer Support', value: 45, color: 'bg-blue-500' },
                          { label: 'Sales', value: 30, color: 'bg-green-500' },
                          { label: 'Marketing', value: 15, color: 'bg-purple-500' },
                          { label: 'Other', value: 10, color: 'bg-orange-500' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${item.color}`} />
                              <span className="text-sm">{item.label}</span>
                            </div>
                            <span className="text-sm font-medium">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Message Volume (Today)</h3>
                    <div className="h-48 bg-muted rounded-lg p-4">
                      <div className="space-y-3">
                        {[
                          { time: '00:00', messages: 120 },
                          { time: '04:00', messages: 80 },
                          { time: '08:00', messages: 450 },
                          { time: '12:00', messages: 680 },
                          { time: '16:00', messages: 520 },
                          { time: '20:00', messages: 380 }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{item.time}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${(item.messages / 700) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{item.messages}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold">Channel Performance</h3>
                    <div className="h-48 bg-muted rounded-lg p-4">
                      <div className="space-y-3">
                        {[
                          { channel: 'WhatsApp', users: 1250, growth: '+12%' },
                          { channel: 'Instagram', users: 890, growth: '+8%' },
                          { channel: 'Messenger', users: 680, growth: '+15%' },
                          { channel: 'Website', users: 320, growth: '+5%' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div>
                              <span className="text-sm font-medium">{item.channel}</span>
                              <div className="text-xs text-muted-foreground">{item.users} users</div>
                            </div>
                            <span className="text-sm font-medium text-green-600">{item.growth}</span>
                          </div>
                        ))}
                      </div>
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
