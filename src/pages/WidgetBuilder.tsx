import React, { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code, 
  Palette, 
  Eye, 
  Download, 
  Copy, 
  Check,
  Settings,
  MessageCircle,
  Smartphone,
  Monitor,
  Globe,
  Zap,
  Shield,
  Save,
  RefreshCw
} from "lucide-react";

const WidgetBuilder = () => {
  const [widgetConfig, setWidgetConfig] = useState({
    name: "My Chat Widget",
    position: "bottom-right",
    color: "#25D366",
    size: "medium",
    welcomeMessage: "Hi! How can I help you today?",
    showAvatar: true,
    showTyping: true,
    enableSound: true,
    autoOpen: false,
    theme: "light"
  });

  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const generateWidgetCode = () => {
    return `<!-- ${widgetConfig.name} Widget -->
<script>
  (function(w,d,s,o){
    var j=d.createElement(s),f=d.getElementsByTagName(s)[0];
    j.async=1;j.src='https://your-domain.com/widget.js';
    j.setAttribute('data-bot-id', 'your-bot-id');
    j.setAttribute('data-position', '${widgetConfig.position}');
    j.setAttribute('data-color', '${widgetConfig.color}');
    j.setAttribute('data-size', '${widgetConfig.size}');
    j.setAttribute('data-welcome-message', '${widgetConfig.welcomeMessage}');
    j.setAttribute('data-show-avatar', '${widgetConfig.showAvatar}');
    j.setAttribute('data-show-typing', '${widgetConfig.showTyping}');
    j.setAttribute('data-enable-sound', '${widgetConfig.enableSound}');
    j.setAttribute('data-auto-open', '${widgetConfig.autoOpen}');
    j.setAttribute('data-theme', '${widgetConfig.theme}');
    f.parentNode.insertBefore(j,f);
  })(window,document,'script');
</script>`;
  };

  const previewStyles = {
    position: widgetConfig.position,
    backgroundColor: widgetConfig.color,
    transform: widgetConfig.size === 'small' ? 'scale(0.8)' : widgetConfig.size === 'large' ? 'scale(1.2)' : 'scale(1)'
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
              <Code className="w-8 h-8 text-whatsapp" />
              Widget Builder
            </h1>
            <p className="text-muted-foreground">Create and customize your chat widget</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Save className="mr-2 w-4 h-4" />
              Save Widget
            </Button>
            <Button className="bg-whatsapp hover:bg-whatsapp/90">
              <Download className="mr-2 w-4 h-4" />
              Export Code
            </Button>
          </div>
        </div>

        <Tabs defaultValue="design" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>

          {/* Design Tab */}
          <TabsContent value="design" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Widget Name</label>
                    <Input
                      value={widgetConfig.name}
                      onChange={(e) => setWidgetConfig(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter widget name..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Position</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['bottom-right', 'bottom-left', 'top-right', 'top-left'].map((pos) => (
                        <Button
                          key={pos}
                          variant={widgetConfig.position === pos ? "default" : "outline"}
                          size="sm"
                          onClick={() => setWidgetConfig(prev => ({ ...prev, position: pos }))}
                        >
                          {pos.replace('-', ' ')}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Color</label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={widgetConfig.color}
                        onChange={(e) => setWidgetConfig(prev => ({ ...prev, color: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={widgetConfig.color}
                        onChange={(e) => setWidgetConfig(prev => ({ ...prev, color: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['small', 'medium', 'large'].map((size) => (
                        <Button
                          key={size}
                          variant={widgetConfig.size === size ? "default" : "outline"}
                          size="sm"
                          onClick={() => setWidgetConfig(prev => ({ ...prev, size }))}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Theme</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['light', 'dark'].map((theme) => (
                        <Button
                          key={theme}
                          variant={widgetConfig.theme === theme ? "default" : "outline"}
                          size="sm"
                          onClick={() => setWidgetConfig(prev => ({ ...prev, theme }))}
                        >
                          {theme}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Messages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Welcome Message</label>
                    <Textarea
                      value={widgetConfig.welcomeMessage}
                      onChange={(e) => setWidgetConfig(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                      placeholder="Enter your welcome message..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Show Avatar</span>
                      <Button
                        variant={widgetConfig.showAvatar ? "default" : "outline"}
                        size="sm"
                        onClick={() => setWidgetConfig(prev => ({ ...prev, showAvatar: !prev.showAvatar }))}
                      >
                        {widgetConfig.showAvatar ? "On" : "Off"}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Show Typing Indicator</span>
                      <Button
                        variant={widgetConfig.showTyping ? "default" : "outline"}
                        size="sm"
                        onClick={() => setWidgetConfig(prev => ({ ...prev, showTyping: !prev.showTyping }))}
                      >
                        {widgetConfig.showTyping ? "On" : "Off"}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Enable Sound</span>
                      <Button
                        variant={widgetConfig.enableSound ? "default" : "outline"}
                        size="sm"
                        onClick={() => setWidgetConfig(prev => ({ ...prev, enableSound: !prev.enableSound }))}
                      >
                        {widgetConfig.enableSound ? "On" : "Off"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Behavior Tab */}
          <TabsContent value="behavior" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Interaction Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Auto Open</span>
                      <Button
                        variant={widgetConfig.autoOpen ? "default" : "outline"}
                        size="sm"
                        onClick={() => setWidgetConfig(prev => ({ ...prev, autoOpen: !prev.autoOpen }))}
                      >
                        {widgetConfig.autoOpen ? "On" : "Off"}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Show on Mobile</span>
                      <Button variant="default" size="sm">
                        On
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Show on Desktop</span>
                      <Button variant="default" size="sm">
                        On
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security & Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rate Limiting</span>
                      <Badge variant="outline">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Spam Protection</span>
                      <Badge variant="outline">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data Encryption</span>
                      <Badge variant="outline">AES-256</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">GDPR Compliance</span>
                      <Badge variant="outline">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>See how your widget will appear on different devices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Desktop Preview</h4>
                    <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg h-96 bg-muted/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Monitor className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Desktop view</p>
                        </div>
                      </div>
                      {/* Widget Preview */}
                      <div 
                        className="absolute w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
                        style={previewStyles}
                      >
                        <MessageCircle className="w-8 h-8" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Mobile Preview</h4>
                    <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg h-96 bg-muted/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Smartphone className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Mobile view</p>
                        </div>
                      </div>
                      {/* Widget Preview */}
                      <div 
                        className="absolute w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
                        style={previewStyles}
                      >
                        <MessageCircle className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Code Tab */}
          <TabsContent value="code" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Generated Code
                </CardTitle>
                <CardDescription>Copy and paste this code into your website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={generateWidgetCode()}
                    readOnly
                    className="font-mono text-sm min-h-[300px]"
                  />
                  <Button
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(generateWidgetCode(), "Widget Code")}
                  >
                    {copied === "Widget Code" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">WordPress</h4>
                    <p className="text-sm text-muted-foreground mb-2">Add to your theme's footer.php</p>
                    <Button size="sm" variant="outline">Get Plugin</Button>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Shopify</h4>
                    <p className="text-sm text-muted-foreground mb-2">Add to theme.liquid</p>
                    <Button size="sm" variant="outline">Get App</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WidgetBuilder;
