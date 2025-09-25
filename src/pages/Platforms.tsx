import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Facebook, 
  Instagram, 
  Globe, 
  Send, 
  Mail, 
  MessageSquare,
  Settings,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Zap,
  Shield,
  BarChart3
} from 'lucide-react';
import { PLATFORM_CONFIGS, Platform, PlatformConfig } from '@/types/platforms';
import AdminPageLayout from '@/components/AdminPageLayout';

const Platforms: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [platforms, setPlatforms] = useState<Record<Platform, PlatformConfig>>(PLATFORM_CONFIGS);

  const getPlatformIcon = (platform: Platform) => {
    const iconProps = { className: "w-8 h-8" };
    
    switch (platform) {
      case 'whatsapp':
        return <MessageCircle {...iconProps} style={{ color: '#25D366' }} />;
      case 'messenger':
        return <Facebook {...iconProps} style={{ color: '#0084FF' }} />;
      case 'instagram':
        return <Instagram {...iconProps} style={{ color: '#E4405F' }} />;
      case 'website':
        return <Globe {...iconProps} style={{ color: '#4F46E5' }} />;
      case 'telegram':
        return <Send {...iconProps} style={{ color: '#0088CC' }} />;
      case 'email':
        return <Mail {...iconProps} style={{ color: '#EA4335' }} />;
      case 'sms':
        return <MessageSquare {...iconProps} style={{ color: '#FF6B35' }} />;
      default:
        return <Globe {...iconProps} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'disconnected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'connecting':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-500">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="destructive">Disconnected</Badge>;
      case 'connecting':
        return <Badge variant="secondary" className="bg-yellow-500">Connecting</Badge>;
      default:
        return <Badge variant="outline">Inactive</Badge>;
    }
  };

  const handleConnectPlatform = (platform: Platform) => {
    setPlatforms(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        status: 'connecting'
      }
    }));

    // Simulate connection process
    setTimeout(() => {
      setPlatforms(prev => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          status: 'connected'
        }
      }));
    }, 2000);
  };

  const handleDisconnectPlatform = (platform: Platform) => {
    setPlatforms(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        status: 'disconnected'
      }
    }));
  };

  return (
    <AdminPageLayout 
      title="Platform Management"
      description="Connect and manage your communication platforms"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Platform Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(platforms).map(([key, platform]) => (
              <Card key={key} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getPlatformIcon(key as Platform)}
                      <div>
                        <CardTitle className="text-lg">{platform.displayName}</CardTitle>
                        <CardDescription>
                          {platform.features.basic.length} basic features
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusIcon(platform.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    {getStatusBadge(platform.status)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Basic Features</span>
                      <span className="font-medium">{platform.features.basic.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Premium Features</span>
                      <span className="font-medium">{platform.features.premium.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Starting Price</span>
                      <span className="font-medium">${platform.pricing.basic.price}/mo</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {platform.status === 'connected' ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDisconnectPlatform(key as Platform)}
                        className="flex-1"
                      >
                        <Pause className="w-4 h-4 mr-2" />
                        Disconnect
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => handleConnectPlatform(key as Platform)}
                        className="flex-1"
                        disabled={platform.status === 'connecting'}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {platform.status === 'connecting' ? 'Connecting...' : 'Connect'}
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common platform management tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Setup Flow Builder</div>
                    <div className="text-sm text-muted-foreground">Create automated conversations</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">Configure Integrations</div>
                    <div className="text-sm text-muted-foreground">Connect external services</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-left">
                    <div className="font-medium">View Analytics</div>
                    <div className="text-sm text-muted-foreground">Monitor performance</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Connections</CardTitle>
              <CardDescription>
                Manage your platform integrations and credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(platforms).map(([key, platform]) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getPlatformIcon(key as Platform)}
                      <div>
                        <h3 className="font-medium">{platform.displayName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {platform.status === 'connected' ? 'Connected and active' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(platform.status)}
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(platforms).filter(([key]) => key !== 'email' && key !== 'sms').map(([key, platform]) => (
              <Card key={key}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {getPlatformIcon(key as Platform)}
                    <div>
                      <CardTitle className="text-lg">{platform.displayName}</CardTitle>
                      <CardDescription>Pricing plans</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(platform.pricing).map(([tier, pricing]) => (
                    <div key={tier} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium capitalize">{tier}</h4>
                        <span className="text-2xl font-bold">${pricing.price}/mo</span>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {pricing.features.slice(0, 3).map((feature, index) => (
                          <div key={index}>• {feature}</div>
                        ))}
                      </div>
                      <Button size="sm" className="w-full mt-3">
                        Choose {tier}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Platform Analytics
              </CardTitle>
              <CardDescription>
                Performance metrics across all platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Connected Platforms</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Total Messages</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">0%</div>
                  <div className="text-sm text-muted-foreground">Response Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminPageLayout>
  );
};

export default Platforms;
