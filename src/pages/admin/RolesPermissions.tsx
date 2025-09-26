import React, { useState, useEffect } from 'react';
import AdminPageLayout from '@/components/AdminPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Lock, 
  Unlock,
  Crown,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  level: number;
  permissions: Permission[];
  userCount: number;
  isSystem: boolean;
  createdAt: string;
}

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
}

const RolesPermissions: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Mock permissions data
      const mockPermissions: Permission[] = [
        { id: '1', name: 'System Management', resource: 'system', action: 'manage', description: 'Full system access' },
        { id: '2', name: 'User Management', resource: 'users', action: 'manage', description: 'Create, edit, delete users' },
        { id: '3', name: 'Workspace Management', resource: 'workspaces', action: 'manage', description: 'Manage workspaces and teams' },
        { id: '4', name: 'Bot Management', resource: 'bots', action: 'manage', description: 'Create and manage bots' },
        { id: '5', name: 'Analytics View', resource: 'analytics', action: 'read', description: 'View analytics and reports' },
        { id: '6', name: 'API Management', resource: 'api', action: 'manage', description: 'Manage API keys and webhooks' },
        { id: '7', name: 'Settings Management', resource: 'settings', action: 'manage', description: 'Manage platform settings' },
        { id: '8', name: 'Audit Logs View', resource: 'audit_logs', action: 'read', description: 'View audit logs' },
        { id: '9', name: 'Team Management', resource: 'team', action: 'manage', description: 'Manage team members' },
        { id: '10', name: 'Billing Management', resource: 'billing', action: 'manage', description: 'Manage billing and subscriptions' }
      ];

      // Mock roles data
      const mockRoles: Role[] = [
        {
          id: '1',
          name: 'ROOT_OWNER',
          description: 'Highest level access with all permissions',
          level: 110,
          permissions: mockPermissions,
          userCount: 1,
          isSystem: true,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'SUPER_ADMIN',
          description: 'Full administrative access to all features',
          level: 100,
          permissions: mockPermissions.filter(p => p.id !== '1'), // Exclude system management
          userCount: 2,
          isSystem: true,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '3',
          name: 'ADMIN',
          description: 'Administrative access to workspace and user management',
          level: 80,
          permissions: mockPermissions.filter(p => ['2', '3', '4', '5', '8', '9'].includes(p.id)),
          userCount: 5,
          isSystem: true,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '4',
          name: 'MANAGER',
          description: 'Team and bot management permissions',
          level: 60,
          permissions: mockPermissions.filter(p => ['4', '5', '9'].includes(p.id)),
          userCount: 12,
          isSystem: true,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '5',
          name: 'AGENT',
          description: 'Basic operational permissions for customer support',
          level: 40,
          permissions: mockPermissions.filter(p => ['4'].includes(p.id)),
          userCount: 25,
          isSystem: true,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '6',
          name: 'CUSTOM_ROLE_1',
          description: 'Custom role for enterprise clients',
          level: 70,
          permissions: mockPermissions.filter(p => ['4', '5', '8'].includes(p.id)),
          userCount: 3,
          isSystem: false,
          createdAt: '2024-01-15T10:30:00Z'
        }
      ];

      setPermissions(mockPermissions);
      setRoles(mockRoles);
    } catch (error) {
      console.error('Error loading roles and permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'ROOT_OWNER':
        return Crown;
      case 'SUPER_ADMIN':
      case 'ADMIN':
        return Shield;
      default:
        return Users;
    }
  };

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case 'ROOT_OWNER':
        return 'bg-red-100 text-red-800';
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800';
      case 'MANAGER':
        return 'bg-indigo-100 text-indigo-800';
      case 'AGENT':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateRole = () => {
    setShowCreateModal(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setShowEditModal(true);
  };

  const handleDeleteRole = (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      console.log('Deleting role:', roleId);
      // Implement delete logic
    }
  };

  const handleTogglePermission = (roleId: string, permissionId: string) => {
    setRoles(prevRoles => 
      prevRoles.map(role => {
        if (role.id === roleId) {
          const hasPermission = role.permissions.some(p => p.id === permissionId);
          const permission = permissions.find(p => p.id === permissionId);
          
          if (hasPermission) {
            return {
              ...role,
              permissions: role.permissions.filter(p => p.id !== permissionId)
            };
          } else if (permission) {
            return {
              ...role,
              permissions: [...role.permissions, permission]
            };
          }
        }
        return role;
      })
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout 
      title="Roles & Permissions"
      description="Manage roles and permissions"
    >
      <div className="space-y-6">
          <Button onClick={handleCreateRole} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Role</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Roles</p>
                  <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {roles.reduce((sum, role) => sum + role.userCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Settings className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Permissions</p>
                  <p className="text-2xl font-bold text-gray-900">{permissions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Edit className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Custom Roles</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {roles.filter(role => !role.isSystem).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRoles.map((role) => {
            const Icon = getRoleIcon(role.name);
            return (
              <Card key={role.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getRoleBadgeColor(role.name)}>
                            Level {role.level}
                          </Badge>
                          {role.isSystem && (
                            <Badge className="bg-gray-100 text-gray-800">
                              System
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {!role.isSystem && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditRole(role)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {!role.isSystem && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Users assigned:</span>
                      <span className="font-medium">{role.userCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Permissions:</span>
                      <span className="font-medium">{role.permissions.length}</span>
                    </div>
                    
                    {/* Permissions Preview */}
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Key Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((permission) => (
                          <Badge key={permission.id} className="bg-blue-100 text-blue-800 text-xs">
                            {permission.resource}
                          </Badge>
                        ))}
                        {role.permissions.length > 3 && (
                          <Badge className="bg-gray-100 text-gray-800 text-xs">
                            +{role.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleEditRole(role)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Permissions Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Permissions Matrix</CardTitle>
            <CardDescription>
              Overview of all permissions across roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Permission</th>
                    {roles.map(role => (
                      <th key={role.id} className="text-center p-4 font-medium">
                        {role.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permissions.map(permission => (
                    <tr key={permission.id} className="border-b">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{permission.name}</p>
                          <p className="text-sm text-gray-600">{permission.description}</p>
                        </div>
                      </td>
                      {roles.map(role => {
                        const hasPermission = role.permissions.some(p => p.id === permission.id);
                        const isSystemRole = role.isSystem;
                        
                        return (
                          <td key={role.id} className="p-4 text-center">
                            {isSystemRole ? (
                              <Badge className="bg-gray-100 text-gray-800">
                                System
                              </Badge>
                            ) : (
                              <button
                                onClick={() => handleTogglePermission(role.id, permission.id)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  hasPermission 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                {hasPermission ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <XCircle className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  );
};

export default RolesPermissions;
