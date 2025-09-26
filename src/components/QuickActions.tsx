import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  MessageSquare, 
  BarChart3, 
  Bot, 
  Phone, 
  Globe, 
  Users, 
  Settings, 
  Zap, 
  Target,
  ArrowRight,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  url: string;
  color: string;
  priority: 'high' | 'medium' | 'low';
  category: 'creation' | 'management' | 'analysis' | 'setup';
  estimatedTime?: string;
  isNew?: boolean;
  isPopular?: boolean;
}

interface QuickActionsProps {
  className?: string;
  showHeader?: boolean;
  maxItems?: number;
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  className = '', 
  showHeader = true, 
  maxItems = 6 
}) => {
  const { user } = useAuth();

  // Define quick actions based on user role and context
  const getQuickActions = (): QuickAction[] => {
    const baseActions: QuickAction[] = [
      {
        id: 'create-bot',
        title: 'Create Bot',
        description: 'Build an AI assistant in minutes',
        icon: Bot,
        url: '/dashboard/flows',
        color: 'bg-blue-500 hover:bg-blue-600',
        priority: 'high',
        category: 'creation',
        estimatedTime: '5 min',
        isNew: true
      },
      {
        id: 'send-message',
        title: 'Send Message',
        description: 'Broadcast to your audience',
        icon: MessageSquare,
        url: '/dashboard/broadcast',
        color: 'bg-green-500 hover:bg-green-600',
        priority: 'high',
        category: 'creation',
        estimatedTime: '2 min'
      },
      {
        id: 'connect-whatsapp',
        title: 'Connect WhatsApp',
        description: 'Start receiving messages',
        icon: Phone,
        url: '/dashboard/channels/whatsapp',
        color: 'bg-green-600 hover:bg-green-700',
        priority: 'high',
        category: 'setup',
        estimatedTime: '3 min',
        isPopular: true
      },
      {
        id: 'view-analytics',
        title: 'View Analytics',
        description: 'Track performance and insights',
        icon: BarChart3,
        url: '/dashboard/analytics',
        color: 'bg-purple-500 hover:bg-purple-600',
        priority: 'medium',
        category: 'analysis',
        estimatedTime: '1 min'
      },
      {
        id: 'setup-automation',
        title: 'Setup Automation',
        description: 'Create automated workflows',
        icon: Zap,
        url: '/dashboard/automation',
        color: 'bg-orange-500 hover:bg-orange-600',
        priority: 'medium',
        category: 'management',
        estimatedTime: '10 min'
      },
      {
        id: 'invite-team',
        title: 'Invite Team',
        description: 'Add team members',
        icon: Users,
        url: '/dashboard/team',
        color: 'bg-indigo-500 hover:bg-indigo-600',
        priority: 'low',
        category: 'management',
        estimatedTime: '3 min'
      }
    ];

    // Add role-specific actions
    if (user?.role === 'SUPER_ADMIN' || user?.role === 'ROOT_OWNER') {
      baseActions.push(
        {
          id: 'admin-panel',
          title: 'Admin Panel',
          description: 'Manage users and settings',
          icon: Settings,
          url: '/dashboard/superadmin',
          color: 'bg-red-500 hover:bg-red-600',
          priority: 'high',
          category: 'management',
          estimatedTime: '5 min'
        }
      );
    }

    if (user?.role === 'ROOT_OWNER') {
      baseActions.push(
        {
          id: 'system-overview',
          title: 'System Overview',
          description: 'Monitor platform health',
          icon: Target,
          url: '/dashboard/root',
          color: 'bg-gray-500 hover:bg-gray-600',
          priority: 'high',
          category: 'analysis',
          estimatedTime: '2 min'
        }
      );
    }

    return baseActions;
  };

  const actions = getQuickActions()
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, maxItems);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-l-red-500';
      case 'medium':
        return 'border-l-4 border-l-yellow-500';
      case 'low':
        return 'border-l-4 border-l-green-500';
      default:
        return '';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'creation':
        return <Plus className="w-3 h-3" />;
      case 'management':
        return <Settings className="w-3 h-3" />;
      case 'analysis':
        return <BarChart3 className="w-3 h-3" />;
      case 'setup':
        return <Target className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'creation':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'management':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'analysis':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'setup':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Get things done faster with these common tasks
          </CardDescription>
        </CardHeader>
      )}
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action) => (
            <Card 
              key={action.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${getPriorityColor(action.priority)}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm">{action.title}</h3>
                      {action.isNew && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                      {action.isPopular && (
                        <Badge variant="outline" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{action.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${getCategoryColor(action.category)}`}>
                          {getCategoryIcon(action.category)}
                          {action.category}
                        </Badge>
                        {action.estimatedTime && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {action.estimatedTime}
                          </div>
                        )}
                      </div>
                      <Button size="sm" variant="ghost" asChild>
                        <a href={action.url}>
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Show more actions if there are more than maxItems */}
        {getQuickActions().length > maxItems && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View All Actions
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
