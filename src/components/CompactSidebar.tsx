import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import SidebarDropdown from './SidebarDropdown';
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
  Database,
  Webhook,
  Key,
  Download,
  Monitor,
  Smartphone,
  Mail,
  Facebook,
  Instagram,
  TrendingUp,
  Headphones,
  Megaphone,
  Target
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export default function CompactSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout } = useAuth();

  const isActive = (path: string) => currentPath === path;

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold rounded-xl border border-blue-200 dark:border-blue-700 shadow-sm" 
      : "hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-sm rounded-xl transition-all duration-200";

  // Main navigation items
  const mainItems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
  ];

  // Conversations dropdown
  const conversationItems = [
    { title: "All Conversations", url: "/conversations", icon: MessageSquare },
    { title: "Live Transfer", url: "/live-agent", icon: Headphones },
    { title: "Broadcast Messages", url: "/broadcast", icon: Megaphone },
    { title: "Polls & Surveys", url: "/polls", icon: TrendingUp },
  ];

  // AI & Automation dropdown
  const aiItems = [
    { title: "My AI Agents", url: "/bots", icon: Bot },
    { title: "AI Training", url: "/ai/training", icon: Zap },
    { title: "AI Templates", url: "/ai/templates", icon: FileText },
    { title: "AI Knowledge Base", url: "/ai/knowledge", icon: Database },
    { title: "Flow Builder", url: "/flows", icon: Target },
    { title: "Triggers", url: "/triggers", icon: Target },
  ];

  // Channels & Integrations dropdown
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

  // Analytics dropdown
  const analyticsItems = [
    { title: "Omnichannel Analytics", url: "/analytics", icon: BarChart3 },
  ];

  // Team & Settings dropdown
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

  // Billing & Admin dropdown
  const billingItems = [
    { title: "Subscription Plans", url: "/subscription-tiers", icon: CreditCard },
    { title: "Billing Overview", url: "/billing", icon: CreditCard },
    { title: "Super Admin Dashboard", url: "/superadmin", icon: Shield },
  ];

  // Help & Resources dropdown
  const helpItems = [
    { title: "Documentation", url: "/docs", icon: FileText },
    { title: "Support", url: "/support", icon: Users },
    { title: "Pricing", url: "/pricing", icon: CreditCard },
  ];

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm`} collapsible="icon">
      <SidebarTrigger className="m-3 self-end hover:bg-slate-100 rounded-lg transition-colors" />
      
      <SidebarContent className="px-3 py-2">
        {/* Logo/Brand */}
        <div className="mb-6 p-4">
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

        {/* Main Navigation */}
        <SidebarGroup className="mb-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
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

        {/* Dropdown Navigation */}
        <div className="space-y-2">
          <SidebarDropdown
            title="💬 Conversations"
            icon={MessageSquare}
            items={conversationItems}
            isActive={isActive}
            getNavCls={getNavCls}
            collapsed={collapsed}
          />

          <SidebarDropdown
            title="🤖 AI & Automation"
            icon={Bot}
            items={aiItems}
            isActive={isActive}
            getNavCls={getNavCls}
            collapsed={collapsed}
          />

          <SidebarDropdown
            title="🌐 Channels"
            icon={Globe}
            items={channelItems}
            isActive={isActive}
            getNavCls={getNavCls}
            collapsed={collapsed}
          />

          <SidebarDropdown
            title="🔗 Integrations"
            icon={Code}
            items={integrationItems}
            isActive={isActive}
            getNavCls={getNavCls}
            collapsed={collapsed}
          />

          <SidebarDropdown
            title="📊 Analytics"
            icon={BarChart3}
            items={analyticsItems}
            isActive={isActive}
            getNavCls={getNavCls}
            collapsed={collapsed}
          />

          <SidebarDropdown
            title="👥 Team"
            icon={Users}
            items={teamItems}
            isActive={isActive}
            getNavCls={getNavCls}
            collapsed={collapsed}
          />

          <SidebarDropdown
            title="⚙️ Settings"
            icon={Settings}
            items={accountSettingsItems}
            isActive={isActive}
            getNavCls={getNavCls}
            collapsed={collapsed}
          />

          <SidebarDropdown
            title="💳 Billing"
            icon={CreditCard}
            items={billingItems}
            isActive={isActive}
            getNavCls={getNavCls}
            collapsed={collapsed}
          />

          <SidebarDropdown
            title="📚 Help"
            icon={FileText}
            items={helpItems}
            isActive={isActive}
            getNavCls={getNavCls}
            collapsed={collapsed}
          />
        </div>

        {/* Footer */}
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
