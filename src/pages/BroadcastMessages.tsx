import React, { useState, useEffect } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Megaphone, 
  Send, 
  Clock, 
  Users, 
  Eye, 
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Filter,
  Target,
  BarChart3,
  MessageSquare,
  Settings,
  MessageCircle,
  Mail,
  Instagram,
  Smartphone,
  Globe,
  Check,
  Facebook
} from "lucide-react";

const BroadcastMessages = () => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [activeTab, setActiveTab] = useState("compose");
  const [selectedSegment, setSelectedSegment] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // New broadcast form
  const [newBroadcast, setNewBroadcast] = useState({
    title: "",
    message: "",
    type: "IMMEDIATE",
    scheduledAt: "",
    segment: "",
    template: "",
    channels: [] as string[]
  });

  // Templates
  const messageTemplates = [
    {
      id: "welcome",
      name: "Welcome Message",
      content: "👋 Welcome to our service! We're excited to have you here.",
      category: "Onboarding"
    },
    {
      id: "promotion",
      name: "Special Promotion",
      content: "🎉 Special offer just for you! Get 20% off your next purchase.",
      category: "Marketing"
    },
    {
      id: "reminder",
      name: "Appointment Reminder",
      content: "⏰ Don't forget! You have an appointment tomorrow at {time}.",
      category: "Reminders"
    },
    {
      id: "support",
      name: "Support Follow-up",
      content: "🔧 How was your experience with our support team? We'd love your feedback!",
      category: "Support"
    }
  ];

  // Segments
  const segments = [
    {
      id: "all",
      name: "All Users",
      count: 1250,
      description: "All active subscribers"
    },
    {
      id: "premium",
      name: "Premium Users",
      count: 320,
      description: "Users with premium subscription"
    },
    {
      id: "new",
      name: "New Users",
      count: 150,
      description: "Users who joined in the last 30 days"
    },
    {
      id: "inactive",
      name: "Inactive Users",
      count: 85,
      description: "Users who haven't engaged in 30+ days"
    }
  ];

  // Available channels
  const availableChannels = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: MessageCircle,
      description: "Send via WhatsApp Business API",
      subscriberCount: 1250,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200"
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      description: "Send via Instagram Direct Messages",
      subscriberCount: 890,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    },
    {
      id: "messenger",
      name: "Messenger",
      icon: Facebook,
      description: "Send via Facebook Messenger",
      subscriberCount: 680,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: "website",
      name: "Website Widget",
      icon: Globe,
      description: "Show in website chat widget",
      subscriberCount: 320,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    }
  ];

  const handleChannelToggle = (channelId: string) => {
    setNewBroadcast(prev => ({
      ...prev,
      channels: prev.channels.includes(channelId)
        ? prev.channels.filter(id => id !== channelId)
        : [...prev.channels, channelId]
    }));
  };

  const handleSendBroadcast = async () => {
    if (!newBroadcast.title || !newBroadcast.message) {
      alert("Please fill in title and message");
      return;
    }

    if (newBroadcast.channels.length === 0) {
      alert("Please select at least one channel to send the broadcast");
      return;
    }

    // Simulate sending
    console.log("Sending broadcast:", newBroadcast);
    const channelNames = newBroadcast.channels.map(id => 
      availableChannels.find(c => c.id === id)?.name
    ).join(", ");
    alert(`Broadcast sent successfully to ${channelNames}!`);
    
    // Reset form
    setNewBroadcast({
      title: "",
      message: "",
      type: "IMMEDIATE",
      scheduledAt: "",
      segment: "",
      template: "",
      channels: []
    });
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = messageTemplates.find(t => t.id === templateId);
    if (template) {
      setNewBroadcast(prev => ({
        ...prev,
        message: template.content,
        template: templateId
      }));
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
                <Megaphone className="w-8 h-8 text-blue-600" />
                Broadcast Messages
              </h1>
              <p className="text-gray-600 mt-2">
                Send messages to your subscribers in bulk with advanced targeting and analytics
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Eye className="mr-2 w-4 h-4" />
                View Analytics
              </Button>
              <Button>
                <Plus className="mr-2 w-4 h-4" />
                New Broadcast
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="compose" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Compose
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="segments" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Segments
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Compose Tab */}
          <TabsContent value="compose" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Compose Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Compose Message</CardTitle>
                    <CardDescription>
                      Create and send broadcast messages to your subscribers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Message Title</label>
                      <Input
                        placeholder="Enter message title..."
                        value={newBroadcast.title}
                        onChange={(e) => setNewBroadcast(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Message Content</label>
                      <Textarea
                        placeholder="Type your message here..."
                        rows={8}
                        value={newBroadcast.message}
                        onChange={(e) => setNewBroadcast(prev => ({ ...prev, message: e.target.value }))}
                      />
                    </div>

                    {/* Channel Selection */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">
                        Select Channels
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {availableChannels.map((channel) => {
                          const IconComponent = channel.icon;
                          const isSelected = newBroadcast.channels.includes(channel.id);
                          
                          return (
                            <div
                              key={channel.id}
                              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                isSelected 
                                  ? `${channel.bgColor} ${channel.borderColor} border-2` 
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                              onClick={() => handleChannelToggle(channel.id)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <IconComponent className={`w-5 h-5 ${isSelected ? channel.color : 'text-gray-500'}`} />
                                  <span className={`font-medium text-sm ${isSelected ? channel.color : 'text-gray-700'}`}>
                                    {channel.name}
                                  </span>
                                </div>
                                {isSelected && (
                                  <Check className="w-4 h-4 text-blue-600" />
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{channel.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  {channel.subscriberCount.toLocaleString()} subscribers
                                </span>
                                {isSelected && (
                                  <Badge variant="secondary" className="text-xs">
                                    Selected
                                  </Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {newBroadcast.channels.length > 0 && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-700">
                            <strong>Selected channels:</strong> {newBroadcast.channels.map(id => 
                              availableChannels.find(c => c.id === id)?.name
                            ).join(", ")}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Broadcast Type</label>
                        <Select 
                          value={newBroadcast.type} 
                          onValueChange={(value) => setNewBroadcast(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="IMMEDIATE">Send Now</SelectItem>
                            <SelectItem value="SCHEDULED">Schedule</SelectItem>
                            <SelectItem value="RECURRING">Recurring</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {newBroadcast.type === "SCHEDULED" && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Schedule Date & Time</label>
                          <Input
                            type="datetime-local"
                            value={newBroadcast.scheduledAt}
                            onChange={(e) => setNewBroadcast(prev => ({ ...prev, scheduledAt: e.target.value }))}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button 
                        onClick={handleSendBroadcast} 
                        className="flex-1"
                        disabled={newBroadcast.channels.length === 0}
                      >
                        <Send className="mr-2 w-4 h-4" />
                        {newBroadcast.type === "IMMEDIATE" ? "Send Now" : "Schedule Broadcast"}
                        {newBroadcast.channels.length > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            {newBroadcast.channels.length} channel{newBroadcast.channels.length > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </Button>
                      <Button variant="outline">
                        <Clock className="mr-2 w-4 h-4" />
                        Save as Draft
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                {/* Templates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Templates</CardTitle>
                    <CardDescription>Use pre-built message templates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {messageTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{template.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {template.content}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Segments */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Target Segments</CardTitle>
                    <CardDescription>Choose who receives this message</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {segments.map((segment) => (
                      <div
                        key={segment.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          newBroadcast.segment === segment.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setNewBroadcast(prev => ({ ...prev, segment: segment.id }))}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{segment.name}</h4>
                          <span className="text-xs text-gray-500">{segment.count} users</span>
                        </div>
                        <p className="text-xs text-gray-600">{segment.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Message Templates</CardTitle>
                    <CardDescription>Create and manage reusable message templates</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 w-4 h-4" />
                    New Template
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {messageTemplates.map((template) => (
                    <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <Badge variant="secondary" className="w-fit">
                          {template.category}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {template.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Segments Tab */}
          <TabsContent value="segments" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Segments</CardTitle>
                    <CardDescription>Create and manage user segments for targeted messaging</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 w-4 h-4" />
                    New Segment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {segments.map((segment) => (
                    <Card key={segment.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{segment.name}</CardTitle>
                          <Badge variant="outline">{segment.count} users</Badge>
                        </div>
                        <CardDescription>{segment.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Users className="mr-2 w-3 h-3" />
                            View Users
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Send className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Sent</p>
                      <p className="text-2xl font-bold text-gray-900">1,234</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Delivered</p>
                      <p className="text-2xl font-bold text-gray-900">1,187</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Eye className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Read</p>
                      <p className="text-2xl font-bold text-gray-900">956</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Failed</p>
                      <p className="text-2xl font-bold text-gray-900">47</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Broadcasts</CardTitle>
                <CardDescription>Track performance of your recent broadcast messages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">Welcome New Users - Batch #{i}</h4>
                        <p className="text-sm text-gray-600">Sent to Premium Users segment</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500">Sent 2 hours ago</span>
                          <Badge variant="outline">1,234 sent</Badge>
                          <Badge variant="outline">956 read</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="w-3 h-3" />
                        </Button>
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

export default BroadcastMessages;
