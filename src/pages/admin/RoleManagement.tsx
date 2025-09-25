import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminPageLayout from '@/components/AdminPageLayout';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Users, 
  Settings, 
  Bot, 
  BarChart, 
  Database,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuthorization } from '@/hooks/useAuthorization';
import { Role, Permission, Resource, Action, ROLE_PERMISSIONS } from '@/types/auth';

interface RoleManagementProps {}

const RoleManagement: React.FC<RoleManagementProps> = () => {
  const { hasPermission } = useAuthorization();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRoles();
    loadPermissions();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/roles', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles || []);
      }
    } catch (error) {
      setError('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const loadPermissions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/permissions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPermissions(data.permissions || []);
      }
    } catch (error) {
      console.error('Failed to load permissions:', error);
    }
  };

  const handleCreateRole = async (roleData: any) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(roleData)
      });

      if (response.ok) {
        setShowRoleDialog(false);
        await loadRoles();
      } else {
        setError('Failed to create role');
      }
    } catch (error) {
      setError('Failed to create role');
    }
  };

  const handleUpdateRole = async (roleId: string, roleData: any) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/roles/${roleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(roleData)
      });

      if (response.ok) {
        setShowRoleDialog(false);
        await loadRoles();
      } else {
        setError('Failed to update role');
      }
    } catch (error) {
      setError('Failed to update role');
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/roles/${roleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        await loadRoles();
      } else {
        setError('Failed to delete role');
      }
    } catch (error) {
      setError('Failed to delete role');
    }
  };

  const getResourceIcon = (resource: Resource) => {
    switch (resource) {
      case 'users':
        return <Users className="h-4 w-4" />;
      case 'bots':
        return <Bot className="h-4 w-4" />;
      case 'analytics':
        return <BarChart className="h-4 w-4" />;
      case 'settings':
        return <Settings className="h-4 w-4" />;
      case 'integrations':
        return <Database className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: Action) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'read':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'update':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'delete':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'manage':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  if (!hasPermission('roles', 'read')) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert>
          <AlertCircle className="w-4 w-4" />
          <AlertDescription>
            You don't have permission to view role management.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <AdminPageLayout 
      title="Role Management"
      description="Manage roles, permissions, and access controls"
    >
      <div className="flex items-center justify-between">
        <div>
        
        {hasPermission('roles', 'create') && (
          <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedRole(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedRole ? 'Edit Role' : 'Create New Role'}
                </DialogTitle>
                <DialogDescription>
                  {selectedRole ? 'Update role information and permissions' : 'Create a new role with specific permissions'}
                </DialogDescription>
              </DialogHeader>
              <RoleForm 
                role={selectedRole}
                permissions={permissions}
                onSubmit={selectedRole ? 
                  (data) => handleUpdateRole(selectedRole.id, data) : 
                  handleCreateRole
                }
                onClose={() => setShowRoleDialog(false)}
              />
            </DialogContent>
          </Dialog>
        )}
        </div>
      </div>

      {/* System Roles Info */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          System roles (Super Admin, Admin, Manager, Agent, Viewer, Client) cannot be deleted or modified. 
          You can create custom roles with specific permissions.
        </AlertDescription>
      </Alert>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          roles.map((role) => (
            <Card key={role.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>{role.name}</span>
                    </CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </div>
                  {role.isSystem && (
                    <Badge variant="secondary">System</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Permissions ({role.permissions.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 5).map((permission) => (
                        <Badge key={permission.id} variant="outline" className="text-xs">
                          {permission.resource}:{permission.action}
                        </Badge>
                      ))}
                      {role.permissions.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Created: {new Date(role.createdAt).toLocaleDateString()}</span>
                    <span>Users: 0</span>
                  </div>
                </div>
              </CardContent>
              
              {!role.isSystem && hasPermission('roles', 'update') && (
                <div className="absolute top-4 right-4">
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedRole(role);
                        setShowRoleDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {hasPermission('roles', 'delete') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Permissions Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Available Permissions</CardTitle>
          <CardDescription>
            Overview of all system permissions and their usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="resources" className="space-y-4">
            <TabsList>
              <TabsTrigger value="resources">By Resource</TabsTrigger>
              <TabsTrigger value="actions">By Action</TabsTrigger>
              <TabsTrigger value="matrix">Permission Matrix</TabsTrigger>
            </TabsList>
            
            <TabsContent value="resources">
              <div className="space-y-4">
                {Object.entries(
                  permissions.reduce((acc, perm) => {
                    if (!acc[perm.resource]) acc[perm.resource] = [];
                    acc[perm.resource].push(perm);
                    return acc;
                  }, {} as Record<Resource, Permission[]>)
                ).map(([resource, perms]) => (
                  <div key={resource} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      {getResourceIcon(resource as Resource)}
                      <h3 className="font-medium capitalize">{resource}</h3>
                      <Badge variant="outline">{perms.length} permissions</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {perms.map((perm) => (
                        <Badge key={perm.id} className={getActionColor(perm.action)}>
                          {perm.action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="actions">
              <div className="space-y-4">
                {Object.entries(
                  permissions.reduce((acc, perm) => {
                    if (!acc[perm.action]) acc[perm.action] = [];
                    acc[perm.action].push(perm);
                    return acc;
                  }, {} as Record<Action, Permission[]>)
                ).map(([action, perms]) => (
                  <div key={action} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge className={getActionColor(action as Action)}>
                        {action}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {perms.length} resources
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {perms.map((perm) => (
                        <div key={perm.id} className="flex items-center space-x-1">
                          {getResourceIcon(perm.resource)}
                          <span className="text-sm capitalize">{perm.resource}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="matrix">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource</TableHead>
                      <TableHead>Create</TableHead>
                      <TableHead>Read</TableHead>
                      <TableHead>Update</TableHead>
                      <TableHead>Delete</TableHead>
                      <TableHead>Manage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from(new Set(permissions.map(p => p.resource))).map((resource) => (
                      <TableRow key={resource}>
                        <TableCell className="font-medium capitalize">
                          <div className="flex items-center space-x-2">
                            {getResourceIcon(resource as Resource)}
                            <span>{resource}</span>
                          </div>
                        </TableCell>
                        {(['create', 'read', 'update', 'delete', 'manage'] as Action[]).map((action) => {
                          const hasPermission = permissions.some(p => p.resource === resource && p.action === action);
                          return (
                            <TableCell key={action}>
                              {hasPermission ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <div className="h-5 w-5" />
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </AdminPageLayout>
  );
};

// Role Form Component
const RoleForm: React.FC<{
  role?: Role | null;
  permissions: Permission[];
  onSubmit: (data: any) => void;
  onClose: () => void;
}> = ({ role, permissions, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: role?.name || '',
    description: role?.description || '',
    permissions: role?.permissions.map(p => p.id) || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) acc[perm.resource] = [];
    acc[perm.resource].push(perm);
    return acc;
  }, {} as Record<Resource, Permission[]>);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Role Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter role name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter role description"
          />
        </div>
      </div>

      <div>
        <Label>Permissions</Label>
        <div className="mt-2 space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4">
          {Object.entries(groupedPermissions).map(([resource, perms]) => (
            <div key={resource} className="space-y-2">
              <h4 className="font-medium capitalize">{resource}</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {perms.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission.id}
                      checked={formData.permissions.includes(permission.id)}
                      onCheckedChange={() => togglePermission(permission.id)}
                    />
                    <Label htmlFor={permission.id} className="text-sm">
                      {permission.action}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {role ? 'Update Role' : 'Create Role'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default RoleManagement;
