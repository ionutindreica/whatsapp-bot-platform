import React, { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Headphones, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Phone,
  Video,
  Settings,
  Activity,
  TrendingUp,
  Bell,
  ArrowRight
} from "lucide-react";

const LiveAgent = () => {
  const [activeTab, setActiveTab] = useState("agents");
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Sample agents data
  const agents = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      status: "ONLINE",
      currentLoad: 2,
      maxConcurrent: 5,
      specializations: ["Technical Support", "Billing", "General"],
      avgResponseTime: "2m 30s",
      totalChats: 156,
      rating: 4.8,
      lastActive: "2 minutes ago"
    },
    {
      id: "2",
      name: "Mike Chen",
      email: "mike@company.com",
      status: "BUSY",
      currentLoad: 4,
      maxConcurrent: 5,
      specializations: ["Technical Support", "API Integration"],
      avgResponseTime: "1m 45s",
      totalChats: 203,
      rating: 4.9,
      lastActive: "Just now"
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily@company.com",
      status: "AWAY",
      currentLoad: 1,
      maxConcurrent: 3,
      specializations: ["Sales", "General"],
      avgResponseTime: "3m 15s",
      totalChats: 89,
      rating: 4.7,
      lastActive: "15 minutes ago"
    },
    {
      id: "4",
      name: "David Kim",
      email: "david@company.com",
      status: "OFFLINE",
      currentLoad: 0,
      maxConcurrent: 4,
      specializations: ["Technical Support", "Billing"],
      avgResponseTime: "2m 10s",
      totalChats: 134,
      rating: 4.6,
      lastActive: "2 hours ago"
    }
  ];

  // Sample transfer requests
  const transferRequests = [
    {
      id: "1",
      customerName: "John Doe",
      customerId: "user_123",
      reason: "Technical issue with API integration",
      requestedAt: "5 minutes ago",
      priority: "HIGH",
      agent: "Sarah Johnson",
      status: "PENDING"
    },
    {
      id: "2",
      customerName: "Jane Smith",
      customerId: "user_456",
      reason: "Billing question",
      requestedAt: "12 minutes ago",
      priority: "MEDIUM",
      agent: "Mike Chen",
      status: "IN_PROGRESS"
    },
    {
      id: "3",
      customerName: "Bob Wilson",
      customerId: "user_789",
      reason: "General inquiry",
      requestedAt: "1 hour ago",
      priority: "LOW",
      agent: "Emily Rodriguez",
      status: "COMPLETED"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ONLINE": return "bg-green-100 text-green-800";
      case "BUSY": return "bg-yellow-100 text-yellow-800";
      case "AWAY": return "bg-orange-100 text-orange-800";
      case "OFFLINE": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-red-100 text-red-800";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800";
      case "LOW": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTransferStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800";
      case "COMPLETED": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <BackToDashboard />
          <div className="flex items-center justify-between mt-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Headphones className="w-8 h-8 text-green-600" />
                Live Agent Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your live support agents and handle customer transfers
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Activity className="mr-2 w-4 h-4" />
                View Analytics
              </Button>
              <Button>
                <Plus className="mr-2 w-4 h-4" />
                Add Agent
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Agents
            </TabsTrigger>
            <TabsTrigger value="transfers" className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Transfers
            </TabsTrigger>
            <TabsTrigger value="queue" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Queue
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Agents Tab */}
          <TabsContent value="agents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <Card key={agent.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                          {agent.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <CardTitle className="text-base">{agent.name}</CardTitle>
                          <p className="text-sm text-gray-600">{agent.email}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(agent.status)}>
                        {agent.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Current Load</p>
                        <p className="font-medium">{agent.currentLoad}/{agent.maxConcurrent}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Response</p>
                        <p className="font-medium">{agent.avgResponseTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Chats</p>
                        <p className="font-medium">{agent.totalChats}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Rating</p>
                        <p className="font-medium flex items-center gap-1">
                          ⭐ {agent.rating}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Specializations</p>
                      <div className="flex flex-wrap gap-1">
                        {agent.specializations.map((spec, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Last active: {agent.lastActive}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <MessageSquare className="mr-1 w-3 h-3" />
                        Chat
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transfers Tab */}
          <TabsContent value="transfers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transfer Requests</CardTitle>
                    <CardDescription>Manage customer transfers to live agents</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-red-50 text-red-700">
                      2 High Priority
                    </Badge>
                    <Badge variant="outline">
                      {transferRequests.filter(t => t.status === "PENDING").length} Pending
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transferRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {request.customerName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-medium">{request.customerName}</h4>
                            <p className="text-sm text-gray-600">ID: {request.customerId}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority}
                          </Badge>
                          <Badge className={getTransferStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">{request.reason}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Requested: {request.requestedAt}</span>
                          <span>Assigned to: {request.agent}</span>
                        </div>
                        <div className="flex gap-2">
                          {request.status === "PENDING" && (
                            <>
                              <Button size="sm" variant="outline">
                                <CheckCircle className="mr-1 w-3 h-3" />
                                Accept
                              </Button>
                              <Button size="sm" variant="outline">
                                <AlertCircle className="mr-1 w-3 h-3" />
                                Reject
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Queue Tab */}
          <TabsContent value="queue" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">In Queue</p>
                      <p className="text-2xl font-bold text-gray-900">8</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Chats</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Users className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Available Agents</p>
                      <p className="text-2xl font-bold text-gray-900">3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg Wait Time</p>
                      <p className="text-2xl font-bold text-gray-900">2m 30s</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Customer Queue</CardTitle>
                <CardDescription>Customers waiting for agent assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          U{i}
                        </div>
                        <div>
                          <h4 className="font-medium">Customer {i}</h4>
                          <p className="text-sm text-gray-600">Waiting for 3m 45s</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">General</Badge>
                        <Button size="sm" variant="outline">
                          <ArrowRight className="mr-1 w-3 h-3" />
                          Assign Agent
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transfer Settings</CardTitle>
                  <CardDescription>Configure how customers are transferred to agents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Auto-assignment</label>
                    <Select defaultValue="round-robin">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="round-robin">Round Robin</SelectItem>
                        <SelectItem value="least-busy">Least Busy</SelectItem>
                        <SelectItem value="specialization">By Specialization</SelectItem>
                        <SelectItem value="manual">Manual Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Max Queue Wait Time</label>
                    <Input type="number" placeholder="30" />
                    <p className="text-xs text-gray-500 mt-1">Minutes before escalating</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Transfer Reasons</label>
                    <Textarea 
                      placeholder="Enter common transfer reasons (one per line)"
                      rows={4}
                      defaultValue="Technical issue&#10;Billing question&#10;General inquiry&#10;Complaint&#10;Feature request"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Agent Settings</CardTitle>
                  <CardDescription>Configure agent availability and workload</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Default Max Concurrent Chats</label>
                    <Input type="number" placeholder="5" />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Auto-status Updates</label>
                    <Select defaultValue="enabled">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Response Time Tracking</label>
                    <Select defaultValue="enabled">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">Save Settings</Button>
                    <Button variant="outline">Reset</Button>
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

export default LiveAgent;
