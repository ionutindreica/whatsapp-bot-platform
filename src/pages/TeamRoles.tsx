import React, { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2,
  Users,
  Settings,
  Key,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Crown,
  User,
  UserCheck
} from "lucide-react";

const TeamRoles = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  const roles = [
    {
      id: "1",
      name: "Super Admin",
      description: "Full access to all features and settings",
      permissions: ["all"],
      members: 1,
      color: "bg-red-100 text-red-800",
      icon: Crown
    },
    {
      id: "2",
      name: "Admin",
      description: "Manage users, bots, and most settings",
      permissions: ["users", "bots", "analytics", "settings"],
      members: 2,
      color: "bg-blue-100 text-blue-800",
      icon: Shield
    },
    {
      id: "3",
      name: "Manager",
      description: "Manage bots and view analytics",
      permissions: ["bots", "analytics", "conversations"],
      members: 3,
      color: "bg-green-100 text-green-800",
      icon: UserCheck
    },
    {
      id: "4",
      name: "Agent",
      description: "Handle conversations and basic bot management",
      permissions: ["conversations", "bots"],
      members: 5,
      color: "bg-yellow-100 text-yellow-800",
      icon: User
    },
    {
      id: "5",
      name: "Viewer",
      description: "View-only access to analytics and conversations",
      permissions: ["analytics", "conversations"],
      members: 2,
      color: "bg-gray-100 text-gray-800",
      icon: User
    }
  ];

  const permissions = [
    { name: "User Management", key: "users", description: "Create, edit, and delete users" },
    { name: "Bot Management", key: "bots", description: "Create, edit, and delete bots" },
    { name: "Analytics", key: "analytics", description: "View and export analytics" },
    { name: "Conversations", key: "conversations", description: "View and manage conversations" },
    { name: "Settings", key: "settings", description: "Modify system settings" },
    { name: "Billing", key: "billing", description: "Manage billing and subscriptions" },
    { name: "Integrations", key: "integrations", description: "Manage integrations and API keys" },
    { name: "Team Management", key: "team", description: "Manage team members and roles" }
  ];

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case "users":
        return "bg-red-100 text-red-800";
      case "bots":
        return "bg-blue-100 text-blue-800";
      case "analytics":
        return "bg-green-100 text-green-800";
      case "conversations":
        return "bg-yellow-100 text-yellow-800";
      case "settings":
        return "bg-purple-100 text-purple-800";
      case "billing":
        return "bg-orange-100 text-orange-800";
      case "integrations":
        return "bg-cyan-100 text-cyan-800";
      case "team":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
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
              <Shield className="w-8 h-8 text-whatsapp" />
              Roles & Permissions
            </h1>
            <p className="text-muted-foreground">Manage team roles and access permissions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="mr-2 w-4 h-4" />
              Settings
            </Button>
            <Button className="bg-whatsapp hover:bg-whatsapp/90">
              <Plus className="mr-2 w-4 h-4" />
              Create Role
            </Button>
          </div>
        </div>

        <Tabs defaultValue="roles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Roles Tab */}
          <TabsContent value="roles" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {roles.map((role) => (
                <Card key={role.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <role.icon className="w-6 h-6 text-whatsapp" />
                        <div>
                          <CardTitle className="text-lg">{role.name}</CardTitle>
                          <CardDescription>{role.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={role.color}>
                          {role.members} members
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium mb-2">Permissions</h4>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.map((permission) => (
                            <Badge key={permission} variant="secondary" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button size="sm" className="bg-whatsapp hover:bg-whatsapp/90">
                          <Users className="w-4 h-4 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Permissions</CardTitle>
                <CardDescription>Manage what each role can access and do</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {permissions.map((permission) => (
                    <div key={permission.key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-whatsapp" />
                        <div>
                          <h4 className="font-medium">{permission.name}</h4>
                          <p className="text-sm text-muted-foreground">{permission.description}</p>
                        </div>
                      </div>
                      <Badge className={getPermissionColor(permission.key)}>
                        {permission.key}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Members</p>
                      <p className="text-2xl font-bold">{roles.reduce((sum, role) => sum + role.members, 0)}</p>
                      <p className="text-sm text-green-600">+2 this month</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Roles</p>
                      <p className="text-2xl font-bold">{roles.length}</p>
                      <p className="text-sm text-green-600">100% active</p>
                    </div>
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Permissions</p>
                      <p className="text-2xl font-bold">{permissions.length}</p>
                      <p className="text-sm text-green-600">All configured</p>
                    </div>
                    <Key className="w-8 h-8 text-whatsapp" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Role Distribution</CardTitle>
                <CardDescription>See how team members are distributed across roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <role.icon className="w-5 h-5 text-whatsapp" />
                        <span className="font-medium">{role.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{role.members} members</div>
                        <div className="text-xs text-muted-foreground">{role.permissions.length} permissions</div>
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
                  <CardTitle>Role Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-assign roles</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Role inheritance</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Permission validation</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Audit logging</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Enable two-factor authentication",
                      "Set up role-based access control",
                      "Configure permission inheritance",
                      "Enable audit trails",
                      "Set up role expiration"
                    ].map((setting, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-whatsapp rounded-full mt-2" />
                        <span className="text-sm">{setting}</span>
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

export default TeamRoles;
