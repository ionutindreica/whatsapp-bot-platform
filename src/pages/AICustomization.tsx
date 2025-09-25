import React, { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Palette, 
  Settings, 
  Save,
  Eye,
  Download,
  Upload,
  Brush,
  Type,
  Circle,
  Zap
} from "lucide-react";

const AICustomization = () => {
  const [customization, setCustomization] = useState({
    theme: "light",
    primaryColor: "#25D366",
    secondaryColor: "#128C7E",
    fontFamily: "Inter",
    fontSize: "14px",
    borderRadius: "8px",
    spacing: "16px"
  });

  const themes = [
    { name: "Light", value: "light", preview: "bg-card border" },
    { name: "Dark", value: "dark", preview: "bg-gray-900 border-gray-700" },
    { name: "WhatsApp", value: "whatsapp", preview: "bg-green-50 border-green-200" },
    { name: "Custom", value: "custom", preview: "bg-gradient-to-r from-blue-500 to-purple-600" }
  ];

  const colorPresets = [
    { name: "WhatsApp Green", primary: "#25D366", secondary: "#128C7E" },
    { name: "Blue Ocean", primary: "#3B82F6", secondary: "#1E40AF" },
    { name: "Purple Dream", primary: "#8B5CF6", secondary: "#5B21B6" },
    { name: "Orange Sunset", primary: "#F59E0B", secondary: "#D97706" }
  ];

  const fontFamilies = [
    "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", "Source Sans Pro"
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
              <Palette className="w-8 h-8 text-whatsapp" />
              AI Customization
            </h1>
            <p className="text-muted-foreground">Customize the appearance and behavior of your AI bots</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 w-4 h-4" />
              Export
            </Button>
            <Button className="bg-whatsapp hover:bg-whatsapp/90">
              <Save className="mr-2 w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brush className="w-5 h-5" />
                    Theme & Colors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Select Theme</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {themes.map((theme) => (
                        <div
                          key={theme.value}
                          className={`p-3 border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                            customization.theme === theme.value ? 'ring-2 ring-whatsapp' : ''
                          }`}
                          onClick={() => setCustomization({...customization, theme: theme.value})}
                        >
                          <div className={`w-full h-8 rounded ${theme.preview} mb-2`} />
                          <span className="text-sm font-medium">{theme.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Color Presets</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {colorPresets.map((preset) => (
                        <div
                          key={preset.name}
                          className="p-3 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setCustomization({
                            ...customization,
                            primaryColor: preset.primary,
                            secondaryColor: preset.secondary
                          })}
                        >
                          <div className="flex gap-2 mb-2">
                            <div className="w-6 h-6 rounded" style={{backgroundColor: preset.primary}} />
                            <div className="w-6 h-6 rounded" style={{backgroundColor: preset.secondary}} />
                          </div>
                          <span className="text-sm font-medium">{preset.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Custom Colors</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Circle className="w-4 h-4" />
                        <span className="text-sm">Primary Color</span>
                        <input
                          type="color"
                          value={customization.primaryColor}
                          onChange={(e) => setCustomization({...customization, primaryColor: e.target.value})}
                          className="w-8 h-8 rounded border"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Circle className="w-4 h-4" />
                        <span className="text-sm">Secondary Color</span>
                        <input
                          type="color"
                          value={customization.secondaryColor}
                          onChange={(e) => setCustomization({...customization, secondaryColor: e.target.value})}
                          className="w-8 h-8 rounded border"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="w-5 h-5" />
                    Typography
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Font Family</h4>
                    <select
                      value={customization.fontFamily}
                      onChange={(e) => setCustomization({...customization, fontFamily: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    >
                      {fontFamilies.map((font) => (
                        <option key={font} value={font} style={{fontFamily: font}}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Font Size</h4>
                    <input
                      type="range"
                      min="12"
                      max="20"
                      value={parseInt(customization.fontSize)}
                      onChange={(e) => setCustomization({...customization, fontSize: e.target.value + 'px'})}
                      className="w-full"
                    />
                    <span className="text-sm text-muted-foreground">{customization.fontSize}</span>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Border Radius</h4>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={parseInt(customization.borderRadius)}
                      onChange={(e) => setCustomization({...customization, borderRadius: e.target.value + 'px'})}
                      className="w-full"
                    />
                    <span className="text-sm text-muted-foreground">{customization.borderRadius}</span>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Spacing</h4>
                    <input
                      type="range"
                      min="8"
                      max="32"
                      value={parseInt(customization.spacing)}
                      onChange={(e) => setCustomization({...customization, spacing: e.target.value + 'px'})}
                      className="w-full"
                    />
                    <span className="text-sm text-muted-foreground">{customization.spacing}</span>
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
                    <Zap className="w-5 h-5" />
                    Response Behavior
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Typing indicators</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-responses</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Quick replies</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Message suggestions</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Advanced Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Enable conversation memory",
                      "Set up personality traits",
                      "Configure response timing",
                      "Enable context awareness",
                      "Set up fallback responses"
                    ].map((setting, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-whatsapp rounded-full mt-2" />
                        <span className="text-sm">{setting}</span>
                      </div>
                    ))}
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
                <CardDescription>See how your customizations look in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="max-w-md mx-auto">
                    <div 
                      className="bg-card rounded-lg shadow-lg p-4"
                      style={{
                        fontFamily: customization.fontFamily,
                        fontSize: customization.fontSize,
                        borderRadius: customization.borderRadius
                      }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div 
                          className="w-8 h-8 rounded-full"
                          style={{backgroundColor: customization.primaryColor}}
                        />
                        <div>
                          <h4 className="font-medium">AI Assistant</h4>
                          <p className="text-sm text-muted-foreground">Online</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div 
                          className="p-3 rounded-lg text-white"
                          style={{backgroundColor: customization.primaryColor}}
                        >
                          Hello! How can I help you today?
                        </div>
                        <div className="p-3 bg-gray-100 rounded-lg">
                          I need help with my order
                        </div>
                        <div 
                          className="p-3 rounded-lg text-white"
                          style={{backgroundColor: customization.secondaryColor}}
                        >
                          I'd be happy to help you with your order. Can you provide your order number?
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customization Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-save changes</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Version control</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Preview mode</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Backup customizations</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Export as CSS",
                      "Export as JSON",
                      "Export as theme file",
                      "Share with team",
                      "Create template"
                    ].map((option, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-whatsapp rounded-full mt-2" />
                        <span className="text-sm">{option}</span>
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

export default AICustomization;
