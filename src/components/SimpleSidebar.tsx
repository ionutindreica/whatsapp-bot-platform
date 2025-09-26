import { useState, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  Bot, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  User, 
  Phone,
  CreditCard,
  LogOut,
  Globe,
  Zap,
  Shield,
  Users,
  Crown,
  ChevronDown,
  ChevronRight,
  Plus,
  Play,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Simplified menu structure - only 5 core sections
const coreMenuSections = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: Home,
    url: "/dashboard",
    description: "Overview and analytics"
  },
  {
    id: "conversations", 
    title: "Conversations",
    icon: MessageSquare,
    url: "/dashboard/conversations",
    description: "Manage all chats"
  },
  {
    id: "ai",
    title: "AI Assistant",
    icon: Bot,
    url: "/dashboard/bots",
    description: "Create and manage bots"
  },
  {
    id: "channels",
    title: "Channels",
    icon: Globe,
    url: "/dashboard/channels",
    description: "Connect platforms"
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    url: "/dashboard/settings",
    description: "Account and team"
  }
];

// Quick actions for easy access
const quickActions = [
  {
    title: "Create Bot",
    icon: Plus,
    url: "/dashboard/flows",
    color: "bg-blue-500 hover:bg-blue-600"
  },
  {
    title: "Send Message",
    icon: MessageSquare,
    url: "/dashboard/broadcast",
    color: "bg-green-500 hover:bg-green-600"
  },
  {
    title: "View Analytics",
    icon: BarChart3,
    url: "/dashboard/analytics",
    color: "bg-purple-500 hover:bg-purple-600"
  }
];

// Advanced features (hidden by default, shown on demand)
const advancedFeatures = [
  {
    id: "automation",
    title: "Automation",
    icon: Zap,
    url: "/dashboard/automation",
    description: "Workflow automation"
  },
  {
    id: "integrations",
    title: "Integrations",
    icon: Code,
    url: "/dashboard/integrations",
    description: "API keys, webhooks, widgets"
  },
  {
    id: "team",
    title: "Team",
    icon: Users,
    url: "/dashboard/team",
    description: "Team management"
  },
  {
    id: "billing",
    title: "Billing",
    icon: CreditCard,
    url: "/dashboard/billing",
    description: "Subscription and billing"
  }
];

// Admin features (only for admin users)
const adminFeatures = [
  {
    id: "admin",
    title: "Admin Panel",
    icon: Shield,
    url: "/dashboard/superadmin",
    description: "System administration",
    requiredRole: "SUPER_ADMIN"
  },
  {
    id: "root",
    title: "Root Admin",
    icon: Crown,
    url: "/dashboard/root",
    description: "Root administration",
    requiredRole: "ROOT_OWNER"
  }
];

interface SimpleSidebarProps {
  isCollapsed?: boolean;
}

const SimpleSidebar: React.FC<SimpleSidebarProps> = ({ isCollapsed = false }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  // Filter features based on user role
  const filteredAdminFeatures = useMemo(() => {
    if (!user) return [];
    return adminFeatures.filter(feature => {
      if (!feature.requiredRole) return true;
      return user.role === feature.requiredRole;
    });
  }, [user]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`flex flex-col h-full bg-background border-r transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold">ChatFlow</h1>
              <p className="text-xs text-muted-foreground">AI Platform</p>
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-b">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <NavLink
                key={action.title}
                to={action.url}
                end={action.url === '/dashboard'} // Only match exactly for dashboard
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`
                }
              >
                <action.icon className="w-4 h-4" />
                {action.title}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Core Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Main Menu
          </h3>
          <nav className="space-y-1">
            {coreMenuSections.map((section) => (
              <NavLink
                key={section.id}
                to={section.url}
                end={section.url === '/dashboard'} // Only match exactly for dashboard
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`
                }
              >
                <section.icon className="w-4 h-4" />
                {!isCollapsed && (
                  <div className="flex-1">
                    <div>{section.title}</div>
                    <div className="text-xs text-muted-foreground">{section.description}</div>
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Advanced Features Toggle */}
        {!isCollapsed && (
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full justify-between"
            >
              <span className="text-sm">Advanced Features</span>
              {showAdvanced ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
            
            {showAdvanced && (
              <div className="mt-2 space-y-1">
                {advancedFeatures.map((feature) => (
                  <NavLink
                    key={feature.id}
                    to={feature.url}
                    end={feature.url === '/dashboard'} // Only match exactly for dashboard
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                      }`
                    }
                  >
                    <feature.icon className="w-4 h-4" />
                    <div className="flex-1">
                      <div>{feature.title}</div>
                      <div className="text-xs text-muted-foreground">{feature.description}</div>
                    </div>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Admin Features */}
        {!isCollapsed && filteredAdminFeatures.length > 0 && (
          <div className="p-4 border-t">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Administration
            </h3>
            <div className="space-y-1">
              {filteredAdminFeatures.map((feature) => (
                <NavLink
                  key={feature.id}
                  to={feature.url}
                  end={feature.url === '/dashboard'} // Only match exactly for dashboard
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`
                  }
                >
                  <feature.icon className="w-4 h-4" />
                  <div className="flex-1">
                    <div>{feature.title}</div>
                    <div className="text-xs text-muted-foreground">{feature.description}</div>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          {!isCollapsed && (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleSidebar;