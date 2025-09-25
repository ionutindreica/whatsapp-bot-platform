import React, { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Search, 
  Filter, 
  MoreHorizontal,
  User,
  Bot,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Phone,
  Mail,
  Globe,
  Smartphone
} from "lucide-react";

const Conversations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  
  const handleNewConversation = () => {
    console.log("Creating new conversation...");
    // Navigate to new conversation page
    window.location.href = '/conversations?new=true';
  };

  const handleFilters = () => {
    console.log("Opening filters...");
    // Toggle filters sidebar or open filters modal
    const filtersPanel = document.getElementById('filters-panel');
    if (filtersPanel) {
      filtersPanel.style.display = filtersPanel.style.display === 'none' ? 'block' : 'none';
    }
  };

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversation(conversationId);
    console.log(`Selected conversation: ${conversationId}`);
    // Navigate to conversation details
    window.location.href = `/conversations/${conversationId}`;
  };
  
  const conversations = [
    {
      id: "1",
      user: "John Doe",
      userInfo: "+1 234 567 8900",
      channel: "WhatsApp",
      status: "active",
      lastMessage: "Thank you for your help!",
      lastActivity: "2 minutes ago",
      messageCount: 15,
      duration: "5 minutes",
      bot: "Customer Support Bot"
    },
    {
      id: "2",
      user: "Jane Smith",
      userInfo: "jane@example.com",
      channel: "Email",
      status: "pending",
      lastMessage: "I need help with my order",
      lastActivity: "15 minutes ago",
      messageCount: 8,
      duration: "3 minutes",
      bot: "Sales Assistant"
    },
    {
      id: "3",
      user: "Mike Johnson",
      userInfo: "Website Chat",
      channel: "Website",
      status: "resolved",
      lastMessage: "Perfect, that solved my issue",
      lastActivity: "1 hour ago",
      messageCount: 12,
      duration: "8 minutes",
      bot: "Customer Support Bot"
    },
    {
      id: "4",
      user: "Sarah Wilson",
      userInfo: "+1 987 654 3210",
      channel: "WhatsApp",
      status: "active",
      lastMessage: "What are your business hours?",
      lastActivity: "30 minutes ago",
      messageCount: 6,
      duration: "2 minutes",
      bot: "Sales Assistant"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case "closed":
        return <XCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "WhatsApp":
        return <Phone className="w-4 h-4 text-green-600" />;
      case "Email":
        return <Mail className="w-4 h-4 text-blue-600" />;
      case "Website":
        return <Globe className="w-4 h-4 text-purple-600" />;
      case "Mobile":
        return <Smartphone className="w-4 h-4 text-orange-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.userInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back to Dashboard */}
        <BackToDashboard title="Back to Dashboard" />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <MessageSquare className="w-8 h-8 text-whatsapp" />
              Conversations
            </h1>
            <p className="text-muted-foreground">Manage and monitor your bot conversations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleFilters}>
              <Filter className="mr-2 w-4 h-4" />
              Filters
            </Button>
            <Button className="bg-whatsapp hover:bg-whatsapp/90" onClick={handleNewConversation}>
              <MessageSquare className="mr-2 w-4 h-4" />
              New Conversation
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Conversations</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          {/* Search Bar */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Conversations List */}
          <TabsContent value="all" className="space-y-4">
            <div className="space-y-4">
              {filteredConversations.map((conversation) => (
                <Card 
                  key={conversation.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleConversationClick(conversation.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-whatsapp/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-whatsapp" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{conversation.user}</h4>
                            <Badge className={getStatusColor(conversation.status)}>
                              {conversation.status}
                            </Badge>
                            {getStatusIcon(conversation.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{conversation.userInfo}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              {getChannelIcon(conversation.channel)}
                              <span>{conversation.channel}</span>
                            </div>
                            <span>•</span>
                            <span>{conversation.bot}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-1">
                          {conversation.lastActivity}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{conversation.messageCount} messages</span>
                          <span>•</span>
                          <span>{conversation.duration}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="space-y-4">
              {filteredConversations.filter(conv => conv.status === 'active').map((conversation) => (
                <Card key={conversation.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-whatsapp/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-whatsapp" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{conversation.user}</h4>
                            <Badge className={getStatusColor(conversation.status)}>
                              {conversation.status}
                            </Badge>
                            {getStatusIcon(conversation.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{conversation.userInfo}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              {getChannelIcon(conversation.channel)}
                              <span>{conversation.channel}</span>
                            </div>
                            <span>•</span>
                            <span>{conversation.bot}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-1">
                          {conversation.lastActivity}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{conversation.messageCount} messages</span>
                          <span>•</span>
                          <span>{conversation.duration}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="space-y-4">
              {filteredConversations.filter(conv => conv.status === 'pending').map((conversation) => (
                <Card key={conversation.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-whatsapp/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-whatsapp" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{conversation.user}</h4>
                            <Badge className={getStatusColor(conversation.status)}>
                              {conversation.status}
                            </Badge>
                            {getStatusIcon(conversation.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{conversation.userInfo}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              {getChannelIcon(conversation.channel)}
                              <span>{conversation.channel}</span>
                            </div>
                            <span>•</span>
                            <span>{conversation.bot}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-1">
                          {conversation.lastActivity}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{conversation.messageCount} messages</span>
                          <span>•</span>
                          <span>{conversation.duration}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resolved" className="space-y-4">
            <div className="space-y-4">
              {filteredConversations.filter(conv => conv.status === 'resolved').map((conversation) => (
                <Card key={conversation.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-whatsapp/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-whatsapp" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{conversation.user}</h4>
                            <Badge className={getStatusColor(conversation.status)}>
                              {conversation.status}
                            </Badge>
                            {getStatusIcon(conversation.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{conversation.userInfo}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              {getChannelIcon(conversation.channel)}
                              <span>{conversation.channel}</span>
                            </div>
                            <span>•</span>
                            <span>{conversation.bot}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-1">
                          {conversation.lastActivity}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{conversation.messageCount} messages</span>
                          <span>•</span>
                          <span>{conversation.duration}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Conversations;
