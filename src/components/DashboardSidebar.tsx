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
      ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 font-semibold rounded-xl border border-blue-200/50 shadow-sm" 
      : "hover:bg-slate-50 text-slate-700 hover:text-blue-600 hover:shadow-sm rounded-xl transition-all duration-200";

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-72"} border-r border-slate-200/60 bg-white/95 backdrop-blur-sm shadow-sm`} collapsible="icon">
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
                <span className="text-xs text-slate-500 font-medium">Omnichannel Platform</span>
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
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
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
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
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
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
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

        {/* 🌐 Channels & Integrations */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
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
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
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
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
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

        {/* 💳 Billing & Admin */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
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
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">
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
          <div className="mt-auto p-4 border-t border-slate-200/60 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50">
              <span className="text-sm font-medium text-slate-600">Theme</span>
              <ThemeToggle />
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Sign Out</span>
            </Button>
          </div>
        )}
        
        {/* Collapsed footer */}
        {collapsed && (
          <div className="mt-auto p-4 border-t border-slate-200/60">
            <Button 
              variant="ghost" 
              size="icon"
              className="w-full text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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