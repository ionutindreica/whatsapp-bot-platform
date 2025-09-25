import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  MessageCircle, 
  Instagram, 
  Globe, 
  Users, 
  Activity, 
  Settings, 
  Play, 
  Pause, 
  Trash2, 
  Edit, 
  Eye, 
  RefreshCcw,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  BarChart3,
  Search
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Bot {
  id: string;
  name: string;
  platform: 'WHATSAPP' | 'MESSENGER' | 'INSTAGRAM' | 'WEBSITE';
  workspaceId: string;
  workspaceName: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'PAUSED';
  lastActivity: string;
  totalConversations: number;
  activeConversations: number;
  messagesToday: number;
  createdAt: string;
  owner: {
    name: string;
    email: string;
  };
}

interface Channel {
  id: string;
  name: string;
  platform: 'WHATSAPP' | 'MESSENGER' | 'INSTAGRAM' | 'WEBSITE';
  workspaceId: string;
  workspaceName: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'PENDING';
  connectionDate: string;
  lastSync: string;
  messageCount: number;
  webhookUrl?: string;
  apiKey?: string;
  settings: {
    autoReply: boolean;
    workingHours: boolean;
    language: string;
  };
}

const BotsChannels: React.FC = () => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeTab, setActiveTab] = useState<'bots' | 'channels'>('bots');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<'all' | 'WHATSAPP' | 'MESSENGER' | 'INSTAGRAM' | 'WEBSITE'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'PAUSED'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchBots();
    fetchChannels();
  }, []);

  const fetchBots = async () => {
    // Mock data for bots
    const mockBots: Bot[] = [
      {
        id: 'bot-1',
        name: 'Alpha Customer Support',
        platform: 'WHATSAPP',
        workspaceId: 'ws-1',
        workspaceName: 'Alpha Corp',
        status: 'ACTIVE',
        lastActivity: '2024-01-20T14:30:00Z',
        totalConversations: 1250,
        activeConversations: 45,
        messagesToday: 320,
        createdAt: '2023-06-01T10:00:00Z',
        owner: { name: 'John Smith', email: 'john@alphacorp.com' }
      },
      {
        id: 'bot-2',
        name: 'Beta Sales Bot',
        platform: 'MESSENGER',
        workspaceId: 'ws-2',
        workspaceName: 'Beta Solutions',
        status: 'ACTIVE',
        lastActivity: '2024-01-20T13:45:00Z',
        totalConversations: 890,
        activeConversations: 23,
        messagesToday: 180,
        createdAt: '2023-08-15T09:30:00Z',
        owner: { name: 'Sarah Johnson', email: 'sarah@betasolutions.com' }
      },
      {
        id: 'bot-3',
        name: 'Gamma Marketing Assistant',
        platform: 'INSTAGRAM',
        workspaceId: 'ws-3',
        workspaceName: 'Gamma Innovations',
        status: 'ERROR',
        lastActivity: '2024-01-19T16:20:00Z',
        totalConversations: 450,
        activeConversations: 0,
        messagesToday: 0,
        createdAt: '2023-09-10T14:15:00Z',
        owner: { name: 'Mike Chen', email: 'mike@gammainnovations.com' }
      },
      {
        id: 'bot-4',
        name: 'Delta Website Chat',
        platform: 'WEBSITE',
        workspaceId: 'ws-4',
        workspaceName: 'Delta Marketing',
        status: 'PAUSED',
        lastActivity: '2024-01-18T11:00:00Z',
        totalConversations: 2100,
        activeConversations: 0,
        messagesToday: 0,
        createdAt: '2023-07-20T08:45:00Z',
        owner: { name: 'Lisa Brown', email: 'lisa@deltamarketing.com' }
      }
    ];
    setBots(mockBots);
  };

  const fetchChannels = async () => {
    // Mock data for channels
    const mockChannels: Channel[] = [
      {
        id: 'channel-1',
        name: 'Alpha WhatsApp Business',
        platform: 'WHATSAPP',
        workspaceId: 'ws-1',
        workspaceName: 'Alpha Corp',
        status: 'CONNECTED',
        connectionDate: '2023-06-01T10:00:00Z',
        lastSync: '2024-01-20T14:30:00Z',
        messageCount: 15420,
        webhookUrl: 'https://api.alphacorp.com/webhook/whatsapp',
        apiKey: 'wa_***abc123',
        settings: {
          autoReply: true,
          workingHours: true,
          language: 'en'
        }
      },
      {
        id: 'channel-2',
        name: 'Beta Facebook Page',
        platform: 'MESSENGER',
        workspaceId: 'ws-2',
        workspaceName: 'Beta Solutions',
        status: 'CONNECTED',
        connectionDate: '2023-08-15T09:30:00Z',
        lastSync: '2024-01-20T13:45:00Z',
        messageCount: 8930,
        webhookUrl: 'https://api.betasolutions.com/webhook/messenger',
        apiKey: 'fb_***def456',
        settings: {
          autoReply: false,
          workingHours: false,
          language: 'en'
        }
      },
      {
        id: 'channel-3',
        name: 'Gamma Instagram Business',
        platform: 'INSTAGRAM',
        workspaceId: 'ws-3',
        workspaceName: 'Gamma Innovations',
        status: 'ERROR',
        connectionDate: '2023-09-10T14:15:00Z',
        lastSync: '2024-01-19T16:20:00Z',
        messageCount: 2340,
        settings: {
          autoReply: true,
          workingHours: true,
          language: 'en'
        }
      },
      {
        id: 'channel-4',
        name: 'Delta Website Widget',
        platform: 'WEBSITE',
        workspaceId: 'ws-4',
        workspaceName: 'Delta Marketing',
        status: 'DISCONNECTED',
        connectionDate: '2023-07-20T08:45:00Z',
        lastSync: '2024-01-18T11:00:00Z',
        messageCount: 15670,
        webhookUrl: 'https://api.deltamarketing.com/webhook/website',
        settings: {
          autoReply: true,
          workingHours: false,
          language: 'en'
        }
      }
    ];
    setChannels(mockChannels);
  };

  const filteredBots = bots.filter(bot => {
    const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bot.workspaceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === 'all' || bot.platform === filterPlatform;
    const matchesStatus = filterStatus === 'all' || bot.status === filterStatus;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         channel.workspaceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === 'all' || channel.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

  const handleBotAction = (botId: string, action: string) => {
    console.log(`Bot ${botId} - Action: ${action}`);
    toast({
      title: "Action Successful",
      description: `Bot ${action.toLowerCase()}d. (Mock action)`,
    });
    fetchBots();
  };

  const handleChannelAction = (channelId: string, action: string) => {
    console.log(`Channel ${channelId} - Action: ${action}`);
    toast({
      title: "Action Successful",
      description: `Channel ${action.toLowerCase()}d. (Mock action)`,
    });
    fetchChannels();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'CONNECTED': return 'success';
      case 'INACTIVE':
      case 'DISCONNECTED': return 'outline';
      case 'ERROR': return 'destructive';
      case 'PAUSED':
      case 'PENDING': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'CONNECTED': return <CheckCircle className="h-4 w-4" />;
      case 'INACTIVE':
      case 'DISCONNECTED': return <Clock className="h-4 w-4" />;
      case 'ERROR': return <AlertTriangle className="h-4 w-4" />;
      case 'PAUSED':
      case 'PENDING': return <Pause className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'WHATSAPP': return <MessageCircle className="h-5 w-5 text-green-500" />;
      case 'MESSENGER': return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'INSTAGRAM': return <Instagram className="h-5 w-5 text-pink-500" />;
      case 'WEBSITE': return <Globe className="h-5 w-5 text-gray-500" />;
      default: return <Bot className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Bot className="w-7 h-7 mr-3" /> Bots & Channels
        </h1>
        <p className="text-muted-foreground">Monitor and manage all bots and channels across the platform.</p>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('bots')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'bots' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Bots ({bots.length})
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'channels' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Channels ({channels.length})
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bots</p>
                  <p className="text-2xl font-bold">{bots.length}</p>
                </div>
                <Bot className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Bots</p>
                  <p className="text-2xl font-bold text-green-600">{bots.filter(b => b.status === 'ACTIVE').length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Connected Channels</p>
                  <p className="text-2xl font-bold text-blue-600">{channels.filter(c => c.status === 'CONNECTED').length}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Error States</p>
                  <p className="text-2xl font-bold text-red-600">{bots.filter(b => b.status === 'ERROR').length + channels.filter(c => c.status === 'ERROR').length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search bots and channels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <select
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value as any)}
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
              >
                <option value="all">All Platforms</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="MESSENGER">Messenger</option>
                <option value="INSTAGRAM">Instagram</option>
                <option value="WEBSITE">Website</option>
              </select>
              {activeTab === 'bots' && (
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="ERROR">Error</option>
                  <option value="PAUSED">Paused</option>
                </select>
              )}
              <Button variant="outline" onClick={activeTab === 'bots' ? fetchBots : fetchChannels}>
                <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {activeTab === 'bots' && (
          <Card>
            <CardHeader>
              <CardTitle>All Bots</CardTitle>
              <CardDescription>Monitor bot performance and manage bot settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bot Name</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Workspace</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Conversations</TableHead>
                    <TableHead>Messages Today</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBots.map((bot) => (
                    <TableRow key={bot.id}>
                      <TableCell className="font-medium">{bot.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getPlatformIcon(bot.platform)}
                          <span>{bot.platform}</span>
                        </div>
                      </TableCell>
                      <TableCell>{bot.workspaceName}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(bot.status)} className="flex items-center space-x-1 w-fit">
                          {getStatusIcon(bot.status)}
                          <span>{bot.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-semibold">{bot.activeConversations} active</div>
                          <div className="text-muted-foreground">{bot.totalConversations} total</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span>{bot.messagesToday}</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(bot.lastActivity).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleBotAction(bot.id, 'View')}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleBotAction(bot.id, 'Edit')}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {bot.status === 'ACTIVE' ? (
                            <Button variant="ghost" size="sm" onClick={() => handleBotAction(bot.id, 'Pause')}>
                              <Pause className="h-4 w-4 text-yellow-600" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => handleBotAction(bot.id, 'Start')}>
                              <Play className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleBotAction(bot.id, 'Settings')}>
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'channels' && (
          <Card>
            <CardHeader>
              <CardTitle>All Channels</CardTitle>
              <CardDescription>Monitor channel connections and manage integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Channel Name</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Workspace</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Messages</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Settings</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredChannels.map((channel) => (
                    <TableRow key={channel.id}>
                      <TableCell className="font-medium">{channel.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getPlatformIcon(channel.platform)}
                          <span>{channel.platform}</span>
                        </div>
                      </TableCell>
                      <TableCell>{channel.workspaceName}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(channel.status)} className="flex items-center space-x-1 w-fit">
                          {getStatusIcon(channel.status)}
                          <span>{channel.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4 text-blue-500" />
                          <span>{channel.messageCount.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(channel.lastSync).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${channel.settings.autoReply ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <span>Auto Reply</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${channel.settings.workingHours ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <span>Working Hours</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleChannelAction(channel.id, 'View')}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleChannelAction(channel.id, 'Edit')}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {channel.status === 'CONNECTED' ? (
                            <Button variant="ghost" size="sm" onClick={() => handleChannelAction(channel.id, 'Disconnect')}>
                              <Pause className="h-4 w-4 text-red-600" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={() => handleChannelAction(channel.id, 'Connect')}>
                              <Play className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleChannelAction(channel.id, 'Settings')}>
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default BotsChannels;
