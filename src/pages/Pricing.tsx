import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Rocket } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Pricing = () => {
  const handlePlanSelection = (planName: string) => {
    console.log(`Selected plan: ${planName}`);
    if (planName === "Enterprise") {
      console.log("Opening contact sales form...");
      // Here you would typically open contact sales modal or navigate to contact page
    } else {
      console.log(`Starting ${planName} trial...`);
      // Here you would typically navigate to signup or checkout
    }
  };

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for testing and small projects",
      icon: Zap,
      features: [
        "1 AI Bot",
        "500 messages/month",
        "Basic AI responses",
        "Community support",
        "Basic dashboard",
        "1 channel integration",
        "Basic analytics",
        "7-day message history"
      ],
      limitations: [
        "Limited to 500 messages/month",
        "Basic support only",
        "No advanced features"
      ],
      color: "border-gray-200",
      buttonVariant: "outline" as const,
      popular: false,
      stripePriceId: null
    },
    {
      id: "pro",
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "Ideal for growing businesses",
      icon: Crown,
      features: [
        "5 AI Bots",
        "10,000 messages/month",
        "Advanced AI with personality",
        "Priority support",
        "Advanced analytics & reporting",
        "All channel integrations (WhatsApp, Instagram, Messenger, Website)",
        "Broadcast messages",
        "Trigger system & automation",
        "Live agent transfer",
        "Polls & surveys",
        "90-day message history",
        "Custom branding"
      ],
      limitations: [
        "Limited to 10,000 messages/month",
        "Standard support response time"
      ],
      color: "border-blue-500",
      buttonVariant: "default" as const,
      popular: true,
      stripePriceId: "price_pro_monthly"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For large organizations and agencies",
      icon: Rocket,
      features: [
        "Unlimited AI Bots",
        "100,000 messages/month",
        "Custom AI training",
        "Dedicated account manager",
        "White-label solution",
        "Full API access",
        "Advanced security & compliance",
        "SLA guarantee (99.9%)",
        "Custom integrations",
        "Unlimited message history",
        "Advanced team collaboration",
        "Custom onboarding",
        "Priority feature requests"
      ],
      limitations: [
        "Contact sales for custom limits",
        "Minimum 12-month commitment"
      ],
      color: "border-purple-500",
      buttonVariant: "outline" as const,
      popular: false,
      stripePriceId: "price_enterprise_monthly"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-24 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-6">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Perfect Plan
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Start with our free trial, then choose a plan that grows with your business. 
              All plans include our core omnichannel AI features and 24/7 support.
            </p>
            
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-12">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
              30-day free trial • No credit card required
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <Card 
                  key={plan.name} 
                  className={`relative ${plan.color} ${plan.popular ? 'ring-2 ring-blue-500 shadow-elegant' : ''}`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500">
                      Most Popular
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <plan.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <Button 
                      className="w-full" 
                      variant={plan.buttonVariant}
                      size="lg"
                      onClick={() => handlePlanSelection(plan.name)}
                    >
                      {plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                    </Button>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold">Everything included:</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-3">
                            <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Everything you need to know about our pricing and plans
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  question: "Can I change plans anytime?",
                  answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately."
                },
                {
                  question: "What happens if I exceed my message limit?",
                  answer: "We'll notify you when you're near your limit. You can upgrade or purchase additional messages."
                },
                {
                  question: "Is there a setup fee?",
                  answer: "No setup fees! All plans include free onboarding and bot configuration assistance."
                },
                {
                  question: "Do you offer custom enterprise solutions?",
                  answer: "Yes! Our Enterprise plan includes custom features, dedicated support, and white-label options."
                }
              ].map((faq) => (
                <Card key={faq.question}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
