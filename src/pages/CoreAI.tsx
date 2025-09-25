import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Brain, 
  Bot, 
  Cpu, 
  Network, 
  Activity, 
  BarChart3, 
  MessageSquare,
  Zap,
  Settings,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Eye,
  EyeOff,
  Target,
  TrendingUp,
  Database,
  Layers,
  GitBranch,
  Workflow,
  Lightbulb,
  Code2,
  Globe,
  Users,
  Clock,
  Star
} from 'lucide-react';
import AdminPageLayout from '@/components/AdminPageLayout';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  type: 'LLM' | 'NLP' | 'Hybrid';
  status: 'active' | 'inactive' | 'training';
  accuracy: number;
  responseTime: number;
  cost: number;
  features: string[];
}

interface Intent {
  id: string;
  name: string;
  description: string;
  examples: string[];
  confidence: number;
  actions: string[];
}

interface ConversationFlow {
  id: string;
  name: string;
  trigger: string;
  steps: FlowStep[];
  status: 'active' | 'inactive';
  successRate: number;
}

interface FlowStep {
  id: string;
  type: 'message' | 'condition' | 'action' | 'ai_response';
  content: string;
  conditions?: string[];
  nextStep?: string;
}

const CoreAI: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [aiSettings, setAiSettings] = useState({
    temperature: 0.7,
    maxTokens: 150,
    enableMemory: true,
    enableContext: true,
    enableSentiment: true,
    enableIntentDetection: true,
    enableMultiLanguage: true,
    enablePersonalization: true
  });

  const aiModels: AIModel[] = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'OpenAI',
      type: 'LLM',
      status: 'active',
      accuracy: 94.2,
      responseTime: 1.2,
      cost: 0.03,
      features: ['Context Understanding', 'Multi-language', 'Code Generation', 'Reasoning']
    },
    {
      id: 'claude-3',
      name: 'Claude 3',
      provider: 'Anthropic',
      type: 'LLM',
      status: 'active',
      accuracy: 92.8,
      responseTime: 1.5,
      cost: 0.025,
      features: ['Long Context', 'Analysis', 'Writing', 'Safety']
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      type: 'LLM',
      status: 'inactive',
      accuracy: 91.5,
      responseTime: 1.8,
      cost: 0.02,
      features: ['Multimodal', 'Code', 'Reasoning', 'Creative']
    },
    {
      id: 'custom-nlp',
      name: 'Custom NLP Engine',
      provider: 'ChatFlow AI',
      type: 'NLP',
      status: 'training',
      accuracy: 89.3,
      responseTime: 0.8,
      cost: 0.01,
      features: ['Intent Detection', 'Entity Extraction', 'Sentiment Analysis', 'Language Detection']
    }
  ];

  const intents: Intent[] = [
    {
      id: 'greeting',
      name: 'Greeting',
      description: 'User greets the bot',
      examples: ['Hello', 'Hi', 'Good morning', 'Hey there'],
      confidence: 95.2,
      actions: ['respond_with_greeting', 'ask_how_can_help']
    },
    {
      id: 'support',
      name: 'Support Request',
      description: 'User needs help or support',
      examples: ['I need help', 'Can you help me?', 'I have a problem', 'Support'],
      confidence: 87.4,
      actions: ['collect_issue_details', 'escalate_to_human', 'provide_solution']
    },
    {
      id: 'pricing',
      name: 'Pricing Inquiry',
      description: 'User asks about pricing',
      examples: ['How much does it cost?', 'What are your prices?', 'Pricing', 'Cost'],
      confidence: 92.1,
      actions: ['show_pricing_plans', 'schedule_demo', 'connect_to_sales']
    },
    {
      id: 'goodbye',
      name: 'Goodbye',
      description: 'User says goodbye',
      examples: ['Bye', 'Goodbye', 'See you later', 'Thanks, bye'],
      confidence: 96.8,
      actions: ['respond_with_goodbye', 'offer_help', 'end_conversation']
    }
  ];

  const conversationFlows: ConversationFlow[] = [
    {
      id: 'welcome-flow',
      name: 'Welcome Flow',
      trigger: 'new_user',
      steps: [
        { id: '1', type: 'message', content: 'Welcome! How can I help you today?' },
        { id: '2', type: 'condition', content: 'Check user intent', conditions: ['greeting', 'support', 'pricing'] },
        { id: '3', type: 'ai_response', content: 'Generate contextual response' }
      ],
      status: 'active',
      successRate: 94.2
    },
    {
      id: 'support-flow',
      name: 'Support Flow',
      trigger: 'support_intent',
      steps: [
        { id: '1', type: 'message', content: 'I\'m here to help! What seems to be the issue?' },
        { id: '2', type: 'condition', content: 'Analyze issue complexity', conditions: ['simple', 'complex', 'urgent'] },
        { id: '3', type: 'ai_response', content: 'Provide solution or escalate' }
      ],
      status: 'active',
      successRate: 89.7
    }
  ];

  const getModelIcon = (type: string) => {
    switch (type) {
      case 'LLM':
        return <Brain className="w-5 h-5 text-blue-500" />;
      case 'NLP':
        return <Network className="w-5 h-5 text-green-500" />;
      case 'Hybrid':
        return <Cpu className="w-5 h-5 text-purple-500" />;
      default:
        return <Bot className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'training':
        return <Badge variant="outline" className="bg-yellow-500">Training</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <AdminPageLayout 
      title="Core AI Engine"
      description="Advanced AI and NLP capabilities for intelligent conversations"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="intents">Intents</TabsTrigger>
          <TabsTrigger value="flows">Flows</TabsTrigger>
          <TabsTrigger value="nlp">NLP Engine</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* AI Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">AI Accuracy</p>
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
                    <p className="text-sm text-muted-foreground">Response Time</p>
                    <p className="text-2xl font-bold">1.2s</p>
                    <p className="text-sm text-blue-600">-0.3s this week</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Models</p>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-sm text-purple-600">GPT-4, Claude 3, Custom NLP</p>
                  </div>
                  <Brain className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Intent Accuracy</p>
                    <p className="text-2xl font-bold">92.8%</p>
                    <p className="text-sm text-orange-600">+1.5% this week</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent AI Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent AI Activity
              </CardTitle>
              <CardDescription>
                Latest AI interactions and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Brain className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Intent Detection: "Support Request"</p>
                      <p className="text-sm text-muted-foreground">Confidence: 94.2% • Response: 1.1s</p>
                    </div>
                  </div>
                  <Badge variant="outline">Success</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Context Analysis: Customer Support</p>
                      <p className="text-sm text-muted-foreground">Sentiment: Positive • Language: English</p>
                    </div>
                  </div>
                  <Badge variant="outline">Analyzed</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium">AI Response Generated</p>
                      <p className="text-sm text-muted-foreground">Model: GPT-4 • Tokens: 45 • Cost: $0.002</p>
                    </div>
                  </div>
                  <Badge variant="outline">Generated</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>AI Models</CardTitle>
                  <CardDescription>Manage and configure your AI models</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Model
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiModels.map((model) => (
                  <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getModelIcon(model.type)}
                      <div>
                        <h3 className="font-medium">{model.name}</h3>
                        <p className="text-sm text-muted-foreground">{model.provider} • {model.type}</p>
                        <div className="flex space-x-2 mt-1">
                          {model.features.slice(0, 2).map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{model.accuracy}% accuracy</p>
                        <p className="text-xs text-muted-foreground">{model.responseTime}s response</p>
                        <p className="text-xs text-muted-foreground">${model.cost}/1K tokens</p>
                      </div>
                      {getStatusBadge(model.status)}
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intents" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Intent Recognition</CardTitle>
                  <CardDescription>Manage user intent detection and classification</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Intent
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {intents.map((intent) => (
                  <div key={intent.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{intent.name}</h3>
                      <Badge variant="outline">{intent.confidence}% confidence</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{intent.description}</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Examples:</p>
                        <div className="flex flex-wrap gap-1">
                          {intent.examples.map((example, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              "{example}"
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Actions:</p>
                        <div className="flex flex-wrap gap-1">
                          {intent.actions.map((action, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {action}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flows" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Conversation Flows</CardTitle>
                  <CardDescription>AI-powered conversation flow management</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Flow
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversationFlows.map((flow) => (
                  <div key={flow.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{flow.name}</h3>
                        <p className="text-sm text-muted-foreground">Trigger: {flow.trigger}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{flow.successRate}% success</Badge>
                        {getStatusBadge(flow.status)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {flow.steps.map((step, index) => (
                        <div key={step.id} className="flex items-center space-x-2 text-sm">
                          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <span className="capitalize">{step.type.replace('_', ' ')}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{step.content}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nlp" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>NLP Configuration</CardTitle>
                <CardDescription>Configure natural language processing settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Language Detection</Label>
                  <Switch 
                    checked={aiSettings.enableMultiLanguage}
                    onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, enableMultiLanguage: checked }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Sentiment Analysis</Label>
                  <Switch 
                    checked={aiSettings.enableSentiment}
                    onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, enableSentiment: checked }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Intent Detection</Label>
                  <Switch 
                    checked={aiSettings.enableIntentDetection}
                    onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, enableIntentDetection: checked }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Context Understanding</Label>
                  <Switch 
                    checked={aiSettings.enableContext}
                    onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, enableContext: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Settings</CardTitle>
                <CardDescription>Configure AI model parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Temperature: {aiSettings.temperature}</Label>
                  <Slider
                    value={[aiSettings.temperature]}
                    onValueChange={(value) => setAiSettings(prev => ({ ...prev, temperature: value[0] }))}
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Max Tokens: {aiSettings.maxTokens}</Label>
                  <Slider
                    value={[aiSettings.maxTokens]}
                    onValueChange={(value) => setAiSettings(prev => ({ ...prev, maxTokens: value[0] }))}
                    max={500}
                    min={50}
                    step={10}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Selected Model</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {aiModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name} ({model.provider})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Engine Settings</CardTitle>
              <CardDescription>Configure advanced AI engine settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Enable Memory</Label>
                    <Switch 
                      checked={aiSettings.enableMemory}
                      onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, enableMemory: checked }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Remember conversation context across sessions
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Enable Personalization</Label>
                    <Switch 
                      checked={aiSettings.enablePersonalization}
                      onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, enablePersonalization: checked }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Personalize responses based on user history
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label>Default Language</Label>
                    <Select value="en" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="it">Italian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Fallback Model</Label>
                    <Select value="gpt-3.5" onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-2">Claude 2</SelectItem>
                        <SelectItem value="custom">Custom Model</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button>
                  <Settings className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Config
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Config
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminPageLayout>
  );
};

export default CoreAI;
