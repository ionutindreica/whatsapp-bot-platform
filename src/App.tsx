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
import SmartDashboard from "./pages/SmartDashboard";
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
import TrainingAnalytics from "./pages/TrainingAnalytics";
import AutomationBuilder from "./pages/AutomationBuilder";
import WorkflowConfig from "./pages/WorkflowConfig";
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
import UsersManagement from "./pages/admin/UsersManagement";
import RolesPermissions from "./pages/admin/RolesPermissions";
import WorkspacesManagement from "./pages/admin/WorkspacesManagement";
import PlansSubscriptions from "./pages/admin/PlansSubscriptions";
import BotsChannels from "./pages/admin/BotsChannels";
import SystemAnalytics from "./pages/admin/SystemAnalytics";
import APIManagement from "./pages/admin/APIManagement";
import PlatformSettings from "./pages/admin/PlatformSettings";
import AuditLogs from "./pages/admin/AuditLogs";
import RoleManagement from "./pages/admin/RoleManagement";
import SessionManagement from "./pages/admin/SessionManagement";
import SecurityDashboard from "./pages/admin/SecurityDashboard";
import GDPRTools from "./pages/admin/GDPRTools";
import AccessControl from "./pages/admin/AccessControl";
import CustomRoles from "./pages/admin/CustomRoles";
import Platforms from "./pages/Platforms";
import FlowBuilder from "./pages/FlowBuilder";
import UnifiedInbox from "./pages/UnifiedInbox";
import MessengerChannel from "./pages/MessengerChannel";
import CoreAI from "./pages/CoreAI";
import AutomationCenter from "./pages/AutomationCenter";
import CRMLight from "./pages/CRMLight";

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
                  <Route path="/pricing" element={<Pricing />} />
                  
                  {/* Protected routes with Layout */}
                  <Route path="/dashboard" element={<Layout />}>
                    <Route index element={<SmartDashboard />} />
                    
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
                    
                    {/* Platform Management - Manager+ */}
                    <Route path="platforms" element={
                      <ProtectedRoute>
                        <Platforms />
                      </ProtectedRoute>
                    } />
                    
                    {/* Flow Builder - Manager+ */}
                    <Route path="flow-builder" element={
                      <ProtectedRoute requiredPermission={{ resource: 'flows', action: 'read' }}>
                        <FlowBuilder />
                      </ProtectedRoute>
                    } />
                    
                    {/* Automation Center - Manager+ */}
                    <Route path="automation" element={
                      <ProtectedRoute>
                        <AutomationCenter />
                      </ProtectedRoute>
                    } />
                    
                    {/* CRM Light - Manager+ */}
                    <Route path="crm" element={
                      <ProtectedRoute>
                        <CRMLight />
                      </ProtectedRoute>
                    } />
                    
                    {/* Unified Inbox - Agent+ */}
                    <Route path="inbox" element={
                      <ProtectedRoute requiredPermission={{ resource: 'conversations', action: 'read' }}>
                        <UnifiedInbox />
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
                    <Route path="channels/messenger" element={
                      <ProtectedRoute requiredPermission={{ resource: 'channels', action: 'manage' }}>
                        <MessengerChannel />
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
                    <Route path="ai/core" element={
                      <ProtectedRoute requiredPermission={{ resource: 'bots', action: 'update' }}>
                        <CoreAI />
                      </ProtectedRoute>
                    } />
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
                    
                    {/* Bot Builder - Direct access */}
                    <Route path="bot-builder" element={
                      <ProtectedRoute>
                        <BotBuilder />
                      </ProtectedRoute>
                    } />
                    
                    {/* Training Analytics */}
                    <Route path="training" element={
                      <ProtectedRoute>
                        <TrainingAnalytics />
                      </ProtectedRoute>
                    } />
                    
                    {/* Automation Builder */}
                    <Route path="automation" element={
                      <ProtectedRoute>
                        <AutomationBuilder />
                      </ProtectedRoute>
                    } />
                    
                    {/* Workflow Configuration */}
                    <Route path="workflow/:workflowType" element={
                      <ProtectedRoute>
                        <WorkflowConfig />
                      </ProtectedRoute>
                    } />
                    
                    {/* Team Management - Admin+ */}
                    <Route path="team" element={<Navigate to="/dashboard/team/members" replace />} />
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
                    <Route path="settings" element={<Navigate to="/dashboard/settings/profile" replace />} />
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
                      <ProtectedRoute rbacMinRole="ROOT_OWNER">
                        <UsersManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/roles" element={
                      <ProtectedRoute rbacMinRole="ROOT_OWNER">
                        <RolesPermissions />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/workspaces" element={
                      <ProtectedRoute rbacMinRole="ROOT_OWNER">
                        <WorkspacesManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/platform-settings" element={
                      <ProtectedRoute rbacRole="ROOT_OWNER">
                        <PlatformSettings />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/settings" element={
                      <ProtectedRoute rbacRole="ROOT_OWNER">
                        <PlatformSettings />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/plans" element={
                      <ProtectedRoute rbacMinRole="ROOT_OWNER">
                        <PlansSubscriptions />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/bots" element={
                      <ProtectedRoute rbacMinRole="SUPER_ADMIN">
                        <BotsChannels />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/analytics" element={
                      <ProtectedRoute rbacMinRole="SUPER_ADMIN">
                        <SystemAnalytics />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/api" element={
                      <ProtectedRoute rbacRole="ROOT_OWNER">
                        <APIManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/audit-logs" element={
                      <ProtectedRoute rbacPermissions={['SYSTEM_VIEW_LOGS']}>
                        <AuditLogs />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/sessions" element={
                      <ProtectedRoute rbacPermissions={['USER_VIEW_DETAILS']}>
                        <SessionManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/security" element={
                      <ProtectedRoute rbacPermissions={['SYSTEM_VIEW_LOGS']}>
                        <SecurityDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/gdpr" element={
                      <ProtectedRoute rbacPermissions={['USER_DELETE']}>
                        <GDPRTools />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/access-control" element={
                      <ProtectedRoute rbacPermissions={['USER_MANAGE_ALL']}>
                        <AccessControl />
                      </ProtectedRoute>
                    } />
                    <Route path="admin/custom-roles" element={
                      <ProtectedRoute rbacFeatures={['CUSTOM_ROLES']}>
                        <CustomRoles />
                      </ProtectedRoute>
                    } />
                    
                    {/* Root Owner Only */}
                    <Route path="root" element={
                      <ProtectedRoute rbacRole="ROOT_OWNER">
                        <SuperAdminDashboard />
                      </ProtectedRoute>
                    } />
                    
                    {/* Super Admin Only */}
                    <Route path="superadmin" element={
                      <ProtectedRoute rbacMinRole="SUPER_ADMIN">
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
