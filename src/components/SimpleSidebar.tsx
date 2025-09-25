import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Bot, 
  MessageSquare, 
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SimpleSidebar() {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isExpanded = (sectionId: string) => expandedSections.includes(sectionId);

  return (
    <div className="w-80 h-full bg-card border-r border-border shadow-sm p-4">
      <h2 className="text-xl font-bold mb-6">ChatFlow AI</h2>
      
      {/* Dashboard */}
      <div className="mb-4">
        <Button variant="ghost" className="w-full justify-start">
          <Home className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
      </div>

      {/* Conversations - DROPDOWN */}
      <div className="mb-4">
        <Button 
          variant="ghost" 
          className="w-full justify-between"
          onClick={() => toggleSection('conversations')}
        >
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Conversations
          </div>
          {isExpanded('conversations') ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        
        {isExpanded('conversations') && (
          <div className="ml-6 mt-2 space-y-1">
            <NavLink to="/conversations" className="block p-2 hover:bg-muted rounded">
              All Conversations
            </NavLink>
            <NavLink to="/live-agent" className="block p-2 hover:bg-muted rounded">
              Live Transfer
            </NavLink>
            <NavLink to="/broadcast" className="block p-2 hover:bg-muted rounded">
              Broadcast Messages
            </NavLink>
            <NavLink to="/polls" className="block p-2 hover:bg-muted rounded">
              Polls & Surveys
            </NavLink>
          </div>
        )}
      </div>

      {/* AI & Automation - DROPDOWN */}
      <div className="mb-4">
        <Button 
          variant="ghost" 
          className="w-full justify-between"
          onClick={() => toggleSection('ai')}
        >
          <div className="flex items-center">
            <Bot className="h-4 w-4 mr-2" />
            AI & Automation
          </div>
          {isExpanded('ai') ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        
        {isExpanded('ai') && (
          <div className="ml-6 mt-2 space-y-1">
            <NavLink to="/bots" className="block p-2 hover:bg-muted rounded">
              My AI Agents
            </NavLink>
            <NavLink to="/ai/training" className="block p-2 hover:bg-muted rounded">
              AI Training
            </NavLink>
            <NavLink to="/ai/templates" className="block p-2 hover:bg-muted rounded">
              AI Templates
            </NavLink>
            <NavLink to="/ai/knowledge" className="block p-2 hover:bg-muted rounded">
              AI Knowledge Base
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}
