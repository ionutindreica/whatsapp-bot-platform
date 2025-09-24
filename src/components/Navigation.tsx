import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, X, Zap } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ChatFlow AI</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/#features" className="text-foreground hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-foreground hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link to="/docs" className="text-foreground hover:text-blue-600 transition-colors">
              Docs
            </Link>
            <Link to="/support" className="text-foreground hover:text-blue-600 transition-colors">
              Support
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost">
                Dashboard
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button>
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <Link to="/#features" className="text-foreground hover:text-whatsapp transition-colors">
                Features
              </Link>
              <Link to="/pricing" className="text-foreground hover:text-whatsapp transition-colors">
                Pricing
              </Link>
              <Link to="/docs" className="text-foreground hover:text-whatsapp transition-colors">
                Docs
              </Link>
              <Link to="/support" className="text-foreground hover:text-whatsapp transition-colors">
                Support
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <Link to="/dashboard">
                  <Button variant="ghost" className="justify-start w-full">
                    Dashboard
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button className="justify-start w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;