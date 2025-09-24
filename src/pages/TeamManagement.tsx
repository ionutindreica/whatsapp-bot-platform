import { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Settings, 
  Mail, 
  Phone,
  Calendar,
  Crown,
  User,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  Key,
  Lock,
  Eye,
  EyeOff,
  Plus,
  Search,
  Filter,
  Download,
  Upload
} from "lucide-react";

const TeamManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  
  const teamMembers = [
    {
      id: 1,
      name: "John Smith",
      email: "john@company.com",
      role: "Admin",
      status: "active",
      avatar: "/avatars/john.jpg",
      lastActive: "2 hours ago",
      permissions: ["Full Access", "User Management", "Billing"],
      joinDate: "2024-01-15",
      bots: 12,
      conversations: 2847
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "Editor",
      status: "active",
      avatar: "/avatars/sarah.jpg",
      lastActive: "1 hour ago",
      permissions: ["Bot Management", "Analytics"],
      joinDate: "2024-02-20",
      bots: 8,
      conversations: 1247
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike@company.com",
      role: "Viewer",
      status: "pending",
      avatar: "/avatars/mike.jpg",
      lastActive: "Never",
      permissions: ["View Only"],
      joinDate: "2024-03-10",
      bots: 0,
      conversations: 0
    }
  ];

  const roles = [
    {
      name: "Admin",
      description: "Full access to all features and settings",
      permissions: ["Full Access", "User Management", "Billing", "System Settings"],
      color: "bg-red-100 text-red-800",
      members: 1
    },
    {
      name: "Editor",
      description: "Can create and manage bots, view analytics",
      permissions: ["Bot Management", "Analytics", "Templates"],
      color: "bg-blue-100 text-blue-800",
      members: 1
    },
    {
      name: "Viewer",
      description: "Read-only access to bots and conversations",
      permissions: ["View Only", "Basic Analytics"],
      color: "bg-green-100 text-green-800",
      members: 1
    }
  ];

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || member.role.toLowerCase() === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back to Dashboard */}
        <BackToDashboard title="Back to Dashboard" />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="w-8 h-8 text-whatsapp" />
              Team Management
            </h1>
            <p className="text-muted-foreground">Manage your team members and their permissions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 w-4 h-4" />
              Export Team
            </Button>
            <Button className="bg-whatsapp hover:bg-whatsapp/90">
              <UserPlus className="mr-2 w-4 h-4" />
              Invite Member
            </Button>
          </div>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold">{teamMembers.length}</p>
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
                  <p className="text-sm text-muted-foreground">Active Members</p>
                  <p className="text-2xl font-bold">{teamMembers.filter(m => m.status === 'active').length}</p>
                  <p className="text-sm text-green-600">100% active</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Invites</p>
                  <p className="text-2xl font-bold">{teamMembers.filter(m => m.status === 'pending').length}</p>
                  <p className="text-sm text-orange-600">Awaiting response</p>
                </div>
                <UserX className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bots</p>
                  <p className="text-2xl font-bold">{teamMembers.reduce((sum, m) => sum + m.bots, 0)}</p>
                  <p className="text-sm text-green-600">+15 this month</p>
                </div>
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="members">Team Members</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            <TabsTrigger value="invites">Invitations</TabsTrigger>
          </TabsList>

          {/* Team Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Members
                </CardTitle>
                <CardDescription>Manage your team members and their access levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search and Filters */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Search team members..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button variant="outline">
                      <Filter className="mr-2 w-4 h-4" />
                      Filter
                    </Button>
                  </div>

                  {/* Members List */}
                  <div className="space-y-4">
                    {filteredMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/25">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{member.name}</h4>
                              <Badge 
                                variant={member.status === 'active' ? 'default' : 'secondary'}
                                className={member.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                              >
                                {member.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {member.email}
                              </span>
                              <span>•</span>
                              <span>Last active: {member.lastActive}</span>
                              <span>•</span>
                              <span>{member.bots} bots</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <Badge variant="outline" className={roles.find(r => r.name === member.role)?.color}>
                              {member.role}
                            </Badge>
                            <div className="text-sm text-muted-foreground mt-1">
                              {member.conversations.toLocaleString()} conversations
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <UserX className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles & Permissions Tab */}
          <TabsContent value="roles" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {roles.map((role) => (
                <Card key={role.name} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                      <Badge className={role.color}>
                        {role.members} member{role.members !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Permissions:</h4>
                      <div className="space-y-1">
                        {role.permissions.map((permission) => (
                          <div key={permission} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-whatsapp rounded-full" />
                            <span>{permission}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="mr-2 w-4 h-4" />
                        Edit Role
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Create Custom Role</h3>
                  <p className="text-muted-foreground mb-4">
                    Create a custom role with specific permissions for your team
                  </p>
                  <Button>
                    <Plus className="mr-2 w-4 h-4" />
                    Create Role
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invitations Tab */}
          <TabsContent value="invites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Pending Invitations
                </CardTitle>
                <CardDescription>Manage team invitations and access requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.filter(m => m.status === 'pending').map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                          <p className="text-xs text-muted-foreground">Invited {member.joinDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <UserCheck className="mr-2 w-4 h-4" />
                          Resend
                        </Button>
                        <Button size="sm" variant="outline">
                          <UserX className="mr-2 w-4 h-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}

                  {teamMembers.filter(m => m.status === 'pending').length === 0 && (
                    <div className="text-center py-8">
                      <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Pending Invitations</h3>
                      <p className="text-muted-foreground">
                        All team invitations have been accepted
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invite New Member</CardTitle>
                <CardDescription>Send an invitation to join your team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <Input placeholder="colleague@company.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>Editor</option>
                      <option>Viewer</option>
                      <option>Admin</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Personal Message (Optional)</label>
                  <textarea 
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder="Add a personal message to the invitation..."
                  />
                </div>
                <Button className="w-full">
                  <UserPlus className="mr-2 w-4 h-4" />
                  Send Invitation
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeamManagement;
