import { MessageCircle, Twitter, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-whatsapp rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">WhatsBot AI</span>
            </div>
            <p className="text-muted-foreground">
              The fastest way to create intelligent WhatsApp AI agents for your business.
            </p>
            <div className="flex space-x-4">
              <Twitter className="w-5 h-5 text-muted-foreground hover:text-whatsapp cursor-pointer transition-colors" />
              <Github className="w-5 h-5 text-muted-foreground hover:text-whatsapp cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-muted-foreground hover:text-whatsapp cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-whatsapp transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-whatsapp transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-whatsapp transition-colors">API</a></li>
              <li><a href="#" className="hover:text-whatsapp transition-colors">Integrations</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-whatsapp transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-whatsapp transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-whatsapp transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-whatsapp transition-colors">Status</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-whatsapp transition-colors">About</a></li>
              <li><a href="#" className="hover:text-whatsapp transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-whatsapp transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-whatsapp transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 WhatsBot AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;