import React, { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Instagram, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Settings,
  ExternalLink,
  RefreshCw,
  BarChart3,
  Camera,
  Heart,
  MessageCircle,
  Send,
  Zap,
  Shield,
  Key
} from "lucide-react";

const InstagramChannel = () => {
  const [activeTab, setActiveTab] = useState("connect");
  const [isConnecting, setIsConnecting] = useState(false);

  // Sample Instagram accounts
  const instagramAccounts = [
    {
      id: "1",
      username: "@mybusiness_insta",
      accountId: "17841401234567890",
      status: "CONNECTED",
      followers: 1250,
      lastSync: "2 minutes ago",
      permissions: ["instagram_basic", "instagram_manage_messages", "instagram_manage_comments"],
      isActive: true
    },
    {
      id: "2", 
      username: "@support_channel",
      accountId: "17841409876543210",
      status: "CONNECTED",
      followers: 890,
      lastSync: "5 minutes ago",
      permissions: ["instagram_basic", "instagram_manage_messages"],
      isActive: false
    }
  ];

  // Sample messages
  const recentMessages = [
    {
      id: "1",
      user: "john_doe",
      message: "Hi! I'm interested in your products. Can you help me?",
      timestamp: "2 minutes ago",
      type: "DIRECT_MESSAGE",
      status: "UNREAD"
    },
    {
      id: "2",
      user: "sarah_wilson",
      message: "Love your latest post! 😍",
      timestamp: "15 minutes ago", 
      type: "COMMENT",
      status: "READ"
    },
    {
      id: "3",
      user: "mike_chen",
      message: "Do you have this in different colors?",
      timestamp: "1 hour ago",
      type: "DIRECT_MESSAGE", 
      status: "READ"
    }
  ];

  const handleConnectInstagram = async () => {
    setIsConnecting(true);
    // Simulate Instagram OAuth flow
    setTimeout(() => {
      setIsConnecting(false);
      alert("Instagram account connected successfully!");
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONNECTED": return "bg-green-100 text-green-800";
      case "DISCONNECTED": return "bg-gray-100 text-gray-800";
      case "ERROR": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case "DIRECT_MESSAGE": return <MessageCircle className="w-4 h-4 text-blue-600" />;
      case "COMMENT": return <MessageSquare className="w-4 h-4 text-green-600" />;
      case "STORY_REPLY": return <Camera className="w-4 h-4 text-purple-600" />;
      default: return <MessageCircle className="w-4 h-4 text-gray-600" />;
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
                <Instagram className="w-8 h-8 text-pink-600" />
                Instagram Integration
              </h1>
              <p className="text-gray-600 mt-2">
                Connect and manage your Instagram business accounts for automated messaging
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <BarChart3 className="mr-2 w-4 h-4" />
                Analytics
              </Button>
              <Button>
                <Plus className="mr-2 w-4 h-4" />
                Connect Account
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="connect" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Connect
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Connect Tab */}
          <TabsContent value="connect" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Connect New Account */}
              <Card>
                <CardHeader>
                  <CardTitle>Connect Instagram Account</CardTitle>
                  <CardDescription>
                    Link your Instagram business account to enable automated messaging
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Requirements:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Instagram Business or Creator account</li>
                      <li>• Connected Facebook Page</li>
                      <li>• Instagram Basic Display API access</li>
                      <li>• Instagram Messaging API access</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Account Type</label>
                      <Select defaultValue="business">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="business">Business Account</SelectItem>
                          <SelectItem value="creator">Creator Account</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Facebook Page</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select connected Facebook page..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="page1">My Business Page</SelectItem>
                          <SelectItem value="page2">Support Page</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={handleConnectInstagram}
                    disabled={isConnecting}
                    className="w-full"
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="mr-2 w-4 h-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Instagram className="mr-2 w-4 h-4" />
                        Connect Instagram Account
                      </>
                    )}
                  </Button>

                  <div className="text-xs text-gray-500 text-center">
                    By connecting, you agree to our terms of service and privacy policy
                  </div>
                </CardContent>
              </Card>

              {/* Connected Accounts */}
              <Card>
                <CardHeader>
                  <CardTitle>Connected Accounts</CardTitle>
                  <CardDescription>
                    Manage your connected Instagram accounts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {instagramAccounts.map((account) => (
                    <div key={account.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                            {account.username.charAt(1).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-medium">{account.username}</h4>
                            <p className="text-sm text-gray-600">{account.followers} followers</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(account.status)}>
                            {account.status}
                          </Badge>
                          <Switch 
                            checked={account.isActive}
                            onCheckedChange={(checked) => console.log('Toggle account:', checked)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-gray-600">Last Sync</p>
                          <p className="font-medium">{account.lastSync}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Permissions</p>
                          <p className="font-medium">{account.permissions.length} granted</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <RefreshCw className="mr-1 w-3 h-3" />
                          Sync
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Messages List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Messages</CardTitle>
                        <CardDescription>Manage incoming Instagram messages and comments</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {recentMessages.filter(m => m.status === "UNREAD").length} Unread
                        </Badge>
                        <Button size="sm" variant="outline">
                          <RefreshCw className="mr-1 w-3 h-3" />
                          Refresh
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentMessages.map((message) => (
                        <div key={message.id} className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          message.status === "UNREAD" ? "bg-blue-50 border-blue-200" : ""
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              {getMessageTypeIcon(message.type)}
                              <div>
                                <h4 className="font-medium">{message.user}</h4>
                                <p className="text-sm text-gray-600">{message.type.replace('_', ' ')}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {message.status === "UNREAD" && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                              <span className="text-xs text-gray-500">{message.timestamp}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{message.message}</p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <MessageCircle className="mr-1 w-3 h-3" />
                              Reply
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                    <CardDescription>Common Instagram management tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="mr-2 w-4 h-4" />
                      Send Direct Message
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Camera className="mr-2 w-4 h-4" />
                      Post Story Reply
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Heart className="mr-2 w-4 h-4" />
                      Like & Comment
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="mr-2 w-4 h-4" />
                      Follow Back
                    </Button>
                  </CardContent>
                </Card>

                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Messages Today</span>
                        <span className="font-medium">24</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg Response Time</span>
                        <span className="font-medium">2m 30s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Engagement Rate</span>
                        <span className="font-medium">4.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Follower Growth</span>
                        <span className="font-medium text-green-600">+12</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Instagram Automation Rules</CardTitle>
                    <CardDescription>Set up automated responses and actions for Instagram interactions</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 w-4 h-4" />
                    New Rule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      name: "Welcome Message",
                      description: "Send welcome message to new followers",
                      trigger: "New Follower",
                      status: "ACTIVE",
                      responses: 156
                    },
                    {
                      name: "Comment Response",
                      description: "Auto-reply to comments with keywords",
                      trigger: "Comment Contains 'help'",
                      status: "ACTIVE", 
                      responses: 89
                    },
                    {
                      name: "Story Reply",
                      description: "Respond to story reactions",
                      trigger: "Story Reaction",
                      status: "INACTIVE",
                      responses: 23
                    },
                    {
                      name: "DM Auto-Reply",
                      description: "Quick response to common DM questions",
                      trigger: "DM Contains 'price'",
                      status: "ACTIVE",
                      responses: 45
                    },
                    {
                      name: "Follow Back",
                      description: "Automatically follow back new followers",
                      trigger: "New Follower",
                      status: "INACTIVE",
                      responses: 67
                    },
                    {
                      name: "Engagement Boost",
                      description: "Like and comment on specific posts",
                      trigger: "Post Contains Hashtag",
                      status: "ACTIVE",
                      responses: 234
                    }
                  ].map((rule, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{rule.name}</CardTitle>
                          <Badge className={rule.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                            {rule.status}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {rule.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-600">Trigger</p>
                            <p className="text-sm font-medium">{rule.trigger}</p>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Responses</span>
                            <span className="font-medium">{rule.responses}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Edit className="mr-1 w-3 h-3" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
                  <CardTitle>Instagram Settings</CardTitle>
                  <CardDescription>Configure Instagram integration preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-sync Messages</p>
                      <p className="text-sm text-gray-600">Automatically sync new messages</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-reply to Comments</p>
                      <p className="text-sm text-gray-600">Enable automated comment responses</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Story Interaction</p>
                      <p className="text-sm text-gray-600">Respond to story reactions and replies</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Sync Frequency</label>
                    <Select defaultValue="realtime">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="5min">Every 5 minutes</SelectItem>
                        <SelectItem value="15min">Every 15 minutes</SelectItem>
                        <SelectItem value="1hour">Every hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Default Response Delay</label>
                    <Input type="number" placeholder="2" />
                    <p className="text-xs text-gray-500 mt-1">Minutes before auto-responding</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy & Security</CardTitle>
                  <CardDescription>Manage Instagram data and permissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-900 mb-2">Data Usage</h4>
                    <p className="text-sm text-yellow-800">
                      We only access messages and comments for automation purposes. 
                      Your Instagram data is encrypted and never shared with third parties.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Key className="mr-2 w-4 h-4" />
                      Manage API Permissions
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="mr-2 w-4 h-4" />
                      Data Export
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Trash2 className="mr-2 w-4 h-4" />
                      Delete All Data
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="w-full">
                      <Shield className="mr-2 w-4 h-4" />
                      Save Security Settings
                    </Button>
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

export default InstagramChannel;
