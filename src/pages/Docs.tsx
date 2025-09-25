import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Book, Code, MessageCircle, Phone, Settings, Zap } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Docs = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      title: "Getting Started",
      icon: Zap,
      description: "Quick setup guides and tutorials",
      articles: [
        { title: "How to connect your WhatsApp number", time: "5 min read" },
        { title: "Creating your first AI bot", time: "8 min read" },
        { title: "Basic bot configuration", time: "6 min read" },
        { title: "Understanding bot personalities", time: "4 min read" }
      ]
    },
    {
      title: "Bot Configuration",
      icon: Settings,
      description: "Advanced bot setup and customization",
      articles: [
        { title: "Advanced personality training", time: "12 min read" },
        { title: "Setting up workflows", time: "10 min read" },
        { title: "Multi-language support", time: "7 min read" },
        { title: "Custom response templates", time: "9 min read" }
      ]
    },
    {
      title: "API Reference",
      icon: Code,
      description: "Technical documentation for developers",
      articles: [
        { title: "REST API Overview", time: "6 min read" },
        { title: "Webhook integration", time: "15 min read" },
        { title: "Authentication methods", time: "8 min read" },
        { title: "Rate limits and quotas", time: "5 min read" }
      ]
    },
    {
      title: "WhatsApp Integration",
      icon: Phone,
      description: "WhatsApp Business API setup and management",
      articles: [
        { title: "WhatsApp Business verification", time: "10 min read" },
        { title: "Managing multiple numbers", time: "7 min read" },
        { title: "Message templates", time: "9 min read" },
        { title: "Media handling", time: "11 min read" }
      ]
    },
    {
      title: "Best Practices",
      icon: Book,
      description: "Tips and guidelines for optimal performance",
      articles: [
        { title: "Writing effective bot responses", time: "8 min read" },
        { title: "Handling customer escalations", time: "6 min read" },
        { title: "Performance optimization", time: "10 min read" },
        { title: "Compliance and privacy", time: "12 min read" }
      ]
    },
    {
      title: "Troubleshooting",
      icon: MessageCircle,
      description: "Common issues and solutions",
      articles: [
        { title: "Bot not responding to messages", time: "5 min read" },
        { title: "WhatsApp connection issues", time: "7 min read" },
        { title: "Message delivery problems", time: "6 min read" },
        { title: "Performance troubleshooting", time: "9 min read" }
      ]
    }
  ];

  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.articles.some(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-24 bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Documentation &{" "}
              <span className="bg-gradient-whatsapp bg-clip-text text-transparent">
                Guides
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Everything you need to build, configure, and optimize your WhatsApp AI agents
            </p>
            
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "Quick Start", badge: "Popular" },
                { title: "API Reference", badge: "Technical" },
                { title: "Examples", badge: "Code" },
                { title: "Support", badge: "Help" }
              ].map((link) => (
                <Card key={link.title} className="cursor-pointer hover:border-whatsapp/20 transition-colors">
                  <CardContent className="p-4 text-center">
                    <div className="font-medium">{link.title}</div>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {link.badge}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Documentation Categories */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCategories.map((category) => (
                <Card key={category.title} className="hover:border-whatsapp/20 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-whatsapp rounded-lg flex items-center justify-center">
                        <category.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                      </div>
                    </div>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.articles.map((article) => (
                        <div 
                          key={article.title}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <span className="text-sm font-medium hover:text-whatsapp transition-colors">
                            {article.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {article.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredCategories.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try searching with different keywords or browse our categories above
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Need Help */}
        <section className="py-24 bg-muted/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Card className="p-6 text-center hover:border-whatsapp/20 transition-colors cursor-pointer">
                <MessageCircle className="w-8 h-8 text-whatsapp mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground">Get instant help from our team</p>
              </Card>
              
              <Card className="p-6 text-center hover:border-whatsapp/20 transition-colors cursor-pointer">
                <Book className="w-8 h-8 text-whatsapp mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Knowledge Base</h3>
                <p className="text-sm text-muted-foreground">Browse our detailed guides</p>
              </Card>
              
              <Card className="p-6 text-center hover:border-whatsapp/20 transition-colors cursor-pointer">
                <Phone className="w-8 h-8 text-whatsapp mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Schedule Call</h3>
                <p className="text-sm text-muted-foreground">Book a 1-on-1 consultation</p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Docs;
