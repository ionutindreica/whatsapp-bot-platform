import React from "react";
import { Link } from "react-router-dom";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Globe, 
  Code, 
  Key, 
  Webhook,
  MessageCircle,
  Monitor,
  Smartphone,
  Mail,
  Database,
  Settings,
  Zap,
  Shield
} from "lucide-react";

const IntegrationsIndex = () => {
  const integrations = [
    {
      id: "website",
      title: "Website Integration",
      description: "Embed chat widget on any website",
      icon: Globe,
      status: "active",
      features: ["JavaScript Widget", "Custom Styling", "Real-time Chat", "Analytics"],
      difficulty: "Easy",
      category: "Web"
    },
    {
      id: "widget",
      title: "Widget Builder",
      description: "Create custom chat widgets",
      icon: Code,
      status: "active",
      features: ["Drag & Drop", "Custom Themes", "Responsive Design", "Preview Mode"],
      difficulty: "Easy",
      category: "Web"
    },
    {
      id: "api",
      title: "API Keys",
      description: "Manage your API access keys",
      icon: Key,
      status: "active",
      features: ["REST API", "Rate Limiting", "Authentication", "Documentation"],
      difficulty: "Medium",
      category: "Developer"
    },
    {
      id: "webhooks",
      title: "Webhooks",
      description: "Real-time event notifications",
      icon: Webhook,
      status: "active",
      features: ["Event Triggers", "Retry Logic", "Security", "Monitoring"],
      difficulty: "Medium",
      category: "Developer"
    }
  ];

  const channels = [
    {
      id: "whatsapp",
      title: "WhatsApp Business",
      description: "Native WhatsApp integration",
      icon: MessageCircle,
      status: "active",
      features: ["Business API", "Media Support", "Templates", "Analytics"],
      difficulty: "Medium",
      category: "Messaging"
    },
    {
      id: "website-chat",
      title: "Website Chat",
      description: "Embeddable chat widget",
      icon: Monitor,
      status: "active",
      features: ["Live Chat", "File Sharing", "Typing Indicators", "Mobile Support"],
      difficulty: "Easy",
      category: "Web"
    },
    {
      id: "mobile",
      title: "Mobile App",
      description: "iOS and Android integration",
      icon: Smartphone,
      status: "coming-soon",
      features: ["Push Notifications", "Offline Support", "Native UI", "Biometric Auth"],
      difficulty: "Hard",
      category: "Mobile"
    },
    {
      id: "email",
      title: "Email Integration",
      description: "Automated email responses",
      icon: Mail,
      status: "active",
      features: ["SMTP Support", "Templates", "Scheduling", "Tracking"],
      difficulty: "Easy",
      category: "Email"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "coming-soon":
        return "bg-blue-100 text-blue-800";
      case "beta":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-blue-100 text-blue-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-8">
        {/* Back to Dashboard */}
        <BackToDashboard title="Back to Dashboard" />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span>Integrations</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="w-6 h-6 rounded-full bg-blue-100 hover:bg-blue-200 border border-blue-300 flex items-center justify-center text-blue-600 hover:text-blue-800 transition-all duration-200 hover:scale-110 shadow-sm">
                      <span className="text-sm font-bold">?</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent 
                    className="max-w-sm bg-gray-900 text-white border-gray-700 shadow-lg" 
                    side="bottom"
                    align="start"
                    sideOffset={8}
                  >
                    <div className="space-y-2">
                      <p className="font-medium text-white">What are Integrations?</p>
                      <p className="text-sm text-gray-300">
                        Connect your AI bots to external platforms and services. 
                        Enable seamless communication across WhatsApp, websites, APIs, and more.
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            </h1>
            <p className="text-muted-foreground mt-2">Connect your AI bots to any platform or service</p>
          </div>
        </div>

        {/* Integration Methods */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Integration Methods</h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {integrations.map((integration) => (
                <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-whatsapp/10 rounded-lg flex items-center justify-center">
                          <integration.icon className="w-5 h-5 text-whatsapp" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{integration.title}</CardTitle>
                          <CardDescription>{integration.description}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(integration.status)}>
                        {integration.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className={getDifficultyColor(integration.difficulty)}>
                        {integration.difficulty}
                      </Badge>
                      <Badge variant="outline">{integration.category}</Badge>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {integration.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link 
                        to={integration.id === "website" ? "/integrations/website" : 
                            integration.id === "widget" ? "/integrations/widget" : "#"}
                        className="flex-1"
                      >
                        <Button 
                          className="w-full"
                          disabled={integration.status === "coming-soon"}
                        >
                          {integration.status === "coming-soon" ? "Coming Soon" : "Configure"}
                        </Button>
                      </Link>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline">
                            <Zap className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent 
                          className="bg-gray-900 text-white border-gray-700 shadow-lg" 
                          side="top"
                          sideOffset={5}
                        >
                          <p className="text-white">Quick setup with AI assistance</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Communication Channels */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Communication Channels</h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {channels.map((channel) => (
                <Card key={channel.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-whatsapp/10 rounded-lg flex items-center justify-center">
                          <channel.icon className="w-5 h-5 text-whatsapp" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{channel.title}</CardTitle>
                          <CardDescription>{channel.description}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(channel.status)}>
                        {channel.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className={getDifficultyColor(channel.difficulty)}>
                        {channel.difficulty}
                      </Badge>
                      <Badge variant="outline">{channel.category}</Badge>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {channel.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1"
                        disabled={channel.status === "coming-soon"}
                      >
                        {channel.status === "coming-soon" ? "Coming Soon" : "Setup"}
                      </Button>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent 
                          className="bg-gray-900 text-white border-gray-700 shadow-lg" 
                          side="top"
                          sideOffset={5}
                        >
                          <p className="text-white">Advanced configuration options</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span>Quick Start Guide</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="w-5 h-5 rounded-full bg-blue-100 hover:bg-blue-200 border border-blue-300 flex items-center justify-center text-blue-600 hover:text-blue-800 transition-all duration-200 hover:scale-110 shadow-sm">
                      <span className="text-xs font-bold">?</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent 
                    className="max-w-sm bg-gray-900 text-white border-gray-700 shadow-lg" 
                    side="bottom"
                    align="start"
                    sideOffset={8}
                  >
                    <div className="space-y-2">
                      <p className="font-medium text-white">Quick Start Guide</p>
                      <p className="text-sm text-gray-300">
                        Follow these steps to get your first integration up and running in minutes. 
                        Choose the option that best fits your needs.
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardTitle>
            <CardDescription>Get started with integrations in minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-whatsapp/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-whatsapp" />
                </div>
                <h3 className="font-semibold mb-2">Website Widget</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Add a chat widget to your website in 2 minutes
                </p>
                <Button size="sm" className="w-full">
                  Get Started
                </Button>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-whatsapp/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-whatsapp" />
                </div>
                <h3 className="font-semibold mb-2">WhatsApp Business</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Connect your WhatsApp Business account
                </p>
                <Button size="sm" className="w-full">
                  Connect
                </Button>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-whatsapp/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Code className="w-6 h-6 text-whatsapp" />
                </div>
                <h3 className="font-semibold mb-2">API Integration</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Use our REST API for custom integrations
                </p>
                <Button size="sm" className="w-full">
                  View Docs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default IntegrationsIndex;
