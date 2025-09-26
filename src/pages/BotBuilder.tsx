import React, { useState, useEffect } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    // Knowledge Base
    knowledgeBase: [],
    documents: [],
    faqEnabled: true,
    // AI Settings
    aiModel: "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 150,
    contextWindow: 5,
    // Channels
    channels: {
      whatsapp: true,
      website: false,
      telegram: false,
      facebook: false
    },
    // Business Hours
    businessHours: {
      enabled: true,
      timezone: "UTC",
      schedule: {
        monday: { start: "09:00", end: "18:00", enabled: true },
        tuesday: { start: "09:00", end: "18:00", enabled: true },
        wednesday: { start: "09:00", end: "18:00", enabled: true },
        thursday: { start: "09:00", end: "18:00", enabled: true },
        friday: { start: "09:00", end: "18:00", enabled: true },
        saturday: { start: "10:00", end: "16:00", enabled: false },
        sunday: { start: "10:00", end: "16:00", enabled: false }
      }
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [userTimezone, setUserTimezone] = useState("");
  const [copiedField, setCopiedField] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  
  // Bot testing states
  const [testMessage, setTestMessage] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [testHistory, setTestHistory] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Detect user timezone on component mount
  useEffect(() => {
    // Încarcă configurația salvată
    const savedConfig = localStorage.getItem('botConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setBotConfig(parsedConfig);
      } catch (error) {
        console.error('Error loading saved config:', error);
      }
    }
    
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(detectedTimezone);
    
    // Set user timezone as default if not already set
    if (!botConfig.businessHours.timezone || botConfig.businessHours.timezone === "UTC") {
      setBotConfig(prev => ({
        ...prev,
        businessHours: {
          ...prev.businessHours,
          timezone: detectedTimezone
        }
      }));
    }
  }, []);

  const handleConfigChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setBotConfig(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setBotConfig(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Marchează că există modificări nesalvate
    setHasUnsavedChanges(true);
    
    // Auto-save pentru câmpuri importante
    const importantFields = ['name', 'description', 'welcomeMessage', 'fallbackMessage'];
    if (importantFields.includes(field) || importantFields.includes(field.split('.')[0])) {
      // Debounce auto-save - salvează după 3 secunde de inactivitate
      setTimeout(() => {
        if (saveStatus === 'idle' && !isSaving) {
          handleSave();
        }
      }, 3000);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      // Simulează salvarea (înlocuiește cu API call real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validează configurația
      if (!botConfig.name.trim()) {
        throw new Error('Bot name is required');
      }
      
      // Salvează în localStorage pentru demo
      localStorage.setItem('botConfig', JSON.stringify(botConfig));
      
      // Log pentru debugging
      console.log("Bot configuration saved:", botConfig);
      
      setSaveStatus('saved');
      setHasUnsavedChanges(false);
      
      // Reset status după 3 secunde
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error("Error saving bot:", error);
      setSaveStatus('error');
      
      // Reset status după 3 secunde
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const handleDeploy = () => {
    console.log("Deploying bot:", botConfig);
    alert("Bot deployed successfully!");
  };

  const handleTestBot = async () => {
    if (!testMessage.trim() || isTesting) return;
    
    setIsTesting(true);
    setTestResponse("");
    
    try {
      // Try RAG API first, fallback to simple bot
      let response;
      let data;
      
      try {
        response = await fetch('http://localhost:5000/api/rag/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: testMessage,
            sessionId: 'test-session',
            conversationHistory: testHistory.slice(-3) // Last 3 messages for context
          })
        });
        
        if (response.ok) {
          data = await response.json();
          setTestResponse(`${data.reply}\n\n[Method: ${data.method}, Confidence: ${(data.confidence * 100).toFixed(1)}%]`);
        } else {
          throw new Error('RAG API failed');
        }
      } catch (ragError) {
        console.log('RAG API not available, using simple bot...');
        
        // Fallback to simple bot
        response = await fetch('http://localhost:5000/api/bot/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({
            message: testMessage,
            botConfig: botConfig
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to test bot');
        }
        
        data = await response.json();
        setTestResponse(data.response);
      }
      
      // Add to test history
      const newTest = {
        id: data.conversationId || Date.now().toString(),
        message: testMessage,
        response: data.reply || data.response,
        timestamp: new Date().toISOString(),
        method: data.method || 'simple',
        confidence: data.confidence || 1.0
      };
      setTestHistory(prev => [...prev, newTest]);
      setCurrentConversationId(newTest.id);
      setShowFeedback(true);
      
      // Clear test message
      setTestMessage("");
      
    } catch (error) {
      console.error('Error testing bot:', error);
      setTestResponse("Sorry, there was an error testing the bot. Please try again.");
    } finally {
      setIsTesting(false);
    }
  };

  const handleFeedback = async (rating: number, feedback: string, improvement: string) => {
    if (!currentConversationId) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/rag/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: currentConversationId,
          rating,
          feedback,
          improvement
        })
      });
      
      if (response.ok) {
        alert('Feedback saved for training! Thank you for helping improve the bot.');
        setShowFeedback(false);
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newDocuments = Array.from(files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      }));
      setBotConfig(prev => ({
        ...prev,
        documents: [...prev.documents, ...newDocuments]
      }));
    }
  };

  const handleTestConnection = () => {
    console.log("Testing phone/WhatsApp connection...");
    alert("Connection test initiated! Check the verification status.");
  };

  const handleToggleChannel = (channel: string) => {
    setBotConfig(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: !prev.channels[channel]
      }
    }));
  };

  const handleCopyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(""), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleWebsiteScraping = async () => {
    if (!websiteUrl) {
      alert("Please enter a website URL");
      return;
    }

    setIsScraping(true);
    try {
      // Simulate website scraping and content structuring
      console.log("Scraping website:", websiteUrl);
      
      // Simulate API call to scraping service
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Add scraped content to knowledge base
      const scrapedContent = {
        id: Date.now().toString(),
        type: "website",
        source: websiteUrl,
        title: "Scraped Content",
        content: "Website content has been scraped and structured",
        structured: true,
        timestamp: new Date().toISOString()
      };

      setBotConfig(prev => ({
        ...prev,
        knowledgeBase: [...prev.knowledgeBase, scrapedContent]
      }));

      alert("Website content scraped and structured successfully!");
    } catch (error) {
      console.error("Scraping failed:", error);
      alert("Failed to scrape website content");
    } finally {
      setIsScraping(false);
    }
  };

  const handleContentStructuring = (content: any) => {
    // Simulate AI content structuring
    const structuredContent = {
      ...content,
      structured: true,
      categories: ["General", "FAQ", "Product Info"],
      keywords: ["business", "services", "contact"],
      summary: "AI-generated summary of the content"
    };
    
    setBotConfig(prev => ({
      ...prev,
      knowledgeBase: prev.knowledgeBase.map(item => 
        item.id === content.id ? structuredContent : item
      )
    }));
  };

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    // Update current step based on tab
    const tabSteps = {
      "basic": 1,
      "integration": 2,
      "knowledge": 3,
      "ai": 4,
      "channels": 5,
      "business": 6
    };
    setCurrentStep(tabSteps[tabValue] || 1);
  };

  const steps = [
    { id: 1, title: "Basic Info", icon: Bot },
    { id: 2, title: "Integration", icon: Settings },
    { id: 3, title: "Knowledge", icon: Brain },
    { id: 4, title: "AI Settings", icon: Zap },
    { id: 5, title: "Channels", icon: MessageSquare },
    { id: 6, title: "Preview", icon: Eye }
  ];

  return (
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleTest}>
              <Eye className="mr-2 w-4 h-4" />
              {isPreviewMode ? "Exit Preview" : "Preview"}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSave}
              disabled={isSaving}
              className={`relative ${
                saveStatus === 'saved' ? 'bg-green-50 border-green-200 text-green-700' : 
                saveStatus === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 
                saveStatus === 'saving' ? 'bg-blue-50 border-blue-200 text-blue-700' : 
                hasUnsavedChanges ? 'bg-orange-50 border-orange-200 text-orange-700' : ''
              }`}
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="mr-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Check className="mr-2 w-4 h-4" />
                  Saved!
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <Save className="mr-2 w-4 h-4" />
                  Save Failed
                </>
              ) : (
                <>
                  <Save className="mr-2 w-4 h-4" />
                  {hasUnsavedChanges ? 'Save Changes' : 'Save'}
                </>
              )}
            </Button>
            <Button className="bg-whatsapp hover:bg-whatsapp/90" onClick={handleDeploy}>
              <Zap className="mr-2 w-4 h-4" />
              Deploy Bot
            </Button>
          </div>
        </div>


        <div className="grid lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  Basic
                </TabsTrigger>
                <TabsTrigger value="integration" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Integration
                </TabsTrigger>
                <TabsTrigger value="knowledge" className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Knowledge
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  AI Settings
                </TabsTrigger>
                <TabsTrigger value="channels" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Channels
                </TabsTrigger>
                <TabsTrigger value="business" className="flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Business
                </TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Set up your bot's basic details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Bot Name</label>
                      <Input
                        value={botConfig.name}
                        onChange={(e) => handleConfigChange('name', e.target.value)}
                        className="mt-1"
                        placeholder="Enter bot name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={botConfig.description}
                        onChange={(e) => handleConfigChange('description', e.target.value)}
                        className="mt-1"
                        placeholder="Describe your bot's purpose"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Language</label>
                      <Select value={botConfig.language} onValueChange={(value) => handleConfigChange('language', value)}>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Romanian">Romanian</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="German">German</SelectItem>
                          <SelectItem value="Italian">Italian</SelectItem>
                          <SelectItem value="Portuguese">Portuguese</SelectItem>
                          <SelectItem value="Dutch">Dutch</SelectItem>
                          <SelectItem value="Polish">Polish</SelectItem>
                          <SelectItem value="Russian">Russian</SelectItem>
                          <SelectItem value="Chinese">Chinese</SelectItem>
                          <SelectItem value="Japanese">Japanese</SelectItem>
                          <SelectItem value="Korean">Korean</SelectItem>
                          <SelectItem value="Arabic">Arabic</SelectItem>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Integration Tab */}
              <TabsContent value="integration" className="space-y-6">
                {/* WhatsApp Business Integration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                      </div>
                      WhatsApp Business Integration
                    </CardTitle>
                    <CardDescription>Connect your bot to WhatsApp Business for customer support</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* WhatsApp Setup Instructions */}
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        WhatsApp Business Setup Instructions
                      </h4>
                      <div className="space-y-2 text-sm text-green-800">
                        <p><strong>Step 1:</strong> Get a WhatsApp Business account</p>
                        <p><strong>Step 2:</strong> Verify your business phone number</p>
                        <p><strong>Step 3:</strong> Get your Business ID from Meta Business</p>
                        <p><strong>Step 4:</strong> Configure webhook for message events</p>
                      </div>
                    </div>

                    {/* Phone Number Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <div className="group relative">
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                          <div className="absolute left-8 top-0 w-80 p-4 bg-card border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                            <div className="space-y-3">
                              <h4 className="font-medium text-foreground">Phone Number Requirements:</h4>
                              <ul className="text-sm text-gray-700 space-y-1">
                                <li>• Must be a real business phone number</li>
                                <li>• Must be able to receive SMS for verification</li>
                                <li>• Format: +[country code][number]</li>
                                <li>• This becomes your WhatsApp Business number</li>
                              </ul>
                              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                                Examples: +1 555 123 4567 (US) or +40 721 234 567 (Romania)
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
                            <SelectItem value="+39">🇮🇹 +39 (IT)</SelectItem>
                            <SelectItem value="+34">🇪🇸 +34 (ES)</SelectItem>
                            <SelectItem value="+31">🇳🇱 +31 (NL)</SelectItem>
                            <SelectItem value="+46">🇸🇪 +46 (SE)</SelectItem>
                            <SelectItem value="+47">🇳🇴 +47 (NO)</SelectItem>
                            <SelectItem value="+45">🇩🇰 +45 (DK)</SelectItem>
                            <SelectItem value="+41">🇨🇭 +41 (CH)</SelectItem>
                            <SelectItem value="+43">🇦🇹 +43 (AT)</SelectItem>
                            <SelectItem value="+32">🇧🇪 +32 (BE)</SelectItem>
                            <SelectItem value="+48">🇵🇱 +48 (PL)</SelectItem>
                            <SelectItem value="+420">🇨🇿 +420 (CZ)</SelectItem>
                            <SelectItem value="+421">🇸🇰 +421 (SK)</SelectItem>
                            <SelectItem value="+36">🇭🇺 +36 (HU)</SelectItem>
                            <SelectItem value="+385">🇭🇷 +385 (HR)</SelectItem>
                            <SelectItem value="+386">🇸🇮 +386 (SI)</SelectItem>
                            <SelectItem value="+372">🇪🇪 +372 (EE)</SelectItem>
                            <SelectItem value="+371">🇱🇻 +371 (LV)</SelectItem>
                            <SelectItem value="+370">🇱🇹 +370 (LT)</SelectItem>
                            <SelectItem value="+359">🇧🇬 +359 (BG)</SelectItem>
                            <SelectItem value="+40">🇷🇴 +40 (RO)</SelectItem>
                            <SelectItem value="+7">🇷🇺 +7 (RU)</SelectItem>
                            <SelectItem value="+90">🇹🇷 +90 (TR)</SelectItem>
                            <SelectItem value="+86">🇨🇳 +86 (CN)</SelectItem>
                            <SelectItem value="+81">🇯🇵 +81 (JP)</SelectItem>
                            <SelectItem value="+82">🇰🇷 +82 (KR)</SelectItem>
                            <SelectItem value="+65">🇸🇬 +65 (SG)</SelectItem>
                            <SelectItem value="+60">🇲🇾 +60 (MY)</SelectItem>
                            <SelectItem value="+66">🇹🇭 +66 (TH)</SelectItem>
                            <SelectItem value="+63">🇵🇭 +63 (PH)</SelectItem>
                            <SelectItem value="+61">🇦🇺 +61 (AU)</SelectItem>
                            <SelectItem value="+64">🇳🇿 +64 (NZ)</SelectItem>
                            <SelectItem value="+55">🇧🇷 +55 (BR)</SelectItem>
                            <SelectItem value="+54">🇦🇷 +54 (AR)</SelectItem>
                            <SelectItem value="+56">🇨🇱 +56 (CL)</SelectItem>
                            <SelectItem value="+57">🇨🇴 +57 (CO)</SelectItem>
                            <SelectItem value="+52">🇲🇽 +52 (MX)</SelectItem>
                            <SelectItem value="+1">🇨🇦 +1 (CA)</SelectItem>
                            <SelectItem value="+91">🇮🇳 +91 (IN)</SelectItem>
                            <SelectItem value="+92">🇵🇰 +92 (PK)</SelectItem>
                            <SelectItem value="+880">🇧🇩 +880 (BD)</SelectItem>
                            <SelectItem value="+94">🇱🇰 +94 (LK)</SelectItem>
                            <SelectItem value="+977">🇳🇵 +977 (NP)</SelectItem>
                            <SelectItem value="+975">🇧🇹 +975 (BT)</SelectItem>
                            <SelectItem value="+93">🇦🇫 +93 (AF)</SelectItem>
                            <SelectItem value="+98">🇮🇷 +98 (IR)</SelectItem>
                            <SelectItem value="+964">🇮🇶 +964 (IQ)</SelectItem>
                            <SelectItem value="+966">🇸🇦 +966 (SA)</SelectItem>
                            <SelectItem value="+971">🇦🇪 +971 (AE)</SelectItem>
                            <SelectItem value="+974">🇶🇦 +974 (QA)</SelectItem>
                            <SelectItem value="+965">🇰🇼 +965 (KW)</SelectItem>
                            <SelectItem value="+973">🇧🇭 +973 (BH)</SelectItem>
                            <SelectItem value="+968">🇴🇲 +968 (OM)</SelectItem>
                            <SelectItem value="+967">🇾🇪 +967 (YE)</SelectItem>
                            <SelectItem value="+20">🇪🇬 +20 (EG)</SelectItem>
                            <SelectItem value="+27">🇿🇦 +27 (ZA)</SelectItem>
                            <SelectItem value="+234">🇳🇬 +234 (NG)</SelectItem>
                            <SelectItem value="+254">🇰🇪 +254 (KE)</SelectItem>
                            <SelectItem value="+256">🇺🇬 +256 (UG)</SelectItem>
                            <SelectItem value="+250">🇷🇼 +250 (RW)</SelectItem>
                            <SelectItem value="+255">🇹🇿 +255 (TZ)</SelectItem>
                            <SelectItem value="+233">🇬🇭 +233 (GH)</SelectItem>
                            <SelectItem value="+225">🇨🇮 +225 (CI)</SelectItem>
                            <SelectItem value="+221">🇸🇳 +221 (SN)</SelectItem>
                            <SelectItem value="+223">🇲🇱 +223 (ML)</SelectItem>
                            <SelectItem value="+226">🇧🇫 +226 (BF)</SelectItem>
                            <SelectItem value="+227">🇳🇪 +227 (NE)</SelectItem>
                            <SelectItem value="+228">🇹🇬 +228 (TG)</SelectItem>
                            <SelectItem value="+229">🇧🇯 +229 (BJ)</SelectItem>
                            <SelectItem value="+230">🇲🇺 +230 (MU)</SelectItem>
                            <SelectItem value="+231">🇱🇷 +231 (LR)</SelectItem>
                            <SelectItem value="+232">🇸🇱 +232 (SL)</SelectItem>
                            <SelectItem value="+234">🇳🇬 +234 (NG)</SelectItem>
                            <SelectItem value="+235">🇹🇩 +235 (TD)</SelectItem>
                            <SelectItem value="+236">🇨🇫 +236 (CF)</SelectItem>
                            <SelectItem value="+237">🇨🇲 +237 (CM)</SelectItem>
                            <SelectItem value="+238">🇨🇻 +238 (CV)</SelectItem>
                            <SelectItem value="+239">🇸🇹 +239 (ST)</SelectItem>
                            <SelectItem value="+240">🇬🇶 +240 (GQ)</SelectItem>
                            <SelectItem value="+241">🇬🇦 +241 (GA)</SelectItem>
                            <SelectItem value="+242">🇨🇬 +242 (CG)</SelectItem>
                            <SelectItem value="+243">🇨🇩 +243 (CD)</SelectItem>
                            <SelectItem value="+244">🇦🇴 +244 (AO)</SelectItem>
                            <SelectItem value="+245">🇬🇼 +245 (GW)</SelectItem>
                            <SelectItem value="+246">🇮🇴 +246 (IO)</SelectItem>
                            <SelectItem value="+247">🇦🇨 +247 (AC)</SelectItem>
                            <SelectItem value="+248">🇸🇨 +248 (SC)</SelectItem>
                            <SelectItem value="+249">🇸🇩 +249 (SD)</SelectItem>
                            <SelectItem value="+250">🇷🇼 +250 (RW)</SelectItem>
                            <SelectItem value="+251">🇪🇹 +251 (ET)</SelectItem>
                            <SelectItem value="+252">🇸🇴 +252 (SO)</SelectItem>
                            <SelectItem value="+253">🇩🇯 +253 (DJ)</SelectItem>
                            <SelectItem value="+254">🇰🇪 +254 (KE)</SelectItem>
                            <SelectItem value="+255">🇹🇿 +255 (TZ)</SelectItem>
                            <SelectItem value="+256">🇺🇬 +256 (UG)</SelectItem>
                            <SelectItem value="+257">🇧🇮 +257 (BI)</SelectItem>
                            <SelectItem value="+258">🇲🇿 +258 (MZ)</SelectItem>
                            <SelectItem value="+260">🇿🇲 +260 (ZM)</SelectItem>
                            <SelectItem value="+261">🇲🇬 +261 (MG)</SelectItem>
                            <SelectItem value="+262">🇷🇪 +262 (RE)</SelectItem>
                            <SelectItem value="+263">🇿🇼 +263 (ZW)</SelectItem>
                            <SelectItem value="+264">🇳🇦 +264 (NA)</SelectItem>
                            <SelectItem value="+265">🇲🇼 +265 (MW)</SelectItem>
                            <SelectItem value="+266">🇱🇸 +266 (LS)</SelectItem>
                            <SelectItem value="+267">🇧🇼 +267 (BW)</SelectItem>
                            <SelectItem value="+268">🇸🇿 +268 (SZ)</SelectItem>
                            <SelectItem value="+269">🇰🇲 +269 (KM)</SelectItem>
                            <SelectItem value="+290">🇸🇭 +290 (SH)</SelectItem>
                            <SelectItem value="+291">🇪🇷 +291 (ER)</SelectItem>
                            <SelectItem value="+297">🇦🇼 +297 (AW)</SelectItem>
                            <SelectItem value="+298">🇫🇴 +298 (FO)</SelectItem>
                            <SelectItem value="+299">🇬🇱 +299 (GL)</SelectItem>
                            <SelectItem value="+350">🇬🇮 +350 (GI)</SelectItem>
                            <SelectItem value="+351">🇵🇹 +351 (PT)</SelectItem>
                            <SelectItem value="+352">🇱🇺 +352 (LU)</SelectItem>
                            <SelectItem value="+353">🇮🇪 +353 (IE)</SelectItem>
                            <SelectItem value="+354">🇮🇸 +354 (IS)</SelectItem>
                            <SelectItem value="+355">🇦🇱 +355 (AL)</SelectItem>
                            <SelectItem value="+356">🇲🇹 +356 (MT)</SelectItem>
                            <SelectItem value="+357">🇨🇾 +357 (CY)</SelectItem>
                            <SelectItem value="+358">🇫🇮 +358 (FI)</SelectItem>
                            <SelectItem value="+359">🇧🇬 +359 (BG)</SelectItem>
                            <SelectItem value="+370">🇱🇹 +370 (LT)</SelectItem>
                            <SelectItem value="+371">🇱🇻 +371 (LV)</SelectItem>
                            <SelectItem value="+372">🇪🇪 +372 (EE)</SelectItem>
                            <SelectItem value="+373">🇲🇩 +373 (MD)</SelectItem>
                            <SelectItem value="+374">🇦🇲 +374 (AM)</SelectItem>
                            <SelectItem value="+375">🇧🇾 +375 (BY)</SelectItem>
                            <SelectItem value="+376">🇦🇩 +376 (AD)</SelectItem>
                            <SelectItem value="+377">🇲🇨 +377 (MC)</SelectItem>
                            <SelectItem value="+378">🇸🇲 +378 (SM)</SelectItem>
                            <SelectItem value="+380">🇺🇦 +380 (UA)</SelectItem>
                            <SelectItem value="+381">🇷🇸 +381 (RS)</SelectItem>
                            <SelectItem value="+382">🇲🇪 +382 (ME)</SelectItem>
                            <SelectItem value="+383">🇽🇰 +383 (XK)</SelectItem>
                            <SelectItem value="+385">🇭🇷 +385 (HR)</SelectItem>
                            <SelectItem value="+386">🇸🇮 +386 (SI)</SelectItem>
                            <SelectItem value="+387">🇧🇦 +387 (BA)</SelectItem>
                            <SelectItem value="+389">🇲🇰 +389 (MK)</SelectItem>
                            <SelectItem value="+420">🇨🇿 +420 (CZ)</SelectItem>
                            <SelectItem value="+421">🇸🇰 +421 (SK)</SelectItem>
                            <SelectItem value="+423">🇱🇮 +423 (LI)</SelectItem>
                            <SelectItem value="+500">🇫🇰 +500 (FK)</SelectItem>
                            <SelectItem value="+501">🇧🇿 +501 (BZ)</SelectItem>
                            <SelectItem value="+502">🇬🇹 +502 (GT)</SelectItem>
                            <SelectItem value="+503">🇸🇻 +503 (SV)</SelectItem>
                            <SelectItem value="+504">🇭🇳 +504 (HN)</SelectItem>
                            <SelectItem value="+505">🇳🇮 +505 (NI)</SelectItem>
                            <SelectItem value="+506">🇨🇷 +506 (CR)</SelectItem>
                            <SelectItem value="+507">🇵🇦 +507 (PA)</SelectItem>
                            <SelectItem value="+508">🇵🇲 +508 (PM)</SelectItem>
                            <SelectItem value="+509">🇭🇹 +509 (HT)</SelectItem>
                            <SelectItem value="+590">🇬🇵 +590 (GP)</SelectItem>
                            <SelectItem value="+591">🇧🇴 +591 (BO)</SelectItem>
                            <SelectItem value="+592">🇬🇾 +592 (GY)</SelectItem>
                            <SelectItem value="+593">🇪🇨 +593 (EC)</SelectItem>
                            <SelectItem value="+594">🇬🇫 +594 (GF)</SelectItem>
                            <SelectItem value="+595">🇵🇾 +595 (PY)</SelectItem>
                            <SelectItem value="+596">🇲🇶 +596 (MQ)</SelectItem>
                            <SelectItem value="+597">🇸🇷 +597 (SR)</SelectItem>
                            <SelectItem value="+598">🇺🇾 +598 (UY)</SelectItem>
                            <SelectItem value="+599">🇧🇶 +599 (BQ)</SelectItem>
                            <SelectItem value="+670">🇹🇱 +670 (TL)</SelectItem>
                            <SelectItem value="+672">🇦🇶 +672 (AQ)</SelectItem>
                            <SelectItem value="+673">🇧🇳 +673 (BN)</SelectItem>
                            <SelectItem value="+674">🇳🇷 +674 (NR)</SelectItem>
                            <SelectItem value="+675">🇵🇬 +675 (PG)</SelectItem>
                            <SelectItem value="+676">🇹🇴 +676 (TO)</SelectItem>
                            <SelectItem value="+677">🇸🇧 +677 (SB)</SelectItem>
                            <SelectItem value="+678">🇻🇺 +678 (VU)</SelectItem>
                            <SelectItem value="+679">🇫🇯 +679 (FJ)</SelectItem>
                            <SelectItem value="+680">🇵🇼 +680 (PW)</SelectItem>
                            <SelectItem value="+681">🇼🇫 +681 (WF)</SelectItem>
                            <SelectItem value="+682">🇨🇰 +682 (CK)</SelectItem>
                            <SelectItem value="+683">🇳🇺 +683 (NU)</SelectItem>
                            <SelectItem value="+684">🇦🇸 +684 (AS)</SelectItem>
                            <SelectItem value="+685">🇼🇸 +685 (WS)</SelectItem>
                            <SelectItem value="+686">🇰🇮 +686 (KI)</SelectItem>
                            <SelectItem value="+687">🇳🇨 +687 (NC)</SelectItem>
                            <SelectItem value="+688">🇹🇻 +688 (TV)</SelectItem>
                            <SelectItem value="+689">🇵🇫 +689 (PF)</SelectItem>
                            <SelectItem value="+690">🇹🇰 +690 (TK)</SelectItem>
                            <SelectItem value="+691">🇫🇲 +691 (FM)</SelectItem>
                            <SelectItem value="+692">🇲🇭 +692 (MH)</SelectItem>
                            <SelectItem value="+850">🇰🇵 +850 (KP)</SelectItem>
                            <SelectItem value="+852">🇭🇰 +852 (HK)</SelectItem>
                            <SelectItem value="+853">🇲🇴 +853 (MO)</SelectItem>
                            <SelectItem value="+855">🇰🇭 +855 (KH)</SelectItem>
                            <SelectItem value="+856">🇱🇦 +856 (LA)</SelectItem>
                            <SelectItem value="+880">🇧🇩 +880 (BD)</SelectItem>
                            <SelectItem value="+886">🇹🇼 +886 (TW)</SelectItem>
                            <SelectItem value="+960">🇲🇻 +960 (MV)</SelectItem>
                            <SelectItem value="+961">🇱🇧 +961 (LB)</SelectItem>
                            <SelectItem value="+962">🇯🇴 +962 (JO)</SelectItem>
                            <SelectItem value="+963">🇸🇾 +963 (SY)</SelectItem>
                            <SelectItem value="+964">🇮🇶 +964 (IQ)</SelectItem>
                            <SelectItem value="+965">🇰🇼 +965 (KW)</SelectItem>
                            <SelectItem value="+966">🇸🇦 +966 (SA)</SelectItem>
                            <SelectItem value="+967">🇾🇪 +967 (YE)</SelectItem>
                            <SelectItem value="+968">🇴🇲 +968 (OM)</SelectItem>
                            <SelectItem value="+970">🇵🇸 +970 (PS)</SelectItem>
                            <SelectItem value="+971">🇦🇪 +971 (AE)</SelectItem>
                            <SelectItem value="+972">🇮🇱 +972 (IL)</SelectItem>
                            <SelectItem value="+973">🇧🇭 +973 (BH)</SelectItem>
                            <SelectItem value="+974">🇶🇦 +974 (QA)</SelectItem>
                            <SelectItem value="+975">🇧🇹 +975 (BT)</SelectItem>
                            <SelectItem value="+976">🇲🇳 +976 (MN)</SelectItem>
                            <SelectItem value="+977">🇳🇵 +977 (NP)</SelectItem>
                            <SelectItem value="+992">🇹🇯 +992 (TJ)</SelectItem>
                            <SelectItem value="+993">🇹🇲 +993 (TM)</SelectItem>
                            <SelectItem value="+994">🇦🇿 +994 (AZ)</SelectItem>
                            <SelectItem value="+995">🇬🇪 +995 (GE)</SelectItem>
                            <SelectItem value="+996">🇰🇬 +996 (KG)</SelectItem>
                            <SelectItem value="+998">🇺🇿 +998 (UZ)</SelectItem>
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

                    {/* WhatsApp Business ID Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">WhatsApp Business ID</label>
                        <div className="group relative">
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                          <div className="absolute left-8 top-0 w-80 p-4 bg-card border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                            <div className="space-y-3">
                              <h4 className="font-medium text-foreground">How to get your WhatsApp Business ID:</h4>
                              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                                <li>Go to <a href="https://business.whatsapp.com" target="_blank" className="text-blue-600 underline">business.whatsapp.com</a></li>
                                <li>Create a WhatsApp Business account</li>
                                <li>Verify your business phone number</li>
                                <li>Get your Business ID from the API settings</li>
                                <li>It looks like: 123456789012345</li>
                              </ol>
                              <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                                Note: You need a Facebook Business account
                              </div>
                              <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                                Format: 15-digit number (e.g., 123456789012345)
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
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

                    {/* Webhook URL Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Webhook URL</label>
                        <div className="group relative">
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                          <div className="absolute left-8 top-0 w-80 p-4 bg-card border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                            <div className="space-y-3">
                              <h4 className="font-medium text-foreground">What is a webhook URL?</h4>
                              <p className="text-sm text-gray-700">A webhook URL is where WhatsApp sends message events (new messages, delivery status, etc.)</p>
                              <div className="space-y-2">
                                <p className="font-medium text-sm">Requirements:</p>
                                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                                  <li>Must be HTTPS (not HTTP)</li>
                                  <li>Must be publicly accessible</li>
                                  <li>Should return 200 status code</li>
                                  <li>Example: https://yourdomain.com/webhook</li>
                                </ul>
                              </div>
                              <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                                Must be HTTPS and publicly accessible
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
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
                  </CardContent>
                </Card>

                {/* Facebook Messenger Integration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                      </div>
                      Facebook Messenger Integration
                    </CardTitle>
                    <CardDescription>Connect your bot to Facebook Messenger for social media support</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Facebook Setup Instructions */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Facebook Messenger Setup Instructions
                      </h4>
                      <div className="space-y-2 text-sm text-blue-900 dark:text-blue-100">
                        <p><strong>Step 1:</strong> Create a Facebook Business account</p>
                        <p><strong>Step 2:</strong> Go to Facebook Developers and create an App</p>
                        <p><strong>Step 3:</strong> Add Messenger product to your App</p>
                        <p><strong>Step 4:</strong> Get Page Access Token from your Facebook Page</p>
                        <p><strong>Step 5:</strong> Configure webhook URL for message events</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-foreground">Facebook App ID</label>
                        <div className="group relative">
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                          <div className="absolute left-8 top-0 w-80 p-4 bg-card border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                            <div className="space-y-3">
                              <h4 className="font-medium text-foreground">Facebook App ID:</h4>
                              <p className="text-sm text-gray-700">Found in your Facebook App settings under "App ID"</p>
                              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                                Example: 1234567890123456
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Input
                        placeholder="1234567890123456"
                        className="text-sm"
                        readOnly
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-foreground">Page Access Token</label>
                        <div className="group relative">
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                          <div className="absolute left-8 top-0 w-80 p-4 bg-card border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                            <div className="space-y-3">
                              <h4 className="font-medium text-foreground">Page Access Token:</h4>
                              <p className="text-sm text-gray-700">Get this from your Facebook Page settings under "Messenger"</p>
                              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                                Example: EAAxxxxxxxxxxxxxxxxxxxxx
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
                  </CardContent>
                </Card>

                {/* Telegram Bot Integration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-cyan-600" />
                      </div>
                      Telegram Bot Integration
                    </CardTitle>
                    <CardDescription>Create a Telegram bot for instant messaging support</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Telegram Setup Instructions */}
                    <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                      <h4 className="font-medium text-cyan-900 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        Telegram Bot Setup Instructions
                      </h4>
                      <div className="space-y-2 text-sm text-cyan-800">
                        <p><strong>Step 1:</strong> Open Telegram and search for @BotFather</p>
                        <p><strong>Step 2:</strong> Send /newbot command to BotFather</p>
                        <p><strong>Step 3:</strong> Choose a name for your bot (e.g., "My Company Bot")</p>
                        <p><strong>Step 4:</strong> Choose a username (e.g., "mycompany_bot")</p>
                        <p><strong>Step 5:</strong> Copy the bot token provided by BotFather</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Telegram Bot Token</label>
                        <div className="group relative">
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                          <div className="absolute left-8 top-0 w-80 p-4 bg-card border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                            <div className="space-y-3">
                              <h4 className="font-medium text-foreground">Bot Token:</h4>
                              <p className="text-sm text-gray-700">Get this from @BotFather after creating your bot</p>
                              <div className="text-xs text-cyan-600 bg-cyan-50 p-2 rounded">
                                Example: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
                  </CardContent>
                </Card>

                {/* Website Chat Widget Integration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Monitor className="w-4 h-4 text-purple-600" />
                      </div>
                      Website Chat Widget Integration
                    </CardTitle>
                    <CardDescription>Embed a chat widget on your website for customer support</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Website Widget Setup Instructions */}
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Website Widget Setup Instructions
                      </h4>
                      <div className="space-y-2 text-sm text-purple-800">
                        <p><strong>Step 1:</strong> Enter your website domain</p>
                        <p><strong>Step 2:</strong> Click "Get Code" to generate the widget code</p>
                        <p><strong>Step 3:</strong> Copy the generated JavaScript code</p>
                        <p><strong>Step 4:</strong> Paste the code in your website's HTML (before &lt;/body&gt; tag)</p>
                        <p><strong>Step 5:</strong> Customize the widget appearance in the settings</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Website Domain</label>
                        <div className="group relative">
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                          <div className="absolute left-8 top-0 w-80 p-4 bg-card border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                            <div className="space-y-3">
                              <h4 className="font-medium text-foreground">Website Domain:</h4>
                              <p className="text-sm text-gray-700">Enter your website domain where the widget will be embedded</p>
                              <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded">
                                Examples: yourcompany.com, www.yourcompany.com, subdomain.yourcompany.com
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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

                    {/* Generated Code Preview */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-foreground mb-2">Generated Widget Code:</h4>
                      <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono">
                        &lt;script src="https://your-domain.com/widget.js"&gt;&lt;/script&gt;
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Paste this code before the closing &lt;/body&gt; tag in your website's HTML
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Verification Status */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Integration Status
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">WhatsApp Business</span>
                            <div className="group relative">
                              <HelpCircle className="w-3 h-3 text-blue-600 cursor-help" />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                Requires WhatsApp Business API access
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                          <Badge className={botConfig.whatsappBusinessId ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {botConfig.whatsappBusinessId ? "Connected" : "Not Connected"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Facebook Messenger</span>
                            <div className="group relative">
                              <HelpCircle className="w-3 h-3 text-blue-600 cursor-help" />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                Requires Facebook App and Page Access Token
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">Pending</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Telegram Bot</span>
                            <div className="group relative">
                              <HelpCircle className="w-3 h-3 text-blue-600 cursor-help" />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                Requires Telegram Bot Token from BotFather
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">Pending</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Website Widget</span>
                            <div className="group relative">
                              <HelpCircle className="w-3 h-3 text-blue-600 cursor-help" />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                Copy code and paste in your website
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Ready</Badge>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-blue-200">
                        <Button 
                          onClick={handleTestConnection}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                        >
                          Test All Connections
                        </Button>
                        <p className="text-xs text-blue-700 mt-2 text-center">
                          This will verify all configured channels and integrations
                        </p>
                      </div>
                    </div>
              </TabsContent>

              {/* Knowledge Base Tab */}
              <TabsContent value="knowledge" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Knowledge Base & Content Sources</CardTitle>
                    <CardDescription>Upload documents, scrape websites, and create structured knowledge</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Website Scraping Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Website Scraping</label>
                        <div className="group relative">
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                          <div className="absolute left-8 top-0 w-80 p-4 bg-card border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                            <div className="space-y-3">
                              <h4 className="font-medium text-foreground">Website Content Scraping</h4>
                              <p className="text-sm text-gray-700">AI will automatically scrape and structure content from websites</p>
                              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                                <li>Extracts text, headings, and structure</li>
                                <li>Identifies FAQ sections automatically</li>
                                <li>Creates searchable knowledge base</li>
                                <li>Structures content for better responses</li>
                              </ul>
                              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                                Example: https://yourcompany.com/faq
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          placeholder="https://example.com/faq"
                          className="flex-1"
                        />
                        <Button
                          onClick={handleWebsiteScraping}
                          disabled={isScraping}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isScraping ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Scraping...
                            </>
                          ) : (
                            <>
                              <Brain className="w-4 h-4 mr-2" />
                              Scrape & Structure
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        AI will analyze the website and create structured knowledge automatically
                      </div>
                    </div>

                    {/* Document Upload Section */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Upload Documents</label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.txt,.csv"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Drag and drop files here or click to browse</p>
                          <p className="text-xs text-muted-foreground mt-1">Supports PDF, DOC, TXT, CSV files</p>
                        </label>
                      </div>
                      {botConfig.documents.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <h4 className="text-sm font-medium">Uploaded Documents:</h4>
                          {botConfig.documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                              <span className="text-sm">{doc.name}</span>
                              <Badge variant="secondary">{(doc.size / 1024).toFixed(1)} KB</Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Knowledge Base Content */}
                    {botConfig.knowledgeBase.length > 0 && (
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Knowledge Base Content</label>
                        <div className="space-y-2">
                          {botConfig.knowledgeBase.map((item, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-sm font-medium">{item.title}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {item.type}
                                  </Badge>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleContentStructuring(item)}
                                    className="text-xs"
                                  >
                                    <Brain className="w-3 h-3 mr-1" />
                                    Structure
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs text-red-600"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Source: {item.source}
                              </div>
                              {item.structured && (
                                <div className="mt-2 flex gap-1">
                                  <Badge className="bg-green-100 text-green-800 text-xs">Structured</Badge>
                                  <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs">AI Processed</Badge>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* FAQ Section */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">FAQ Questions</label>
                      <Textarea
                        className="mt-1"
                        placeholder="Q: What are your business hours?&#10;A: We're open Monday-Friday 9AM-6PM&#10;&#10;Q: How can I contact support?&#10;A: You can reach us at support@company.com"
                        rows={6}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Enable FAQ</span>
                        <Badge className={botConfig.faqEnabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {botConfig.faqEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                    </div>

                    {/* AI Processing Status */}
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        AI Content Processing
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Total Sources</span>
                          <span className="text-sm font-medium">{botConfig.knowledgeBase.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Structured Content</span>
                          <span className="text-sm font-medium">
                            {botConfig.knowledgeBase.filter(item => item.structured).length}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Documents</span>
                          <span className="text-sm font-medium">{botConfig.documents.length}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* AI Settings Tab */}
              <TabsContent value="ai" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Model Configuration</CardTitle>
                    <CardDescription>Configure AI model parameters and behavior</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">AI Model</label>
                      <select
                        value={botConfig.aiModel}
                        onChange={(e) => handleConfigChange('aiModel', e.target.value)}
                        className="w-full p-2 border rounded-md mt-1"
                      >
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="gpt-4">GPT-4</option>
                        <option value="claude-3">Claude 3</option>
                        <option value="gemini-pro">Gemini Pro</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Temperature: {botConfig.temperature}</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={botConfig.temperature}
                        onChange={(e) => handleConfigChange('temperature', e.target.value)}
                        className="w-full mt-1"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>More Focused</span>
                        <span>More Creative</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Max Tokens: {botConfig.maxTokens}</label>
                      <input
                        type="range"
                        min="50"
                        max="500"
                        step="10"
                        value={botConfig.maxTokens}
                        onChange={(e) => handleConfigChange('maxTokens', e.target.value)}
                        className="w-full mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Context Window: {botConfig.contextWindow} messages</label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        step="1"
                        value={botConfig.contextWindow}
                        onChange={(e) => handleConfigChange('contextWindow', e.target.value)}
                        className="w-full mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Channels Tab */}
              <TabsContent value="channels" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Communication Channels</CardTitle>
                    <CardDescription>Select which channels your bot will be available on</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {Object.entries(botConfig.channels).map(([channel, enabled]) => (
                        <div key={channel} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                             onClick={() => handleToggleChannel(channel)}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-whatsapp/10 rounded-full flex items-center justify-center">
                              <MessageSquare className="w-4 h-4 text-whatsapp" />
                            </div>
                            <div>
                              <h4 className="font-medium capitalize">{channel}</h4>
                              <p className="text-sm text-muted-foreground">
                                {channel === 'whatsapp' && 'WhatsApp Business integration'}
                                {channel === 'website' && 'Website chat widget'}
                                {channel === 'telegram' && 'Telegram bot integration'}
                                {channel === 'facebook' && 'Facebook Messenger bot'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                              {enabled ? "Enabled" : "Disabled"}
                            </Badge>
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={() => handleToggleChannel(channel)}
                              className="w-4 h-4"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Business Hours Tab */}
              <TabsContent value="business" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Hours & Availability</CardTitle>
                    <CardDescription>Configure when your bot is available to users</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Enable Business Hours</span>
                      <Badge className={botConfig.businessHours.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {botConfig.businessHours.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Timezone</label>
                      <div className="space-y-2">
                        <select
                          value={botConfig.businessHours.timezone}
                          onChange={(e) => handleConfigChange('businessHours.timezone', e.target.value)}
                          className="w-full p-2 border rounded-md mt-1"
                        >
                          <optgroup label="Auto-Detected">
                            <option value={userTimezone}>
                              {userTimezone} (Your Timezone)
                            </option>
                          </optgroup>
                          <optgroup label="Americas">
                            <option value="America/New_York">Eastern Time (ET)</option>
                            <option value="America/Chicago">Central Time (CT)</option>
                            <option value="America/Denver">Mountain Time (MT)</option>
                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                            <option value="America/Anchorage">Alaska Time (AKT)</option>
                            <option value="Pacific/Honolulu">Hawaii Time (HST)</option>
                            <option value="America/Toronto">Toronto (EST)</option>
                            <option value="America/Vancouver">Vancouver (PST)</option>
                            <option value="America/Sao_Paulo">São Paulo (BRT)</option>
                            <option value="America/Mexico_City">Mexico City (CST)</option>
                          </optgroup>
                          <optgroup label="Europe">
                            <option value="Europe/London">London (GMT/BST)</option>
                            <option value="Europe/Paris">Paris (CET)</option>
                            <option value="Europe/Berlin">Berlin (CET)</option>
                            <option value="Europe/Rome">Rome (CET)</option>
                            <option value="Europe/Madrid">Madrid (CET)</option>
                            <option value="Europe/Amsterdam">Amsterdam (CET)</option>
                            <option value="Europe/Stockholm">Stockholm (CET)</option>
                            <option value="Europe/Moscow">Moscow (MSK)</option>
                            <option value="Europe/Istanbul">Istanbul (TRT)</option>
                          </optgroup>
                          <optgroup label="Asia">
                            <option value="Asia/Tokyo">Tokyo (JST)</option>
                            <option value="Asia/Shanghai">Shanghai (CST)</option>
                            <option value="Asia/Hong_Kong">Hong Kong (HKT)</option>
                            <option value="Asia/Singapore">Singapore (SGT)</option>
                            <option value="Asia/Seoul">Seoul (KST)</option>
                            <option value="Asia/Kolkata">Mumbai/Delhi (IST)</option>
                            <option value="Asia/Dubai">Dubai (GST)</option>
                            <option value="Asia/Bangkok">Bangkok (ICT)</option>
                            <option value="Asia/Jakarta">Jakarta (WIB)</option>
                          </optgroup>
                          <optgroup label="Oceania">
                            <option value="Australia/Sydney">Sydney (AEST)</option>
                            <option value="Australia/Melbourne">Melbourne (AEST)</option>
                            <option value="Australia/Perth">Perth (AWST)</option>
                            <option value="Pacific/Auckland">Auckland (NZST)</option>
                            <option value="Pacific/Fiji">Fiji (FJT)</option>
                          </optgroup>
                          <optgroup label="Africa">
                            <option value="Africa/Cairo">Cairo (EET)</option>
                            <option value="Africa/Johannesburg">Johannesburg (SAST)</option>
                            <option value="Africa/Lagos">Lagos (WAT)</option>
                            <option value="Africa/Nairobi">Nairobi (EAT)</option>
                          </optgroup>
                          <optgroup label="UTC">
                            <option value="UTC">UTC (Coordinated Universal Time)</option>
                          </optgroup>
                        </select>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Detected: {userTimezone}</span>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setBotConfig(prev => ({
                                ...prev,
                                businessHours: {
                                  ...prev.businessHours,
                                  timezone: userTimezone
                                }
                              }));
                            }}
                            className="text-xs"
                          >
                            Use My Timezone
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium">Weekly Schedule</h4>
                      {Object.entries(botConfig.businessHours.schedule).map(([day, schedule]) => (
                        <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={schedule.enabled}
                              onChange={(e) => {
                                const newSchedule = { ...botConfig.businessHours.schedule };
                                newSchedule[day] = { ...schedule, enabled: e.target.checked };
                                setBotConfig(prev => ({
                                  ...prev,
                                  businessHours: {
                                    ...prev.businessHours,
                                    schedule: newSchedule
                                  }
                                }));
                              }}
                            />
                            <span className="font-medium capitalize">{day}</span>
                          </div>
                          {schedule.enabled && (
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={schedule.start}
                                className="p-1 border rounded text-sm"
                              />
                              <span>to</span>
                              <input
                                type="time"
                                value={schedule.end}
                                className="p-1 border rounded text-sm"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Personality Tab */}
              <TabsContent value="personality" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personality & Behavior</CardTitle>
                    <CardDescription>Define how your bot interacts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Personality</label>
                      <select
                        value={botConfig.personality}
                        onChange={(e) => handleConfigChange('personality', e.target.value)}
                        className="w-full p-2 border rounded-md mt-1"
                      >
                        <option value="friendly">Friendly</option>
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="formal">Formal</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Response Style</label>
                      <select
                        value={botConfig.responseStyle}
                        onChange={(e) => handleConfigChange('responseStyle', e.target.value)}
                        className="w-full p-2 border rounded-md mt-1"
                      >
                        <option value="conversational">Conversational</option>
                        <option value="direct">Direct</option>
                        <option value="detailed">Detailed</option>
                        <option value="brief">Brief</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Welcome Message</label>
                      <Textarea
                        value={botConfig.welcomeMessage}
                        onChange={(e) => handleConfigChange('welcomeMessage', e.target.value)}
                        className="mt-1"
                        placeholder="First message users will see"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Fallback Message</label>
                      <Textarea
                        value={botConfig.fallbackMessage}
                        onChange={(e) => handleConfigChange('fallbackMessage', e.target.value)}
                        className="mt-1"
                        placeholder="Message when bot doesn't understand"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appearance Tab */}
              <TabsContent value="appearance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance & Branding</CardTitle>
                    <CardDescription>Customize your bot's look</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Bot Avatar</label>
                      <Input
                        value={botConfig.avatar}
                        onChange={(e) => handleConfigChange('avatar', e.target.value)}
                        className="mt-1"
                        placeholder="🤖"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Primary Color</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={botConfig.color}
                          onChange={(e) => handleConfigChange('color', e.target.value)}
                          className="w-12 h-10 border rounded"
                        />
                        <Input
                          value={botConfig.color}
                          onChange={(e) => handleConfigChange('color', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Font Size</label>
                        <select className="w-full p-2 border rounded-md mt-1">
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Theme</label>
                        <select className="w-full p-2 border rounded-md mt-1">
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="auto">Auto</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Settings</CardTitle>
                    <CardDescription>Configure bot behavior and limits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Auto-responses</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Human handoff</span>
                      <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">Available</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Learning mode</span>
                      <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">Active</Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Response Timeout (seconds)</label>
                      <Input
                        type="number"
                        value={botConfig.responseTimeout || "30"}
                        onChange={(e) => handleConfigChange('responseTimeout', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Additional Information Cards */}
            <div className="space-y-4">
              {/* Bot Status Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${botConfig.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    Bot Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Status</span>
                    <Badge className={botConfig.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {botConfig.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Channels</span>
                    <span className="text-sm font-medium">
                      {Object.values(botConfig.channels).filter(Boolean).length} enabled
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Documents</span>
                    <span className="text-sm font-medium">{botConfig.documents.length} uploaded</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">AI Model</span>
                    <span className="text-sm font-medium">{botConfig.aiModel}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-whatsapp">{botConfig.temperature}</div>
                      <div className="text-xs text-muted-foreground">Temperature</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-whatsapp">{botConfig.maxTokens}</div>
                      <div className="text-xs text-muted-foreground">Max Tokens</div>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-whatsapp">{botConfig.contextWindow}</div>
                    <div className="text-xs text-muted-foreground">Context Messages</div>
                  </div>
                </CardContent>
              </Card>

              {/* Integration Status Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Integration Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Phone Number</span>
                    <Badge className={botConfig.phoneNumber ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {botConfig.phoneNumber ? "Set" : "Not Set"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">WhatsApp Business</span>
                    <Badge className={botConfig.whatsappBusinessId ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {botConfig.whatsappBusinessId ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Webhook</span>
                    <Badge className={botConfig.webhookUrl ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {botConfig.webhookUrl ? "Configured" : "Not Configured"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Business Hours</span>
                    <Badge className={botConfig.businessHours.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {botConfig.businessHours.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Timezone</span>
                    <span className="text-sm font-medium">{botConfig.businessHours.timezone}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const tabOrder = ["basic", "integration", "knowledge", "ai", "channels", "business"];
                    const currentIndex = tabOrder.indexOf(activeTab);
                    if (currentIndex > 0) {
                      handleTabChange(tabOrder[currentIndex - 1]);
                    }
                  }}
                  disabled={activeTab === "basic"}
                >
                  ← Previous
                </Button>
                
                <div className="flex gap-2">
                  {["basic", "integration", "knowledge", "ai", "channels", "business"].map((tab, index) => (
                    <Button
                      key={tab}
                      variant={activeTab === tab ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTabChange(tab)}
                      className="w-8 h-8 p-0"
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    const tabOrder = ["basic", "integration", "knowledge", "ai", "channels", "business"];
                    const currentIndex = tabOrder.indexOf(activeTab);
                    if (currentIndex < tabOrder.length - 1) {
                      handleTabChange(tabOrder[currentIndex + 1]);
                    }
                  }}
                  disabled={activeTab === "business"}
                >
                  Next →
                </Button>
              </div>
            </div>
          </div>

          {/* Live Preview Widget */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>See how your bot will appear to users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
                      style={{ backgroundColor: botConfig.color }}
                    >
                      {botConfig.avatar}
                    </div>
                    <div>
                      <h4 className="font-medium">{botConfig.name}</h4>
                      <p className="text-sm text-muted-foreground">Online</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="bg-card p-3 rounded-lg shadow-sm">
                      <p className="text-sm">{botConfig.welcomeMessage}</p>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="bg-whatsapp text-white p-3 rounded-lg max-w-xs">
                        <p className="text-sm">Hello! I need help with my order.</p>
                      </div>
                    </div>
                    
                    <div className="bg-card p-3 rounded-lg shadow-sm">
                      <p className="text-sm">I'd be happy to help you with your order. Can you provide me with your order number?</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-muted-foreground">Bot is typing...</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bot Testing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Test Your Bot
                </CardTitle>
                <CardDescription>
                  Test your bot's responses in real-time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Test Message</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message to test your bot..."
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleTestBot()}
                    />
                    <Button 
                      onClick={handleTestBot}
                      disabled={!testMessage.trim() || isTesting}
                    >
                      {isTesting ? 'Testing...' : 'Test'}
                    </Button>
                  </div>
                </div>
                
                {testResponse && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground mb-1">Bot Response:</div>
                    <div className="text-sm">{testResponse}</div>
                  </div>
                )}
                
               {testHistory.length > 0 && (
                 <div className="space-y-2">
                   <div className="text-sm font-medium">Recent Tests:</div>
                   <div className="max-h-32 overflow-y-auto space-y-1">
                     {testHistory.slice(-3).map((test, index) => (
                       <div key={index} className="text-xs p-2 bg-muted/50 rounded">
                         <div className="font-medium">You: {test.message}</div>
                         <div className="text-muted-foreground">Bot: {test.response}</div>
                         <div className="text-xs text-muted-foreground">
                           Method: {test.method} | Confidence: {(test.confidence * 100).toFixed(1)}%
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
               
               {showFeedback && currentConversationId && (
                 <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                   <div className="text-sm font-medium">Rate this response (1-5):</div>
                   <div className="flex gap-2">
                     {[1, 2, 3, 4, 5].map((rating) => (
                       <button
                         key={rating}
                         onClick={() => handleFeedback(rating, '', '')}
                         className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                       >
                         {rating}
                       </button>
                     ))}
                   </div>
                   <div className="text-xs text-muted-foreground">
                     Your feedback helps improve the bot's training!
                   </div>
                 </div>
               )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
        </div>
      </div>
    </div>
  );
};

export default BotBuilder;
