import React from "react";
import { Link } from "react-router-dom";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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


  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back to Dashboard */}
        <BackToDashboard title="Back to Dashboard" />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Integrations</h1>
            <p className="text-muted-foreground mt-2">Connect your AI bots to any platform or service</p>
          </div>
        </div>

        {/* Integration Methods */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Integration Methods</h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {integrations.map((integration) => (
                <Card key={integration.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <integration.icon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-foreground">{integration.title}</CardTitle>
                          <CardDescription className="text-muted-foreground">{integration.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={integration.status === "active" ? "default" : "secondary"}>
                        {integration.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {integration.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {integration.category}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-foreground">Features:</h4>
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
                <Card key={channel.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                          <channel.icon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-foreground">{channel.title}</CardTitle>
                          <CardDescription className="text-muted-foreground">{channel.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={channel.status === "active" ? "default" : "secondary"}>
                        {channel.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {channel.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {channel.category}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-foreground">Features:</h4>
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Zap className="w-5 h-5" />
              Quick Start Guide
            </CardTitle>
            <CardDescription className="text-muted-foreground">Get started with integrations in minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">Website Widget</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Add a chat widget to your website in 2 minutes
                </p>
                <Button size="sm" className="w-full">
                  Get Started
                </Button>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">WhatsApp Business</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Connect your WhatsApp Business account
                </p>
                <Button size="sm" className="w-full">
                  Connect
                </Button>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Code className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">API Integration</h3>
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
  );
};

export default IntegrationsIndex;
