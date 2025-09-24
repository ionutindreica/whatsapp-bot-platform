import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-blue-500/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-subtle opacity-50" />
      
      <div className="container relative z-10 px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
              AI-Powered Omnichannel Automation
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Create Your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Omnichannel
              </span>
              <br />AI Platform
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl">
              Build, configure, and launch intelligent chatbots across WhatsApp, Instagram, Messenger, and more. 
              No coding required - just connect your channels and let AI handle the rest.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/dashboard">
                <Button size="lg" className="group">
                  Start Building Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="group">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">10K+</div>
                <div className="text-sm text-muted-foreground">Active Bots</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">500M+</div>
                <div className="text-sm text-muted-foreground">Messages Sent</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-3xl opacity-20 animate-pulse" />
            <img 
              src={heroImage} 
              alt="Omnichannel AI Platform Dashboard"
              className="relative z-10 w-full rounded-3xl shadow-elegant border border-border/20"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;