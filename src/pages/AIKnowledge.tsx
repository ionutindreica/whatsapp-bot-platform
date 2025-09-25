import React, { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  Plus, 
  Search, 
  Filter,
  Upload,
  Download,
  Edit,
  Trash2,
  FileText,
  Link,
  Image,
  Video,
  Music,
  Archive,
  BookOpen,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";

const AIKnowledge = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const knowledgeItems = [
    {
      id: "1",
      title: "Product Information",
      type: "document",
      category: "Products",
      size: "2.3 MB",
      lastModified: "2 days ago",
      status: "active",
      tags: ["products", "information", "catalog"]
    },
    {
      id: "2",
      title: "FAQ Database",
      type: "document",
      category: "Support",
      size: "1.8 MB",
      lastModified: "1 week ago",
      status: "active",
      tags: ["faq", "support", "questions"]
    },
    {
      id: "3",
      title: "Company Policies",
      type: "document",
      category: "Legal",
      size: "3.1 MB",
      lastModified: "3 days ago",
      status: "active",
      tags: ["policies", "legal", "company"]
    },
    {
      id: "4",
      title: "Training Videos",
      type: "video",
      category: "Training",
      size: "45.2 MB",
      lastModified: "5 days ago",
      status: "processing",
      tags: ["training", "videos", "education"]
    },
    {
      id: "5",
      title: "API Documentation",
      type: "link",
      category: "Technical",
      size: "N/A",
      lastModified: "1 day ago",
      status: "active",
      tags: ["api", "documentation", "technical"]
    }
  ];

  const categories = [
    { name: "All", count: 5, color: "bg-muted text-muted-foreground" },
    { name: "Products", count: 1, color: "bg-blue-100 text-blue-800" },
    { name: "Support", count: 1, color: "bg-green-100 text-green-800" },
    { name: "Legal", count: 1, color: "bg-red-100 text-red-800" },
    { name: "Training", count: 1, color: "bg-purple-100 text-purple-800" },
    { name: "Technical", count: 1, color: "bg-orange-100 text-orange-800" }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "video":
        return <Video className="w-5 h-5 text-red-600" />;
      case "audio":
        return <Music className="w-5 h-5 text-purple-600" />;
      case "image":
        return <Image className="w-5 h-5 text-green-600" />;
      case "link":
        return <Link className="w-5 h-5 text-orange-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "archived":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "processing":
        return <AlertTriangle className="w-4 h-4 text-blue-600" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "archived":
        return <Archive className="w-4 h-4 text-gray-600" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back to Dashboard */}
        <BackToDashboard title="Back to Dashboard" />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Database className="w-8 h-8 text-whatsapp" />
              Knowledge Base
            </h1>
            <p className="text-muted-foreground">Manage your AI knowledge base and training data</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 w-4 h-4" />
              Export
            </Button>
            <Button className="bg-whatsapp hover:bg-whatsapp/90">
              <Plus className="mr-2 w-4 h-4" />
              Add Knowledge
            </Button>
          </div>
        </div>

        <Tabs defaultValue="knowledge" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search knowledge base..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Knowledge Tab */}
          <TabsContent value="knowledge" className="space-y-4">
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getTypeIcon(item.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{item.title}</h4>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                            {getStatusIcon(item.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{item.category}</span>
                            <span>•</span>
                            <span>{item.size}</span>
                            <span>•</span>
                            <span>Modified: {item.lastModified}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
                <Card 
                  key={index} 
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedCategory === category.name ? 'ring-2 ring-whatsapp' : ''
                  }`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-lg">{category.name}</h4>
                        <p className="text-sm text-muted-foreground">{category.count} items</p>
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
                      <p className="text-sm text-muted-foreground">Total Items</p>
                      <p className="text-2xl font-bold">{knowledgeItems.length}</p>
                      <p className="text-sm text-green-600">+3 this month</p>
                    </div>
                    <Database className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Items</p>
                      <p className="text-2xl font-bold">{knowledgeItems.filter(item => item.status === 'active').length}</p>
                      <p className="text-sm text-green-600">100% uptime</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Size</p>
                      <p className="text-2xl font-bold">52.4 MB</p>
                      <p className="text-sm text-green-600">+8.2% this week</p>
                    </div>
                    <Archive className="w-8 h-8 text-whatsapp" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Categories</p>
                      <p className="text-2xl font-bold">{categories.length - 1}</p>
                      <p className="text-sm text-green-600">+1 this month</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Knowledge Usage</CardTitle>
                <CardDescription>Track how your knowledge base is being used</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {knowledgeItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(item.type)}
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{item.size}</div>
                        <div className="text-xs text-muted-foreground">{item.category}</div>
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
                  <CardTitle>Knowledge Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-indexing</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Version control</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Backup knowledge</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Search optimization</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">Enabled</Badge>
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
                      "Enable semantic search",
                      "Set up knowledge categories",
                      "Configure auto-tagging",
                      "Enable content validation",
                      "Set up knowledge sharing"
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

export default AIKnowledge;
