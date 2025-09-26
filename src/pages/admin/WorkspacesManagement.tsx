import React, { useState, useEffect } from 'react';
import AdminPageLayout from '@/components/AdminPageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  Bot, 
  CreditCard, 
  Settings, 
  Search, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Key,
  ArrowRight,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Crown,
  Globe,
  Clock,
  Download,
  Plus
} from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
  domain?: string;
  planTier: 'STARTER' | 'PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TRIAL';
  memberCount: number;
  botCount: number;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  lastActivityAt: string;
  usage: {
    messagesThisMonth: number;
    botsLimit: number;
    storageUsed: number;
    storageLimit: number;
  };
  features: string[];
  settings: {
    timezone: string;
    language: string;
    branding: {
      logo?: string;
      primaryColor: string;
    };
  };
}

const WorkspacesManagement: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      setLoading(true);
      
      // Mock workspaces data
      const mockWorkspaces: Workspace[] = [
        {
          id: 'ws-1',
          name: 'TechCorp Solutions',
          domain: 'techcorp.com',
          planTier: 'ENTERPRISE',
          status: 'ACTIVE',
          memberCount: 15,
          botCount: 8,
          owner: {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah@techcorp.com'
          },
          createdAt: '2024-01-10T08:00:00Z',
          lastActivityAt: '2024-01-20T14:30:00Z',
          usage: {
            messagesThisMonth: 45000,
            botsLimit: 50,
            storageUsed: 2.3,
            storageLimit: 100
          },
          features: ['MULTI_WORKSPACE', 'SSO_SCIM', 'WHITE_LABEL', 'ADVANCED_ANALYTICS'],
          settings: {
            timezone: 'UTC-5',
            language: 'en',
            branding: {
              primaryColor: '#3B82F6'
            }
          }
        },
        {
          id: 'ws-2',
          name: 'StartupXYZ',
          domain: 'startupxyz.io',
          planTier: 'PRO',
          status: 'ACTIVE',
          memberCount: 8,
          botCount: 4,
          owner: {
            id: '3',
            name: 'Mike Chen',
            email: 'mike@startupxyz.io'
          },
          createdAt: '2024-01-15T12:00:00Z',
          lastActivityAt: '2024-01-19T16:45:00Z',
          usage: {
            messagesThisMonth: 12000,
            botsLimit: 20,
            storageUsed: 0.8,
            storageLimit: 50
          },
          features: ['TEAM_COLLABORATION', 'ANALYTICS', 'API_ACCESS'],
          settings: {
            timezone: 'UTC-8',
            language: 'en',
            branding: {
              primaryColor: '#10B981'
            }
          }
        },
        {
          id: 'ws-3',
          name: 'Local Business',
          planTier: 'STARTER',
          status: 'ACTIVE',
          memberCount: 3,
          botCount: 2,
          owner: {
            id: '4',
            name: 'Emma Wilson',
            email: 'emma@localbiz.com'
          },
          createdAt: '2024-01-18T09:30:00Z',
          lastActivityAt: '2024-01-20T11:20:00Z',
          usage: {
            messagesThisMonth: 2500,
            botsLimit: 5,
            storageUsed: 0.2,
            storageLimit: 10
          },
          features: ['BASIC_CHAT', 'TEMPLATES'],
          settings: {
            timezone: 'UTC-6',
            language: 'en',
            branding: {
              primaryColor: '#F59E0B'
            }
          }
        },
        {
          id: 'ws-4',
          name: 'Trial Company',
          planTier: 'STARTER',
          status: 'TRIAL',
          memberCount: 2,
          botCount: 1,
          owner: {
            id: '5',
            name: 'Alex Rodriguez',
            email: 'alex@trialco.com'
          },
          createdAt: '2024-01-19T14:15:00Z',
          lastActivityAt: '2024-01-20T10:15:00Z',
          usage: {
            messagesThisMonth: 150,
            botsLimit: 2,
            storageUsed: 0.05,
            storageLimit: 5
          },
          features: ['BASIC_CHAT'],
          settings: {
            timezone: 'UTC-7',
            language: 'en',
            branding: {
              primaryColor: '#8B5CF6'
            }
          }
        }
      ];

      setWorkspaces(mockWorkspaces);
    } catch (error) {
      console.error('Error loading workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkspaces = workspaces.filter(workspace => {
    const matchesSearch = workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workspace.owner.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = selectedPlan === 'ALL' || workspace.planTier === selectedPlan;
    const matchesStatus = selectedStatus === 'ALL' || workspace.status === selectedStatus;
    
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      INACTIVE: { color: 'bg-gray-100 text-gray-800', icon: Activity },
      SUSPENDED: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      TRIAL: { color: 'bg-blue-100 text-blue-800', icon: Clock }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center space-x-1`}>
        <Icon className="h-3 w-3" />
        <span>{status}</span>
      </Badge>
    );
  };

  const getPlanBadge = (plan: string) => {
    const planConfig = {
      STARTER: { color: 'bg-gray-100 text-gray-800' },
      PRO: { color: 'bg-blue-100 text-blue-800' },
      ENTERPRISE: { color: 'bg-purple-100 text-purple-800' }
    };
    
    const config = planConfig[plan as keyof typeof planConfig];
    
    return (
      <Badge className={config.color}>
        {plan}
      </Badge>
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout 
      title="Workspaces"
      description="Manage workspaces and teams"
    >
      <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Workspace</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Workspaces</p>
                  <p className="text-2xl font-bold text-gray-900">{workspaces.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Workspaces</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {workspaces.filter(w => w.status === 'ACTIVE').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {workspaces.reduce((sum, ws) => sum + ws.memberCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Bot className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bots</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {workspaces.reduce((sum, ws) => sum + ws.botCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search workspaces..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Plans</option>
                  <option value="STARTER">Starter</option>
                  <option value="PRO">Pro</option>
                  <option value="ENTERPRISE">Enterprise</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="TRIAL">Trial</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workspaces Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredWorkspaces.map((workspace) => (
            <Card key={workspace.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{workspace.name}</CardTitle>
                      {workspace.domain && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Globe className="h-3 w-3" />
                          <span>{workspace.domain}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(workspace.status)}
                    {getPlanBadge(workspace.planTier)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Owner Info */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Owner:</span>
                    <div className="flex items-center space-x-2">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{workspace.owner.name}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Users className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-600">Members</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">{workspace.memberCount}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Bot className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-600">Bots</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">{workspace.botCount}</p>
                    </div>
                  </div>

                  {/* Usage */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Messages this month</span>
                      <span className="font-medium">{formatNumber(workspace.usage.messagesThisMonth)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min((workspace.usage.messagesThisMonth / 50000) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {workspace.features.slice(0, 3).map((feature) => (
                        <Badge key={feature} className="bg-blue-100 text-blue-800 text-xs">
                          {feature.replace('_', ' ')}
                        </Badge>
                      ))}
                      {workspace.features.length > 3 && (
                        <Badge className="bg-gray-100 text-gray-800 text-xs">
                          +{workspace.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-xs text-gray-500">
                      Created {new Date(workspace.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Table View */}
        <Card>
          <CardHeader>
            <CardTitle>Workspaces Overview</CardTitle>
            <CardDescription>
              Detailed view of all workspaces with usage metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Workspace</th>
                    <th className="text-left p-4 font-medium">Plan</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Members</th>
                    <th className="text-left p-4 font-medium">Bots</th>
                    <th className="text-left p-4 font-medium">Usage</th>
                    <th className="text-left p-4 font-medium">Last Activity</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkspaces.map((workspace) => (
                    <tr key={workspace.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">{workspace.name}</p>
                          <p className="text-sm text-gray-600">{workspace.owner.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        {getPlanBadge(workspace.planTier)}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(workspace.status)}
                      </td>
                      <td className="p-4">
                        <span className="font-medium">{workspace.memberCount}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">{workspace.botCount}</span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <span className="font-medium">{formatNumber(workspace.usage.messagesThisMonth)}</span>
                          <span className="text-gray-600"> messages</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">
                          {new Date(workspace.lastActivityAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  );
};

export default WorkspacesManagement;
