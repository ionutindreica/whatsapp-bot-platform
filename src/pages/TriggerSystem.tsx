import React, { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Zap, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Play, 
  Pause,
  Clock, 
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Settings,
  Target,
  Filter,
  Code,
  Brain,
  Tag,
  ArrowRight,
  Send,
  Timer,
  Shuffle,
  Webhook,
  Users,
  BarChart3
} from "lucide-react";

const TriggerSystem = () => {
  const [activeTab, setActiveTab] = useState("triggers");
  const [selectedTrigger, setSelectedTrigger] = useState(null);

  // New trigger form
  const [newTrigger, setNewTrigger] = useState({
    name: "",
    description: "",
    triggerType: "KEYWORD",
    conditions: {
      keywords: [""],
      matchType: "contains",
      caseSensitive: false
    },
    actions: [
      {
        type: "SEND_MESSAGE",
        config: {
          message: "",
          delay: 0
        }
      }
    ],
    isActive: true,
    priority: 0
  });

  // Sample triggers
  const triggers = [
    {
      id: "1",
      name: "Welcome New Users",
      description: "Send welcome message to new subscribers",
      triggerType: "CONVERSATION_STATE",
      conditions: { state: "first_message" },
      actions: [
        {
          type: "SEND_MESSAGE",
          config: { message: "👋 Welcome! How can I help you today?" }
        },
        {
          type: "ADD_TAG",
          config: { tag: "new_user" }
        }
      ],
      isActive: true,
      priority: 1,
      executions: 234,
      lastTriggered: "2 minutes ago"
    },
    {
      id: "2", 
      name: "Help Keyword",
      description: "Respond when user says help or support",
      triggerType: "KEYWORD",
      conditions: { 
        keywords: ["help", "support", "assistance", "aiut"],
        matchType: "contains"
      },
      actions: [
        {
          type: "SEND_TEMPLATE",
          config: { template: "help_template" }
        },
        {
          type: "ADD_TAG", 
          config: { tag: "needs_help" }
        }
      ],
      isActive: true,
      priority: 2,
      executions: 156,
      lastTriggered: "5 minutes ago"
    },
    {
      id: "3",
      name: "Price Inquiry",
      description: "Handle price-related questions",
      triggerType: "KEYWORD", 
      conditions: {
        keywords: ["price", "cost", "how much", "preț", "cât costă"],
        matchType: "contains"
      },
      actions: [
        {
          type: "SEND_MESSAGE",
          config: { message: "💰 Here are our current prices:\n\nBasic Plan: $29/month\nPro Plan: $59/month\nEnterprise: Custom pricing\n\nWould you like to see a demo?" }
        },
        {
          type: "ADD_TAG",
          config: { tag: "price_inquiry" }
        }
      ],
      isActive: true,
      priority: 3,
      executions: 89,
      lastTriggered: "1 hour ago"
    },
    {
      id: "4",
      name: "Transfer to Agent",
      description: "Transfer complex queries to human agent",
      triggerType: "KEYWORD",
      conditions: {
        keywords: ["speak to human", "agent", "support", "complaint"],
        matchType: "contains"
      },
      actions: [
        {
          type: "TRANSFER_AGENT",
          config: { reason: "User requested human support" }
        }
      ],
      isActive: true,
      priority: 4,
      executions: 45,
      lastTriggered: "2 hours ago"
    }
  ];

  const triggerTypes = [
    { value: "KEYWORD", label: "Keyword", icon: <MessageSquare className="w-4 h-4" /> },
    { value: "PHRASE", label: "Phrase", icon: <MessageSquare className="w-4 h-4" /> },
    { value: "REGEX", label: "Regex Pattern", icon: <Code className="w-4 h-4" /> },
    { value: "INTENT", label: "AI Intent", icon: <Brain className="w-4 h-4" /> },
    { value: "ENTITY", label: "Entity Detection", icon: <Target className="w-4 h-4" /> },
    { value: "SENTIMENT", label: "Sentiment", icon: <BarChart3 className="w-4 h-4" /> },
    { value: "TIME_BASED", label: "Time Based", icon: <Timer className="w-4 h-4" /> },
    { value: "USER_ATTRIBUTE", label: "User Attribute", icon: <Users className="w-4 h-4" /> },
    { value: "CONVERSATION_STATE", label: "Conversation State", icon: <Clock className="w-4 h-4" /> }
  ];

  const actionTypes = [
    { value: "SEND_MESSAGE", label: "Send Message", icon: <Send className="w-4 h-4" /> },
    { value: "SEND_TEMPLATE", label: "Send Template", icon: <MessageSquare className="w-4 h-4" /> },
    { value: "SET_VARIABLE", label: "Set Variable", icon: <Settings className="w-4 h-4" /> },
    { value: "ADD_TAG", label: "Add Tag", icon: <Tag className="w-4 h-4" /> },
    { value: "REMOVE_TAG", label: "Remove Tag", icon: <Tag className="w-4 h-4" /> },
    { value: "TRIGGER_FLOW", label: "Trigger Flow", icon: <ArrowRight className="w-4 h-4" /> },
    { value: "TRANSFER_AGENT", label: "Transfer Agent", icon: <Users className="w-4 h-4" /> },
    { value: "SCHEDULE_MESSAGE", label: "Schedule Message", icon: <Timer className="w-4 h-4" /> },
    { value: "WEBHOOK", label: "Webhook", icon: <Webhook className="w-4 h-4" /> },
    { value: "CONDITION", label: "Condition", icon: <Filter className="w-4 h-4" /> },
    { value: "DELAY", label: "Delay", icon: <Clock className="w-4 h-4" /> },
    { value: "RANDOM", label: "Random", icon: <Shuffle className="w-4 h-4" /> }
  ];

  const handleAddKeyword = () => {
    setNewTrigger(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        keywords: [...prev.conditions.keywords, ""]
      }
    }));
  };

  const handleRemoveKeyword = (index: number) => {
    if (newTrigger.conditions.keywords.length > 1) {
      setNewTrigger(prev => ({
        ...prev,
        conditions: {
          ...prev.conditions,
          keywords: prev.conditions.keywords.filter((_, i) => i !== index)
        }
      }));
    }
  };

  const handleKeywordChange = (index: number, value: string) => {
    setNewTrigger(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        keywords: prev.conditions.keywords.map((keyword, i) => i === index ? value : keyword)
      }
    }));
  };

  const handleAddAction = () => {
    setNewTrigger(prev => ({
      ...prev,
      actions: [
        ...prev.actions,
        {
          type: "SEND_MESSAGE",
          config: {
            message: "",
            delay: 0
          }
        }
      ]
    }));
  };

  const handleRemoveAction = (index: number) => {
    if (newTrigger.actions.length > 1) {
      setNewTrigger(prev => ({
        ...prev,
        actions: prev.actions.filter((_, i) => i !== index)
      }));
    }
  };

  const handleCreateTrigger = () => {
    if (!newTrigger.name || !newTrigger.conditions.keywords.some(k => k.trim())) {
      alert("Please fill in trigger name and at least one keyword");
      return;
    }

    console.log("Creating trigger:", newTrigger);
    alert("Trigger created successfully!");
    
    // Reset form
    setNewTrigger({
      name: "",
      description: "",
      triggerType: "KEYWORD",
      conditions: {
        keywords: [""],
        matchType: "contains",
        caseSensitive: false
      },
      actions: [
        {
          type: "SEND_MESSAGE",
          config: {
            message: "",
            delay: 0
          }
        }
      ],
      isActive: true,
      priority: 0
    });
  };

  const getTriggerTypeIcon = (type: string) => {
    const triggerType = triggerTypes.find(t => t.value === type);
    return triggerType ? triggerType.icon : <Zap className="w-4 h-4" />;
  };

  const getActionIcon = (type: string) => {
    const action = actionTypes.find(a => a.value === type);
    return action ? action.icon : <Zap className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <BackToDashboard />
          <div className="flex items-center justify-between mt-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Zap className="w-8 h-8 text-yellow-600" />
                Trigger System
              </h1>
              <p className="text-gray-600 mt-2">
                Create automated responses based on keywords, phrases, and user behavior (ManyChat-style)
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <BarChart3 className="mr-2 w-4 h-4" />
                Analytics
              </Button>
              <Button>
                <Plus className="mr-2 w-4 h-4" />
                New Trigger
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="triggers" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Triggers
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Trigger
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Triggers Tab */}
          <TabsContent value="triggers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {triggers.map((trigger) => (
                <Card key={trigger.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getTriggerTypeIcon(trigger.triggerType)}
                        <CardTitle className="text-base">{trigger.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Priority {trigger.priority}</Badge>
                        <Switch 
                          checked={trigger.isActive}
                          onCheckedChange={(checked) => console.log('Toggle trigger:', checked)}
                        />
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {trigger.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Trigger Conditions:</p>
                      <div className="space-y-1">
                        {trigger.triggerType === "KEYWORD" && trigger.conditions.keywords && (
                          <div className="flex flex-wrap gap-1">
                            {trigger.conditions.keywords.slice(0, 3).map((keyword, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                "{keyword}"
                              </Badge>
                            ))}
                            {trigger.conditions.keywords.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{trigger.conditions.keywords.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                        {trigger.triggerType === "CONVERSATION_STATE" && (
                          <Badge variant="secondary" className="text-xs">
                            {trigger.conditions.state}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Actions ({trigger.actions.length}):</p>
                      <div className="space-y-1">
                        {trigger.actions.slice(0, 2).map((action, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            {getActionIcon(action.type)}
                            <span>{action.type.replace('_', ' ')}</span>
                          </div>
                        ))}
                        {trigger.actions.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{trigger.actions.length - 2} more actions
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{trigger.executions} executions</span>
                      <span>Last: {trigger.lastTriggered}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="mr-1 w-3 h-3" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Create Trigger Tab */}
          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Trigger</CardTitle>
                    <CardDescription>
                      Set up automated responses based on user input or behavior
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Trigger Name</label>
                      <Input
                        placeholder="e.g., Help Keyword Trigger"
                        value={newTrigger.name}
                        onChange={(e) => setNewTrigger(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <Textarea
                        placeholder="Describe what this trigger does..."
                        rows={2}
                        value={newTrigger.description}
                        onChange={(e) => setNewTrigger(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Trigger Type</label>
                      <Select 
                        value={newTrigger.triggerType} 
                        onValueChange={(value) => setNewTrigger(prev => ({ ...prev, triggerType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {triggerTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                {type.icon}
                                {type.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {newTrigger.triggerType === "KEYWORD" && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Keywords</label>
                        <div className="space-y-2">
                          {newTrigger.conditions.keywords.map((keyword, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                placeholder={`Keyword ${index + 1}`}
                                value={keyword}
                                onChange={(e) => handleKeywordChange(index, e.target.value)}
                              />
                              {newTrigger.conditions.keywords.length > 1 && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRemoveKeyword(index)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleAddKeyword}
                            className="w-full"
                          >
                            <Plus className="mr-1 w-3 h-3" />
                            Add Keyword
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Match Type</label>
                            <Select 
                              value={newTrigger.conditions.matchType}
                              onValueChange={(value) => setNewTrigger(prev => ({
                                ...prev,
                                conditions: { ...prev.conditions, matchType: value }
                              }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="contains">Contains</SelectItem>
                                <SelectItem value="exact">Exact Match</SelectItem>
                                <SelectItem value="starts_with">Starts With</SelectItem>
                                <SelectItem value="ends_with">Ends With</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center space-x-2 mt-6">
                            <Switch 
                              checked={newTrigger.conditions.caseSensitive}
                              onCheckedChange={(checked) => setNewTrigger(prev => ({
                                ...prev,
                                conditions: { ...prev.conditions, caseSensitive: checked }
                              }))}
                            />
                            <label className="text-sm font-medium">Case Sensitive</label>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium mb-2 block">Priority</label>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        value={newTrigger.priority}
                        onChange={(e) => setNewTrigger(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
                      />
                      <p className="text-xs text-gray-500 mt-1">Higher numbers = higher priority</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={newTrigger.isActive}
                        onCheckedChange={(checked) => setNewTrigger(prev => ({ ...prev, isActive: checked }))}
                      />
                      <label className="text-sm font-medium">Active</label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Actions</CardTitle>
                      <Button size="sm" onClick={handleAddAction}>
                        <Plus className="mr-1 w-3 h-3" />
                        Add Action
                      </Button>
                    </div>
                    <CardDescription>What happens when this trigger fires</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {newTrigger.actions.map((action, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getActionIcon(action.type)}
                            <span className="font-medium">Action {index + 1}</span>
                          </div>
                          {newTrigger.actions.length > 1 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveAction(index)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Action Type</label>
                            <Select 
                              value={action.type}
                              onValueChange={(value) => {
                                const newActions = [...newTrigger.actions];
                                newActions[index] = { ...newActions[index], type: value };
                                setNewTrigger(prev => ({ ...prev, actions: newActions }));
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {actionTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    <div className="flex items-center gap-2">
                                      {type.icon}
                                      {type.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {action.type === "SEND_MESSAGE" && (
                            <div>
                              <label className="text-sm font-medium mb-2 block">Message</label>
                              <Textarea
                                placeholder="Type your response message..."
                                rows={3}
                                value={action.config.message}
                                onChange={(e) => {
                                  const newActions = [...newTrigger.actions];
                                  newActions[index].config.message = e.target.value;
                                  setNewTrigger(prev => ({ ...prev, actions: newActions }));
                                }}
                              />
                            </div>
                          )}

                          {action.type === "ADD_TAG" && (
                            <div>
                              <label className="text-sm font-medium mb-2 block">Tag Name</label>
                              <Input
                                placeholder="e.g., interested_customer"
                                value={action.config.tag}
                                onChange={(e) => {
                                  const newActions = [...newTrigger.actions];
                                  newActions[index].config.tag = e.target.value;
                                  setNewTrigger(prev => ({ ...prev, actions: newActions }));
                                }}
                              />
                            </div>
                          )}

                          <div>
                            <label className="text-sm font-medium mb-2 block">Delay (seconds)</label>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={action.config.delay}
                              onChange={(e) => {
                                const newActions = [...newTrigger.actions];
                                newActions[index].config.delay = parseInt(e.target.value) || 0;
                                setNewTrigger(prev => ({ ...prev, actions: newActions }));
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreateTrigger} className="flex-1">
                    <Plus className="mr-2 w-4 h-4" />
                    Create Trigger
                  </Button>
                  <Button variant="outline">
                    <Eye className="mr-2 w-4 h-4" />
                    Preview
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Zap className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Triggers</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Play className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Triggers</p>
                      <p className="text-2xl font-bold text-gray-900">8</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Executions</p>
                      <p className="text-2xl font-bold text-gray-900">1,234</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-gray-900">96%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Triggers</CardTitle>
                <CardDescription>Most frequently triggered automation rules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {triggers.slice(0, 5).map((trigger, index) => (
                    <div key={trigger.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{trigger.name}</h4>
                          <p className="text-sm text-gray-600">{trigger.executions} executions</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={trigger.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {trigger.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TriggerSystem;
