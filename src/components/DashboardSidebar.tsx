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
  Receipt,
  LogOut,
  Globe,
  Code,
  Zap,
  Shield,
  Users,
  FileText,
  Palette,
  Database,
  Webhook,
  Key,
  Download,
  Upload,
  PlayCircle,
  PauseCircle,
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
  Crown
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

// 🏠 Dashboard
const dashboardItems = [
  { title: "Overview", url: "/dashboard", icon: Home },
];

// 💬 Conversations
const conversationItems = [
  { title: "All Conversations", url: "/conversations", icon: MessageSquare },
  { title: "Live Transfer", url: "/live-agent", icon: Headphones },
  { title: "Broadcast Messages", url: "/broadcast", icon: Megaphone },
  { title: "Polls & Surveys", url: "/polls", icon: TrendingUp },
];

// 🤖 AI & Automation
const aiItems = [
  { title: "My AI Agents", url: "/bots", icon: Bot },
  { title: "AI Training", url: "/ai/training", icon: Zap },
  { title: "AI Templates", url: "/ai/templates", icon: FileText },
  { title: "AI Knowledge Base", url: "/ai/knowledge", icon: Database },
  { title: "Flow Builder", url: "/flows", icon: Target },
  { title: "Triggers", url: "/triggers", icon: Target },
];

// 🌐 Channels & Integrations
const channelItems = [
  { title: "WhatsApp", url: "/channels/whatsapp", icon: Phone },
  { title: "Instagram", url: "/channels/instagram", icon: Instagram },
  { title: "Messenger", url: "/channels/messenger", icon: Facebook },
  { title: "Website Widget", url: "/channels/website", icon: Globe },
  { title: "Mobile App", url: "/channels/mobile", icon: Smartphone },
  { title: "Email", url: "/channels/email", icon: Mail },
];

const integrationItems = [
  { title: "Website Integration", url: "/integrations/website", icon: Globe },
  { title: "Instagram Integration", url: "/integrations/instagram", icon: Instagram },
  { title: "Widget Builder", url: "/integrations/widget", icon: Code },
  { title: "API Keys", url: "/integrations/api", icon: Key },
  { title: "Webhooks", url: "/integrations/webhooks", icon: Webhook },
];

// 📊 Analytics & Insights
const analyticsItems = [
  { title: "Omnichannel Analytics", url: "/analytics", icon: BarChart3 },
];

// 👥 Team & Settings
const teamItems = [
  { title: "Team Members", url: "/team/members", icon: Users },
  { title: "Team Roles", url: "/team/roles", icon: Shield },
  { title: "Collaboration", url: "/team/collaboration", icon: Users },
];

const accountSettingsItems = [
  { title: "Profile Settings", url: "/settings/profile", icon: User },
  { title: "Account Settings", url: "/settings/account", icon: Settings },
  { title: "Phone Settings", url: "/settings/phone", icon: Phone },
  { title: "Security Settings", url: "/settings/security", icon: Shield },
  { title: "Export Data", url: "/settings/export", icon: Download },
];

// 💳 Billing & Admin
const billingItems = [
  { title: "Subscription Plans", url: "/subscription-tiers", icon: Crown },
  { title: "Billing Overview", url: "/billing", icon: CreditCard },
  { title: "Super Admin Dashboard", url: "/superadmin", icon: Shield },
];

// 📚 Help & Resources
const helpItems = [
  { title: "Documentation", url: "/docs", icon: FileText },
  { title: "Support", url: "/support", icon: Users },
  { title: "Pricing", url: "/pricing", icon: CreditCard },
];

export default function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout } = useAuth();

  const isActive = (path: string) => currentPath === path;
  const isMainExpanded = dashboardItems.some((item) => isActive(item.url));
  const isSettingsExpanded = accountSettingsItems.some((item) => isActive(item.url));

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium border-r-2 border-blue-500 dark:border-blue-400" 
      : "hover:bg-gray-100 dark:hover:bg-gray-800/50 text-foreground hover:text-blue-600 dark:hover:text-blue-400";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent className="px-2">
        {/* Logo/Brand */}
        <div className="mb-6 p-4">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">ChatFlow AI</span>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        {/* 🏠 Dashboard */}
        <SidebarGroup>
          <SidebarGroupLabel>🏠 Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 💬 Conversations */}
        <SidebarGroup>
          <SidebarGroupLabel>💬 Conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 🤖 AI & Automation */}
        <SidebarGroup>
          <SidebarGroupLabel>🤖 AI & Automation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {aiItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 🌐 Channels & Integrations */}
        <SidebarGroup>
          <SidebarGroupLabel>🌐 Channels & Integrations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {channelItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {integrationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 📊 Analytics & Insights */}
        <SidebarGroup>
          <SidebarGroupLabel>📊 Analytics & Insights</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 👥 Team & Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>👥 Team & Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {teamItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {accountSettingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 💳 Billing & Admin */}
        <SidebarGroup>
          <SidebarGroupLabel>💳 Billing & Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {billingItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 📚 Help & Resources */}
        <SidebarGroup>
          <SidebarGroupLabel>📚 Help & Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {helpItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Theme Toggle and Logout */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}