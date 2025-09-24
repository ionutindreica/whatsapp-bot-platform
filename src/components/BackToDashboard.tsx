import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

interface BackToDashboardProps {
  title?: string;
  showHome?: boolean;
}

const BackToDashboard = ({ title = "Back to Dashboard", showHome = true }: BackToDashboardProps) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Link to="/dashboard">
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          {title}
        </Button>
      </Link>
      {showHome && (
        <Link to="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Home
          </Button>
        </Link>
      )}
    </div>
  );
};

export default BackToDashboard;
