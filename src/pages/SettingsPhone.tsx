import React, { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, 
  Plus, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageCircle,
  Settings,
  Shield,
  Key,
  Globe,
  Smartphone
} from "lucide-react";

const SettingsPhone = () => {
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  
  const phoneNumbers = [
    {
      id: "1",
      number: "+1 234 567 8900",
      provider: "WhatsApp Business",
      status: "active",
      country: "United States",
      region: "US",
      lastActivity: "2 minutes ago",
      messages: 1247,
      verified: true
    },
    {
      id: "2",
      number: "+44 20 7946 0958",
      provider: "WhatsApp Business",
      status: "active",
      country: "United Kingdom",
      region: "GB",
      lastActivity: "15 minutes ago",
      messages: 892,
      verified: true
    },
    {
      id: "3",
      number: "+49 30 12345678",
      provider: "WhatsApp Business",
      status: "pending",
      country: "Germany",
      region: "DE",
      lastActivity: "Never",
      messages: 0,
      verified: false
    }
  ];

  const countries = [
    { name: "United States", code: "US", flag: "🇺🇸" },
    { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
    { name: "Germany", code: "DE", flag: "🇩🇪" },
    { name: "France", code: "FR", flag: "🇫🇷" },
    { name: "Spain", code: "ES", flag: "🇪🇸" },
    { name: "Italy", code: "IT", flag: "🇮🇹" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "inactive":
        return <XCircle className="w-4 h-4 text-gray-600" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back to Dashboard */}
        <BackToDashboard title="Back to Dashboard" />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Phone className="w-8 h-8 text-whatsapp" />
              Phone Numbers
            </h1>
            <p className="text-muted-foreground">Manage your WhatsApp Business phone numbers</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="mr-2 w-4 h-4" />
              Settings
            </Button>
            <Button className="bg-whatsapp hover:bg-whatsapp/90">
              <Plus className="mr-2 w-4 h-4" />
              Add Phone Number
            </Button>
          </div>
        </div>

        <Tabs defaultValue="numbers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="numbers">Phone Numbers</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Phone Numbers Tab */}
          <TabsContent value="numbers" className="space-y-6">
            <div className="space-y-4">
              {phoneNumbers.map((phone) => (
                <Card key={phone.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Phone className="w-6 h-6 text-whatsapp" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-lg">{phone.number}</h4>
                            {phone.verified ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <Badge className={getStatusColor(phone.status)}>
                              {phone.status}
                            </Badge>
                            {getStatusIcon(phone.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{phone.country}</span>
                            <span>•</span>
                            <span>{phone.provider}</span>
                            <span>•</span>
                            <span>{phone.messages} messages</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Last activity: {phone.lastActivity}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Phone Number Verification</CardTitle>
                <CardDescription>Verify your phone numbers for WhatsApp Business</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {phoneNumbers.map((phone) => (
                    <div key={phone.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-whatsapp" />
                        <div>
                          <h4 className="font-medium">{phone.number}</h4>
                          <p className="text-sm text-muted-foreground">{phone.country}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {phone.verified ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <Badge className={phone.verified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {phone.verified ? "Verified" : "Not Verified"}
                        </Badge>
                        {!phone.verified && (
                          <Button size="sm" className="bg-whatsapp hover:bg-whatsapp/90">
                            Verify
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Numbers</p>
                      <p className="text-2xl font-bold">{phoneNumbers.length}</p>
                      <p className="text-sm text-green-600">+1 this month</p>
                    </div>
                    <Phone className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Numbers</p>
                      <p className="text-2xl font-bold">{phoneNumbers.filter(p => p.status === 'active').length}</p>
                      <p className="text-sm text-green-600">100% uptime</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Messages</p>
                      <p className="text-2xl font-bold">{phoneNumbers.reduce((sum, p) => sum + p.messages, 0).toLocaleString()}</p>
                      <p className="text-sm text-green-600">+15.2% this week</p>
                    </div>
                    <MessageCircle className="w-8 h-8 text-whatsapp" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Phone Number Performance</CardTitle>
                <CardDescription>Performance metrics for each phone number</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {phoneNumbers.map((phone) => (
                    <div key={phone.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-whatsapp" />
                        <span className="font-medium">{phone.number}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{phone.messages} messages</div>
                        <div className="text-xs text-muted-foreground">{phone.country}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Phone Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-verification</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Message encryption</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rate limiting</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">1000/hour</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Backup messages</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Enable two-factor authentication",
                      "Set up phone number verification",
                      "Configure message encryption",
                      "Enable audit logging",
                      "Set up backup procedures"
                    ].map((setting, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-whatsapp rounded-full mt-2" />
                        <span className="text-sm">{setting}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPhone;
