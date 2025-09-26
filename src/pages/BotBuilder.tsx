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
      </AdminPageLayout>
    </TooltipProvider>
  );
}
