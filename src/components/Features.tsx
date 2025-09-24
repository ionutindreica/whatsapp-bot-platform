import { Phone, Brain, Zap, MessageSquare, BarChart3, Shield, Settings, Bot, Globe } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Phone,
      title: "Multi-Channel Integration",
      description: "Connect WhatsApp, Instagram, Messenger, and Website chat in seconds. No complex setup or technical knowledge required."
    },
    {
      icon: Brain,
      title: "Smart AI Configuration",
      description: "Train your bot with custom personalities, responses, and behaviors. Make it sound exactly like your brand."
    },
    {
      icon: Zap,
      title: "Instant Deployment",
      description: "Launch your AI agent instantly. Start handling customer conversations within minutes of setup."
    },
    {
      icon: MessageSquare,
      title: "Natural Conversations",
      description: "Advanced NLP ensures your bot understands context and responds naturally to customer inquiries."
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track conversations, response times, customer satisfaction, and bot performance with detailed insights."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and security measures to protect your business and customer data."
    },
    {
      icon: Settings,
      title: "Advanced Automation",
      description: "Set up complex workflows, triggers, and automated responses for different scenarios."
    },
    {
      icon: Bot,
      title: "Multi-Bot Management",
      description: "Manage multiple AI agents from a single dashboard. Perfect for agencies and large businesses."
    },
    {
      icon: Globe,
      title: "Global Support",
      description: "Support for multiple languages and international channels. Reach customers worldwide across all platforms."
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need to Build{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Powerful AI Agents
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            From simple customer support to complex sales funnels, our platform provides all the tools 
            you need to create intelligent omnichannel experiences.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group p-6 rounded-2xl bg-card border border-border hover:border-blue-500/20 transition-all duration-300 hover-scale">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;