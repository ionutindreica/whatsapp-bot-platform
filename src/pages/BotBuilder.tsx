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
import QRCode from "qrcode";
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
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [connectedChannels, setConnectedChannels] = useState({
    whatsapp: false,
    telegram: false,
    instagram: false,
    facebook: false,
    website: false
  });

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

  const generateQRCode = async () => {
    if (!botConfig.phoneNumber) {
      alert('Please enter a phone number first!');
      return;
    }

    try {
      const phoneNumber = `${botConfig.countryCode || '+40'}${botConfig.phoneNumber}`;
      const message = `Hello! I want to connect with ${botConfig.name || 'My Bot'}`;
      const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber.replace('+', '')}&text=${encodeURIComponent(message)}`;
      
      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(whatsappLink, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeDataUrl(qrDataUrl);
      setShowQRCode(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Error generating QR code');
    }
  };

  const openWhatsAppLink = () => {
    if (!botConfig.phoneNumber) {
      alert('Please enter a phone number first!');
      return;
    }

    const phoneNumber = `${botConfig.countryCode || '+40'}${botConfig.phoneNumber}`;
    const message = `Hello! I want to connect with ${botConfig.name || 'My Bot'}`;
    const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber.replace('+', '')}&text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
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
          <div className="w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="configuration">Basic Setup</TabsTrigger>
                <TabsTrigger value="design">Appearance</TabsTrigger>
                <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
                <TabsTrigger value="integration">Connections</TabsTrigger>
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

                {/* Design Tab */}
              <TabsContent value="design" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Bot Design & Branding
                      </CardTitle>
                      <CardDescription>Customize your bot's appearance and branding</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Bot Avatar</label>
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-2xl">
                                {botConfig.avatar}
                              </div>
                              <div className="space-y-2">
                                <Input
                                  value={botConfig.avatar}
                                  onChange={(e) => handleConfigChange('avatar', e.target.value)}
                                  placeholder="🤖"
                                  className="w-20"
                                />
                                <p className="text-xs text-muted-foreground">Emoji or text</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Brand Color</label>
                            <div className="flex items-center gap-3">
                              <input
                                type="color"
                                value={botConfig.color}
                                onChange={(e) => handleConfigChange('color', e.target.value)}
                                className="w-12 h-8 rounded border"
                              />
                              <Input
                                value={botConfig.color}
                                onChange={(e) => handleConfigChange('color', e.target.value)}
                                placeholder="#25D366"
                                className="flex-1"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Bot Name</label>
                            <Input
                              value={botConfig.name}
                              onChange={(e) => handleConfigChange('name', e.target.value)}
                              placeholder="My AI Bot"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Preview</label>
                            <div className="p-4 border rounded-lg bg-muted/50">
                              <div className="flex items-center gap-3 mb-3">
                                <div 
                                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                                  style={{ backgroundColor: botConfig.color }}
                                >
                                  {botConfig.avatar}
                                </div>
                                <div>
                                  <p className="font-medium">{botConfig.name}</p>
                                  <p className="text-xs text-muted-foreground">Online</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                  <p className="text-sm">{botConfig.welcomeMessage}</p>
                                </div>
                                <div className="bg-gray-100 p-3 rounded-lg ml-8">
                                  <p className="text-sm">Hello! How can I help you?</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              </TabsContent>

                {/* Knowledge Tab */}
              <TabsContent value="knowledge" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        Knowledge Base
                      </CardTitle>
                      <CardDescription>Train your bot with knowledge and documents</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Add Knowledge</label>
                            <Textarea
                              placeholder="Enter knowledge or FAQ..."
                              rows={4}
                            />
                            <Button size="sm" className="w-full">
                              <Brain className="w-4 h-4 mr-2" />
                              Add to Knowledge Base
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Upload Documents</label>
                            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Drag & drop files or click to upload</p>
                              <p className="text-xs text-muted-foreground mt-1">PDF, DOC, TXT files supported</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Knowledge Base Status</label>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <span className="text-sm">Total Documents</span>
                                <Badge>0</Badge>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <span className="text-sm">Knowledge Items</span>
                                <Badge>0</Badge>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                <span className="text-sm">Training Status</span>
                                <Badge variant="outline">Not Trained</Badge>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Quick Actions</label>
                            <div className="space-y-2">
                              <Button variant="outline" size="sm" className="w-full justify-start">
                                <Brain className="w-4 h-4 mr-2" />
                                Train AI Model
                              </Button>
                              <Button variant="outline" size="sm" className="w-full justify-start">
                                <Download className="w-4 h-4 mr-2" />
                                Export Knowledge
                              </Button>
                              <Button variant="outline" size="sm" className="w-full justify-start">
                                <Upload className="w-4 h-4 mr-2" />
                                Import Knowledge
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Configuration */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        AI Configuration
                      </CardTitle>
                      <CardDescription>Configure AI behavior and response settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
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
                            <label className="text-sm font-medium">Response Timeout (seconds)</label>
                            <Input
                              type="number"
                              value={botConfig.responseTimeout}
                              onChange={(e) => handleConfigChange('responseTimeout', e.target.value)}
                              placeholder="30"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">AI Model</label>
                            <Select defaultValue="gpt-3.5-turbo">
                              <SelectTrigger>
                                <SelectValue placeholder="Select AI model" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                <SelectItem value="gpt-4">GPT-4</SelectItem>
                                <SelectItem value="claude-3">Claude 3</SelectItem>
                                <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Advanced Settings</label>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Enable Context Memory</span>
                                <input type="checkbox" className="w-4 h-4" defaultChecked />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Enable Sentiment Analysis</span>
                                <input type="checkbox" className="w-4 h-4" />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Enable Intent Recognition</span>
                                <input type="checkbox" className="w-4 h-4" defaultChecked />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Enable Multi-language</span>
                                <input type="checkbox" className="w-4 h-4" />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Response Length</label>
                            <Select defaultValue="medium">
                              <SelectTrigger>
                                <SelectValue placeholder="Select length" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                                <SelectItem value="medium">Medium (2-4 sentences)</SelectItem>
                                <SelectItem value="long">Long (4+ sentences)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              </TabsContent>


                {/* Integration Tab */}
              <TabsContent value="integration" className="space-y-6">
              {/* Multi-Channel Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Multi-Channel Bot
                  </CardTitle>
                  <CardDescription>Connect your bot to multiple channels simultaneously for maximum reach</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {/* WhatsApp Channel */}
                    <div className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">WhatsApp</h3>
                            <p className="text-xs text-muted-foreground">Business messaging</p>
                          </div>
                        </div>
                        <Badge className={connectedChannels.whatsapp ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {connectedChannels.whatsapp ? "Connected" : "Not Connected"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Status:</span> {connectedChannels.whatsapp ? "Active" : "Inactive"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Messages today:</span> {connectedChannels.whatsapp ? "24" : "0"}
                        </div>
                        <Button 
                          size="sm" 
                          variant={connectedChannels.whatsapp ? "outline" : "default"}
                          className="w-full"
                          onClick={() => setConnectedChannels(prev => ({...prev, whatsapp: !prev.whatsapp}))}
                        >
                          {connectedChannels.whatsapp ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    </div>

                    {/* Telegram Channel */}
                    <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">Telegram</h3>
                            <p className="text-xs text-muted-foreground">Bot messaging</p>
                          </div>
                        </div>
                        <Badge className={connectedChannels.telegram ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
                          {connectedChannels.telegram ? "Connected" : "Not Connected"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Status:</span> {connectedChannels.telegram ? "Active" : "Inactive"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Messages today:</span> {connectedChannels.telegram ? "18" : "0"}
                        </div>
                        <Button 
                          size="sm" 
                          variant={connectedChannels.telegram ? "outline" : "default"}
                          className="w-full"
                          onClick={() => setConnectedChannels(prev => ({...prev, telegram: !prev.telegram}))}
                        >
                          {connectedChannels.telegram ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    </div>

                    {/* Instagram Channel */}
                    <div className="border rounded-lg p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-pink-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">Instagram</h3>
                            <p className="text-xs text-muted-foreground">Direct messages</p>
                          </div>
                        </div>
                        <Badge className={connectedChannels.instagram ? "bg-pink-100 text-pink-800" : "bg-gray-100 text-gray-800"}>
                          {connectedChannels.instagram ? "Connected" : "Not Connected"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Status:</span> {connectedChannels.instagram ? "Active" : "Inactive"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Messages today:</span> {connectedChannels.instagram ? "12" : "0"}
                        </div>
                        <Button 
                          size="sm" 
                          variant={connectedChannels.instagram ? "outline" : "default"}
                          className="w-full"
                          onClick={() => setConnectedChannels(prev => ({...prev, instagram: !prev.instagram}))}
                        >
                          {connectedChannels.instagram ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    </div>

                    {/* Facebook Messenger */}
                    <div className="border rounded-lg p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">Facebook</h3>
                            <p className="text-xs text-muted-foreground">Messenger bot</p>
                          </div>
                        </div>
                        <Badge className={connectedChannels.facebook ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-800"}>
                          {connectedChannels.facebook ? "Connected" : "Not Connected"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Status:</span> {connectedChannels.facebook ? "Active" : "Inactive"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Messages today:</span> {connectedChannels.facebook ? "8" : "0"}
                        </div>
                        <Button 
                          size="sm" 
                          variant={connectedChannels.facebook ? "outline" : "default"}
                          className="w-full"
                          onClick={() => setConnectedChannels(prev => ({...prev, facebook: !prev.facebook}))}
                        >
                          {connectedChannels.facebook ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    </div>

                    {/* Website Widget */}
                    <div className="border rounded-lg p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">Website</h3>
                            <p className="text-xs text-muted-foreground">Chat widget</p>
                          </div>
                        </div>
                        <Badge className={connectedChannels.website ? "bg-gray-100 text-gray-800" : "bg-gray-100 text-gray-800"}>
                          {connectedChannels.website ? "Connected" : "Not Connected"}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Status:</span> {connectedChannels.website ? "Active" : "Inactive"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Visitors today:</span> {connectedChannels.website ? "45" : "0"}
                        </div>
                        <Button 
                          size="sm" 
                          variant={connectedChannels.website ? "outline" : "default"}
                          className="w-full"
                          onClick={() => setConnectedChannels(prev => ({...prev, website: !prev.website}))}
                        >
                          {connectedChannels.website ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Multi-Channel Stats */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Multi-Channel Analytics
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {Object.values(connectedChannels).filter(Boolean).length}
                        </div>
                        <div className="text-xs text-muted-foreground">Active Channels</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {Object.values(connectedChannels).filter(Boolean).length * 15}
                        </div>
                        <div className="text-xs text-muted-foreground">Total Messages</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {Object.values(connectedChannels).filter(Boolean).length * 8}
                        </div>
                        <div className="text-xs text-muted-foreground">Active Users</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          98%
                        </div>
                        <div className="text-xs text-muted-foreground">Response Rate</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Channel Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Channel Management
                  </CardTitle>
                  <CardDescription>Manage your bot's communication channels and their status</CardDescription>
                </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* WhatsApp Channel */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <MessageSquare className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">WhatsApp</h3>
                                <p className="text-xs text-muted-foreground">Business</p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Messages Today</span>
                              <span className="font-medium">24</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Response Rate</span>
                              <span className="font-medium">98%</span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                              <Settings className="w-4 h-4 mr-2" />
                              Configure
                            </Button>
                          </div>
                        </div>

                        {/* Facebook Messenger Channel */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <MessageSquare className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">Messenger</h3>
                                <p className="text-xs text-muted-foreground">Facebook</p>
                              </div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Messages Today</span>
                              <span className="font-medium">0</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Response Rate</span>
                              <span className="font-medium">-</span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                              <Settings className="w-4 h-4 mr-2" />
                              Setup
                            </Button>
                          </div>
                        </div>

                        {/* Telegram Channel */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                                <MessageSquare className="w-4 h-4 text-cyan-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">Telegram</h3>
                                <p className="text-xs text-muted-foreground">Bot</p>
                              </div>
                            </div>
                            <Badge className="bg-cyan-100 text-cyan-800">Ready</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Messages Today</span>
                              <span className="font-medium">12</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Response Rate</span>
                              <span className="font-medium">95%</span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                              <Settings className="w-4 h-4 mr-2" />
                              Configure
                            </Button>
                          </div>
                        </div>

                        {/* Website Widget Channel */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <Monitor className="w-4 h-4 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">Website</h3>
                                <p className="text-xs text-muted-foreground">Widget</p>
                              </div>
                            </div>
                            <Badge className="bg-purple-100 text-purple-800">Active</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Visitors Today</span>
                              <span className="font-medium">156</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Engagement</span>
                              <span className="font-medium">23%</span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                              <Settings className="w-4 h-4 mr-2" />
                              Configure
                            </Button>
                          </div>
                        </div>

                        {/* Instagram Channel */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                                <MessageSquare className="w-4 h-4 text-pink-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">Instagram</h3>
                                <p className="text-xs text-muted-foreground">Direct</p>
                              </div>
                            </div>
                            <Badge className="bg-gray-100 text-gray-800">Disabled</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Messages Today</span>
                              <span className="font-medium">0</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Response Rate</span>
                              <span className="font-medium">-</span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                              <Settings className="w-4 h-4 mr-2" />
                              Enable
                            </Button>
                          </div>
                        </div>

                        {/* Add New Channel */}
                        <div className="border-2 border-dashed border-muted rounded-lg p-4 flex flex-col items-center justify-center">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mb-2">
                            <MessageSquare className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground text-center">Add New Channel</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            <Settings className="w-4 h-4 mr-2" />
                            Add Channel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Platform Integrations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Platform Integrations
                      </CardTitle>
                      <CardDescription>Connect your bot to different messaging platforms</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* WhatsApp Business Integration - Simplified */}
                      <div className="border rounded-lg p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">WhatsApp Business</h3>
                            <p className="text-sm text-muted-foreground">Connect your bot to WhatsApp in 3 simple steps</p>
                          </div>
                        </div>
                        
                        {/* Step-by-step guide */}
                        <div className="space-y-4">
                          <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">1</div>
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">Get WhatsApp Business Account</h4>
                              <p className="text-sm text-muted-foreground mb-2">Create a WhatsApp Business account if you don't have one</p>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open('https://business.whatsapp.com', '_blank')}
                                className="flex items-center gap-2"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Open WhatsApp Business
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">2</div>
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">Add Your Phone Number</h4>
                              <p className="text-sm text-muted-foreground mb-2">Enter the phone number you want to use for your bot</p>
                              <div className="flex gap-2">
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
                          </div>

                          <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">3</div>
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">We'll Handle the Rest!</h4>
                              <p className="text-sm text-muted-foreground mb-2">Our system will automatically configure the webhook and API connections</p>
                              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Auto-configured webhook: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">https://api.oglis.com/webhook/{botConfig.name?.toLowerCase().replace(/\s+/g, '-') || 'your-bot'}</code></span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Connect Options */}
                        <div className="mt-4 space-y-3">
                          {/* QR Code Option */}
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-bold">QR</span>
                                </div>
                                <div>
                                  <h4 className="font-medium text-sm">Scan QR Code</h4>
                                  <p className="text-xs text-muted-foreground">Generate QR code for easy connection</p>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={generateQRCode}
                                disabled={!botConfig.phoneNumber}
                              >
                                Generate QR
                              </Button>
                            </div>
                          </div>

                          {/* Direct Link Option */}
                          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                  <ExternalLink className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-sm">Direct WhatsApp Link</h4>
                                  <p className="text-xs text-muted-foreground">Click to open WhatsApp directly</p>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={openWhatsAppLink}
                                disabled={!botConfig.phoneNumber}
                              >
                                Open WhatsApp
                              </Button>
                            </div>
                          </div>

                          {/* Connection Status */}
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-medium text-green-700 dark:text-green-300">Ready to connect</span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {botConfig.countryCode || '+40'}{botConfig.phoneNumber || 'Enter phone number'}
                              </div>
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

                  {/* Additional Connections */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Additional Connections
                      </CardTitle>
                      <CardDescription>Connect your bot to external services and APIs</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* CRM Integration */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                <Brain className="w-4 h-4 text-orange-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">CRM Integration</h3>
                                <p className="text-xs text-muted-foreground">Salesforce, HubSpot</p>
                              </div>
                            </div>
                            <Badge className="bg-orange-100 text-orange-800">Available</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Sync Contacts</span>
                              <span className="font-medium">Enabled</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Lead Scoring</span>
                              <span className="font-medium">Active</span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                              <Settings className="w-4 h-4 mr-2" />
                              Configure
                            </Button>
                          </div>
                        </div>

                        {/* Email Integration */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <MessageSquare className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">Email Service</h3>
                                <p className="text-xs text-muted-foreground">SendGrid, Mailgun</p>
                              </div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">Connected</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Emails Sent</span>
                              <span className="font-medium">1,234</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Delivery Rate</span>
                              <span className="font-medium">99.2%</span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                              <Settings className="w-4 h-4 mr-2" />
                              Configure
                            </Button>
                          </div>
                        </div>

                        {/* Analytics Integration */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <Brain className="w-4 h-4 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">Analytics</h3>
                                <p className="text-xs text-muted-foreground">Google Analytics</p>
                              </div>
                            </div>
                            <Badge className="bg-purple-100 text-purple-800">Active</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Events Tracked</span>
                              <span className="font-medium">5,678</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Conversion Rate</span>
                              <span className="font-medium">12.5%</span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                              <Settings className="w-4 h-4 mr-2" />
                              View Analytics
                            </Button>
                          </div>
                        </div>

                        {/* Database Integration */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <Brain className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">Database</h3>
                                <p className="text-xs text-muted-foreground">PostgreSQL, MongoDB</p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800">Connected</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Records Stored</span>
                              <span className="font-medium">45,678</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Query Performance</span>
                              <span className="font-medium">98ms</span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full">
                              <Settings className="w-4 h-4 mr-2" />
                              Manage
                            </Button>
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
    </TooltipProvider>
  );
};

export default BotBuilder;