import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import OnboardingWizard from '@/components/OnboardingWizard';
import QuickActions from '@/components/QuickActions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Settings, 
  Phone, 
  Globe, 
  Zap, 
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Plus,
  Play,
  ArrowRight,
  Crown,
  Shield
} from 'lucide-react';

interface DashboardMetric {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  url: string;
  color: string;
  priority: 'high' | 'medium' | 'low';
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  url: string;
  icon: React.ComponentType<any>;
}

const SmartDashboard: React.FC = () => {
  const { user } = useAuth();
  const [onboardingProgress, setOnboardingProgress] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Role-based dashboard content
  const getRoleBasedContent = () => {
    if (!user) return { metrics: [], quickActions: [], onboardingSteps: [] };

    const baseMetrics: DashboardMetric[] = [
      {
        title: "Total Conversations",
        value: "1,247",
        change: "+12%",
        trend: 'up',
        icon: MessageSquare,
        color: "text-blue-500"
      },
      {
        title: "Active Bots",
        value: "3",
        change: "+1 this week",
        trend: 'up',
        icon: Bot,
        color: "text-green-500"
      }
    ];

    const baseQuickActions: QuickAction[] = [
      {
        title: "Create Your First Bot",
        description: "Set up an AI assistant in minutes",
        icon: Plus,
        url: "/dashboard/flows",
        color: "bg-blue-500 hover:bg-blue-600",
        priority: 'high'
      },
      {
        title: "Connect WhatsApp",
        description: "Start receiving messages",
        icon: Phone,
        url: "/dashboard/channels/whatsapp",
        color: "bg-green-500 hover:bg-green-600",
        priority: 'high'
      }
    ];

    const baseOnboardingSteps: OnboardingStep[] = [
      {
        id: "connect-channel",
        title: "Connect a Channel",
        description: "Link WhatsApp, Instagram, or Website",
        completed: false,
        url: "/dashboard/channels",
        icon: Globe
      },
      {
        id: "create-bot",
        title: "Create Your First Bot",
        description: "Build an AI assistant",
        completed: false,
        url: "/dashboard/flows",
        icon: Bot
      },
      {
        id: "send-message",
        title: "Send Test Message",
        description: "Test your bot with a message",
        completed: false,
        url: "/dashboard/conversations",
        icon: MessageSquare
      },
      {
        id: "invite-team",
        title: "Invite Team Members",
        description: "Add your team to collaborate",
        completed: false,
        url: "/dashboard/team",
        icon: Users
      }
    ];

    // Role-specific content
    switch (user.role) {
      case 'ROOT_OWNER':
        return {
          metrics: [
            ...baseMetrics,
            {
              title: "System Health",
              value: "99.9%",
              change: "All systems operational",
              trend: 'up',
              icon: Shield,
              color: "text-green-500"
            },
            {
              title: "Total Users",
              value: "1,234",
              change: "+45 this month",
              trend: 'up',
              icon: Users,
              color: "text-purple-500"
            }
          ],
          quickActions: [
            ...baseQuickActions,
            {
              title: "System Overview",
              description: "Monitor platform health",
              icon: BarChart3,
              url: "/dashboard/root",
              color: "bg-purple-500 hover:bg-purple-600",
              priority: 'high'
            },
            {
              title: "User Management",
              description: "Manage users and permissions",
              icon: Users,
              url: "/dashboard/admin/users",
              color: "bg-orange-500 hover:bg-orange-600",
              priority: 'medium'
            }
          ],
          onboardingSteps: baseOnboardingSteps
        };

      case 'SUPER_ADMIN':
        return {
          metrics: [
            ...baseMetrics,
            {
              title: "Team Members",
              value: "12",
              change: "+2 this week",
              trend: 'up',
              icon: Users,
              color: "text-blue-500"
            }
          ],
          quickActions: [
            ...baseQuickActions,
            {
              title: "Admin Panel",
              description: "Manage users and settings",
              icon: Shield,
              url: "/dashboard/superadmin",
              color: "bg-red-500 hover:bg-red-600",
              priority: 'high'
            }
          ],
          onboardingSteps: baseOnboardingSteps
        };

      case 'MANAGER':
        return {
          metrics: baseMetrics,
          quickActions: [
            ...baseQuickActions,
            {
              title: "Team Analytics",
              description: "View team performance",
              icon: BarChart3,
              url: "/dashboard/analytics",
              color: "bg-indigo-500 hover:bg-indigo-600",
              priority: 'medium'
            }
          ],
          onboardingSteps: baseOnboardingSteps
        };

      default:
        return {
          metrics: baseMetrics,
          quickActions: baseQuickActions,
          onboardingSteps: baseOnboardingSteps
        };
    }
  };

  const { metrics, quickActions, onboardingSteps } = getRoleBasedContent();

  // Calculate onboarding progress
  useEffect(() => {
    const completedSteps = onboardingSteps.filter(step => step.completed).length;
    const totalSteps = onboardingSteps.length;
    setOnboardingProgress((completedSteps / totalSteps) * 100);
  }, [onboardingSteps]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <div className="w-4 h-4" />;
    }
  };

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'ROOT_OWNER' && 'System Overview'}
            {user?.role === 'SUPER_ADMIN' && 'Admin Dashboard'}
            {user?.role === 'MANAGER' && 'Team Management'}
            {!['ROOT_OWNER', 'SUPER_ADMIN', 'MANAGER'].includes(user?.role || '') && 'Your AI Assistant Dashboard'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            {user?.role === 'ROOT_OWNER' && <Crown className="w-3 h-3" />}
            {user?.role === 'SUPER_ADMIN' && <Shield className="w-3 h-3" />}
            {user?.role}
          </Badge>
        </div>
      </div>

      {/* Onboarding Progress */}
      {onboardingProgress < 100 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Getting Started
            </CardTitle>
            <CardDescription>
              Complete these steps to get the most out of your platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(onboardingProgress)}%</span>
              </div>
              <Progress value={onboardingProgress} className="w-full" />
              
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground">
                  Complete these steps to get started
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowOnboarding(true)}
                >
                  <Target className="w-4 h-4 mr-1" />
                  Guided Setup
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {onboardingSteps.map((step) => (
                  <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'
                    }`}>
                      {step.completed ? <CheckCircle className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{step.title}</div>
                      <div className="text-sm text-muted-foreground">{step.description}</div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a href={step.url}>
                        {step.completed ? 'View' : 'Start'}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  {metric.change && (
                    <div className="flex items-center gap-1 mt-1">
                      {getTrendIcon(metric.trend || 'neutral')}
                      <span className="text-sm text-muted-foreground">{metric.change}</span>
                    </div>
                  )}
                </div>
                <metric.icon className={`w-8 h-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions />

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
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{activity.title}</div>
                    <div className="text-sm text-muted-foreground">{activity.description}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{activity.time}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <p>No recent activity</p>
                <p className="text-sm">Start by creating your first bot or connecting a channel</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Wizard */}
      <OnboardingWizard 
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => setShowOnboarding(false)}
      />
    </div>
  );
};

export default SmartDashboard;
