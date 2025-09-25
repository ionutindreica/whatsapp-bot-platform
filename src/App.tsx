import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ModernDashboard from "./pages/ModernDashboard";
import Layout from "./components/Layout";
import Pricing from "./pages/Pricing";
import Docs from "./pages/Docs";
import Support from "./pages/Support";
import WebsiteIntegration from "./pages/WebsiteIntegration";
import WidgetBuilder from "./pages/WidgetBuilder";
import ApiKeys from "./pages/ApiKeys";
import Webhooks from "./pages/Webhooks";
import TriggerSystem from "./pages/TriggerSystem";
import Channels from "./pages/Channels";
import WhatsAppChannel from "./pages/WhatsAppChannel";
import WebsiteChannel from "./pages/WebsiteChannel";
import MobileChannel from "./pages/MobileChannel";
import EmailChannel from "./pages/EmailChannel";
import InstagramChannel from "./pages/InstagramChannel";
import AITraining from "./pages/AITraining";
import AITemplates from "./pages/AITemplates";
import AICustomization from "./pages/AICustomization";
import AIKnowledge from "./pages/AIKnowledge";
import BotBuilder from "./pages/BotBuilder";
import TeamManagement from "./pages/TeamManagement";
import TeamRoles from "./pages/TeamRoles";
import TeamCollaboration from "./pages/TeamCollaboration";
import SettingsPhone from "./pages/SettingsPhone";
import SettingsAccount from "./pages/SettingsAccount";
import SettingsProfile from "./pages/SettingsProfile";
import SettingsSecurity from "./pages/SettingsSecurity";
import SettingsExport from "./pages/SettingsExport";
import Billing from "./pages/Billing";
import SubscriptionTiers from "./pages/SubscriptionTiers";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Bots from "./pages/Bots";
import Conversations from "./pages/Conversations";
import BroadcastMessages from "./pages/BroadcastMessages";
import PollsSurveys from "./pages/PollsSurveys";
import LiveAgent from "./pages/LiveAgent";
import Analytics from "./pages/Analytics";
import IntegrationsIndex from "./pages/IntegrationsIndex";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UserManagement from "./pages/admin/UserManagement";
import AuditLogs from "./pages/admin/AuditLogs";
import RoleManagement from "./pages/admin/RoleManagement";
import SessionManagement from "./pages/admin/SessionManagement";
import SecurityDashboard from "./pages/admin/SecurityDashboard";
import GDPRTools from "./pages/admin/GDPRTools";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  
                  {/* Protected routes with Layout */}
                  <Route path="/dashboard" element={<Layout />}>
                    <Route index element={<ModernDashboard />} />
                    
                    {/* Bot Management - Manager+ */}
                    <Route path="bots" element={
                      <ProtectedRoute requiredPermission={{ resource: 'bots', action: 'read' }}>
                        <Bots />
                      </ProtectedRoute>
                    } />
                    
                    {/* Conversations - Agent+ */}
                    <Route path="conversations" element={
                      <ProtectedRoute requiredPermission={{ resource: 'conversations', action: 'read' }}>
                        <Conversations />
                      </ProtectedRoute>
                    } />
                    
                    {/* Broadcast - Manager+ */}
                    <Route path="broadcast" element={
                      <ProtectedRoute requiredPermission={{ resource: 'broadcasts', action: 'read' }}>
                        <BroadcastMessages />
                      </ProtectedRoute>
                    } />
                    
                    {/* Polls - Manager+ */}
                    <Route path="polls" element={
                      <ProtectedRoute requiredPermission={{ resource: 'polls', action: 'read' }}>
                        <PollsSurveys />
                      </ProtectedRoute>
                    } />
                    
                    {/* Live Agent - Agent+ */}
                    <Route path="live-agent" element={
                      <ProtectedRoute requiredPermission={{ resource: 'conversations', action: 'update' }}>
                        <LiveAgent />
                      </ProtectedRoute>
                    } />
                    
                    {/* Analytics - Manager+ */}
                    <Route path="analytics" element={
                      <ProtectedRoute requiredPermission={{ resource: 'analytics', action: 'read' }}>
                        <Analytics />
                      </ProtectedRoute>
                    } />
                    
                    {/* Integrations - Manager+ */}
                    <Route path="integrations" element={
                      <ProtectedRoute requiredPermission={{ resource: 'integrations', action: 'read' }}>
                        <IntegrationsIndex />
                      </ProtectedRoute>
                    } />
                    <Route path="integrations/website" element={
                      <ProtectedRoute requiredPermission={{ resource: 'integrations', action: 'manage' }}>
                        <WebsiteIntegration />
                      </ProtectedRoute>
                    } />
                    <Route path="integrations/instagram" element={
                      <ProtectedRoute requiredPermission={{ resource: 'integrations', action: 'manage' }}>
                        <InstagramChannel />
                      </ProtectedRoute>
                    } />
                    <Route path="integrations/widget" element={
                      <ProtectedRoute requiredPermission={{ resource: 'integrations', action: 'manage' }}>
                        <WidgetBuilder />
                      </ProtectedRoute>
                    } />
                    <Route path="integrations/api" element={
                      <ProtectedRoute requiredPermission={{ resource: 'api_keys', action: 'manage' }}>
                        <ApiKeys />
                      </ProtectedRoute>
                    } />
                    <Route path="integrations/webhooks" element={
                      <ProtectedRoute requiredPermission={{ resource: 'webhooks', action: 'manage' }}>
                        <Webhooks />
                      </ProtectedRoute>
                    } />
                    
                    {/* Triggers - Manager+ */}
                    <Route path="triggers" element={
                      <ProtectedRoute requiredPermission={{ resource: 'flows', action: 'read' }}>
                        <TriggerSystem />
                      </ProtectedRoute>
                    } />
                    
                    {/* Channels - Manager+ */}
                    <Route path="channels" element={
                      <ProtectedRoute requiredPermission={{ resource: 'channels', action: 'read' }}>
                        <Channels />
                      </ProtectedRoute>
                    } />
                    <Route path="channels/whatsapp" element={
                      <ProtectedRoute requiredPermission={{ resource: 'channels', action: 'manage' }}>
                        <WhatsAppChannel />
                      </ProtectedRoute>
                    } />
                    <Route path="channels/instagram" element={
                      <ProtectedRoute requiredPermission={{ resource: 'channels', action: 'manage' }}>
                        <InstagramChannel />
                      </ProtectedRoute>
                    } />
                    <Route path="channels/website" element={
                      <ProtectedRoute requiredPermission={{ resource: 'channels', action: 'manage' }}>
                        <WebsiteChannel />
                      </ProtectedRoute>
                    } />
                    <Route path="channels/mobile" element={
                      <ProtectedRoute requiredPermission={{ resource: 'channels', action: 'manage' }}>
                        <MobileChannel />
                      </ProtectedRoute>
                    } />
                    <Route path="channels/email" element={
                      <ProtectedRoute requiredPermission={{ resource: 'channels', action: 'manage' }}>
                        <EmailChannel />
                      </ProtectedRoute>
                    } />
                    
                    {/* AI Features - Manager+ */}
                    <Route path="ai/training" element={
                      <ProtectedRoute requiredPermission={{ resource: 'bots', action: 'update' }}>
                        <AITraining />
                      </ProtectedRoute>
                    } />
                    <Route path="ai/templates" element={
                      <ProtectedRoute requiredPermission={{ resource: 'templates', action: 'read' }}>
                        <AITemplates />
                      </ProtectedRoute>
                    } />
                    <Route path="ai/customization" element={
                      <ProtectedRoute requiredPermission={{ resource: 'bots', action: 'update' }}>
                        <AICustomization />
                      </ProtectedRoute>
                    } />
                    <Route path="ai/knowledge" element={
                      <ProtectedRoute requiredPermission={{ resource: 'bots', action: 'update' }}>
                        <AIKnowledge />
                      </ProtectedRoute>
                    } />
                    
                    {/* Flows - Manager+ */}
                    <Route path="flows" element={
                      <ProtectedRoute requiredPermission={{ resource: 'flows', action: 'read' }}>
                        <BotBuilder />
                      </ProtectedRoute>
                    } />
                    
                    {/* Team Management - Admin+ */}
                    <Route path="team/members" element={
                      <ProtectedRoute requiredPermission={{ resource: 'team', action: 'read' }}>
                        <TeamManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="team/roles" element={
                      <ProtectedRoute requiredPermission={{ resource: 'roles', action: 'read' }}>
                        <TeamRoles />
                      </ProtectedRoute>
                    } />
                    <Route path="team/collaboration" element={
                      <ProtectedRoute requiredPermission={{ resource: 'team', action: 'read' }}>
                        <TeamCollaboration />
                      </ProtectedRoute>
                    } />
                    
                    {/* Settings - All authenticated users */}
                    <Route path="settings/phone" element={<SettingsPhone />} />
                    <Route path="settings/account" element={<SettingsAccount />} />
                    <Route path="settings/profile" element={<SettingsProfile />} />
                    <Route path="settings/security" element={<SettingsSecurity />} />
                    <Route path="settings/export" element={
                      <ProtectedRoute requiredPermission={{ resource: 'analytics', action: 'export' }}>
                        <SettingsExport />
                      </ProtectedRoute>
                    } />
                    
                    {/* Billing - All authenticated users */}
                    <Route path="billing" element={
                      <ProtectedRoute requiredPermission={{ resource: 'billing', action: 'read' }}>
                        <Billing />
                      </ProtectedRoute>
                    } />
                    <Route path="subscription-tiers" element={
                      <ProtectedRoute requiredPermission={{ resource: 'billing', action: 'read' }}>
                        <SubscriptionTiers />
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin Management - Admin+ */}
                    <Route path="admin/users" element={
                      <ProtectedRoute requiredPermission={{ resource: 'users', action: 'read' }}>
                        <UserManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/audit-logs" element={
                      <ProtectedRoute requiredPermission={{ resource: 'audit_logs', action: 'read' }}>
                        <AuditLogs />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/roles" element={
                      <ProtectedRoute requiredPermission={{ resource: 'roles', action: 'read' }}>
                        <RoleManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/sessions" element={
                      <ProtectedRoute requiredPermission={{ resource: 'users', action: 'read' }}>
                        <SessionManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/security" element={
                      <ProtectedRoute requiredPermission={{ resource: 'security', action: 'read' }}>
                        <SecurityDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/gdpr" element={
                      <ProtectedRoute requiredPermission={{ resource: 'users', action: 'delete' }}>
                        <GDPRTools />
                      </ProtectedRoute>
                    } />
                    
                    {/* Super Admin Only */}
                    <Route path="superadmin" element={
                      <ProtectedRoute requiredRole="SUPER_ADMIN">
                        <SuperAdminDashboard />
                      </ProtectedRoute>
                    } />
                    
                    {/* Public pages */}
                    <Route path="docs" element={<Docs />} />
                    <Route path="support" element={<Support />} />
                    <Route path="pricing" element={<Pricing />} />
                  </Route>
                  
                  {/* Catch all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
