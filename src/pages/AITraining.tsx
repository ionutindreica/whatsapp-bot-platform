import { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  Upload, 
  FileText, 
  Brain, 
  Play, 
  Pause, 
  CheckCircle, 
  AlertCircle,
  Download,
  Trash2,
  Edit,
  Eye,
  Plus,
  BookOpen,
  Target,
  TrendingUp,
  MessageSquare,
  Database,
  Settings,
  RefreshCw
} from "lucide-react";

const AITraining = () => {
  const [trainingStatus, setTrainingStatus] = useState("idle");
  const [trainingProgress, setTrainingProgress] = useState(0);
  
  const templates = [
    {
      id: 1,
      name: "Customer Support",
      description: "Professional customer service bot",
      category: "Support",
      language: "English",
      complexity: "Beginner",
      downloads: 1247,
      rating: 4.8,
      features: ["FAQ", "Ticket Creation", "Escalation", "Multi-language"]
    },
    {
      id: 2,
      name: "Sales Assistant",
      description: "Lead qualification and sales bot",
      category: "Sales",
      language: "English",
      complexity: "Intermediate",
      downloads: 892,
      rating: 4.6,
      features: ["Lead Qualification", "Product Info", "Pricing", "Demo Booking"]
    },
    {
      id: 3,
      name: "E-commerce Helper",
      description: "Shopping assistance bot",
      category: "E-commerce",
      language: "English",
      complexity: "Advanced",
      downloads: 634,
      rating: 4.9,
      features: ["Product Search", "Order Tracking", "Returns", "Recommendations"]
    }
  ];

  const knowledgeBase = [
    {
      id: 1,
      title: "Company FAQ",
      type: "FAQ",
      items: 45,
      lastUpdated: "2 hours ago",
      status: "active"
    },
    {
      id: 2,
      title: "Product Documentation",
      type: "Documentation",
      items: 128,
      lastUpdated: "1 day ago",
      status: "active"
    },
    {
      id: 3,
      title: "Support Articles",
      type: "Articles",
      items: 67,
      lastUpdated: "3 days ago",
      status: "pending"
    }
  ];

  const trainingData = [
    {
      id: 1,
      name: "Customer Conversations",
      type: "Conversations",
      size: "2.4 MB",
      items: 1247,
      status: "processed",
      accuracy: 94.2
    },
    {
      id: 2,
      name: "Product Manuals",
      type: "Documents",
      size: "15.8 MB",
      items: 23,
      status: "processing",
      accuracy: 87.5
    },
    {
      id: 3,
      name: "Support Tickets",
      type: "Tickets",
      size: "8.2 MB",
      items: 456,
      status: "pending",
      accuracy: 0
    }
  ];

  const startTraining = () => {
    setTrainingStatus("training");
    setTrainingProgress(0);
    
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          setTrainingStatus("completed");
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
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
              <Brain className="w-8 h-8 text-whatsapp" />
              AI Training & Templates
            </h1>
            <p className="text-muted-foreground">Train your AI agents and manage templates</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 w-4 h-4" />
              Export Data
            </Button>
            <Button className="bg-whatsapp hover:bg-whatsapp/90">
              <Plus className="mr-2 w-4 h-4" />
              Create Template
            </Button>
          </div>
        </div>

        <Tabs defaultValue="training" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* AI Training Tab */}
          <TabsContent value="training" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Training Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Training Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Status</span>
                    <Badge 
                      variant={trainingStatus === "completed" ? "default" : trainingStatus === "training" ? "secondary" : "outline"}
                      className={trainingStatus === "completed" ? "bg-green-100 text-green-800" : ""}
                    >
                      {trainingStatus === "idle" ? "Ready" : trainingStatus === "training" ? "Training..." : "Completed"}
                    </Badge>
                  </div>

                  {trainingStatus === "training" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Training Progress</span>
                        <span>{trainingProgress}%</span>
                      </div>
                      <Progress value={trainingProgress} className="w-full" />
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Model Accuracy</span>
                      <span className="text-sm font-medium">94.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Training Data</span>
                      <span className="text-sm font-medium">2,847 items</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Training</span>
                      <span className="text-sm font-medium">2 hours ago</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={startTraining}
                      disabled={trainingStatus === "training"}
                      className="flex-1"
                    >
                      {trainingStatus === "training" ? (
                        <>
                          <RefreshCw className="mr-2 w-4 h-4 animate-spin" />
                          Training...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 w-4 h-4" />
                          Start Training
                        </>
                      )}
                    </Button>
                    <Button variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Training Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Training Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trainingData.map((data) => (
                      <div key={data.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{data.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {data.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{data.size}</span>
                            <span>{data.items} items</span>
                            {data.accuracy > 0 && <span>{data.accuracy}% accuracy</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={data.status === "processed" ? "default" : data.status === "processing" ? "secondary" : "outline"}
                            className={data.status === "processed" ? "bg-green-100 text-green-800" : ""}
                          >
                            {data.status}
                          </Badge>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      <Upload className="mr-2 w-4 h-4" />
                      Upload Training Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Training Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Training Metrics</CardTitle>
                <CardDescription>Monitor your AI model's performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">94.2%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">2,847</div>
                    <div className="text-sm text-muted-foreground">Training Items</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">156ms</div>
                    <div className="text-sm text-muted-foreground">Avg Response</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">23.4%</div>
                    <div className="text-sm text-muted-foreground">Improvement</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </div>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{template.language}</span>
                      <span>•</span>
                      <span>{template.complexity}</span>
                      <span>•</span>
                      <span>{template.downloads} downloads</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(template.rating) ? "text-yellow-400" : "text-gray-300"
                            }`}
                          >
                            ★
                          </div>
                        ))}
                      </div>
                      <span className="text-sm font-medium">{template.rating}</span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {template.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Play className="mr-2 w-4 h-4" />
                        Use Template
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Template Marketplace</h3>
                  <p className="text-muted-foreground mb-4">
                    Browse and download pre-built templates from our marketplace
                  </p>
                  <Button>
                    <BookOpen className="mr-2 w-4 h-4" />
                    Browse Marketplace
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Knowledge Base Tab */}
          <TabsContent value="knowledge" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Knowledge Base
                </CardTitle>
                <CardDescription>Manage your AI agent's knowledge sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {knowledgeBase.map((kb) => (
                    <div key={kb.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium">{kb.title}</h4>
                          <Badge variant="outline">{kb.type}</Badge>
                          <Badge 
                            variant={kb.status === "active" ? "default" : "secondary"}
                            className={kb.status === "active" ? "bg-green-100 text-green-800" : ""}
                          >
                            {kb.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>{kb.items} items</span>
                          <span>•</span>
                          <span>Updated {kb.lastUpdated}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Button className="w-full">
                    <Plus className="mr-2 w-4 h-4" />
                    Add Knowledge Source
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Model Accuracy</p>
                      <p className="text-2xl font-bold">94.2%</p>
                      <p className="text-sm text-green-600">+2.1% this week</p>
                    </div>
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Training Sessions</p>
                      <p className="text-2xl font-bold">47</p>
                      <p className="text-sm text-green-600">+12 this month</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Knowledge Items</p>
                      <p className="text-2xl font-bold">2,847</p>
                      <p className="text-sm text-green-600">+156 this week</p>
                    </div>
                    <Database className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>AI Performance Analytics</CardTitle>
                <CardDescription>Detailed insights into your AI model's performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">AI Analytics Dashboard</h3>
                  <p className="text-muted-foreground">
                    Connect to analytics service for detailed AI performance insights
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AITraining;
