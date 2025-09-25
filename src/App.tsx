import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "@/components/ui/sonner";
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
                  
                  {/* Protected routes with Layout */}
                  <Route path="/dashboard" element={<Layout />}>
                    <Route index element={<ModernDashboard />} />
                    <Route path="bots" element={<Bots />} />
                    <Route path="conversations" element={<Conversations />} />
                    <Route path="broadcast" element={<BroadcastMessages />} />
                    <Route path="polls" element={<PollsSurveys />} />
                    <Route path="live-agent" element={<LiveAgent />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="integrations" element={<IntegrationsIndex />} />
                    <Route path="integrations/website" element={<WebsiteIntegration />} />
                    <Route path="integrations/instagram" element={<InstagramChannel />} />
                    <Route path="integrations/widget" element={<WidgetBuilder />} />
                    <Route path="integrations/api" element={<ApiKeys />} />
                    <Route path="integrations/webhooks" element={<Webhooks />} />
                    <Route path="triggers" element={<TriggerSystem />} />
                    <Route path="channels" element={<Channels />} />
                    <Route path="channels/whatsapp" element={<WhatsAppChannel />} />
                    <Route path="channels/instagram" element={<InstagramChannel />} />
                    <Route path="channels/website" element={<WebsiteChannel />} />
                    <Route path="channels/mobile" element={<MobileChannel />} />
                    <Route path="channels/email" element={<EmailChannel />} />
                    <Route path="ai/training" element={<AITraining />} />
                    <Route path="ai/templates" element={<AITemplates />} />
                    <Route path="ai/customization" element={<AICustomization />} />
                    <Route path="ai/knowledge" element={<AIKnowledge />} />
                    <Route path="flows" element={<BotBuilder />} />
                    <Route path="team/members" element={<TeamManagement />} />
                    <Route path="team/roles" element={<TeamRoles />} />
                    <Route path="team/collaboration" element={<TeamCollaboration />} />
                    <Route path="settings/phone" element={<SettingsPhone />} />
                    <Route path="settings/account" element={<SettingsAccount />} />
                    <Route path="settings/profile" element={<SettingsProfile />} />
                    <Route path="settings/security" element={<SettingsSecurity />} />
                    <Route path="settings/export" element={<SettingsExport />} />
                    <Route path="billing" element={<Billing />} />
                    <Route path="subscription-tiers" element={<SubscriptionTiers />} />
                    <Route path="superadmin" element={<SuperAdminDashboard />} />
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