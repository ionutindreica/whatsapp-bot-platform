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
  ChevronDown,
  ChevronRight,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
      { title: "All Conversations", url: "/conversations", icon: MessageSquare },
      { title: "Live Transfer", url: "/live-agent", icon: MessageSquare },
      { title: "Broadcast Messages", url: "/broadcast", icon: MessageSquare },
      { title: "Polls & Surveys", url: "/polls", icon: MessageSquare }
    ]
  },
  {
    id: "ai",
    title: "AI & Automation", 
    icon: Bot,
    items: [
      { title: "My AI Agents", url: "/bots", icon: Bot },
      { title: "AI Training", url: "/ai/training", icon: Bot },
      { title: "AI Templates", url: "/ai/templates", icon: Bot },
      { title: "AI Knowledge Base", url: "/ai/knowledge", icon: Bot }
    ]
  }
];

export default function TestSidebar() {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout } = useAuth();

  const toggleSection = (sectionId: string) => {
    console.log('Toggling section:', sectionId);
    setExpandedSections(prev => {
      const newExpanded = prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId];
      console.log('New expanded sections:', newExpanded);
      return newExpanded;
    });
  };

  const isSectionExpanded = (sectionId: string) => {
    const expanded = expandedSections.includes(sectionId);
    console.log(`Section ${sectionId} expanded:`, expanded);
    return expanded;
  };

  return (
    <div className="w-80 h-full bg-card border-r border-border shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold">ChatFlow AI</span>
            <span className="text-xs text-muted-foreground">Test Sidebar</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuSections.map((section) => (
          <Card key={section.id} className="border shadow-sm">
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
