import React, { useState, useEffect } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Bot, 
  Play, 
  Pause, 
  Save, 
  Eye,
  Settings,
  MessageSquare,
  Zap,
  Palette,
  Brain,
  Smartphone,
  Monitor,
  Download,
  Upload,
  HelpCircle,
  ExternalLink,
  Copy,
  Check
} from "lucide-react";

const BotBuilder = () => {
  const [botConfig, setBotConfig] = useState({
    name: "My AI Bot",
    description: "A helpful AI assistant",
    personality: "friendly",
    language: "English",
    responseStyle: "conversational",
    color: "#25D366",
    avatar: "🤖",
    welcomeMessage: "Hi! How can I help you today?",
    fallbackMessage: "I'm sorry, I didn't understand that. Can you rephrase?",
    isActive: false,
    responseTimeout: "30",
    // Phone Integration
    phoneNumber: "",
    whatsappBusinessId: "",
    webhookUrl: "",
    countryCode: "+40",
    // Knowledge Base
    knowledgeBase: [],
    documents: [],
    // Test messages
    testMessage: "",
    testResponse: "",
    isTesting: false,
    testHistory: []
  });

  const [activeTab, setActiveTab] = useState("configuration");
  const [copiedField, setCopiedField] = useState("");
  const [currentConversationId, setCurrentConversationId] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const handleConfigChange = (field, value) => {
    setBotConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCopyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 2000);
  };

  const handleTestBot = async () => {
    if (!botConfig.testMessage.trim()) return;
    
    setBotConfig(prev => ({ ...prev, isTesting: true }));
    
    try {
      // Try RAG API first
      const ragResponse = await fetch('http://localhost:5000/api/rag/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: botConfig.testMessage })
      });
      
      if (ragResponse.ok) {
        const ragData = await ragResponse.json();
        const testId = Date.now().toString();
        setCurrentConversationId(testId);
        setShowFeedback(true);
        
        setBotConfig(prev => ({
          ...prev,
          testResponse: ragData.response,
          isTesting: false,
          testHistory: [
            { id: testId, message: prev.testMessage, response: ragData.response, timestamp: new Date().toLocaleTimeString(), method: ragData.method, confidence: ragData.confidence },
            ...prev.testHistory.slice(0, 4)
          ]
        }));
        return;
      }
      
      // Fallback to simple bot
      const response = await fetch('http://localhost:5000/api/bot/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: botConfig.testMessage })
      });
      
      if (response.ok) {
        const data = await response.json();
        setBotConfig(prev => ({
          ...prev,
          testResponse: data.response,
          isTesting: false,
          testHistory: [
            { id: Date.now(), message: prev.testMessage, response: data.response, timestamp: new Date().toLocaleTimeString(), method: 'simple', confidence: data.confidence || 0.8 },
            ...prev.testHistory.slice(0, 4)
          ]
        }));
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      setBotConfig(prev => ({
        ...prev,
        testResponse: "Sorry, I'm having trouble connecting right now. Please try again later.",
        isTesting: false
      }));
    }
  };

  const handleFeedback = async (rating, feedback = "", suggestions = "") => {
    try {
      await fetch('http://localhost:5000/api/rag/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: currentConversationId,
          rating,
          feedback,
          suggestions
        })
      });
      setShowFeedback(false);
      setCurrentConversationId("");
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const navItems = [
    { id: 1, title: "Configuration", icon: Settings },
    { id: 2, title: "Design", icon: Palette },
    { id: 3, title: "Knowledge", icon: Brain },
    { id: 4, title: "AI Settings", icon: Zap },
    { id: 5, title: "Channels", icon: MessageSquare },
    { id: 6, title: "Preview", icon: Eye }
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back to Dashboard */}
          <BackToDashboard title="Back to Dashboard" />
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Bot className="w-8 h-8 text-whatsapp" />
                Bot Builder
              </h1>
              <p className="text-muted-foreground">
                Create and customize your AI bot - Currently on: <span className="font-medium capitalize text-whatsapp">{activeTab}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Configuration
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import Configuration
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Advanced Settings
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bot Configuration</CardTitle>
                  <CardDescription>Configure your AI bot settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {navItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={activeTab === item.title.toLowerCase() ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab(item.title.toLowerCase())}
                    >
                      <item.icon className="mr-2 w-4 h-4" />
                      {item.title}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <Badge className={botConfig.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {botConfig.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Language</span>
                    <span className="text-sm font-medium">{botConfig.language}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Personality</span>
                    <span className="text-sm font-medium capitalize">{botConfig.personality}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="mr-2 w-4 h-4" />
                    Export Configuration
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="mr-2 w-4 h-4" />
                    Import Configuration
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="mr-2 w-4 h-4" />
                    Advanced Settings
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Configuration Panel */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="configuration">Configuration</TabsTrigger>
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
                  <TabsTrigger value="ai settings">AI Settings</TabsTrigger>
                  <TabsTrigger value="channels">Channels</TabsTrigger>
                  <TabsTrigger value="integration">Integration</TabsTrigger>
                </TabsList>

                {/* Configuration Tab */}
                <TabsContent value="configuration" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Configuration</CardTitle>
                      <CardDescription>Set up your bot's basic information and behavior</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Bot Name</label>
                          <Input
                            value={botConfig.name}
                            onChange={(e) => handleConfigChange('name', e.target.value)}
                            placeholder="Enter bot name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Language</label>
                          <Select value={botConfig.language} onValueChange={(value) => handleConfigChange('language', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="English">English</SelectItem>
                              <SelectItem value="Spanish">Spanish</SelectItem>
                              <SelectItem value="French">French</SelectItem>
                              <SelectItem value="German">German</SelectItem>
                              <SelectItem value="Romanian">Romanian</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={botConfig.description}
                          onChange={(e) => handleConfigChange('description', e.target.value)}
                          placeholder="Describe what your bot does"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Personality</label>
                          <Select value={botConfig.personality} onValueChange={(value) => handleConfigChange('personality', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select personality" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="friendly">Friendly</SelectItem>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="casual">Casual</SelectItem>
                              <SelectItem value="formal">Formal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Response Style</label>
                          <Select value={botConfig.responseStyle} onValueChange={(value) => handleConfigChange('responseStyle', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select style" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="conversational">Conversational</SelectItem>
                              <SelectItem value="direct">Direct</SelectItem>
                              <SelectItem value="detailed">Detailed</SelectItem>
                              <SelectItem value="concise">Concise</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Welcome Message</label>
                        <Textarea
                          value={botConfig.welcomeMessage}
                          onChange={(e) => handleConfigChange('welcomeMessage', e.target.value)}
                          placeholder="Enter welcome message"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Fallback Message</label>
                        <Textarea
                          value={botConfig.fallbackMessage}
                          onChange={(e) => handleConfigChange('fallbackMessage', e.target.value)}
                          placeholder="Enter fallback message"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Response Timeout (seconds)</label>
                        <Input
                          type="number"
                          value={botConfig.responseTimeout || "30"}
                          onChange={(e) => handleConfigChange('responseTimeout', e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={botConfig.isActive}
                          onChange={(e) => handleConfigChange('isActive', e.target.checked)}
                          className="w-4 h-4"
                        />
                        <label className="text-sm font-medium">Activate Bot</label>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Test Your Bot */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Test Your Bot</CardTitle>
                      <CardDescription>Test how your bot responds to messages</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Test Message</label>
                        <div className="flex gap-2">
                          <Input
                            value={botConfig.testMessage}
                            onChange={(e) => handleConfigChange('testMessage', e.target.value)}
                            placeholder="Enter a test message..."
                            onKeyPress={(e) => e.key === 'Enter' && handleTestBot()}
                          />
                          <Button onClick={handleTestBot} disabled={botConfig.isTesting}>
                            {botConfig.isTesting ? (
                              <>
                                <Pause className="w-4 h-4 mr-2" />
                                Testing...
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Test
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {botConfig.testResponse && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Bot Response</label>
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm">{botConfig.testResponse}</p>
                          </div>
                          
                          {showFeedback && (
                            <div className="mt-4 p-4 border rounded-lg">
                              <p className="text-sm font-medium mb-2">Rate this response (1-5):</p>
                              <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(rating => (
                                  <Button
                                    key={rating}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleFeedback(rating)}
                                    className="w-8 h-8 p-0"
                                  >
                                    {rating}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {botConfig.testHistory.length > 0 && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Recent Tests</label>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {botConfig.testHistory.map((test, index) => (
                              <div key={test.id} className="p-3 bg-muted rounded-lg text-sm">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium">Q: {test.message}</span>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{test.method}</span>
                                    <span>{(test.confidence * 100).toFixed(0)}%</span>
                                    <span>{test.timestamp}</span>
                                  </div>
                                </div>
                                <p className="text-muted-foreground">A: {test.response}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Integration Tab */}
                <TabsContent value="integration" className="space-y-4">
                  {/* Integration Dropdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Platform Integrations
                      </CardTitle>
                      <CardDescription>Connect your bot to different messaging platforms</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* WhatsApp Business Integration */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <MessageSquare className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">WhatsApp Business</h3>
                              <p className="text-sm text-muted-foreground">Customer support via WhatsApp</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-foreground">Phone Number</label>
                            <div className="flex gap-2 mt-1">
                              <Select value={botConfig.countryCode || "+40"} onValueChange={(value) => handleConfigChange('countryCode', value)}>
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Country" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="+1">🇺🇸 +1 (US)</SelectItem>
                                  <SelectItem value="+40">🇷🇴 +40 (RO)</SelectItem>
                                  <SelectItem value="+44">🇬🇧 +44 (UK)</SelectItem>
                                  <SelectItem value="+49">🇩🇪 +49 (DE)</SelectItem>
                                  <SelectItem value="+33">🇫🇷 +33 (FR)</SelectItem>
                                  <SelectItem value="+39">🇮🇹 +39 (IT)</SelectItem>
                                  <SelectItem value="+34">🇪🇸 +34 (ES)</SelectItem>
                                  <SelectItem value="+31">🇳🇱 +31 (NL)</SelectItem>
                                  <SelectItem value="+46">🇸🇪 +46 (SE)</SelectItem>
                                  <SelectItem value="+47">🇳🇴 +47 (NO)</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                value={botConfig.phoneNumber}
                                onChange={(e) => handleConfigChange('phoneNumber', e.target.value)}
                                className="flex-1"
                                placeholder="721 234 567"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-foreground">WhatsApp Business ID</label>
                            <div className="flex gap-2 mt-1">
                              <Input
                                value={botConfig.whatsappBusinessId}
                                onChange={(e) => handleConfigChange('whatsappBusinessId', e.target.value)}
                                className="flex-1"
                                placeholder="123456789012345"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => window.open('https://business.whatsapp.com', '_blank')}
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Setup
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-foreground">Webhook URL</label>
                            <div className="flex gap-2 mt-1">
                              <Input
                                value={botConfig.webhookUrl}
                                onChange={(e) => handleConfigChange('webhookUrl', e.target.value)}
                                className="flex-1"
                                placeholder="https://your-domain.com/webhook"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopyToClipboard(botConfig.webhookUrl || 'https://your-domain.com/webhook', 'webhook')}
                                className="flex items-center gap-1"
                              >
                                {copiedField === 'webhook' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copiedField === 'webhook' ? 'Copied!' : 'Copy'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Facebook Messenger Integration */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <MessageSquare className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">Facebook Messenger</h3>
                              <p className="text-sm text-muted-foreground">Social media customer support</p>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-foreground">Facebook App ID</label>
                            <Input
                              placeholder="1234567890123456"
                              className="text-sm"
                              readOnly
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-foreground">Page Access Token</label>
                            <Input
                              placeholder="EAAxxxxxxxxxxxxxxxxxxxxx"
                              className="text-sm"
                              readOnly
                            />
                          </div>
                          
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => window.open('https://developers.facebook.com', '_blank')}
                            className="w-full flex items-center gap-1 text-foreground hover:text-foreground"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Go to Facebook Developers
                          </Button>
                        </div>
                      </div>

                      {/* Telegram Bot Integration */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                              <MessageSquare className="w-4 h-4 text-cyan-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">Telegram Bot</h3>
                              <p className="text-sm text-muted-foreground">Instant messaging support</p>
                            </div>
                          </div>
                          <Badge className="bg-cyan-100 text-cyan-800">Ready</Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-foreground">Telegram Bot Token</label>
                            <div className="flex gap-2">
                              <Input
                                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                                className="flex-1"
                                readOnly
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => window.open('https://t.me/BotFather', '_blank')}
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Open BotFather
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Website Chat Widget Integration */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <Monitor className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-medium">Website Chat Widget</h3>
                              <p className="text-sm text-muted-foreground">Embeddable chat widget</p>
                            </div>
                          </div>
                          <Badge className="bg-purple-100 text-purple-800">Active</Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-foreground">Website Domain</label>
                            <div className="flex gap-2">
                              <Input
                                placeholder="yourcompany.com"
                                className="flex-1"
                                readOnly
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopyToClipboard('<script src="https://your-domain.com/widget.js"></script>', 'widget')}
                                className="flex items-center gap-1"
                              >
                                {copiedField === 'widget' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copiedField === 'widget' ? 'Copied!' : 'Get Code'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default BotBuilder;