import React, { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2,
  Copy,
  Download,
  Upload,
  Search,
  Filter,
  Star,
  Clock,
  Users,
  MessageSquare,
  Bot,
  Zap
} from "lucide-react";

const AITemplates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  const templates = [
    {
      id: "1",
      name: "Customer Support Template",
      description: "Handles customer inquiries and support tickets",
      category: "Support",
      language: "English",
      usage: 1247,
      rating: 4.8,
      lastModified: "2 days ago",
      status: "active",
      tags: ["support", "customer", "help"]
    },
    {
      id: "2",
      name: "Sales Assistant Template",
      description: "Helps with product information and sales",
      category: "Sales",
      language: "English",
      usage: 892,
      rating: 4.6,
      lastModified: "1 week ago",
      status: "active",
      tags: ["sales", "product", "assistant"]
    },
    {
      id: "3",
      name: "Lead Generation Template",
      description: "Collects leads and contact information",
      category: "Lead Generation",
      language: "Spanish",
      usage: 456,
      rating: 4.4,
      lastModified: "3 days ago",
      status: "draft",
      tags: ["leads", "contact", "generation"]
    },
    {
      id: "4",
      name: "FAQ Bot Template",
      description: "Answers frequently asked questions",
      category: "FAQ",
      language: "English",
      usage: 234,
      rating: 4.7,
      lastModified: "5 days ago",
      status: "active",
      tags: ["faq", "questions", "answers"]
    }
  ];

  const categories = [
    { name: "Support", count: 2, color: "bg-blue-100 text-blue-800" },
    { name: "Sales", count: 1, color: "bg-green-100 text-green-800" },
    { name: "Lead Generation", count: 1, color: "bg-purple-100 text-purple-800" },
    { name: "FAQ", count: 1, color: "bg-orange-100 text-orange-800" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-blue-100 text-blue-800";
      case "archived":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back to Dashboard */}
        <BackToDashboard title="Back to Dashboard" />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="w-8 h-8 text-whatsapp" />
              AI Templates
            </h1>
            <p className="text-muted-foreground">Manage and customize your AI bot templates</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="mr-2 w-4 h-4" />
              Import
            </Button>
            <Button className="bg-whatsapp hover:bg-whatsapp/90">
              <Plus className="mr-2 w-4 h-4" />
              Create Template
            </Button>
          </div>
        </div>

        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Search Bar */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-whatsapp" />
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription>{template.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(template.status)}>
                          {template.status}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">{template.rating}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Usage</p>
                        <p className="text-2xl font-bold">{template.usage.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Language</p>
                        <p className="text-lg font-semibold">{template.language}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span>Category: {template.category}</span>
                      <span>Modified: {template.lastModified}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button size="sm" className="bg-whatsapp hover:bg-whatsapp/90">
                        <Bot className="w-4 h-4 mr-1" />
                        Use
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {categories.map((category, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-lg">{category.name}</h4>
                        <p className="text-sm text-muted-foreground">{category.count} templates</p>
                      </div>
                      <Badge className={category.color}>
                        {category.count}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Templates</p>
                      <p className="text-2xl font-bold">{templates.length}</p>
                      <p className="text-sm text-green-600">+2 this month</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Templates</p>
                      <p className="text-2xl font-bold">{templates.filter(t => t.status === 'active').length}</p>
                      <p className="text-sm text-green-600">100% uptime</p>
                    </div>
                    <Zap className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Usage</p>
                      <p className="text-2xl font-bold">{templates.reduce((sum, t) => sum + t.usage, 0).toLocaleString()}</p>
                      <p className="text-sm text-green-600">+15.2% this week</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-whatsapp" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Rating</p>
                      <p className="text-2xl font-bold">4.6</p>
                      <p className="text-sm text-green-600">+0.2 this month</p>
                    </div>
                    <Star className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Template Performance</CardTitle>
                <CardDescription>Usage and performance metrics for your templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-whatsapp" />
                        <span className="font-medium">{template.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{template.usage} uses</div>
                        <div className="text-xs text-muted-foreground">Rating: {template.rating}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Template Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-save templates</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Version control</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Template sharing</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Backup templates</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Enable template analytics",
                      "Set up template approval workflow",
                      "Configure template permissions",
                      "Enable template versioning",
                      "Set up template backup schedule"
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
        </Tabs>
      </div>
    </div>
  );
};

export default AITemplates;
