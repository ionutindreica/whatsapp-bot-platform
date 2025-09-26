import React, { useState, useEffect } from 'react';
import AdminPageLayout from '@/components/AdminPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Ban, 
  CheckCircle, 
  UserPlus,
  Download,
  Upload,
  Eye,
  Shield,
  Mail,
  Phone,
  Calendar,
  Building2,
  Crown,
  AlertTriangle
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  planTier: string;
  workspaceId?: string;
  lastLoginAt?: string;
  createdAt: string;
  permissions: string[];
  features: string[];
}

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'johnindreica@gmail.com',
          name: 'John Indreica',
          role: 'ROOT_OWNER',
          status: 'ACTIVE',
          planTier: 'ENTERPRISE',
          lastLoginAt: '2024-01-20T10:30:00Z',
          createdAt: '2024-01-15T08:00:00Z',
          permissions: ['SYSTEM_MANAGE_ALL', 'WORKSPACE_MANAGE_ALL'],
          features: ['MULTI_WORKSPACE', 'SSO_SCIM', 'WHITE_LABEL']
        },
        {
          id: '2',
          email: 'admin@company.com',
          name: 'Company Admin',
          role: 'SUPER_ADMIN',
          status: 'ACTIVE',
          planTier: 'ENTERPRISE',
          workspaceId: 'ws-1',
          lastLoginAt: '2024-01-19T15:45:00Z',
          createdAt: '2024-01-10T12:00:00Z',
          permissions: ['WORKSPACE_MANAGE_ALL', 'USER_MANAGE_ALL'],
          features: ['MULTI_WORKSPACE', 'ADVANCED_ANALYTICS']
        },
        {
          id: '3',
          email: 'manager@startup.com',
          name: 'Team Manager',
          role: 'MANAGER',
          status: 'ACTIVE',
          planTier: 'PRO',
          workspaceId: 'ws-2',
          lastLoginAt: '2024-01-18T09:20:00Z',
          createdAt: '2024-01-05T14:30:00Z',
          permissions: ['TEAM_MANAGE', 'BOT_MANAGE'],
          features: ['TEAM_COLLABORATION', 'ANALYTICS']
        },
        {
          id: '4',
          email: 'agent@support.com',
          name: 'Support Agent',
          role: 'AGENT',
          status: 'ACTIVE',
          planTier: 'STARTER',
          workspaceId: 'ws-2',
          lastLoginAt: '2024-01-17T16:10:00Z',
          createdAt: '2024-01-03T11:15:00Z',
          permissions: ['CONVERSATION_MANAGE'],
          features: ['BASIC_CHAT']
        },
        {
          id: '5',
          email: 'pending@newuser.com',
          name: 'New User',
          role: 'VIEWER',
          status: 'PENDING_VERIFICATION',
          planTier: 'STARTER',
          createdAt: '2024-01-20T08:00:00Z',
          permissions: ['READ_ONLY'],
          features: ['BASIC_ACCESS']
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'ALL' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'ALL' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      INACTIVE: { color: 'bg-gray-100 text-gray-800', icon: AlertTriangle },
      SUSPENDED: { color: 'bg-red-100 text-red-800', icon: Ban },
      PENDING_VERIFICATION: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center space-x-1`}>
        <Icon className="h-3 w-3" />
        <span>{status.replace('_', ' ')}</span>
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      ROOT_OWNER: { color: 'bg-red-100 text-red-800', icon: Crown },
      SUPER_ADMIN: { color: 'bg-purple-100 text-purple-800', icon: Shield },
      ADMIN: { color: 'bg-blue-100 text-blue-800', icon: Shield },
      MANAGER: { color: 'bg-indigo-100 text-indigo-800', icon: Users },
      AGENT: { color: 'bg-green-100 text-green-800', icon: Users },
      VIEWER: { color: 'bg-gray-100 text-gray-800', icon: Eye },
      CLIENT: { color: 'bg-orange-100 text-orange-800', icon: Users }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center space-x-1`}>
        <Icon className="h-3 w-3" />
        <span>{role.replace('_', ' ')}</span>
      </Badge>
    );
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length 
        ? [] 
        : filteredUsers.map(user => user.id)
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for users:`, selectedUsers);
    // Implement bulk actions
  };

  const handleUserAction = (userId: string, action: string) => {
    console.log(`Action: ${action} for user:`, userId);
    // Implement user actions
  };

  if (loading) {
    return (
      <AdminPageLayout 
        title="Users Management"
        description="Manage users and their access"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout 
      title="Users Management"
      description="Manage users and their access"
    >
      <div className="space-y-6">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Button className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4" />
              <span>Invite User</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.status === 'ACTIVE').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Crown className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Admins</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => ['ROOT_OWNER', 'SUPER_ADMIN', 'ADMIN'].includes(u.role)).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.status === 'PENDING_VERIFICATION').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Roles</option>
                  <option value="ROOT_OWNER">Root Owner</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="ADMIN">Admin</option>
                  <option value="MANAGER">Manager</option>
                  <option value="AGENT">Agent</option>
                  <option value="VIEWER">Viewer</option>
                  <option value="CLIENT">Client</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="PENDING_VERIFICATION">Pending</option>
                </select>
              </div>

              {selectedUsers.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {selectedUsers.length} selected
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('suspend')}
                  >
                    <Ban className="h-4 w-4 mr-1" />
                    Suspend
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('activate')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Activate
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <CardDescription>
              Manage user accounts, roles, and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="text-left p-4 font-medium">User</th>
                    <th className="text-left p-4 font-medium">Role</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Plan</th>
                    <th className="text-left p-4 font-medium">Last Login</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleUserSelect(user.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="p-4">
                        <Badge className="bg-blue-100 text-blue-800">
                          {user.planTier}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">
                          {user.lastLoginAt 
                            ? new Date(user.lastLoginAt).toLocaleDateString()
                            : 'Never'
                          }
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'view')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'edit')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUserAction(user.id, 'suspend')}
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
    </AdminPageLayout>
  );
};

export default UsersManagement;
