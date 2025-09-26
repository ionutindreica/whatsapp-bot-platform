import React, { useState, useEffect } from 'react';
import AdminPageLayout from '@/components/AdminPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Key, 
  Globe, 
  Activity, 
  Shield, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  RefreshCcw,
  Copy,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  BarChart3,
  Users,
  Bot,
  MessageSquare,
  DollarSign,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface APIKey {
  id: string;
  name: string;
  key: string;
  workspaceId?: string;
  workspaceName?: string;
  permissions: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'REVOKED';
  usage: {
    requestsToday: number;
    requestsLimit: number;
    lastUsed: string;
  };
  createdAt: string;
  expiresAt?: string;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  workspaceId: string;
  workspaceName: string;
  events: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  lastTriggered?: string;
  successRate: number;
  retryCount: number;
  createdAt: string;
}

interface RateLimit {
  endpoint: string;
  limit: number;
  window: string;
  current: number;
  resetAt: string;
}

const APIManagement: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [rateLimits, setRateLimits] = useState<RateLimit[]>([]);
  const [activeTab, setActiveTab] = useState<'keys' | 'webhooks' | 'limits'>('keys');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ACTIVE' | 'INACTIVE' | 'REVOKED'>('all');
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchAPIKeys();
    fetchWebhooks();
    fetchRateLimits();
  }, []);

  const fetchAPIKeys = async () => {
    // Mock data for API keys
    const mockKeys: APIKey[] = [
      {
        id: 'key-1',
        name: 'Alpha Corp Production',
        key: 'ak_live_***abc123def456',
        workspaceId: 'ws-1',
        workspaceName: 'Alpha Corp',
        permissions: ['read:bots', 'write:bots', 'read:messages', 'write:messages'],
        status: 'ACTIVE',
        usage: {
          requestsToday: 15420,
          requestsLimit: 100000,
          lastUsed: '2024-01-20T14:30:00Z'
        },
        createdAt: '2023-06-01T10:00:00Z',
        expiresAt: '2024-06-01T10:00:00Z'
      },
      {
        id: 'key-2',
        name: 'Beta Solutions Development',
        key: 'ak_test_***xyz789uvw012',
        workspaceId: 'ws-2',
        workspaceName: 'Beta Solutions',
        permissions: ['read:bots', 'read:messages'],
        status: 'ACTIVE',
        usage: {
          requestsToday: 8930,
          requestsLimit: 10000,
          lastUsed: '2024-01-20T13:45:00Z'
        },
        createdAt: '2023-08-15T09:30:00Z'
      },
      {
        id: 'key-3',
        name: 'Gamma Innovations API',
        key: 'ak_live_***mno345pqr678',
        workspaceId: 'ws-3',
        workspaceName: 'Gamma Innovations',
        permissions: ['read:bots', 'write:bots', 'read:messages', 'write:messages', 'admin:workspace'],
        status: 'REVOKED',
        usage: {
          requestsToday: 0,
          requestsLimit: 50000,
          lastUsed: '2024-01-18T16:20:00Z'
        },
        createdAt: '2023-09-10T14:15:00Z',
        expiresAt: '2024-09-10T14:15:00Z'
      }
    ];
    setApiKeys(mockKeys);
  };

  const fetchWebhooks = async () => {
    // Mock data for webhooks
    const mockWebhooks: Webhook[] = [
      {
        id: 'webhook-1',
        name: 'Alpha Corp Message Handler',
        url: 'https://api.alphacorp.com/webhook/messages',
        workspaceId: 'ws-1',
        workspaceName: 'Alpha Corp',
        events: ['message.received', 'message.sent', 'bot.status_changed'],
        status: 'ACTIVE',
        lastTriggered: '2024-01-20T14:30:00Z',
        successRate: 98.5,
        retryCount: 3,
        createdAt: '2023-06-01T10:00:00Z'
      },
      {
        id: 'webhook-2',
        name: 'Beta Solutions Analytics',
        url: 'https://analytics.betasolutions.com/webhook',
        workspaceId: 'ws-2',
        workspaceName: 'Beta Solutions',
        events: ['user.created', 'bot.created', 'message.received'],
        status: 'ACTIVE',
        lastTriggered: '2024-01-20T13:45:00Z',
        successRate: 99.2,
        retryCount: 1,
        createdAt: '2023-08-15T09:30:00Z'
      },
      {
        id: 'webhook-3',
        name: 'Gamma Innovations Error Handler',
        url: 'https://errors.gammainnovations.com/webhook',
        workspaceId: 'ws-3',
        workspaceName: 'Gamma Innovations',
        events: ['error.occurred', 'bot.error'],
        status: 'ERROR',
        lastTriggered: '2024-01-19T16:20:00Z',
        successRate: 45.2,
        retryCount: 10,
        createdAt: '2023-09-10T14:15:00Z'
      }
    ];
    setWebhooks(mockWebhooks);
  };

  const fetchRateLimits = async () => {
    // Mock data for rate limits
    const mockLimits: RateLimit[] = [
      {
        endpoint: '/api/v1/messages/send',
        limit: 1000,
        window: '1 hour',
        current: 234,
        resetAt: '2024-01-20T15:00:00Z'
      },
      {
        endpoint: '/api/v1/bots/create',
        limit: 10,
        window: '1 hour',
        current: 2,
        resetAt: '2024-01-20T15:00:00Z'
      },
      {
        endpoint: '/api/v1/webhooks/trigger',
        limit: 500,
        window: '1 hour',
        current: 456,
        resetAt: '2024-01-20T15:00:00Z'
      }
    ];
    setRateLimits(mockLimits);
  };

  const filteredKeys = apiKeys.filter(key => {
    const matchesSearch = key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         key.workspaceName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || key.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleKeyAction = (keyId: string, action: string) => {
    console.log(`API Key ${keyId} - Action: ${action}`);
    toast({
      title: "Action Successful",
      description: `API Key ${action.toLowerCase()}d. (Mock action)`,
    });
    fetchAPIKeys();
  };

  const handleWebhookAction = (webhookId: string, action: string) => {
    console.log(`Webhook ${webhookId} - Action: ${action}`);
    toast({
      title: "Action Successful",
      description: `Webhook ${action.toLowerCase()}d. (Mock action)`,
    });
    fetchWebhooks();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'outline';
      case 'REVOKED': return 'destructive';
      case 'ERROR': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="h-4 w-4" />;
      case 'INACTIVE': return <Clock className="h-4 w-4" />;
      case 'REVOKED': return <AlertTriangle className="h-4 w-4" />;
      case 'ERROR': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const createNewKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a key name",
        variant: "destructive",
      });
      return;
    }

    const newKey: APIKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      key: `ak_live_***${Math.random().toString(36).substr(2, 9)}`,
      permissions: newKeyPermissions,
      status: 'ACTIVE',
      usage: {
        requestsToday: 0,
        requestsLimit: 10000,
        lastUsed: new Date().toISOString()
      },
      createdAt: new Date().toISOString()
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName('');
    setNewKeyPermissions([]);
    setIsCreatingKey(false);
    
    toast({
      title: "API Key Created",
      description: `New API key "${newKeyName}" has been created.`,
    });
  };

  return (
    <AdminPageLayout 
      title="API Management"
      description="Manage API keys, webhooks, and integrations"
    >
      <div className="space-y-6">

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('keys')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'keys' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            API Keys ({apiKeys.length})
          </button>
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'webhooks' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Webhooks ({webhooks.length})
          </button>
          <button
            onClick={() => setActiveTab('limits')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'limits' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Rate Limits
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total API Keys</p>
                  <p className="text-2xl font-bold">{apiKeys.length}</p>
                </div>
                <Key className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Keys</p>
                  <p className="text-2xl font-bold text-green-600">{apiKeys.filter(k => k.status === 'ACTIVE').length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Webhooks</p>
                  <p className="text-2xl font-bold text-blue-600">{webhooks.length}</p>
                </div>
                <Globe className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold">{apiKeys.reduce((sum, key) => sum + key.usage.requestsToday, 0).toLocaleString()}</p>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search API keys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="REVOKED">Revoked</option>
              </select>
              <Button variant="outline" onClick={fetchAPIKeys}>
                <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {activeTab === 'keys' && (
          <div className="space-y-6">
            {/* Create New Key */}
            {isCreatingKey && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New API Key</CardTitle>
                  <CardDescription>Generate a new API key for workspace access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="keyName">Key Name</Label>
                    <Input
                      id="keyName"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="Enter a descriptive name for this API key"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button onClick={createNewKey}>
                      <Plus className="h-4 w-4 mr-2" /> Create Key
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreatingKey(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {!isCreatingKey && (
              <div className="flex justify-end">
                <Button onClick={() => setIsCreatingKey(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Create New API Key
                </Button>
              </div>
            )}

            {/* API Keys Table */}
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage and monitor all API keys</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Workspace</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKeys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell className="font-medium">{key.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <code className="text-sm bg-muted px-2 py-1 rounded">{key.key}</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(key.key)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{key.workspaceName || 'Global'}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {key.permissions.slice(0, 2).map((perm, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {perm}
                              </Badge>
                            ))}
                            {key.permissions.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{key.permissions.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(key.status)} className="flex items-center space-x-1 w-fit">
                            {getStatusIcon(key.status)}
                            <span>{key.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-semibold">{key.usage.requestsToday.toLocaleString()}</div>
                            <div className="text-muted-foreground">of {key.usage.requestsLimit.toLocaleString()}</div>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(key.usage.lastUsed).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleKeyAction(key.id, 'View')}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleKeyAction(key.id, 'Edit')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            {key.status === 'ACTIVE' ? (
                              <Button variant="ghost" size="sm" onClick={() => handleKeyAction(key.id, 'Revoke')}>
                                <Shield className="h-4 w-4 text-red-600" />
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm" onClick={() => handleKeyAction(key.id, 'Reactivate')}>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'webhooks' && (
          <Card>
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
              <CardDescription>Manage webhook endpoints and configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Workspace</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Last Triggered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhooks.map((webhook) => (
                    <TableRow key={webhook.id}>
                      <TableCell className="font-medium">{webhook.name}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded break-all">{webhook.url}</code>
                      </TableCell>
                      <TableCell>{webhook.workspaceName}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {webhook.events.slice(0, 2).map((event, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                          {webhook.events.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{webhook.events.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(webhook.status)} className="flex items-center space-x-1 w-fit">
                          {getStatusIcon(webhook.status)}
                          <span>{webhook.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className={`font-semibold ${webhook.successRate >= 95 ? 'text-green-600' : webhook.successRate >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {webhook.successRate}%
                          </span>
                          {webhook.retryCount > 0 && (
                            <span className="text-xs text-muted-foreground">({webhook.retryCount} retries)</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{webhook.lastTriggered ? new Date(webhook.lastTriggered).toLocaleDateString() : 'Never'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleWebhookAction(webhook.id, 'View')}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleWebhookAction(webhook.id, 'Edit')}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleWebhookAction(webhook.id, 'Test')}>
                            <Zap className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleWebhookAction(webhook.id, 'Delete')}>
                            <Trash2 className="h-4 w-4 text-red-600" />
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

        {activeTab === 'limits' && (
          <Card>
            <CardHeader>
              <CardTitle>Rate Limits</CardTitle>
              <CardDescription>Monitor current API rate limit usage</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Limit</TableHead>
                    <TableHead>Window</TableHead>
                    <TableHead>Current Usage</TableHead>
                    <TableHead>Usage %</TableHead>
                    <TableHead>Reset At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rateLimits.map((limit, index) => {
                    const usagePercent = (limit.current / limit.limit) * 100;
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <code className="text-sm bg-muted px-2 py-1 rounded">{limit.endpoint}</code>
                        </TableCell>
                        <TableCell>{limit.limit.toLocaleString()}</TableCell>
                        <TableCell>{limit.window}</TableCell>
                        <TableCell>{limit.current.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${usagePercent >= 90 ? 'bg-red-500' : usagePercent >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${Math.min(usagePercent, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{usagePercent.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(limit.resetAt).toLocaleString()}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminPageLayout>
  );
};

export default APIManagement;
