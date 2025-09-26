import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Plus, 
  Play, 
  Save, 
  Settings, 
  Trash2, 
  Copy, 
  Download,
  Upload,
  Zap,
  MessageSquare,
  Users,
  Database,
  Link,
  Timer,
  CheckCircle,
  AlertTriangle,
  Globe,
  Smartphone
} from 'lucide-react';
import AdminPageLayout from '@/components/AdminPageLayout';

interface FlowNode {
  id: string;
  type: 'trigger' | 'message' | 'condition' | 'action' | 'webhook' | 'delay';
  title: string;
  description: string;
  position: { x: number; y: number };
  data: any;
  connections: string[];
}

interface Flow {
  id: string;
  name: string;
  description: string;
  platform: string;
  status: 'draft' | 'active' | 'paused';
  nodes: FlowNode[];
  createdAt: string;
  updatedAt: string;
}

const FlowBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState('flows');
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
  const [flows, setFlows] = useState<Flow[]>([
    {
      id: '1',
      name: 'Welcome Flow',
      description: 'Automated welcome message for new users',
      platform: 'whatsapp',
      status: 'active',
      nodes: [
        {
          id: 'node1',
          type: 'trigger',
          title: 'New User',
          description: 'Trigger when user sends first message',
          position: { x: 100, y: 100 },
          data: { trigger: 'first_message' },
          connections: ['node2']
        },
        {
          id: 'node2',
          type: 'message',
          title: 'Welcome Message',
          description: 'Send welcome message to user',
          position: { x: 300, y: 100 },
          data: { message: 'Welcome to our service!' },
          connections: ['node3']
        },
        {
          id: 'node3',
          type: 'condition',
          title: 'Check Subscription',
          description: 'Check if user is subscribed',
          position: { x: 500, y: 100 },
          data: { condition: 'is_subscribed' },
          connections: ['node4', 'node5']
        },
        {
          id: 'node4',
          type: 'action',
          title: 'Send Premium Info',
          description: 'Send premium service information',
          position: { x: 700, y: 50 },
          data: { action: 'send_premium_info' },
          connections: []
        },
        {
          id: 'node5',
          type: 'action',
          title: 'Send Free Trial',
          description: 'Send free trial offer',
          position: { x: 700, y: 150 },
          data: { action: 'send_free_trial' },
          connections: []
        }
      ],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: '2',
      name: 'Lead Capture',
      description: 'Capture lead information from website visitors',
      platform: 'website',
      status: 'draft',
      nodes: [
        {
          id: 'node1',
          type: 'trigger',
          title: 'Website Visit',
          description: 'Trigger when user visits website',
          position: { x: 100, y: 100 },
          data: { trigger: 'website_visit' },
          connections: ['node2']
        },
        {
          id: 'node2',
          type: 'message',
          title: 'Greeting',
          description: 'Greet the visitor',
          position: { x: 300, y: 100 },
          data: { message: 'Hi! How can I help you today?' },
          connections: ['node3']
        },
        {
          id: 'node3',
          type: 'condition',
          title: 'Interested?',
          description: 'Check if user is interested',
          position: { x: 500, y: 100 },
          data: { condition: 'user_interested' },
          connections: ['node4']
        },
        {
          id: 'node4',
          type: 'action',
          title: 'Collect Info',
          description: 'Collect user information',
          position: { x: 700, y: 100 },
          data: { action: 'collect_info', fields: ['name', 'email', 'phone'] },
          connections: []
        }
      ],
      createdAt: '2024-01-18',
      updatedAt: '2024-01-19'
    }
  ]);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'trigger':
        return <Zap className="w-4 h-4" />;
      case 'message':
        return <MessageSquare className="w-4 h-4" />;
      case 'condition':
        return <CheckCircle className="w-4 h-4" />;
      case 'action':
        return <Users className="w-4 h-4" />;
      case 'webhook':
        return <Link className="w-4 h-4" />;
      case 'delay':
        return <Timer className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'whatsapp':
        return <Smartphone className="w-4 h-4" />;
      case 'website':
        return <Globe className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'paused':
        return <Badge variant="destructive">Paused</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleCreateFlow = () => {
    const newFlow: Flow = {
      id: Date.now().toString(),
      name: 'New Flow',
      description: 'A new automated flow',
      platform: 'whatsapp',
      status: 'draft',
      nodes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setFlows(prev => [...prev, newFlow]);
    setSelectedFlow(newFlow);
    setActiveTab('builder');
  };

  const handleDeleteFlow = (flowId: string) => {
    setFlows(prev => prev.filter(flow => flow.id !== flowId));
    if (selectedFlow?.id === flowId) {
      setSelectedFlow(null);
    }
  };

  const handleDuplicateFlow = (flow: Flow) => {
    const duplicatedFlow: Flow = {
      ...flow,
      id: Date.now().toString(),
      name: `${flow.name} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setFlows(prev => [...prev, duplicatedFlow]);
  };

  return (
    <TooltipProvider>
      <AdminPageLayout 
        title="Flow Builder" 
        description={
          <div className="flex items-center space-x-2">
            <span>Create and manage automated conversation flows</span>
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
                  <p className="font-medium text-white">What is a Flow?</p>
                  <p className="text-sm text-gray-300">
                    A Flow contains the messages, actions, and transitions that make up an automated conversation for your bot. 
                    It defines how your bot responds to user inputs and guides users through your desired conversation path.
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        }
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="flows">My Flows</TabsTrigger>
          <TabsTrigger value="builder">Flow Builder</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="flows" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">My Flows</h2>
              <p className="text-muted-foreground">
                Manage your automated conversation flows
              </p>
            </div>
            <Button onClick={handleCreateFlow}>
              <Plus className="w-4 h-4 mr-2" />
              Create Flow
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flows.map((flow) => (
              <Card key={flow.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getPlatformIcon(flow.platform)}
                      <CardTitle className="text-lg">{flow.name}</CardTitle>
                    </div>
                    {getStatusBadge(flow.status)}
                  </div>
                  <CardDescription>{flow.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Platform</span>
                      <span className="font-medium capitalize">{flow.platform}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Nodes</span>
                      <span className="font-medium">{flow.nodes.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Updated</span>
                      <span className="font-medium">{new Date(flow.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setSelectedFlow(flow);
                        setActiveTab('builder');
                      }}
                      className="flex-1"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleDuplicateFlow(flow)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent 
                        className="bg-gray-900 text-white border-gray-700 shadow-lg" 
                        side="top"
                        sideOffset={5}
                      >
                        <p className="text-white">Duplicate this flow</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteFlow(flow.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent 
                        className="bg-gray-900 text-white border-gray-700 shadow-lg" 
                        side="top"
                        sideOffset={5}
                      >
                        <p className="text-white">Delete this flow</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          {selectedFlow ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedFlow.name}</h2>
                  <p className="text-muted-foreground">{selectedFlow.description}</p>
                </div>
                <div className="flex space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-white border-gray-700">
                      <p className="text-white">Save your flow changes</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button>
                        <Play className="w-4 h-4 mr-2" />
                        Test Flow
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-white border-gray-700">
                      <p className="text-white">Test your flow with sample data</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Flow Canvas */}
              <Card className="h-96">
                <CardHeader>
                  <CardTitle>Flow Canvas</CardTitle>
                  <CardDescription>
                    Drag and drop nodes to build your flow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    {selectedFlow.nodes.map((node) => (
                      <div
                        key={node.id}
                        className="absolute bg-white border-2 border-blue-500 rounded-lg p-3 shadow-lg cursor-move"
                        style={{
                          left: node.position.x,
                          top: node.position.y,
                          minWidth: '150px'
                        }}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          {getNodeIcon(node.type)}
                          <span className="font-medium text-sm">{node.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{node.description}</p>
                      </div>
                    ))}
                    
                    {selectedFlow.nodes.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">Start building your flow</p>
                          <p className="text-sm text-gray-400">Add nodes from the sidebar</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Node Library */}
              <Card>
                <CardHeader>
                  <CardTitle>Node Library</CardTitle>
                  <CardDescription>
                    Drag nodes to the canvas to build your flow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                      { type: 'trigger', title: 'Trigger', description: 'Start your flow' },
                      { type: 'message', title: 'Message', description: 'Send a message' },
                      { type: 'condition', title: 'Condition', description: 'Add logic' },
                      { type: 'action', title: 'Action', description: 'Perform action' },
                      { type: 'webhook', title: 'Webhook', description: 'External API' },
                      { type: 'delay', title: 'Delay', description: 'Wait time' }
                    ].map((nodeType) => (
                      <Tooltip key={nodeType.type}>
                        <TooltipTrigger asChild>
                          <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all duration-200">
                            {getNodeIcon(nodeType.type)}
                            <span className="font-medium text-sm mt-2">{nodeType.title}</span>
                            <span className="text-xs text-muted-foreground text-center">{nodeType.description}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent 
                          className="max-w-xs bg-gray-900 text-white border-gray-700 shadow-xl" 
                          side="top"
                          align="center"
                          sideOffset={5}
                        >
                          <div className="space-y-2">
                            <p className="font-medium text-white">{nodeType.title}</p>
                            <p className="text-sm text-gray-300">{nodeType.description}</p>
                            <p className="text-xs text-blue-400">Drag to canvas to add this node</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select a flow to start building</p>
                  <Button onClick={handleCreateFlow} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Flow
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Welcome Flow',
                description: 'Welcome new users with personalized messages',
                platform: 'whatsapp',
                category: 'Onboarding',
                nodes: 5
              },
              {
                name: 'Lead Capture',
                description: 'Capture and qualify leads automatically',
                platform: 'website',
                category: 'Lead Generation',
                nodes: 4
              },
              {
                name: 'Customer Support',
                description: 'Handle common support questions',
                platform: 'messenger',
                category: 'Support',
                nodes: 7
              },
              {
                name: 'Product Demo',
                description: 'Guide users through product features',
                platform: 'instagram',
                category: 'Sales',
                nodes: 6
              },
              {
                name: 'Feedback Collection',
                description: 'Collect user feedback and ratings',
                platform: 'telegram',
                category: 'Feedback',
                nodes: 3
              },
              {
                name: 'Appointment Booking',
                description: 'Automated appointment scheduling',
                platform: 'website',
                category: 'Booking',
                nodes: 8
              }
            ].map((template, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Platform</span>
                    <span className="font-medium capitalize">{template.platform}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Nodes</span>
                    <span className="font-medium">{template.nodes}</span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Use Template
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-white border-gray-700">
                      <p className="text-white">Import this template into your flows</p>
                    </TooltipContent>
                  </Tooltip>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        </Tabs>
      </AdminPageLayout>
    </TooltipProvider>
  );
};

export default FlowBuilder;
