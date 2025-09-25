import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  MessageSquare, 
  Phone, 
  Mail,
  Star,
  Tag,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  User,
  Users,
  Archive,
  Trash2,
  Reply,
  Forward,
  UserCheck,
  Plus,
  MessageCircle,
  Facebook,
  Instagram,
  Globe,
  Send,
  Paperclip,
  Smile,
  Send as SendIcon,
  Bot,
  UserCheck as UserCheckIcon
} from 'lucide-react';
import AdminPageLayout from '@/components/AdminPageLayout';

interface Conversation {
  id: string;
  platform: 'whatsapp' | 'messenger' | 'instagram' | 'website' | 'telegram';
  user: {
    id: string;
    name: string;
    avatar?: string;
    email?: string;
    phone?: string;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    isFromUser: boolean;
  };
  status: 'unread' | 'read' | 'assigned' | 'closed';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  assignedTo?: string;
  unreadCount: number;
}

const UnifiedInbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const conversations: Conversation[] = [
    {
      id: '1',
      platform: 'whatsapp',
      user: {
        id: '1',
        name: 'John Doe',
        phone: '+1234567890'
      },
      lastMessage: {
        text: 'Hi, I need help with my order #12345',
        timestamp: '2 min ago',
        isFromUser: true
      },
      status: 'unread',
      priority: 'high',
      tags: ['order', 'support'],
      unreadCount: 2
    },
    {
      id: '2',
      platform: 'messenger',
      user: {
        id: '2',
        name: 'Sarah Wilson',
        email: 'sarah@example.com'
      },
      lastMessage: {
        text: 'Thank you for the quick response!',
        timestamp: '5 min ago',
        isFromUser: false
      },
      status: 'read',
      priority: 'medium',
      tags: ['feedback'],
      unreadCount: 0
    },
    {
      id: '3',
      platform: 'instagram',
      user: {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@example.com'
      },
      lastMessage: {
        text: 'When will my product be delivered?',
        timestamp: '10 min ago',
        isFromUser: true
      },
      status: 'assigned',
      priority: 'high',
      tags: ['delivery', 'urgent'],
      assignedTo: 'agent1',
      unreadCount: 1
    },
    {
      id: '4',
      platform: 'website',
      user: {
        id: '4',
        name: 'Emma Davis',
        email: 'emma@example.com'
      },
      lastMessage: {
        text: 'I would like to know more about your pricing',
        timestamp: '15 min ago',
        isFromUser: true
      },
      status: 'unread',
      priority: 'low',
      tags: ['pricing', 'sales'],
      unreadCount: 1
    },
    {
      id: '5',
      platform: 'telegram',
      user: {
        id: '5',
        name: 'Alex Brown',
        email: 'alex@example.com'
      },
      lastMessage: {
        text: 'Perfect, I will proceed with the purchase',
        timestamp: '1 hour ago',
        isFromUser: false
      },
      status: 'closed',
      priority: 'low',
      tags: ['sales', 'closed'],
      unreadCount: 0
    }
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4 text-green-500" />;
      case 'messenger':
        return <Facebook className="w-4 h-4 text-blue-500" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'website':
        return <Globe className="w-4 h-4 text-purple-500" />;
      case 'telegram':
        return <Send className="w-4 h-4 text-blue-400" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'read':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'assigned':
        return <UserCheckIcon className="w-4 h-4 text-blue-500" />;
      case 'closed':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <Badge variant="destructive">Unread</Badge>;
      case 'read':
        return <Badge variant="secondary">Read</Badge>;
      case 'assigned':
        return <Badge variant="default" className="bg-blue-500">Assigned</Badge>;
      case 'closed':
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'unread') return matchesSearch && conv.status === 'unread';
    if (activeTab === 'assigned') return matchesSearch && conv.status === 'assigned';
    if (activeTab === 'closed') return matchesSearch && conv.status === 'closed';
    
    return matchesSearch;
  });

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);

  return (
    <AdminPageLayout 
      title="Unified Inbox"
      description="Manage conversations across all platforms from one place"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <Button size="sm" variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 mx-4 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="assigned">Assigned</TabsTrigger>
                  <TabsTrigger value="closed">Closed</TabsTrigger>
                </TabsList>
                
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={conversation.user.avatar} />
                            <AvatarFallback>
                              {conversation.user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">{conversation.user.name}</span>
                              {getPlatformIcon(conversation.platform)}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              {getStatusIcon(conversation.status)}
                              {getPriorityBadge(conversation.priority)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {conversation.lastMessage.text}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {conversation.lastMessage.timestamp}
                        </span>
                        <div className="flex space-x-1">
                          {conversation.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          {selectedConv ? (
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedConv.user.avatar} />
                      <AvatarFallback>
                        {selectedConv.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{selectedConv.user.name}</h3>
                        {getPlatformIcon(selectedConv.platform)}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(selectedConv.status)}
                        {getPriorityBadge(selectedConv.priority)}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Tag className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <UserCheck className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Archive className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages Area */}
                <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
                  {/* Sample messages */}
                  <div className="flex justify-end">
                    <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                      <p className="text-sm">Hi, I need help with my order #12345</p>
                      <p className="text-xs opacity-75 mt-1">2 min ago</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg max-w-xs">
                      <div className="flex items-center space-x-2 mb-1">
                        <Bot className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium">AI Assistant</span>
                      </div>
                      <p className="text-sm">Hello! I'd be happy to help you with your order. Let me look up order #12345 for you.</p>
                      <p className="text-xs text-gray-500 mt-1">1 min ago</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                      <p className="text-sm">It was supposed to arrive yesterday but I haven't received it yet.</p>
                      <p className="text-xs opacity-75 mt-1">Just now</p>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="pr-20"
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                        <Button size="sm" variant="ghost">
                          <Smile className="w-4 h-4" />
                        </Button>
                        <Button size="sm">
                          <SendIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                <p className="text-gray-500">Choose a conversation from the list to start chatting</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default UnifiedInbox;
