import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminPageLayout from '@/components/AdminPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Shield, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Crown,
  Settings,
  Key,
  Eye,
  Lock
} from 'lucide-react';
import { 
  Permission, 
  UserRole, 
  PlanTier,
  ROLE_PERMISSIONS,
  getRoleDisplayName,
  getPlanDisplayName,
  RBACMiddleware
} from '@/types/rbac';

interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  usageCount: number;
}

interface PermissionCategory {
  category: string;
  permissions: Permission[];
  icon: React.ReactNode;
}

const CustomRoles: React.FC = () => {
  const { user } = useAuth();
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<CustomRole | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);

  // Permission categories for better organization
  const permissionCategories: PermissionCategory[] = [
    {
      category: 'System Management',
      permissions: [
        'SYSTEM_MANAGE_ALL',
        'SYSTEM_VIEW_LOGS',
        'SYSTEM_MANAGE_LICENSES'
      ],
      icon: <Settings className="w-4 h-4" />
    },
    {
      category: 'Workspace Management',
      permissions: [
        'WORKSPACE_MANAGE_ALL',
        'WORKSPACE_CREATE',
        'WORKSPACE_DELETE',
        'WORKSPACE_MANAGE_BILLING',
        'WORKSPACE_VIEW_ANALYTICS'
      ],
      icon: <Crown className="w-4 h-4" />
    },
    {
      category: 'User Management',
      permissions: [
        'USER_MANAGE_ALL',
        'USER_CREATE',
        'USER_EDIT',
        'USER_DELETE',
        'USER_SUSPEND',
        'USER_ACTIVATE',
        'USER_VIEW_DETAILS'
      ],
      icon: <Users className="w-4 h-4" />
    },
    {
      category: 'Bot Management',
      permissions: [
        'BOT_MANAGE_ALL',
        'BOT_CREATE',
        'BOT_EDIT',
        'BOT_DELETE',
        'BOT_VIEW',
        'BOT_PUBLISH',
        'BOT_ANALYTICS'
      ],
      icon: <Settings className="w-4 h-4" />
    },
    {
      category: 'Conversation Management',
      permissions: [
        'CONVERSATION_MANAGE_ALL',
        'CONVERSATION_VIEW_ALL',
        'CONVERSATION_REPLY',
        'CONVERSATION_ASSIGN',
        'CONVERSATION_CLOSE',
        'CONVERSATION_EXPORT'
      ],
      icon: <Eye className="w-4 h-4" />
    },
    {
      category: 'Channel Management',
      permissions: [
        'CHANNEL_MANAGE_ALL',
        'CHANNEL_CONNECT',
        'CHANNEL_DISCONNECT',
        'CHANNEL_VIEW_ANALYTICS'
      ],
      icon: <Key className="w-4 h-4" />
    },
    {
      category: 'Integration Management',
      permissions: [
        'INTEGRATION_MANAGE_ALL',
        'INTEGRATION_CREATE',
        'INTEGRATION_EDIT',
        'INTEGRATION_DELETE'
      ],
      icon: <Settings className="w-4 h-4" />
    },
    {
      category: 'Broadcast Management',
      permissions: [
        'BROADCAST_MANAGE_ALL',
        'BROADCAST_CREATE',
        'BROADCAST_SEND',
        'BROADCAST_VIEW_ANALYTICS'
      ],
      icon: <Settings className="w-4 h-4" />
    },
    {
      category: 'Analytics & Reporting',
      permissions: [
        'ANALYTICS_VIEW_ALL',
        'ANALYTICS_EXPORT',
        'ANALYTICS_CUSTOM_REPORTS'
      ],
      icon: <Eye className="w-4 h-4" />
    },
    {
      category: 'API Management',
      permissions: [
        'API_MANAGE_KEYS',
        'API_VIEW_USAGE',
        'API_RATE_LIMIT_MANAGE'
      ],
      icon: <Lock className="w-4 h-4" />
    }
  ];

  // Form state for creating/editing roles
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    loadCustomRoles();
  }, []);

  const loadCustomRoles = async () => {
    try {
      setLoading(true);
      // Mock data for now - in real app, this would come from API
      const mockRoles: CustomRole[] = [
        {
          id: '1',
          name: 'Marketing Manager',
          description: 'Manages marketing campaigns, broadcasts, and analytics',
          permissions: [
            'BROADCAST_CREATE',
            'BROADCAST_SEND',
            'BROADCAST_VIEW_ANALYTICS',
            'ANALYTICS_VIEW_ALL',
            'ANALYTICS_EXPORT',
            'CHANNEL_VIEW_ANALYTICS'
          ],
          isActive: true,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-20'),
          createdBy: 'johnindreica@gmail.com',
          usageCount: 3
        },
        {
          id: '2',
          name: 'Support Lead',
          description: 'Manages support team and customer conversations',
          permissions: [
            'CONVERSATION_VIEW_ALL',
            'CONVERSATION_REPLY',
            'CONVERSATION_ASSIGN',
            'CONVERSATION_CLOSE',
            'USER_CREATE',
            'USER_EDIT',
            'USER_VIEW_DETAILS',
            'BOT_VIEW',
            'BOT_ANALYTICS'
          ],
          isActive: true,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-18'),
          createdBy: 'johnindreica@gmail.com',
          usageCount: 2
        },
        {
          id: '3',
          name: 'Analytics Specialist',
          description: 'Read-only access to analytics and reporting',
          permissions: [
            'ANALYTICS_VIEW_ALL',
            'ANALYTICS_EXPORT',
            'ANALYTICS_CUSTOM_REPORTS',
            'CHANNEL_VIEW_ANALYTICS',
            'BOT_ANALYTICS'
          ],
          isActive: true,
          createdAt: new Date('2024-01-05'),
          updatedAt: new Date('2024-01-12'),
          createdBy: 'johnindreica@gmail.com',
          usageCount: 1
        }
      ];
      setCustomRoles(mockRoles);
    } catch (err) {
      setError('Failed to load custom roles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    try {
      if (!formData.name.trim()) {
        setError('Role name is required');
        return;
      }

      if (selectedPermissions.length === 0) {
        setError('At least one permission must be selected');
        return;
      }

      const newRole: CustomRole = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        permissions: selectedPermissions,
        isActive: formData.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: user?.email || 'unknown',
        usageCount: 0
      };

      setCustomRoles(prev => [...prev, newRole]);
      setIsCreateDialogOpen(false);
      setFormData({ name: '', description: '', isActive: true });
      setSelectedPermissions([]);
      setError(null);
    } catch (err) {
      setError('Failed to create role');
    }
  };

  const handleEditRole = (role: CustomRole) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      isActive: role.isActive
    });
    setSelectedPermissions(role.permissions);
    setIsCreateDialogOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;

    try {
      const updatedRole: CustomRole = {
        ...editingRole,
        name: formData.name,
        description: formData.description,
        permissions: selectedPermissions,
        isActive: formData.isActive,
        updatedAt: new Date()
      };

      setCustomRoles(prev => 
        prev.map(role => role.id === editingRole.id ? updatedRole : role)
      );

      setEditingRole(null);
      setIsCreateDialogOpen(false);
      setFormData({ name: '', description: '', isActive: true });
      setSelectedPermissions([]);
      setError(null);
    } catch (err) {
      setError('Failed to update role');
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return;

    try {
      setCustomRoles(prev => prev.filter(role => role.id !== roleId));
    } catch (err) {
      setError('Failed to delete role');
    }
  };

  const handleDuplicateRole = (role: CustomRole) => {
    const duplicatedRole: CustomRole = {
      ...role,
      id: Date.now().toString(),
      name: `${role.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0
    };

    setCustomRoles(prev => [...prev, duplicatedRole]);
  };

  const togglePermission = (permission: Permission) => {
    setSelectedPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const toggleCategoryPermissions = (category: PermissionCategory) => {
    const categoryPermissions = category.permissions;
    const hasAllPermissions = categoryPermissions.every(p => selectedPermissions.includes(p));

    if (hasAllPermissions) {
      // Remove all category permissions
      setSelectedPermissions(prev => 
        prev.filter(p => !categoryPermissions.includes(p))
      );
    } else {
      // Add all category permissions
      setSelectedPermissions(prev => {
        const newPermissions = [...prev];
        categoryPermissions.forEach(p => {
          if (!newPermissions.includes(p)) {
            newPermissions.push(p);
          }
        });
        return newPermissions;
      });
    }
  };

  const getPermissionDisplayName = (permission: Permission): string => {
    return permission.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const canManageCustomRoles = user?.role === 'ROOT_OWNER' || user?.role === 'SUPER_ADMIN' || 
    (user?.role === 'OWNER' && user?.planTier === 'ENTERPRISE');

  if (!canManageCustomRoles) {
    return (
      <AdminPageLayout 
        title="Custom Roles" 
        description="Create and manage custom roles for your organization"
      >
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Custom roles are only available for Enterprise plans. Please upgrade your plan to access this feature.
          </AlertDescription>
        </Alert>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout 
      title="Custom Roles" 
      description="Create and manage custom roles with specific permissions for your organization"
    >
      {error && (
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Custom Roles</h2>
          <p className="text-muted-foreground">
            Create custom roles with specific permissions for your team
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingRole(null);
              setFormData({ name: '', description: '', isActive: true });
              setSelectedPermissions([]);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRole ? 'Edit Custom Role' : 'Create Custom Role'}
              </DialogTitle>
              <DialogDescription>
                {editingRole 
                  ? 'Modify the role name, description, and permissions'
                  : 'Create a new custom role with specific permissions for your organization'
                }
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Role Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Marketing Manager, Support Lead"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this role is for and what they can do"
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>

              {/* Permissions Selection */}
              <div className="space-y-4">
                <div>
                  <Label>Permissions</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select the permissions this role should have. You can select individual permissions or entire categories.
                  </p>
                </div>

                <div className="space-y-4">
                  {permissionCategories.map((category) => {
                    const categoryPermissions = category.permissions;
                    const selectedInCategory = categoryPermissions.filter(p => selectedPermissions.includes(p));
                    const hasAllPermissions = categoryPermissions.every(p => selectedPermissions.includes(p));
                    const hasSomePermissions = selectedInCategory.length > 0 && !hasAllPermissions;

                    return (
                      <Card key={category.category}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {category.icon}
                              <CardTitle className="text-lg">{category.category}</CardTitle>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={hasAllPermissions ? 'default' : hasSomePermissions ? 'secondary' : 'outline'}>
                                {selectedInCategory.length}/{categoryPermissions.length}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleCategoryPermissions(category)}
                              >
                                {hasAllPermissions ? 'Deselect All' : 'Select All'}
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {categoryPermissions.map((permission) => (
                              <div
                                key={permission}
                                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                                onClick={() => togglePermission(permission)}
                              >
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                  selectedPermissions.includes(permission)
                                    ? 'bg-primary border-primary text-primary-foreground'
                                    : 'border-muted-foreground'
                                }`}>
                                  {selectedPermissions.includes(permission) && (
                                    <CheckCircle className="w-3 h-3" />
                                  )}
                                </div>
                                <span className="text-sm">{getPermissionDisplayName(permission)}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={editingRole ? handleUpdateRole : handleCreateRole}>
                  {editingRole ? 'Update Role' : 'Create Role'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Custom Roles List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading custom roles...</p>
          </div>
        ) : customRoles.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Custom Roles</h3>
              <p className="text-muted-foreground mb-4">
                Create your first custom role to get started with advanced permission management.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Role
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customRoles.map((role) => (
              <Card key={role.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-primary" />
                        <span>{role.name}</span>
                        {!role.isActive && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {role.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRole(role)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDuplicateRole(role)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Permissions:</span>
                      <Badge variant="outline">{role.permissions.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Usage:</span>
                      <Badge variant="outline">{role.usageCount} users</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Created:</span>
                      <span>{role.createdAt.toLocaleDateString()}</span>
                    </div>
                    <div className="pt-2">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((permission) => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {getPermissionDisplayName(permission)}
                          </Badge>
                        ))}
                        {role.permissions.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{role.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
};

export default CustomRoles;
