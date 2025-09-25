import { useState } from "react";
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
  Code,
  Zap,
  Shield,
  Users,
  FileText,
  Building2,
  Database,
  Webhook,
  Key,
  Download,
  PlayCircle,
  Monitor,
  Smartphone,
  Mail,
  MessageCircle,
  Megaphone,
  Headphones,
  Target,
  TrendingUp,
  Instagram,
  Facebook,
  Crown,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Material Design 3 Icons mapping
const MaterialIcons = {
  Home: "home",
  Bot: "smart_toy", 
  MessageSquare: "chat",
  BarChart3: "analytics",
  Settings: "settings",
  User: "person",
  Phone: "phone",
  CreditCard: "credit_card",
  Globe: "language",
  Code: "code",
  Zap: "bolt",
  Shield: "security",
  Users: "group",
  FileText: "description",
  Database: "storage",
  Webhook: "webhook",
  Key: "key",
  Download: "download",
  PlayCircle: "play_circle",
  Monitor: "monitor",
  Smartphone: "smartphone",
  Mail: "mail",
  MessageCircle: "chat_bubble",
  Megaphone: "campaign",
  Headphones: "headset",
  Target: "track_changes",
  TrendingUp: "trending_up",
  Instagram: "photo_camera",
  Facebook: "facebook",
  Crown: "workspace_premium",
  LogOut: "logout"
};

// Menu structure with dropdowns
const menuSections = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: Home,
    items: [
      { title: "Overview", url: "/dashboard", icon: Home }
    ]
  },
  {
    id: "conversations", 
    title: "Conversations",
    icon: MessageSquare,
    items: [
      { title: "All Conversations", url: "/dashboard/conversations", icon: MessageSquare },
      { title: "Live Transfer", url: "/dashboard/live-agent", icon: Headphones },
      { title: "Broadcast Messages", url: "/dashboard/broadcast", icon: Megaphone },
      { title: "Polls & Surveys", url: "/dashboard/polls", icon: TrendingUp }
    ]
  },
  {
    id: "ai",
    title: "AI & Automation", 
    icon: Bot,
    items: [
      { title: "My AI Agents", url: "/dashboard/bots", icon: Bot },
      { title: "AI Training", url: "/dashboard/ai/training", icon: Zap },
      { title: "AI Templates", url: "/dashboard/ai/templates", icon: FileText },
      { title: "AI Knowledge Base", url: "/dashboard/ai/knowledge", icon: Database },
      { title: "Flow Builder", url: "/dashboard/flows", icon: Target },
      { title: "CRM Light", url: "/dashboard/crm", icon: Users },
      { title: "Triggers", url: "/dashboard/triggers", icon: Target }
    ]
  },
  {
    id: "channels",
    title: "Channels",
    icon: Globe,
    items: [
      { title: "WhatsApp", url: "/dashboard/channels/whatsapp", icon: Phone },
      { title: "Instagram", url: "/dashboard/channels/instagram", icon: Instagram },
      { title: "Messenger", url: "/dashboard/channels/messenger", icon: Facebook },
      { title: "Website Widget", url: "/dashboard/channels/website", icon: Globe },
      { title: "Mobile App", url: "/dashboard/channels/mobile", icon: Smartphone },
      { title: "Email", url: "/dashboard/channels/email", icon: Mail }
    ]
  },
  {
    id: "integrations",
    title: "Integrations",
    icon: Code,
    items: [
      { title: "Website Integration", url: "/dashboard/integrations/website", icon: Globe },
      { title: "Instagram Integration", url: "/dashboard/integrations/instagram", icon: Instagram },
      { title: "Widget Builder", url: "/dashboard/integrations/widget", icon: Code },
      { title: "API Keys", url: "/dashboard/integrations/api", icon: Key },
      { title: "Webhooks", url: "/dashboard/integrations/webhooks", icon: Webhook }
    ]
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: BarChart3,
    items: [
      { title: "Omnichannel Analytics", url: "/dashboard/analytics", icon: BarChart3 }
    ]
  },
  {
    id: "team",
    title: "Team",
    icon: Users,
    items: [
      { title: "Team Members", url: "/dashboard/team/members", icon: Users },
      { title: "Team Roles", url: "/dashboard/team/roles", icon: Shield },
      { title: "Access Control", url: "/dashboard/admin/access-control", icon: Shield },
      { title: "Collaboration", url: "/dashboard/team/collaboration", icon: Users }
    ]
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    items: [
      { title: "Profile Settings", url: "/dashboard/settings/profile", icon: User },
      { title: "Account Settings", url: "/dashboard/settings/account", icon: Settings },
      { title: "Phone Settings", url: "/dashboard/settings/phone", icon: Phone },
      { title: "Security Settings", url: "/dashboard/settings/security", icon: Shield },
      { title: "Export Data", url: "/dashboard/settings/export", icon: Download }
    ]
  },
  {
    id: "billing",
    title: "Billing",
    icon: CreditCard,
    items: [
      { title: "Subscription Plans", url: "/dashboard/subscription-tiers", icon: Crown },
      { title: "Billing Overview", url: "/dashboard/billing", icon: CreditCard },
      { title: "Root Admin Dashboard", url: "/dashboard/superadmin", icon: Shield },
      { title: "Users Management", url: "/dashboard/admin/users", icon: Users },
      { title: "Roles & Permissions", url: "/dashboard/admin/roles", icon: Shield },
      { title: "Workspaces", url: "/dashboard/admin/workspaces", icon: Building2 }
    ]
  },
  {
    id: "help",
    title: "Help",
    icon: FileText,
    items: [
      { title: "Documentation", url: "/dashboard/docs", icon: FileText },
      { title: "Support", url: "/dashboard/support", icon: Users },
      { title: "Pricing", url: "/dashboard/pricing", icon: CreditCard }
    ]
  }
];

export default function MaterialSidebar() {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout } = useAuth();

  const isActive = (path: string) => currentPath === path;

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isSectionExpanded = (sectionId: string) => expandedSections.includes(sectionId);

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium rounded-lg border border-primary/20 shadow-sm" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground hover:shadow-sm rounded-lg transition-all duration-200";

  return (
    <div className="w-80 h-full bg-card border-r border-border shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              ChatFlow AI
            </span>
            <span className="text-xs text-muted-foreground font-medium">Omnichannel Platform</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuSections.map((section) => (
          <Card key={section.id} className="border-0 shadow-none bg-transparent">
            <Collapsible 
              open={isSectionExpanded(section.id)}
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-3 h-auto hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <section.icon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-sm">{section.title}</span>
                  </div>
                  {isSectionExpanded(section.id) ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-1 ml-4 mt-2">
                {section.items.map((item) => (
                  <NavLink
                    key={item.title}
                    to={item.url}
                    className={({ isActive }) => 
                      `flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? "bg-primary/10 text-primary font-medium border border-primary/20 shadow-sm" 
                          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm">{item.title}</span>
                  </NavLink>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
          <span className="text-sm font-medium text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors group"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
