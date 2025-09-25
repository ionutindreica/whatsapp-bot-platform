import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Facebook, 
  MessageSquare, 
  Settings, 
  Play, 
  Pause, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Copy,
  Download,
  Upload,
  Zap,
  Users,
  BarChart3,
  Globe,
  Link,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import AdminPageLayout from '@/components/AdminPageLayout';

const MessengerChannel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isConnected, setIsConnected] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  return (
    <AdminPageLayout 
      title="Facebook Messenger"
      description="Connect and manage your Facebook Messenger integration"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="flows">Flows</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Connection Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Facebook className="w-8 h-8 text-blue-500" />
                  <div>
                    <CardTitle>Facebook Messenger Integration</CardTitle>
                    <CardDescription>Connect your Facebook Page to start receiving messages</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {isConnected ? (
                    <>
                      <Badge variant="default" className="bg-green-500">Connected</Badge>
                      <Button variant="outline" onClick={handleDisconnect}>
                        <Pause className="w-4 h-4 mr-2" />
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleConnect}>
                      <Play className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <MessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Messages Today</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Zap className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Flows Active</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Latest conversations from Facebook Messenger</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No messages yet</p>
                <p className="text-sm text-gray-400">Connect your Facebook Page to start receiving messages</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup" className="space-y-6">
          {/* Facebook Page Setup */}
          <Card>
            <CardHeader>
              <CardTitle>Facebook Page Setup</CardTitle>
              <CardDescription>
                Connect your Facebook Page to start receiving messages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="page-id">Facebook Page ID</Label>
                    <Input 
                      id="page-id" 
                      placeholder="Enter your Facebook Page ID"
                      className="mt-1"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Find your Page ID in your Facebook Page settings
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="access-token">Page Access Token</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input 
                        id="access-token" 
                        type={showWebhookSecret ? "text" : "password"}
                        placeholder="Enter your Page Access Token"
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                      >
                        {showWebhookSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Generate a Page Access Token in Facebook Developer Console
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input 
                        id="webhook-url" 
                        value="https://your-domain.com/webhook/messenger"
                        readOnly
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add this URL to your Facebook App webhook settings
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="verify-token">Verify Token</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input 
                        id="verify-token" 
                        value="your-verify-token-here"
                        readOnly
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Use this token to verify your webhook
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Test Connection
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download Setup Guide
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Setup Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
              <CardDescription>
                Follow these steps to connect your Facebook Page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
                  <div>
                    <h4 className="font-medium">Create Facebook App</h4>
                    <p className="text-sm text-muted-foreground">
                      Go to Facebook Developer Console and create a new app
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
                  <div>
                    <h4 className="font-medium">Add Messenger Product</h4>
                    <p className="text-sm text-muted-foreground">
                      Add the Messenger product to your Facebook App
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
                  <div>
                    <h4 className="font-medium">Configure Webhook</h4>
                    <p className="text-sm text-muted-foreground">
                      Add the webhook URL and verify token to your app
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">4</div>
                  <div>
                    <h4 className="font-medium">Generate Access Token</h4>
                    <p className="text-sm text-muted-foreground">
                      Generate a Page Access Token for your Facebook Page
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flows" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Messenger Flows</CardTitle>
                  <CardDescription>Create automated conversation flows for Messenger</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Flow
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No flows created yet</p>
                <p className="text-sm text-gray-400">Create your first Messenger flow to get started</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Messenger Analytics</CardTitle>
              <CardDescription>Track performance of your Messenger integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Total Messages</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Unique Users</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">0%</div>
                  <div className="text-sm text-muted-foreground">Response Rate</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">0s</div>
                  <div className="text-sm text-muted-foreground">Avg Response Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Messenger Settings</CardTitle>
              <CardDescription>Configure your Messenger integration settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="welcome-message">Welcome Message</Label>
                    <Textarea 
                      id="welcome-message" 
                      placeholder="Enter your welcome message"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="auto-reply">Auto Reply</Label>
                    <Textarea 
                      id="auto-reply" 
                      placeholder="Enter your auto reply message"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="business-hours">Business Hours</Label>
                    <Input 
                      id="business-hours" 
                      placeholder="e.g., Mon-Fri 9AM-5PM"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input 
                      id="timezone" 
                      placeholder="e.g., UTC+2"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button>
                  <Settings className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminPageLayout>
  );
};

export default MessengerChannel;
