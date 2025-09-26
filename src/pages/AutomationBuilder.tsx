// src/pages/AutomationBuilder.tsx - Automation Builder pentru toate categoriile
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Bot, 
  MessageSquare, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  BookOpen, 
  Settings,
  Play,
  Pause,
  Edit,
  Trash2,
  Plus,
  Zap,
  Target,
  TrendingUp,
  Headphones,
  Mail,
  Calendar,
  FileText,
  BarChart3,
  Clock,
  X
} from 'lucide-react';

interface Automation {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'inactive' | 'draft';
  trigger: string;
  actions: string[];
  conditions: string[];
  createdAt: string;
  lastModified: string;
}

const AutomationBuilder = () => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('workflows');
  const [isCreating, setIsCreating] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    trigger: '',
    actions: [] as string[],
    conditions: [] as string[]
  });
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [workflowConfig, setWorkflowConfig] = useState<any>(null);

  useEffect(() => {
    console.log('selectedWorkflow changed:', selectedWorkflow);
    console.log('workflowConfig changed:', workflowConfig);
  }, [selectedWorkflow, workflowConfig]);

  useEffect(() => {
    console.log('selectedCategory changed:', selectedCategory);
  }, [selectedCategory]);

  const categories = [
    {
      id: 'sales',
      name: 'Vânzări & Lead Generation',
      icon: Target,
      color: 'bg-green-500',
      description: 'Automatizări pentru aducerea și calificarea lead-urilor'
    },
    {
      id: 'support',
      name: 'Suport Clienți',
      icon: Headphones,
      color: 'bg-blue-500',
      description: 'Automatizări pentru suport și FAQ-uri'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: TrendingUp,
      color: 'bg-purple-500',
      description: 'Campanii și secvențe de marketing'
    },
    {
      id: 'internal',
      name: 'Automatizări Interne',
      icon: Settings,
      color: 'bg-orange-500',
      description: 'Eficiență operațională și integrare CRM'
    },
    {
      id: 'education',
      name: 'Educative & Content',
      icon: BookOpen,
      color: 'bg-indigo-500',
      description: 'Livrare conținut și secvențe educaționale'
    },
    {
      id: 'payments',
      name: 'Plăți & Comenzi',
      icon: CreditCard,
      color: 'bg-red-500',
      description: 'Procesare comenzi și plăți automate'
    },
    {
      id: 'ai',
      name: 'Personalizare AI',
      icon: Bot,
      color: 'bg-pink-500',
      description: 'Recomandări și oferte personalizate'
    }
  ];

  const triggers = {
    sales: [
      { value: 'new_lead', label: 'Lead nou în sistem' },
      { value: 'website_visit', label: 'Vizită website' },
      { value: 'form_submit', label: 'Formular completat' },
      { value: 'product_view', label: 'Produs vizualizat' },
      { value: 'cart_abandon', label: 'Coș abandonat' }
    ],
    support: [
      { value: 'new_message', label: 'Mesaj nou primit' },
      { value: 'keyword_detected', label: 'Cuvânt cheie detectat' },
      { value: 'business_hours', label: 'Program de lucru' },
      { value: 'after_hours', label: 'După program' },
      { value: 'escalation', label: 'Escalare necesară' }
    ],
    marketing: [
      { value: 'user_signup', label: 'Înregistrare utilizator' },
      { value: 'purchase_complete', label: 'Cumpărare finalizată' },
      { value: 'time_delay', label: 'Întârziere timp' },
      { value: 'segment_match', label: 'Segment specific' },
      { value: 'campaign_trigger', label: 'Trigger campanie' }
    ],
    internal: [
      { value: 'new_lead', label: 'Lead nou' },
      { value: 'order_created', label: 'Comandă creată' },
      { value: 'payment_received', label: 'Plată primită' },
      { value: 'task_completed', label: 'Task finalizat' },
      { value: 'report_time', label: 'Timp raport' }
    ],
    education: [
      { value: 'course_enrollment', label: 'Înscriere curs' },
      { value: 'content_request', label: 'Cerere conținut' },
      { value: 'progress_milestone', label: 'Prag progres' },
      { value: 'reminder_time', label: 'Timp reminder' },
      { value: 'completion', label: 'Finalizare' }
    ],
    payments: [
      { value: 'order_placed', label: 'Comandă plasată' },
      { value: 'payment_pending', label: 'Plată în așteptare' },
      { value: 'payment_success', label: 'Plată reușită' },
      { value: 'refund_request', label: 'Cerere rambursare' },
      { value: 'subscription_renewal', label: 'Reînnoire abonament' }
    ],
    ai: [
      { value: 'user_profile', label: 'Profil utilizator' },
      { value: 'behavior_pattern', label: 'Pattern comportament' },
      { value: 'preference_update', label: 'Actualizare preferințe' },
      { value: 'recommendation_request', label: 'Cerere recomandare' },
      { value: 'personalization_trigger', label: 'Trigger personalizare' }
    ]
  };

  const actions = {
    sales: [
      { value: 'send_welcome_message', label: 'Trimite mesaj de bun venit' },
      { value: 'qualify_lead', label: 'Califică lead-ul' },
      { value: 'schedule_callback', label: 'Programează callback' },
      { value: 'send_offer', label: 'Trimite ofertă' },
      { value: 'add_to_crm', label: 'Adaugă în CRM' }
    ],
    support: [
      { value: 'auto_response', label: 'Răspuns automat' },
      { value: 'create_ticket', label: 'Creează ticket' },
      { value: 'escalate_to_human', label: 'Escalează la om' },
      { value: 'send_faq', label: 'Trimite FAQ' },
      { value: 'schedule_support', label: 'Programează suport' }
    ],
    marketing: [
      { value: 'send_campaign', label: 'Trimite campanie' },
      { value: 'segment_users', label: 'Segmentează utilizatori' },
      { value: 'send_newsletter', label: 'Trimite newsletter' },
      { value: 'create_sequence', label: 'Creează secvență' },
      { value: 'track_engagement', label: 'Urmărește engagement' }
    ],
    internal: [
      { value: 'notify_team', label: 'Notifică echipa' },
      { value: 'create_task', label: 'Creează task' },
      { value: 'update_crm', label: 'Actualizează CRM' },
      { value: 'sync_data', label: 'Sincronizează date' },
      { value: 'generate_report', label: 'Generează raport' }
    ],
    education: [
      { value: 'send_content', label: 'Trimite conținut' },
      { value: 'unlock_module', label: 'Deblochează modul' },
      { value: 'send_reminder', label: 'Trimite reminder' },
      { value: 'track_progress', label: 'Urmărește progres' },
      { value: 'send_certificate', label: 'Trimite certificat' }
    ],
    payments: [
      { value: 'process_payment', label: 'Procesează plata' },
      { value: 'send_invoice', label: 'Trimite factură' },
      { value: 'confirm_order', label: 'Confirmă comanda' },
      { value: 'send_receipt', label: 'Trimite chitanță' },
      { value: 'update_inventory', label: 'Actualizează inventar' }
    ],
    ai: [
      { value: 'personalize_content', label: 'Personalizează conținut' },
      { value: 'recommend_products', label: 'Recomandă produse' },
      { value: 'customize_offer', label: 'Personalizează ofertă' },
      { value: 'analyze_behavior', label: 'Analizează comportament' },
      { value: 'optimize_experience', label: 'Optimizează experiența' }
    ]
  };

  const handleCreateAutomation = () => {
    const automation: Automation = {
      id: Date.now().toString(),
      name: newAutomation.name,
      category: selectedCategory,
      status: 'draft',
      trigger: newAutomation.trigger,
      actions: newAutomation.actions,
      conditions: newAutomation.conditions,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    setAutomations(prev => [...prev, automation]);
    setNewAutomation({ name: '', trigger: '', actions: [], conditions: [] });
    setIsCreating(false);
  };

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(auto => 
      auto.id === id 
        ? { ...auto, status: auto.status === 'active' ? 'inactive' : 'active' }
        : auto
    ));
  };

  const handleWorkflowConfigure = (workflowType: string) => {
    console.log('Configuring workflow:', workflowType);
    setSelectedWorkflow(workflowType);
    setWorkflowConfig({
      type: workflowType,
      steps: getWorkflowSteps(workflowType),
      conditions: getWorkflowConditions(workflowType),
      actions: getWorkflowActions(workflowType)
    });
  };

  const handleCreateWorkflow = () => {
    setSelectedWorkflow('new');
    setWorkflowConfig({
      type: 'custom',
      steps: [],
      conditions: [],
      actions: []
    });
  };

  const getWorkflowSteps = (type: string) => {
    const steps = {
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
      ]
    };
    return steps[type as keyof typeof steps] || [];
  };

  const getWorkflowConditions = (type: string) => {
    const conditions = {
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
      ]
    };
    return conditions[type as keyof typeof conditions] || [];
  };

  const getWorkflowActions = (type: string) => {
    const actions = {
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
      ]
    };
    return actions[type as keyof typeof actions] || [];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automation Builder</h1>
          <p className="text-muted-foreground">Creează automatizări inteligente pentru toate nevoile business-ului</p>
        </div>
        <Button onClick={handleCreateWorkflow} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Creează Workflow
        </Button>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedCategory === category.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${category.color} text-white`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-sm">{category.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Automation Builder */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Workflows Tab */}
        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Workflows Active
              </CardTitle>
              <CardDescription>Gestionează și monitorizează workflow-urile automate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Workflow Templates */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-lg transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-500" />
                      Lead Qualification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">
                      Califică și segmentează lead-urile automat
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="success">Active</Badge>
                      <Button size="sm" variant="outline" onClick={() => handleWorkflowConfigure('lead_qualification')}>Configure</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                      Follow-up Sequence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">
                      Secvență automată de follow-up
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="success">Active</Badge>
                      <Button size="sm" variant="outline" onClick={() => handleWorkflowConfigure('followup_sequence')}>Configure</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-purple-500" />
                      Cart Recovery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">
                      Recuperează coșurile abandonate
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="success">Active</Badge>
                      <Button size="sm" variant="outline" onClick={() => handleWorkflowConfigure('cart_recovery')}>Configure</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      Appointment Reminders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">
                      Reminder-uri automate pentru programări
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="success">Active</Badge>
                      <Button size="sm" variant="outline" onClick={() => handleWorkflowConfigure('appointment_reminders')}>Configure</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-red-500" />
                      Marketing Campaigns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">
                      Campanii de marketing automate
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Draft</Badge>
                      <Button size="sm" variant="outline" onClick={() => handleWorkflowConfigure('marketing_campaigns')}>Configure</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Bot className="w-4 h-4 text-pink-500" />
                      AI Personalization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-2">
                      Personalizare AI pentru recomandări
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Draft</Badge>
                      <Button size="sm" variant="outline" onClick={() => handleWorkflowConfigure('ai_personalization')}>Configure</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Workflow Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Workflow Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">12</div>
                      <div className="text-sm text-muted-foreground">Active Workflows</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">1,234</div>
                      <div className="text-sm text-muted-foreground">Executions Today</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-500">89%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">45</div>
                      <div className="text-sm text-muted-foreground">Leads Generated</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Lead Qualification executed</div>
                        <div className="text-xs text-muted-foreground">2 minutes ago • 3 leads processed</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Follow-up sequence sent</div>
                        <div className="text-xs text-muted-foreground">5 minutes ago • 12 emails sent</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Cart recovery triggered</div>
                        <div className="text-xs text-muted-foreground">10 minutes ago • 5 abandoned carts</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="w-5 h-5" />
                  {category.name}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {isCreating && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <div>
                      <Label htmlFor="name">Nume Automatizare</Label>
                      <Input
                        id="name"
                        value={newAutomation.name}
                        onChange={(e) => setNewAutomation(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="ex: Lead Qualification Flow"
                      />
                    </div>
                    
                    <div>
                      <Label>Trigger</Label>
                      <Select value={newAutomation.trigger} onValueChange={(value) => 
                        setNewAutomation(prev => ({ ...prev, trigger: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Selectează trigger" />
                        </SelectTrigger>
                        <SelectContent>
                          {triggers[category.id as keyof typeof triggers]?.map((trigger) => (
                            <SelectItem key={trigger.value} value={trigger.value}>
                              {trigger.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Acțiuni</Label>
                      <div className="space-y-2">
                        {actions[category.id as keyof typeof actions]?.map((action) => (
                          <div key={action.value} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={action.value}
                              checked={newAutomation.actions.includes(action.value)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewAutomation(prev => ({
                                    ...prev,
                                    actions: [...prev.actions, action.value]
                                  }));
                                } else {
                                  setNewAutomation(prev => ({
                                    ...prev,
                                    actions: prev.actions.filter(a => a !== action.value)
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={action.value} className="text-sm">
                              {action.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleCreateAutomation}>
                        Creează Automatizare
                      </Button>
                      <Button variant="outline" onClick={() => setIsCreating(false)}>
                        Anulează
                      </Button>
                    </div>
                  </div>
                )}

                {/* Existing Automations */}
                <div className="space-y-3">
                  {automations
                    .filter(auto => auto.category === category.id)
                    .map((automation) => (
                      <div key={automation.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={automation.status === 'active'}
                            onCheckedChange={() => toggleAutomation(automation.id)}
                          />
                          <div>
                            <div className="font-medium">{automation.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Trigger: {automation.trigger} | Acțiuni: {automation.actions.length}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={automation.status === 'active' ? 'default' : 'secondary'}>
                            {automation.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Workflow Configuration Modal */}
      {selectedWorkflow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                Configure {workflowConfig?.type === 'custom' ? 'Custom' : 'Workflow'}
              </h2>
              <Button variant="ghost" onClick={() => setSelectedWorkflow(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {workflowConfig && (
              <div className="space-y-6">
                {/* Workflow Steps */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Workflow Steps</h3>
                  <div className="space-y-2">
                    {workflowConfig.steps.map((step: any, index: number) => (
                      <div key={step.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{step.name}</div>
                          <div className="text-sm text-muted-foreground">Type: {step.type}</div>
                        </div>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Workflow Conditions */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Conditions</h3>
                  <div className="space-y-2">
                    {workflowConfig.conditions.map((condition: any) => (
                      <div key={condition.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{condition.name}</div>
                          <div className="text-sm text-muted-foreground">Value: {condition.value}</div>
                        </div>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Workflow Actions */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Actions</h3>
                  <div className="space-y-2">
                    {workflowConfig.actions.map((action: any) => (
                      <div key={action.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{action.name}</div>
                          <div className="text-sm text-muted-foreground">Type: {action.type}</div>
                        </div>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button onClick={() => setSelectedWorkflow(null)}>
                    Save Configuration
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedWorkflow(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomationBuilder;

