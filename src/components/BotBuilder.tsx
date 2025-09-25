import { useState } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Bot, MessageSquare, Settings, ArrowRight, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BotBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    botName: "",
    personality: "",
    welcomeMessage: ""
  });
  const { toast } = useToast();

  const steps = [
    { id: 1, title: "Connect Phone", icon: Phone },
    { id: 2, title: "Configure Bot", icon: Bot },
    { id: 3, title: "Test & Launch", icon: MessageSquare }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      toast({
        title: "Step completed!",
        description: `Moving to step ${currentStep + 1}`,
      });
    }
  };

  const handleLaunch = () => {
    toast({
      title: "Bot launched successfully!",
      description: "Your WhatsApp AI agent is now live and ready to handle conversations.",
    });
  };

  return (
    <section className="py-24 bg-gradient-to-br from-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Launch Your Bot in{" "}
            <span className="bg-gradient-whatsapp bg-clip-text text-transparent">
              3 Simple Steps
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Our intuitive bot builder makes it easy to create powerful AI agents without any technical expertise.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    currentStep >= step.id 
                      ? 'bg-whatsapp text-white border-whatsapp' 
                      : 'bg-background text-muted-foreground border-border'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <div className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-whatsapp' : 'text-muted-foreground'
                    }`}>
                      Step {step.id}
                    </div>
                    <div className="text-xs text-muted-foreground">{step.title}</div>
                  </div>
                  {step.id < steps.length && (
                    <ArrowRight className="w-4 h-4 text-muted-foreground mx-4" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-whatsapp rounded-lg flex items-center justify-center">
                  {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5 text-white" })}
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {currentStep === 1 && "Connect Your WhatsApp Number"}
                    {currentStep === 2 && "Configure Your AI Agent"}
                    {currentStep === 3 && "Test & Launch Your Bot"}
                  </CardTitle>
                  <CardDescription>
                    {currentStep === 1 && "Enter your WhatsApp Business number to get started"}
                    {currentStep === 2 && "Customize your bot's personality and responses"}
                    {currentStep === 3 && "Preview your bot and launch it live"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">WhatsApp Business Number</label>
                    <Input 
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="text-lg"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Make sure this is a verified WhatsApp Business number
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 p-4 bg-whatsapp/10 rounded-lg border border-whatsapp/20">
                    <CheckCircle className="w-5 h-5 text-whatsapp" />
                    <span className="text-sm text-whatsapp">We'll send a verification code to this number</span>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Bot Name</label>
                    <Input 
                      placeholder="Customer Support Assistant"
                      value={formData.botName}
                      onChange={(e) => handleInputChange('botName', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Personality & Tone</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                      {['Professional', 'Friendly', 'Casual', 'Formal'].map((tone) => (
                        <Badge 
                          key={tone}
                          variant={formData.personality === tone ? "default" : "outline"}
                          className="justify-center cursor-pointer"
                          onClick={() => handleInputChange('personality', tone)}
                        >
                          {tone}
                        </Badge>
                      ))}
                    </div>
                    <Textarea 
                      placeholder="Describe your bot's personality, tone, and how it should interact with customers..."
                      value={formData.personality}
                      onChange={(e) => handleInputChange('personality', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Welcome Message</label>
                    <Textarea 
                      placeholder="Hi! I'm your AI assistant. How can I help you today?"
                      value={formData.welcomeMessage}
                      onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-whatsapp" />
                      Bot Preview
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-end">
                        <div className="bg-whatsapp text-white px-4 py-2 rounded-lg max-w-xs">
                          Hello!
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-card border px-4 py-2 rounded-lg max-w-xs">
                          {formData.welcomeMessage || "Hi! I'm your AI assistant. How can I help you today?"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-card border rounded-lg">
                      <h4 className="font-medium mb-2">Bot Configuration</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div>Phone: {formData.phoneNumber || "Not set"}</div>
                        <div>Name: {formData.botName || "Not set"}</div>
                        <div>Personality: {formData.personality || "Not set"}</div>
                      </div>
                    </div>
                    <div className="p-4 bg-card border rounded-lg">
                      <h4 className="font-medium mb-2">Ready to Launch</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-whatsapp mr-2" />
                          Phone verified
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-whatsapp mr-2" />
                          Bot configured
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-whatsapp mr-2" />
                          Ready for deployment
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6 border-t border-border">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Back
                </Button>
                
                {currentStep < 3 ? (
                  <Button onClick={handleNext}>
                    Next Step
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={handleLaunch} className="bg-whatsapp hover:bg-whatsapp/90">
                    Launch Bot
                    <Settings className="ml-2 w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BotBuilder;
