import React, { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Key, 
  Plus, 
  Copy, 
  Check, 
  Eye, 
  EyeOff,
  Trash2,
  Edit,
  Shield,
  Clock,
  Activity,
  Settings,
  Download,
  RefreshCw
} from "lucide-react";

const ApiKeys = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  
  const apiKeys = [
    {
      id: "1",
      name: "Production API Key",
      key: "sk_live_1234567890abcdef",
      permissions: ["read", "write", "admin"],
      lastUsed: "2 hours ago",
      createdAt: "2024-01-15",
      status: "active",
      usage: 1247
    },
    {
      id: "2", 
      name: "Development API Key",
      key: "sk_test_abcdef1234567890",
      permissions: ["read", "write"],
      lastUsed: "1 day ago",
      createdAt: "2024-01-10",
      status: "active",
      usage: 456
    },
    {
      id: "3",
      name: "Webhook Key",
      key: "whk_9876543210fedcba",
      permissions: ["webhook"],
      lastUsed: "3 days ago",
      createdAt: "2024-01-05",
      status: "inactive",
      usage: 23
    }
  ];

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCreateApiKey = () => {
    console.log("Creating new API key...");
    // Here you would typically open a modal or form to create new API key
  };

  const handleExportKeys = () => {
    console.log("Exporting API keys...");
    // Here you would typically export API keys to a file
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-muted text-muted-foreground";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-muted text-muted-foreground";
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
              <Key className="w-8 h-8 text-whatsapp" />
              API Keys
            </h1>
            <p className="text-muted-foreground">Manage your API access keys and permissions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportKeys}>
              <Download className="mr-2 w-4 h-4" />
              Export Keys
            </Button>
            <Button className="bg-whatsapp hover:bg-whatsapp/90" onClick={handleCreateApiKey}>
              <Plus className="mr-2 w-4 h-4" />
              Create API Key
            </Button>
          </div>
        </div>

        <Tabs defaultValue="keys" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="keys">API Keys</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* API Keys Tab */}
          <TabsContent value="keys" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Your API Keys
                </CardTitle>
                <CardDescription>Manage and monitor your API access keys</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{apiKey.name}</h4>
                          <Badge className={getStatusColor(apiKey.status)}>
                            {apiKey.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Created: {apiKey.createdAt}</span>
                          <span>•</span>
                          <span>Last used: {apiKey.lastUsed}</span>
                          <span>•</span>
                          <span>{apiKey.usage} requests</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Input
                            type={showKeys[apiKey.id] ? "text" : "password"}
                            value={apiKey.key}
                            readOnly
                            className="font-mono text-sm"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                          >
                            {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopy(apiKey.key, `key-${apiKey.id}`)}
                          >
                            {copied === `key-${apiKey.id}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Permission Types
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { name: "Read", description: "View data and analytics", color: "bg-blue-100 text-blue-800" },
                      { name: "Write", description: "Create and update resources", color: "bg-green-100 text-green-800" },
                      { name: "Admin", description: "Full access to all features", color: "bg-red-100 text-red-800" },
                      { name: "Webhook", description: "Send webhook notifications", color: "bg-purple-100 text-purple-800" }
                    ].map((permission) => (
                      <div key={permission.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{permission.name}</h4>
                          <p className="text-sm text-muted-foreground">{permission.description}</p>
                        </div>
                        <Badge className={permission.color}>
                          {permission.name}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Key Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {apiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{apiKey.name}</h4>
                          <Badge className={getStatusColor(apiKey.status)}>
                            {apiKey.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {apiKey.permissions.map((permission) => (
                            <Badge key={permission} variant="secondary" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Requests</p>
                      <p className="text-2xl font-bold">1,726</p>
                      <p className="text-sm text-green-600">+12.5% this month</p>
                    </div>
                    <Activity className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Keys</p>
                      <p className="text-2xl font-bold">2</p>
                      <p className="text-sm text-green-600">+1 this month</p>
                    </div>
                    <Key className="w-8 h-8 text-whatsapp" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Rate Limit</p>
                      <p className="text-2xl font-bold">1,000</p>
                      <p className="text-sm text-muted-foreground">requests/hour</p>
                    </div>
                    <Clock className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>API Usage Analytics</CardTitle>
                <CardDescription>Monitor your API usage and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Usage Analytics</h3>
                  <p className="text-muted-foreground">
                    Connect to analytics service for detailed usage insights
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rate Limiting</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">IP Whitelist</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">Optional</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Key Rotation</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">Recommended</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Audit Logging</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Security Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Rotate API keys every 90 days",
                      "Use environment variables for key storage",
                      "Enable IP whitelisting for production keys",
                      "Monitor usage patterns for anomalies",
                      "Use different keys for different environments"
                    ].map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-whatsapp rounded-full mt-2" />
                        <span className="text-sm">{recommendation}</span>
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

export default ApiKeys;
