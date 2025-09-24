import React, { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Plus, 
  MessageSquare, 
  Bell,
  Calendar,
  FileText,
  Share2,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  UserPlus,
  MessageCircle,
  Activity,
  Zap
} from "lucide-react";

const TeamCollaboration = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  
  const projects = [
    {
      id: "1",
      name: "Customer Support Bot",
      description: "AI bot for handling customer inquiries",
      status: "active",
      members: 3,
      tasks: 12,
      completed: 8,
      deadline: "2024-02-15",
      priority: "high"
    },
    {
      id: "2",
      name: "Sales Integration",
      description: "Integrate bot with sales system",
      status: "in-progress",
      members: 2,
      tasks: 6,
      completed: 3,
      deadline: "2024-02-20",
      priority: "medium"
    },
    {
      id: "3",
      name: "Analytics Dashboard",
      description: "Create analytics dashboard for bot performance",
      status: "planning",
      members: 4,
      tasks: 8,
      completed: 0,
      deadline: "2024-03-01",
      priority: "low"
    }
  ];

  const teamMembers = [
    {
      id: "1",
      name: "John Doe",
      role: "Project Manager",
      status: "online",
      lastActivity: "2 minutes ago",
      avatar: "JD"
    },
    {
      id: "2",
      name: "Jane Smith",
      role: "Developer",
      status: "online",
      lastActivity: "5 minutes ago",
      avatar: "JS"
    },
    {
      id: "3",
      name: "Mike Johnson",
      role: "Designer",
      status: "away",
      lastActivity: "1 hour ago",
      avatar: "MJ"
    },
    {
      id: "4",
      name: "Sarah Wilson",
      role: "QA Tester",
      status: "offline",
      lastActivity: "2 hours ago",
      avatar: "SW"
    }
  ];

  const recentActivity = [
    {
      id: "1",
      user: "John Doe",
      action: "created a new task",
      target: "Customer Support Bot",
      time: "2 minutes ago",
      type: "task"
    },
    {
      id: "2",
      user: "Jane Smith",
      action: "completed a task",
      target: "Sales Integration",
      time: "15 minutes ago",
      type: "completion"
    },
    {
      id: "3",
      user: "Mike Johnson",
      action: "uploaded a file",
      target: "Analytics Dashboard",
      time: "1 hour ago",
      type: "file"
    },
    {
      id: "4",
      user: "Sarah Wilson",
      action: "commented on",
      target: "Customer Support Bot",
      time: "2 hours ago",
      type: "comment"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "planning":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMemberStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800";
      case "away":
        return "bg-yellow-100 text-yellow-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task":
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case "completion":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "file":
        return <FileText className="w-4 h-4 text-purple-600" />;
      case "comment":
        return <MessageCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
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
              <Users className="w-8 h-8 text-whatsapp" />
              Team Collaboration
            </h1>
            <p className="text-muted-foreground">Manage team projects, tasks, and collaboration</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Bell className="mr-2 w-4 h-4" />
              Notifications
            </Button>
            <Button className="bg-whatsapp hover:bg-whatsapp/90">
              <Plus className="mr-2 w-4 h-4" />
              New Project
            </Button>
          </div>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users className="w-6 h-6 text-whatsapp" />
                        <div>
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <CardDescription>{project.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Members</p>
                        <p className="text-2xl font-bold">{project.members}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tasks</p>
                        <p className="text-2xl font-bold">{project.completed}/{project.tasks}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>Deadline: {project.deadline}</span>
                      <span>Progress: {Math.round((project.completed / project.tasks) * 100)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button size="sm" className="bg-whatsapp hover:bg-whatsapp/90">
                        <Users className="w-4 h-4 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {teamMembers.map((member) => (
                <Card key={member.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-whatsapp/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">{member.avatar}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getMemberStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{member.lastActivity}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest team activities and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                          <span className="font-medium">{activity.target}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
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
                  <CardTitle>Collaboration Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Real-time notifications</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Project sharing</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Task assignments</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Activity logging</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Team Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Enable team chat",
                      "Set up project templates",
                      "Configure task workflows",
                      "Enable file sharing",
                      "Set up meeting scheduler"
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

export default TeamCollaboration;
