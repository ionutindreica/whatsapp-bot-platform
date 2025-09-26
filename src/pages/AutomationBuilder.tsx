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
  FileText
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
  const [selectedCategory, setSelectedCategory] = useState('sales');
  const [isCreating, setIsCreating] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    trigger: '',
    actions: [] as string[],
    conditions: [] as string[]
  });

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Automation Builder</h1>
          <p className="text-muted-foreground">Creează automatizări inteligente pentru toate nevoile business-ului</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Creează Automatizare
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
        <TabsList className="grid w-full grid-cols-7">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

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
    </div>
  );
};

export default AutomationBuilder;

