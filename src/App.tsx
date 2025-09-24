import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import Docs from "./pages/Docs";
import Support from "./pages/Support";
import WebsiteIntegration from "./pages/WebsiteIntegration";
import WidgetBuilder from "./pages/WidgetBuilder";
import IntegrationsIndex from "./pages/IntegrationsIndex";
import SuperAdmin from "./pages/SuperAdmin";
import AITraining from "./pages/AITraining";
import TeamManagement from "./pages/TeamManagement";
import Billing from "./pages/Billing";
import ApiKeys from "./pages/ApiKeys";
import Webhooks from "./pages/Webhooks";
import Channels from "./pages/Channels";
import Bots from "./pages/Bots";
import Conversations from "./pages/Conversations";
import Analytics from "./pages/Analytics";
import WhatsAppChannel from "./pages/WhatsAppChannel";
import WebsiteChannel from "./pages/WebsiteChannel";
import MobileChannel from "./pages/MobileChannel";
import EmailChannel from "./pages/EmailChannel";
import AITemplates from "./pages/AITemplates";
import AICustomization from "./pages/AICustomization";
import AIKnowledge from "./pages/AIKnowledge";
import TeamRoles from "./pages/TeamRoles";
import TeamCollaboration from "./pages/TeamCollaboration";
import SettingsPhone from "./pages/SettingsPhone";
import SettingsAccount from "./pages/SettingsAccount";
import SettingsProfile from "./pages/SettingsProfile";
import SettingsSecurity from "./pages/SettingsSecurity";
import SettingsExport from "./pages/SettingsExport";
import BotBuilder from "./pages/BotBuilder";
import BroadcastMessages from "./pages/BroadcastMessages";
import PollsSurveys from "./pages/PollsSurveys";
import LiveAgent from "./pages/LiveAgent";
import InstagramChannel from "./pages/InstagramChannel";
import TriggerSystem from "./pages/TriggerSystem";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <SubscriptionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bots" element={<Bots />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/broadcast" element={<BroadcastMessages />} />
          <Route path="/polls" element={<PollsSurveys />} />
          <Route path="/live-agent" element={<LiveAgent />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/support" element={<Support />} />
          <Route path="/integrations" element={<IntegrationsIndex />} />
          <Route path="/integrations/website" element={<WebsiteIntegration />} />
          <Route path="/integrations/instagram" element={<InstagramChannel />} />
          <Route path="/integrations/widget" element={<WidgetBuilder />} />
          <Route path="/integrations/api" element={<ApiKeys />} />
          <Route path="/integrations/webhooks" element={<Webhooks />} />
          <Route path="/triggers" element={<TriggerSystem />} />
          <Route path="/channels" element={<Channels />} />
          <Route path="/channels/whatsapp" element={<WhatsAppChannel />} />
          <Route path="/channels/website" element={<WebsiteChannel />} />
          <Route path="/channels/mobile" element={<MobileChannel />} />
          <Route path="/channels/email" element={<EmailChannel />} />
          <Route path="/super-admin" element={<SuperAdmin />} />
          <Route path="/ai/training" element={<AITraining />} />
          <Route path="/ai/templates" element={<AITemplates />} />
          <Route path="/ai/customization" element={<AICustomization />} />
          <Route path="/ai/knowledge" element={<AIKnowledge />} />
          <Route path="/team/members" element={<TeamManagement />} />
          <Route path="/team/roles" element={<TeamRoles />} />
          <Route path="/team/collaboration" element={<TeamCollaboration />} />
          <Route path="/settings/phone" element={<SettingsPhone />} />
          <Route path="/settings/account" element={<SettingsAccount />} />
          <Route path="/settings/profile" element={<SettingsProfile />} />
          <Route path="/settings/security" element={<SettingsSecurity />} />
          <Route path="/settings/export" element={<SettingsExport />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/bot-builder" element={<BotBuilder />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </SubscriptionProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
