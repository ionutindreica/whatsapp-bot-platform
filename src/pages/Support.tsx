import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Mail, Phone, Clock, CheckCircle, AlertCircle, Bug, HelpCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const Support = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    priority: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Support ticket submitted!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "",
      priority: "",
      message: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChannelAction = (channelTitle: string) => {
    console.log(`${channelTitle} action triggered`);
    if (channelTitle === "Live Chat") {
      console.log("Starting live chat...");
      // Here you would typically open live chat widget
    } else if (channelTitle === "Email Support") {
      console.log("Opening email client...");
      // Here you would typically open email client or modal
    } else if (channelTitle === "Phone Support") {
      console.log("Initiating phone call...");
      // Here you would typically initiate phone call
    }
  };

  const handleViewStatusPage = () => {
    console.log("Opening full status page...");
    // Here you would typically navigate to full status page
  };

  const supportChannels = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: MessageCircle,
      availability: "24/7",
      responseTime: "< 1 minute",
      color: "text-green-600"
    },
    {
      title: "Email Support",
      description: "Send us a detailed message about your issue",
      icon: Mail,
      availability: "24/7",
      responseTime: "< 4 hours",
      color: "text-blue-600"
    },
    {
      title: "Phone Support",
      description: "Talk directly with our technical experts",
      icon: Phone,
      availability: "Mon-Fri 9AM-6PM EST",
      responseTime: "Immediate",
      color: "text-purple-600"
    }
  ];

  const faqCategories = [
    {
      title: "Getting Started",
      icon: HelpCircle,
      questions: [
        "How do I connect my WhatsApp number?",
        "What's the difference between plans?",
        "How do I create my first bot?",
        "Can I test before purchasing?"
      ]
    },
    {
      title: "Technical Issues",
      icon: Bug,
      questions: [
        "Bot not responding to messages",
        "WhatsApp connection problems",
        "Message delivery issues",
        "API integration errors"
      ]
    },
    {
      title: "Billing & Account",
      icon: AlertCircle,
      questions: [
        "How to upgrade my plan?",
        "Payment method issues",
        "Invoice and billing questions",
        "Account access problems"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-24 text-center bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-6">
              How Can We{" "}
              <span className="bg-gradient-whatsapp bg-clip-text text-transparent">
                Help You?
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our dedicated support team is here to help you succeed with your WhatsApp AI agents. 
              Get assistance 24/7 through multiple channels.
            </p>
          </div>
        </section>

        {/* Support Channels */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Choose Your Preferred Support Channel</h2>
              <p className="text-muted-foreground">
                We offer multiple ways to get help based on your needs and urgency
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {supportChannels.map((channel) => (
                <Card key={channel.title} className="text-center hover:border-whatsapp/20 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-whatsapp rounded-xl flex items-center justify-center">
                      <channel.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{channel.title}</CardTitle>
                    <CardDescription>{channel.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Availability:</span>
                      <Badge variant="outline">{channel.availability}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Response:</span>
                      <span className={`text-sm font-medium ${channel.color}`}>
                        {channel.responseTime}
                      </span>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => handleChannelAction(channel.title)}
                    >
                      {channel.title === "Live Chat" && "Start Chat"}
                      {channel.title === "Email Support" && "Send Email"}
                      {channel.title === "Phone Support" && "Call Now"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Support Form */}
        <section className="py-24 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Submit a Support Ticket</h2>
                <p className="text-muted-foreground">
                  Can't find an immediate solution? Send us a detailed message and we'll help you resolve it.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Contact Support
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and our team will get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Name *</label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <Input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Subject *</label>
                      <Input
                        required
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="Brief description of your issue"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">Technical Issue</SelectItem>
                            <SelectItem value="billing">Billing & Account</SelectItem>
                            <SelectItem value="setup">Setup & Configuration</SelectItem>
                            <SelectItem value="feature">Feature Request</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Priority</label>
                        <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Message *</label>
                      <Textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, and what you expected to happen..."
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Submit Support Ticket
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Quick answers to common questions. Can't find what you're looking for? Check our full documentation.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {faqCategories.map((category) => (
                <Card key={category.title} className="hover:border-whatsapp/20 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-whatsapp rounded-lg flex items-center justify-center">
                        <category.icon className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.questions.map((question) => (
                        <div 
                          key={question}
                          className="p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <span className="text-sm hover:text-whatsapp transition-colors">
                            {question}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Status & Contact Info */}
        <section className="py-24 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>WhatsApp API</span>
                    <Badge className="bg-green-100 text-green-800">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>AI Processing</span>
                    <Badge className="bg-green-100 text-green-800">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Dashboard</span>
                    <Badge className="bg-green-100 text-green-800">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Message Delivery</span>
                    <Badge className="bg-green-100 text-green-800">Operational</Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={handleViewStatusPage}
                  >
                    View Full Status Page
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium">Support Hours</h4>
                    <p className="text-sm text-muted-foreground">
                      24/7 Chat & Email Support<br />
                      Phone: Monday-Friday 9AM-6PM EST
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Emergency Contact</h4>
                    <p className="text-sm text-muted-foreground">
                      For critical issues affecting your business<br />
                      emergency@whatsbotai.com
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Sales & Partnerships</h4>
                    <p className="text-sm text-muted-foreground">
                      sales@whatsbotai.com<br />
                      partnerships@whatsbotai.com
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Support;