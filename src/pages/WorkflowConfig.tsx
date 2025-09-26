// src/pages/WorkflowConfig.tsx - Pagină dedicată pentru configurarea workflow-urilor
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminPageLayout from '@/components/AdminPageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft,
  Save,
  Play,
  Pause,
  Plus,
  Edit,
  Trash2,
  Target,
  MessageSquare,
  ShoppingCart,
  Calendar,
  TrendingUp,
  Bot,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  X
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  type: string;
  config?: any;
}

interface WorkflowCondition {
  id: string;
  name: string;
  value: string;
  config?: any;
}

interface WorkflowAction {
  id: string;
  name: string;
  type: string;
  config?: any;
}

const WorkflowConfig = () => {
  const { workflowType } = useParams<{ workflowType: string }>();
  const navigate = useNavigate();
  
  const [workflowConfig, setWorkflowConfig] = useState<any>(null);
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [editingCondition, setEditingCondition] = useState<string | null>(null);
  const [editingAction, setEditingAction] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [currentItemType, setCurrentItemType] = useState<'step' | 'condition' | 'action' | null>(null);

  useEffect(() => {
    if (workflowType) {
      setWorkflowConfig({
        type: workflowType,
        steps: getWorkflowSteps(workflowType),
        conditions: getWorkflowConditions(workflowType),
        actions: getWorkflowActions(workflowType)
      });
    }
  }, [workflowType]);

  const getWorkflowSteps = (type: string) => {
    const steps: { [key: string]: WorkflowStep[] } = {
      'lead_qualification': [
        { id: 'welcome', name: 'Welcome Message', type: 'message' },
        { id: 'qualify', name: 'Lead Qualification', type: 'form' },
        { id: 'segment', name: 'Lead Segmentation', type: 'logic' },
        { id: 'notify', name: 'Team Notification', type: 'action' }
      ],
      'followup_sequence': [
        { id: 'trigger', name: 'Follow-up Trigger', type: 'trigger' },
        { id: 'email1', name: 'Email 1 (24h)', type: 'email' },
        { id: 'email2', name: 'Email 2 (3 days)', type: 'email' },
        { id: 'email3', name: 'Email 3 (7 days)', type: 'email' }
      ],
      'cart_recovery': [
        { id: 'detect', name: 'Cart Abandonment Detection', type: 'trigger' },
        { id: 'email1', name: 'Recovery Email 1 (1h)', type: 'email' },
        { id: 'email2', name: 'Recovery Email 2 (24h)', type: 'email' },
        { id: 'email3', name: 'Recovery Email 3 (48h)', type: 'email' }
      ],
      'appointment_reminders': [
        { id: 'schedule', name: 'Appointment Scheduled', type: 'trigger' },
        { id: 'reminder24h', name: '24h Reminder', type: 'notification' },
        { id: 'reminder1h', name: '1h Reminder', type: 'notification' },
        { id: 'followup', name: 'Post-appointment Follow-up', type: 'email' }
      ],
      'marketing_campaigns': [
        { id: 'segment_target', name: 'Segment Target Audience', type: 'logic' },
        { id: 'send_promo', name: 'Send Promotional Message', type: 'message' },
        { id: 'track_engagement', name: 'Track Engagement', type: 'analytics' }
      ],
      'ai_personalization': [
        { id: 'user_behavior', name: 'Analyze User Behavior', type: 'ai_logic' },
        { id: 'recommend_product', name: 'Recommend Product', type: 'ai_action' },
        { id: 'customize_offer', name: 'Customize Offer', type: 'ai_action' }
      ]
    };
    return steps[type as keyof typeof steps] || [];
  };

  const getWorkflowConditions = (type: string) => {
    const conditions: { [key: string]: WorkflowCondition[] } = {
      'lead_qualification': [
        { id: 'score_high', name: 'Lead Score > 70', value: 'hot' },
        { id: 'score_medium', name: 'Lead Score 40-70', value: 'warm' },
        { id: 'score_low', name: 'Lead Score < 40', value: 'cold' }
      ],
      'followup_sequence': [
        { id: 'opened_email', name: 'Email Opened', value: 'continue' },
        { id: 'clicked_link', name: 'Link Clicked', value: 'convert' },
        { id: 'no_response', name: 'No Response', value: 'next_email' }
      ],
      'cart_recovery': [
        { id: 'cart_value', name: 'Cart Value > $50', value: 'high_priority' },
        { id: 'cart_items', name: 'Cart Items > 2', value: 'multiple_items' },
        { id: 'user_type', name: 'Returning Customer', value: 'loyal_customer' }
      ],
      'appointment_reminders': [
        { id: 'confirmed', name: 'Appointment Confirmed', value: 'true' },
        { id: 'not_confirmed', name: 'Appointment Not Confirmed', value: 'false' }
      ],
      'marketing_campaigns': [
        { id: 'segment_a', name: 'Segment A', value: 'true' },
        { id: 'segment_b', name: 'Segment B', value: 'true' }
      ],
      'ai_personalization': [
        { id: 'high_intent', name: 'High Purchase Intent', value: 'true' },
        { id: 'low_intent', name: 'Low Purchase Intent', value: 'false' }
      ]
    };
    return conditions[type as keyof typeof conditions] || [];
  };

  const getWorkflowActions = (type: string) => {
    const actions: { [key: string]: WorkflowAction[] } = {
      'lead_qualification': [
        { id: 'notify_sales', name: 'Notify Sales Team', type: 'notification' },
        { id: 'add_crm', name: 'Add to CRM', type: 'crm_sync' },
        { id: 'send_welcome', name: 'Send Welcome Email', type: 'email' }
      ],
      'followup_sequence': [
        { id: 'send_email', name: 'Send Email', type: 'email' },
        { id: 'update_segment', name: 'Update Segment', type: 'crm_sync' },
        { id: 'schedule_next', name: 'Schedule Next Email', type: 'scheduler' }
      ],
      'cart_recovery': [
        { id: 'send_recovery', name: 'Send Recovery Email', type: 'email' },
        { id: 'apply_discount', name: 'Apply Discount', type: 'promotion' },
        { id: 'update_inventory', name: 'Update Inventory', type: 'inventory' }
      ],
      'appointment_reminders': [
        { id: 'send_sms', name: 'Send SMS Reminder', type: 'sms' },
        { id: 'send_email', name: 'Send Email Reminder', type: 'email' },
        { id: 'update_calendar', name: 'Update Calendar', type: 'calendar_sync' }
      ],
      'marketing_campaigns': [
        { id: 'send_broadcast', name: 'Send Broadcast', type: 'message' },
        { id: 'update_crm', name: 'Update CRM', type: 'crm_sync' }
      ],
      'ai_personalization': [
        { id: 'send_custom_offer', name: 'Send Custom Offer', type: 'message' },
        { id: 'update_user_profile', name: 'Update User Profile', type: 'crm_sync' }
      ]
    };
    return actions[type as keyof typeof actions] || [];
  };

  const getWorkflowTitle = (type: string) => {
    const titles: { [key: string]: string } = {
      'lead_qualification': 'Lead Qualification',
      'followup_sequence': 'Follow-up Sequence',
      'cart_recovery': 'Cart Recovery',
      'appointment_reminders': 'Appointment Reminders',
      'marketing_campaigns': 'Marketing Campaigns',
      'ai_personalization': 'AI Personalization'
    };
    return titles[type as keyof typeof titles] || 'Workflow';
  };

  const getWorkflowIcon = (type: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'lead_qualification': <Target className="w-6 h-6 text-green-500" />,
      'followup_sequence': <MessageSquare className="w-6 h-6 text-blue-500" />,
      'cart_recovery': <ShoppingCart className="w-6 h-6 text-purple-500" />,
      'appointment_reminders': <Calendar className="w-6 h-6 text-orange-500" />,
      'marketing_campaigns': <TrendingUp className="w-6 h-6 text-red-500" />,
      'ai_personalization': <Bot className="w-6 h-6 text-pink-500" />
    };
    return icons[type as keyof typeof icons] || <Settings className="w-6 h-6" />;
  };

  const handleSaveWorkflow = () => {
    console.log('Saving workflow configuration:', workflowConfig);
    // Aici vei implementa salvarea în backend
    alert('Workflow configuration saved!');
  };

  const handleTestWorkflow = () => {
    console.log('Testing workflow:', workflowConfig);
    // Aici vei implementa testarea workflow-ului
    alert('Workflow test started!');
  };

  const handleEdit = (item: any, type: 'step' | 'condition' | 'action') => {
    console.log('Editing:', item, type);
    setCurrentItem(item);
    setCurrentItemType(type);
    setShowEditModal(true);
  };

  const handleConfigure = (item: any, type: 'step' | 'condition' | 'action') => {
    console.log('Configuring:', item, type);
    setCurrentItem(item);
    setCurrentItemType(type);
    setShowConfigModal(true);
  };

  const handleSaveEdit = () => {
    console.log('Saving edit for:', currentItem);
    // Aici vei implementa salvarea editărilor
    alert(`Edit saved for ${currentItem.name}!`);
    setShowEditModal(false);
    setCurrentItem(null);
    setCurrentItemType(null);
  };

  const handleSaveConfig = () => {
    console.log('Saving configuration for:', currentItem);
    // Aici vei implementa salvarea configurației
    alert(`Configuration saved for ${currentItem.name}!`);
    setShowConfigModal(false);
    setCurrentItem(null);
    setCurrentItemType(null);
  };

  if (!workflowConfig) {
    return (
      <AdminPageLayout
        title="Loading..."
        description="Loading workflow configuration"
        backTo="/dashboard/automation"
        backLabel="Back to Automation Center"
      >
        <div className="text-center py-12">
          <div className="text-lg font-semibold mb-2">Loading workflow configuration...</div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={getWorkflowTitle(workflowType || '')}
      description="Configure your workflow steps, conditions, and actions"
      backTo="/dashboard/automation"
      backLabel="Back to Automation Center"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-end gap-2 mb-6">
          <Button variant="outline" onClick={handleTestWorkflow}>
            <Play className="w-4 h-4 mr-2" />
            Test Workflow
          </Button>
          <Button onClick={handleSaveWorkflow}>
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>

      {/* Workflow Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Workflow Steps
          </CardTitle>
          <CardDescription>Configure the sequence of actions in your workflow</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {workflowConfig.steps.map((step: WorkflowStep, index: number) => (
            <div key={step.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="font-medium">{step.name}</div>
                <div className="text-sm text-muted-foreground">Type: {step.type}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(step, 'step')}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleConfigure(step, 'step')}>
                  <Settings className="w-4 h-4 mr-1" />
                  Configure
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Workflow Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Conditions
          </CardTitle>
          <CardDescription>Define when this workflow should be triggered</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {workflowConfig.conditions.map((condition: WorkflowCondition) => (
            <div key={condition.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{condition.name}</div>
                <div className="text-sm text-muted-foreground">Value: {condition.value}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(condition, 'condition')}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleConfigure(condition, 'condition')}>
                  <Settings className="w-4 h-4 mr-1" />
                  Configure
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Workflow Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Actions
          </CardTitle>
          <CardDescription>Define what happens when the workflow is triggered</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {workflowConfig.actions.map((action: WorkflowAction) => (
            <div key={action.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{action.name}</div>
                <div className="text-sm text-muted-foreground">Type: {action.type}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(action, 'action')}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleConfigure(action, 'action')}>
                  <Settings className="w-4 h-4 mr-1" />
                  Configure
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      </div>

      {/* Edit Modal */}
      {showEditModal && currentItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Edit {currentItemType}</h2>
              <Button variant="ghost" onClick={() => setShowEditModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  defaultValue={currentItem.name} 
                  className="mt-1"
                />
              </div>
              
              {currentItemType === 'step' && (
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select defaultValue={currentItem.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="message">Message</SelectItem>
                      <SelectItem value="form">Form</SelectItem>
                      <SelectItem value="logic">Logic</SelectItem>
                      <SelectItem value="action">Action</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {currentItemType === 'condition' && (
                <div>
                  <Label htmlFor="value">Value</Label>
                  <Input 
                    id="value" 
                    defaultValue={currentItem.value} 
                    className="mt-1"
                  />
                </div>
              )}
              
              {currentItemType === 'action' && (
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select defaultValue={currentItem.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="notification">Notification</SelectItem>
                      <SelectItem value="crm_sync">CRM Sync</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 pt-4 border-t mt-6">
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Configure Modal */}
      {showConfigModal && currentItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Configure {currentItem.name}</h2>
              <Button variant="ghost" onClick={() => setShowConfigModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Enter configuration details..."
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="settings">Settings</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enabled">Enabled</Label>
                    <Switch id="enabled" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="priority">High Priority</Label>
                    <Switch id="priority" />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="conditions">Additional Conditions</Label>
                <Textarea 
                  id="conditions" 
                  placeholder="Enter additional conditions..."
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t mt-6">
              <Button onClick={handleSaveConfig}>
                Save Configuration
              </Button>
              <Button variant="outline" onClick={() => setShowConfigModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
};

export default WorkflowConfig;
