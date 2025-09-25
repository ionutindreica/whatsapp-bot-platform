import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  MessageSquare,
  Tag,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  Activity,
  Clock,
  Globe,
  Database,
  FileText,
  PieChart,
  BarChart3,
  Target,
  Zap,
  Settings,
  RefreshCw
} from 'lucide-react';
import AdminPageLayout from '@/components/AdminPageLayout';

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  platform: string;
  status: 'active' | 'inactive' | 'lead' | 'customer' | 'churned';
  tags: string[];
  notes: string;
  lastContact: string;
  totalMessages: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  value: number;
  location?: string;
  joinedDate: string;
}

interface Segment {
  id: string;
  name: string;
  description: string;
  criteria: string[];
  customerCount: number;
  color: string;
  autoUpdate: boolean;
}

interface Note {
  id: string;
  customerId: string;
  content: string;
  author: string;
  timestamp: string;
  type: 'note' | 'call' | 'email' | 'meeting';
  tags: string[];
}

const CRMLight: React.FC = () => {
  const [activeTab, setActiveTab] = useState('customers');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const customers: Customer[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      platform: 'WhatsApp',
      status: 'customer',
      tags: ['VIP', 'Premium', 'Tech Support'],
      notes: 'Long-term customer, interested in enterprise features',
      lastContact: '2 hours ago',
      totalMessages: 247,
      sentiment: 'positive',
      value: 2500,
      location: 'New York, USA',
      joinedDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      phone: '+1-555-0456',
      platform: 'Instagram',
      status: 'lead',
      tags: ['Interested', 'Marketing'],
      notes: 'Inquired about pricing for team plan',
      lastContact: '1 day ago',
      totalMessages: 89,
      sentiment: 'positive',
      value: 0,
      location: 'California, USA',
      joinedDate: '2024-02-10'
    },
    {
      id: '3',
      name: 'Mike Chen',
      platform: 'Messenger',
      status: 'active',
      tags: ['Support', 'Bug Report'],
      notes: 'Reported integration issue, resolved successfully',
      lastContact: '3 hours ago',
      totalMessages: 156,
      sentiment: 'neutral',
      value: 500,
      location: 'Toronto, Canada',
      joinedDate: '2024-01-28'
    },
    {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma.w@startup.io',
      phone: '+44-20-7946-0958',
      platform: 'Website',
      status: 'customer',
      tags: ['Enterprise', 'Custom Integration'],
      notes: 'Enterprise client, needs custom API integration',
      lastContact: '5 minutes ago',
      totalMessages: 423,
      sentiment: 'positive',
      value: 5000,
      location: 'London, UK',
      joinedDate: '2023-12-05'
    }
  ];

  const segments: Segment[] = [
    {
      id: '1',
      name: 'VIP Customers',
      description: 'High-value customers with premium support',
      criteria: ['value > 1000', 'status = customer', 'sentiment = positive'],
      customerCount: 23,
      color: 'gold',
      autoUpdate: true
    },
    {
      id: '2',
      name: 'Hot Leads',
      description: 'Recent leads showing strong interest',
      criteria: ['status = lead', 'last_contact < 7_days', 'messages > 10'],
      customerCount: 45,
      color: 'red',
      autoUpdate: true
    },
    {
      id: '3',
      name: 'Support Issues',
      description: 'Customers with ongoing support requests',
      criteria: ['tags contains Support', 'sentiment = negative'],
      customerCount: 12,
      color: 'orange',
      autoUpdate: true
    },
    {
      id: '4',
      name: 'Churned Users',
      description: 'Inactive users who may need re-engagement',
      criteria: ['status = churned', 'last_contact > 30_days'],
      customerCount: 67,
      color: 'gray',
      autoUpdate: true
    }
  ];

  const notes: Note[] = [
    {
      id: '1',
      customerId: '1',
      content: 'Customer called about enterprise features. Very interested in advanced analytics.',
      author: 'John Admin',
      timestamp: '2 hours ago',
      type: 'call',
      tags: ['sales', 'enterprise']
    },
    {
      id: '2',
      customerId: '2',
      content: 'Sent pricing information for team plan. Follow up in 3 days.',
      author: 'Sarah Manager',
      timestamp: '1 day ago',
      type: 'email',
      tags: ['pricing', 'follow-up']
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'customer':
        return <Badge variant="default" className="bg-green-500">Customer</Badge>;
      case 'lead':
        return <Badge variant="outline" className="bg-blue-500">Lead</Badge>;
      case 'active':
        return <Badge variant="default" className="bg-blue-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'churned':
        return <Badge variant="outline" className="bg-gray-500">Churned</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="w-4 h-4 text-green-500" />;
      case 'negative':
        return <ThumbsDown className="w-4 h-4 text-red-500" />;
      case 'neutral':
        return <ThumbsUp className="w-4 h-4 text-gray-500" />;
      default:
        return <ThumbsUp className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'WhatsApp':
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'Instagram':
        return <MessageSquare className="w-4 h-4 text-pink-500" />;
      case 'Messenger':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'Website':
        return <Globe className="w-4 h-4 text-blue-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSegmentColor = (color: string) => {
    const colors: { [key: string]: string } = {
      gold: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800',
      orange: 'bg-orange-100 text-orange-800',
      gray: 'bg-gray-100 text-gray-800',
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800'
    };
    return colors[color] || 'bg-gray-100 text-gray-800';
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone?.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminPageLayout 
      title="CRM Light"
      description="Customer relationship management with user data collection, notes, and segments"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-6">
          {/* Customer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Customers</p>
                    <p className="text-2xl font-bold">1,247</p>
                    <p className="text-sm text-green-600">+23 this week</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Leads</p>
                    <p className="text-2xl font-bold">89</p>
                    <p className="text-sm text-green-600">+12 this week</p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Conversion Rate</p>
                    <p className="text-2xl font-bold">24.3%</p>
                    <p className="text-sm text-blue-600">+2.1% this month</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Value</p>
                    <p className="text-2xl font-bold">$1,247</p>
                    <p className="text-sm text-green-600">+$89 this month</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Customers</CardTitle>
                  <CardDescription>Manage your customer relationships and data</CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search customers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="churned">Churned</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Customer
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCustomers.map((customer) => (
                  <div key={customer.id} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{customer.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            {getPlatformIcon(customer.platform)}
                            <span>{customer.platform}</span>
                            <span>•</span>
                            <span>{customer.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(customer.status)}
                        {getSentimentIcon(customer.sentiment)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-muted-foreground">Contact</p>
                        <p className="font-medium">{customer.email || customer.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Messages</p>
                        <p className="font-medium">{customer.totalMessages}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Value</p>
                        <p className="font-medium">${customer.value.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Contact</p>
                        <p className="font-medium">{customer.lastContact}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {customer.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {customer.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{customer.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Customer Segments</CardTitle>
                  <CardDescription>Organize customers into meaningful groups</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Segment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {segments.map((segment) => (
                  <div key={segment.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getSegmentColor(segment.color)} border-0`}>
                          {segment.name}
                        </Badge>
                        {segment.autoUpdate && (
                          <Badge variant="outline" className="text-xs">
                            Auto-update
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{segment.customerCount}</p>
                        <p className="text-xs text-muted-foreground">customers</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{segment.description}</p>
                    
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Criteria:</p>
                      <div className="flex flex-wrap gap-1">
                        {segment.criteria.map((criterion, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {criterion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Customer Notes</CardTitle>
                  <CardDescription>Track interactions and important information</CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notes.map((note) => (
                  <div key={note.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {note.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">by {note.author}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{note.timestamp}</span>
                    </div>
                    <p className="text-sm mb-2">{note.content}</p>
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Distribution</CardTitle>
                <CardDescription>Breakdown by status and platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Customer Analytics</h3>
                  <p className="text-muted-foreground">
                    Connect to analytics service for detailed customer insights
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>Lead to customer conversion tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Conversion Analytics</h3>
                  <p className="text-muted-foreground">
                    Detailed conversion funnel and customer journey analytics
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CRM Settings</CardTitle>
              <CardDescription>Configure your CRM preferences and data collection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Auto-tagging Rules</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically tag customers based on behavior
                    </p>
                  </div>
                  
                  <div>
                    <Label>Data Collection</Label>
                    <p className="text-xs text-muted-foreground">
                      What customer data to collect and store
                    </p>
                  </div>
                  
                  <div>
                    <Label>Privacy Settings</Label>
                    <p className="text-xs text-muted-foreground">
                      GDPR compliance and data retention policies
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label>Integration Settings</Label>
                    <p className="text-xs text-muted-foreground">
                      Connect with external CRM systems
                    </p>
                  </div>
                  
                  <div>
                    <Label>Export Options</Label>
                    <p className="text-xs text-muted-foreground">
                      Configure data export formats and schedules
                    </p>
                  </div>
                  
                  <div>
                    <Label>Backup Settings</Label>
                    <p className="text-xs text-muted-foreground">
                      Automated backup and data recovery
                    </p>
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
                  Export Data
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminPageLayout>
  );
};

export default CRMLight;
