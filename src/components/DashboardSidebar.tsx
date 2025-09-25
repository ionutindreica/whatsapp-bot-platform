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
  { title: "Unified Inbox", url: "/dashboard/inbox", icon: MessageSquare },
  { title: "All Conversations", url: "/dashboard/conversations", icon: MessageSquare },
  { title: "Live Transfer", url: "/dashboard/live-agent", icon: Headphones },
  { title: "Broadcast Messages", url: "/dashboard/broadcast", icon: Megaphone },
  { title: "Polls & Surveys", url: "/dashboard/polls", icon: TrendingUp },
];

// 🤖 AI & Automation
const aiItems = [
  { title: "My AI Agents", url: "/dashboard/bots", icon: Bot },
  { title: "Core AI Engine", url: "/dashboard/ai/core", icon: Zap },
  { title: "AI Training", url: "/dashboard/ai/training", icon: Zap },
  { title: "AI Templates", url: "/dashboard/ai/templates", icon: FileText },
  { title: "AI Knowledge Base", url: "/dashboard/ai/knowledge", icon: Database },
  { title: "Flow Builder", url: "/dashboard/flow-builder", icon: Target },
  { title: "Automation Center", url: "/dashboard/automation", icon: Target },
  { title: "Triggers", url: "/dashboard/triggers", icon: Target },
];

// 🌐 Platform Management
const platformItems = [
  { title: "Platform Overview", url: "/dashboard/platforms", icon: Globe },
];

// 🌐 Channels & Integrations
const channelItems = [
  { title: "WhatsApp", url: "/dashboard/channels/whatsapp", icon: Phone },
  { title: "Instagram", url: "/dashboard/channels/instagram", icon: Instagram },
  { title: "Messenger", url: "/dashboard/channels/messenger", icon: Facebook },
  { title: "Website Widget", url: "/dashboard/channels/website", icon: Globe },
  { title: "Mobile App", url: "/dashboard/channels/mobile", icon: Smartphone },
  { title: "Email", url: "/dashboard/channels/email", icon: Mail },
];

const integrationItems = [
  { title: "Website Integration", url: "/dashboard/integrations/website", icon: Globe },
  { title: "Instagram Integration", url: "/dashboard/integrations/instagram", icon: Instagram },
  { title: "Widget Builder", url: "/dashboard/integrations/widget", icon: Code },
  { title: "API Keys", url: "/dashboard/integrations/api", icon: Key },
  { title: "Webhooks", url: "/dashboard/integrations/webhooks", icon: Webhook },
];

// 📊 Analytics & Insights
const analyticsItems = [
  { title: "Omnichannel Analytics", url: "/dashboard/analytics", icon: BarChart3 },
];

// 👥 Team & Settings
const teamItems = [
  { title: "Team Members", url: "/dashboard/team/members", icon: Users },
  { title: "Team Roles", url: "/dashboard/team/roles", icon: Shield },
  { title: "Collaboration", url: "/dashboard/team/collaboration", icon: Users },
];

const accountSettingsItems = [
  { title: "Profile Settings", url: "/dashboard/settings/profile", icon: User },
  { title: "Account Settings", url: "/dashboard/settings/account", icon: Settings },
  { title: "Phone Settings", url: "/dashboard/settings/phone", icon: Phone },
  { title: "Security Settings", url: "/dashboard/settings/security", icon: Shield },
  { title: "Export Data", url: "/dashboard/settings/export", icon: Download },
];

// 👑 Admin Management
const adminItems = [
  { title: "User Management", url: "/dashboard/admin/users", icon: Users },
  { title: "Audit Logs", url: "/dashboard/admin/audit-logs", icon: FileText },
  { title: "Role Management", url: "/dashboard/admin/roles", icon: Shield },
  { title: "Session Management", url: "/dashboard/admin/sessions", icon: Monitor },
  { title: "Security Dashboard", url: "/dashboard/admin/security", icon: Shield },
  { title: "GDPR Tools", url: "/dashboard/admin/gdpr", icon: Shield },
];

// 💳 Billing & Admin
const billingItems = [
  { title: "Subscription Plans", url: "/dashboard/subscription-tiers", icon: Crown },
  { title: "Billing Overview", url: "/dashboard/billing", icon: CreditCard },
  { title: "Super Admin Dashboard", url: "/dashboard/superadmin", icon: Shield },
];

// 📚 Help & Resources
const helpItems = [
  { title: "Documentation", url: "/dashboard/docs", icon: FileText },
  { title: "Support", url: "/dashboard/support", icon: Users },
  { title: "Pricing", url: "/dashboard/pricing", icon: CreditCard },
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
      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold rounded-xl border border-blue-200 dark:border-blue-700 shadow-sm" 
      : "hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-sm rounded-xl transition-all duration-200";

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-72"} border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm`} collapsible="icon">
      <SidebarTrigger className="m-3 self-end hover:bg-slate-100 rounded-lg transition-colors" />
      
      <SidebarContent className="px-3 py-2">
        {/* Modern Logo/Brand */}
        <div className="mb-8 p-4">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">ChatFlow AI</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Omnichannel Platform</span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Zap className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Modern Navigation */}
        {/* 🏠 Dashboard */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
            🏠 Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {dashboardItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 💬 Conversations */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
            💬 Conversations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {conversationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 🤖 AI & Automation */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
            🤖 AI & Automation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {aiItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 🌐 Platform Management */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
            🌐 Platform Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {platformItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 🌐 Channels & Integrations */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
            🌐 Channels & Integrations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {channelItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {integrationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 📊 Analytics & Insights */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
            📊 Analytics & Insights
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {analyticsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 👥 Team & Settings */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
            👥 Team & Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {teamItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {accountSettingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 👑 Admin Management */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
            👑 Admin Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 💳 Billing & Admin */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
            💳 Billing & Admin
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {billingItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 📚 Help & Resources */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
            📚 Help & Resources
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {helpItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Modern Footer */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Theme</span>
              <ThemeToggle />
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Sign Out</span>
            </Button>
          </div>
        )}
        
        {/* Collapsed footer */}
        {collapsed && (
          <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="ghost" 
              size="icon"
              className="w-full text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
