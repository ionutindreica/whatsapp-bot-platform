import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-whatsapp/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-subtle opacity-50" />
      
      <div className="container relative z-10 px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 bg-whatsapp/10 text-whatsapp px-4 py-2 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-whatsapp rounded-full animate-pulse" />
              AI-Powered WhatsApp Automation
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Create Your{" "}
              <span className="bg-gradient-whatsapp bg-clip-text text-transparent">
                WhatsApp
              </span>
              <br />AI Agent
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl">
              Build, configure, and launch intelligent WhatsApp bots in minutes. 
              No coding required - just connect your phone number and let AI handle the rest.
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
                <div className="text-2xl font-bold text-whatsapp">10K+</div>
                <div className="text-sm text-muted-foreground">Active Bots</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-whatsapp">500M+</div>
                <div className="text-sm text-muted-foreground">Messages Sent</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-whatsapp">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-whatsapp rounded-3xl blur-3xl opacity-20 animate-pulse" />
            <img 
              src={heroImage} 
              alt="WhatsApp AI Agent Platform Dashboard"
              className="relative z-10 w-full rounded-3xl shadow-elegant border border-border/20"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;