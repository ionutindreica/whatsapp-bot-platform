import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminPageLayout from '@/components/AdminPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Users, 
  Crown, 
  Settings, 
  Eye, 
  UserPlus, 
  Key,
  Lock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { 
  UserRole, 
  PlanTier, 
  Permission, 
  FeatureFlag,
  ROLE_PERMISSIONS,
  TIER_FEATURES,
  getRoleDisplayName,
  getPlanDisplayName,
  RBACMiddleware
} from '@/types/rbac';

const AccessControl: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [features, setFeatures] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Role hierarchy display
  const roleHierarchy = [
    { role: 'ROOT_OWNER', level: 6, color: 'bg-purple-600', description: 'System Owner - Creator of the platform' },
    { role: 'SUPER_ADMIN', level: 5, color: 'bg-red-600', description: 'Global Administrator' },
    { role: 'OWNER', level: 4, color: 'bg-blue-600', description: 'Workspace Owner / Account Admin' },
    { role: 'MANAGER', level: 3, color: 'bg-green-600', description: 'Team Admin / Manager' },
    { role: 'AGENT', level: 2, color: 'bg-yellow-600', description: 'Agent / Member' },
    { role: 'VIEWER', level: 1, color: 'bg-gray-600', description: 'Viewer / Guest' }
  ];

  // Permission categories
  const permissionCategories = {
    'System Management': [
      'SYSTEM_MANAGE_ALL',
      'SYSTEM_CREATE_SUPERADMINS',
      'SYSTEM_DELETE_SUPERADMINS',
      'SYSTEM_VIEW_LOGS',
      'SYSTEM_MANAGE_LICENSES'
    ],
    'Workspace Management': [
      'WORKSPACE_MANAGE_ALL',
      'WORKSPACE_CREATE',
      'WORKSPACE_DELETE',
      'WORKSPACE_MANAGE_BILLING',
      'WORKSPACE_VIEW_ANALYTICS'
    ],
    'User Management': [
      'USER_MANAGE_ALL',
      'USER_CREATE',
      'USER_EDIT',
      'USER_DELETE',
      'USER_SUSPEND',
      'USER_ACTIVATE',
      'USER_VIEW_DETAILS'
    ],
    'Bot Management': [
      'BOT_MANAGE_ALL',
      'BOT_CREATE',
      'BOT_EDIT',
      'BOT_DELETE',
      'BOT_VIEW',
      'BOT_PUBLISH',
      'BOT_ANALYTICS'
    ],
    'Conversation Management': [
      'CONVERSATION_MANAGE_ALL',
      'CONVERSATION_VIEW_ALL',
      'CONVERSATION_REPLY',
      'CONVERSATION_ASSIGN',
      'CONVERSATION_CLOSE',
      'CONVERSATION_EXPORT'
    ],
    'Channel Management': [
      'CHANNEL_MANAGE_ALL',
      'CHANNEL_CONNECT',
      'CHANNEL_DISCONNECT',
      'CHANNEL_VIEW_ANALYTICS'
    ],
    'Integration Management': [
      'INTEGRATION_MANAGE_ALL',
      'INTEGRATION_CREATE',
      'INTEGRATION_EDIT',
      'INTEGRATION_DELETE'
    ],
    'Broadcast Management': [
      'BROADCAST_MANAGE_ALL',
      'BROADCAST_CREATE',
      'BROADCAST_SEND',
      'BROADCAST_VIEW_ANALYTICS'
    ],
    'Analytics & Reporting': [
      'ANALYTICS_VIEW_ALL',
      'ANALYTICS_EXPORT',
      'ANALYTICS_CUSTOM_REPORTS'
    ],
    'API Management': [
      'API_MANAGE_KEYS',
      'API_VIEW_USAGE',
      'API_RATE_LIMIT_MANAGE'
    ]
  };

  // Feature categories
  const featureCategories = {
    'Workspace Features': [
      'MULTI_WORKSPACE',
      'SSO_SCIM',
      'WHITE_LABEL'
    ],
    'AI Features': [
      'AI_RAG',
      'CUSTOM_GPT'
    ],
    'Data & Analytics': [
      'DATA_EXPORT',
      'ADVANCED_ANALYTICS'
    ],
    'Advanced Features': [
      'CUSTOM_ROLES',
      'API_UNLIMITED',
      'PRIORITY_SUPPORT'
    ]
  };

  useEffect(() => {
    loadAccessControlData();
  }, []);

  const loadAccessControlData = async () => {
    try {
      setLoading(true);
      // Load roles, permissions, and features from backend
      // This would typically come from your API
      setRoles(['ROOT_OWNER', 'SUPER_ADMIN', 'OWNER', 'MANAGER', 'AGENT', 'VIEWER']);
      setPermissions(Object.keys(ROLE_PERMISSIONS['ROOT_OWNER']) as Permission[]);
      setFeatures(['MULTI_WORKSPACE', 'SSO_SCIM', 'WHITE_LABEL', 'AI_RAG', 'CUSTOM_GPT', 'DATA_EXPORT', 'ADVANCED_ANALYTICS', 'CUSTOM_ROLES', 'API_UNLIMITED', 'PRIORITY_SUPPORT']);
    } catch (err) {
      setError('Failed to load access control data');
    } finally {
      setLoading(false);
    }
  };

  const getPermissionIcon = (permission: Permission) => {
    if (permission.includes('SYSTEM_')) return <Shield className="w-4 h-4" />;
    if (permission.includes('USER_')) return <Users className="w-4 h-4" />;
    if (permission.includes('BOT_')) return <Settings className="w-4 h-4" />;
    if (permission.includes('CONVERSATION_')) return <Eye className="w-4 h-4" />;
    if (permission.includes('CHANNEL_')) return <Key className="w-4 h-4" />;
    if (permission.includes('API_')) return <Lock className="w-4 h-4" />;
    return <Key className="w-4 h-4" />;
  };

  const getFeatureIcon = (feature: FeatureFlag) => {
    switch (feature) {
      case 'MULTI_WORKSPACE':
      case 'SSO_SCIM':
      case 'WHITE_LABEL':
        return <Crown className="w-4 h-4" />;
      case 'AI_RAG':
      case 'CUSTOM_GPT':
        return <Settings className="w-4 h-4" />;
      case 'DATA_EXPORT':
      case 'ADVANCED_ANALYTICS':
        return <Eye className="w-4 h-4" />;
      default:
        return <Key className="w-4 h-4" />;
    }
  };

  const hasPermission = (role: UserRole, permission: Permission): boolean => {
    return ROLE_PERMISSIONS[role].includes(permission);
  };

  const hasFeature = (tier: PlanTier, feature: FeatureFlag): boolean => {
    return TIER_FEATURES[tier].includes(feature);
  };

  return (
    <AdminPageLayout 
      title="Access Control" 
      description="Manage roles, permissions, and tier-based feature access across your platform"
    >
      {error && (
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="roles">Role Hierarchy</TabsTrigger>
          <TabsTrigger value="permissions">Permissions Matrix</TabsTrigger>
          <TabsTrigger value="features">Feature Access</TabsTrigger>
          <TabsTrigger value="custom">Custom Roles</TabsTrigger>
        </TabsList>

        {/* Role Hierarchy Tab */}
        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="w-5 h-5 mr-2" />
                Role Hierarchy
              </CardTitle>
              <CardDescription>
                The complete hierarchy of user roles in the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roleHierarchy.map((role, index) => (
                  <div key={role.role} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full ${role.color} flex items-center justify-center text-white font-bold`}>
                      {role.level}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{getRoleDisplayName(role.role as UserRole)}</h3>
                        <Badge variant="outline">{role.role}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {ROLE_PERMISSIONS[role.role as UserRole].length} permissions
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Role Assignment Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Who can assign roles:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Root Owner → Any role</li>
                      <li>• Super Admin → All except Root Owner</li>
                      <li>• Owner → Manager, Agent, Viewer</li>
                      <li>• Manager → Agent, Viewer</li>
                      <li>• Agent/Viewer → Cannot assign roles</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Management scope:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Root Owner → Global access</li>
                      <li>• Super Admin → All workspaces</li>
                      <li>• Owner → Own workspace only</li>
                      <li>• Manager → Team members only</li>
                      <li>• Agent/Viewer → Self only</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Matrix Tab */}
        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2" />
                Permissions Matrix
              </CardTitle>
              <CardDescription>
                Detailed breakdown of permissions by role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(permissionCategories).map(([category, categoryPermissions]) => (
                  <div key={category}>
                    <h3 className="font-semibold mb-3">{category}</h3>
                    <div className="space-y-2">
                      {categoryPermissions.map((permission) => (
                        <div key={permission} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getPermissionIcon(permission)}
                            <span className="font-medium">{permission}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {roleHierarchy.map((role) => (
                              <div
                                key={role.role}
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  hasPermission(role.role as UserRole, permission)
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-gray-100 text-gray-400'
                                }`}
                                title={`${getRoleDisplayName(role.role as UserRole)}: ${
                                  hasPermission(role.role as UserRole, permission) ? 'Yes' : 'No'
                                }`}
                              >
                                {hasPermission(role.role as UserRole, permission) ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feature Access Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Tier-Based Feature Access
              </CardTitle>
              <CardDescription>
                Features available based on subscription tier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(featureCategories).map(([category, categoryFeatures]) => (
                  <div key={category}>
                    <h3 className="font-semibold mb-3">{category}</h3>
                    <div className="space-y-2">
                      {categoryFeatures.map((feature) => (
                        <div key={feature} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getFeatureIcon(feature)}
                            <span className="font-medium">{feature}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {(['STARTER', 'PRO', 'ENTERPRISE'] as PlanTier[]).map((tier) => (
                              <Badge
                                key={tier}
                                variant={hasFeature(tier, feature) ? 'default' : 'secondary'}
                                className={hasFeature(tier, feature) ? 'bg-green-100 text-green-800' : ''}
                              >
                                {getPlanDisplayName(tier)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Roles Tab */}
        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="w-5 h-5 mr-2" />
                Custom Roles (Enterprise)
              </CardTitle>
              <CardDescription>
                Create custom roles for Enterprise customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Custom roles are available only for Enterprise plans with the CUSTOM_ROLES feature enabled.
                </AlertDescription>
              </Alert>
              
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Custom role creation will be available in a future update.</p>
                <p className="text-sm">This feature allows Enterprise customers to create their own roles with specific permissions.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminPageLayout>
  );
};

export default AccessControl;
