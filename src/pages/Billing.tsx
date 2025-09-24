import React, { useState, useEffect } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Download, 
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Receipt,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";

const Billing = () => {
  const [currentPlan, setCurrentPlan] = useState({
    id: "pro",
    name: "Pro",
    price: "$29",
    status: "active",
    nextBilling: "2024-02-15",
    usage: {
      messages: 7500,
      limit: 10000,
      bots: 3,
      botsLimit: 5
    }
  });

  const [invoices, setInvoices] = useState([
    {
      id: "INV-001",
      date: "2024-01-15",
      amount: 29.00,
      status: "paid",
      downloadUrl: "#"
    },
    {
      id: "INV-002", 
      date: "2023-12-15",
      amount: 29.00,
      status: "paid",
      downloadUrl: "#"
    },
    {
      id: "INV-003",
      date: "2023-11-15", 
      amount: 29.00,
      status: "paid",
      downloadUrl: "#"
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "pm_1",
      type: "card",
      last4: "4242",
      brand: "visa",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    }
  ]);

  const handleUpgrade = (planId: string) => {
    console.log(`Upgrading to plan: ${planId}`);
    // Implement upgrade logic
  };

  const handleDowngrade = (planId: string) => {
    console.log(`Downgrading to plan: ${planId}`);
    // Implement downgrade logic
  };

  const handleCancelSubscription = () => {
    console.log("Cancelling subscription");
    // Implement cancellation logic
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log(`Downloading invoice: ${invoiceId}`);
    // Implement download logic
  };

  const handleUpdatePaymentMethod = () => {
    console.log("Updating payment method");
    // Implement payment method update
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <BackToDashboard />
          <div className="flex items-center justify-between mt-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-blue-600" />
                Billing & Invoicing
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your subscription, payment methods, and view invoices
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current Plan */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Current Plan
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {currentPlan.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Your current subscription details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                      <p className="text-3xl font-bold text-green-600">{currentPlan.price}/month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Next billing date</p>
                      <p className="font-medium">{currentPlan.nextBilling}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <Button 
                      onClick={() => handleUpgrade("enterprise")}
                      className="w-full"
                    >
                      <TrendingUp className="mr-2 w-4 h-4" />
                      Upgrade Plan
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleDowngrade("free")}
                      className="w-full"
                    >
                      <Zap className="mr-2 w-4 h-4" />
                      Downgrade
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <Button 
                      variant="destructive" 
                      onClick={handleCancelSubscription}
                      className="w-full"
                    >
                      Cancel Subscription
                    </Button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Cancellation takes effect at the end of your current billing period
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Spent</p>
                        <p className="text-2xl font-bold text-gray-900">$87.00</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Member Since</p>
                        <p className="text-2xl font-bold text-gray-900">Nov 2023</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Receipt className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Invoices</p>
                        <p className="text-2xl font-bold text-gray-900">3</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice History</CardTitle>
                <CardDescription>
                  Download and view your past invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Receipt className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Invoice {invoice.id}</h4>
                          <p className="text-sm text-gray-600">{invoice.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">${invoice.amount.toFixed(2)}</p>
                          <Badge 
                            variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                            className={invoice.status === 'paid' ? 'bg-green-100 text-green-700' : ''}
                          >
                            {invoice.status === 'paid' ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Paid
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </>
                            )}
                          </Badge>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Manage your payment methods and billing information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {method.brand.toUpperCase()} •••• {method.last4}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Expires {method.expiryMonth}/{method.expiryYear}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.isDefault && (
                        <Badge variant="default" className="bg-blue-100 text-blue-700">
                          Default
                        </Badge>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={handleUpdatePaymentMethod}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Update
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t">
                  <Button className="w-full">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Add New Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Message Usage</CardTitle>
                  <CardDescription>
                    Your current message consumption this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Messages Used</span>
                      <span className="text-sm text-gray-600">
                        {currentPlan.usage.messages.toLocaleString()} / {currentPlan.usage.limit.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          currentPlan.usage.messages / currentPlan.usage.limit > 0.8 
                            ? 'bg-red-500' 
                            : currentPlan.usage.messages / currentPlan.usage.limit > 0.6
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ 
                          width: `${Math.min((currentPlan.usage.messages / currentPlan.usage.limit) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {currentPlan.usage.messages / currentPlan.usage.limit > 0.8 ? (
                        <>
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-red-600">Approaching limit</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-600">Within limits</span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bot Usage</CardTitle>
                  <CardDescription>
                    Your current bot count and limits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Active Bots</span>
                      <span className="text-sm text-gray-600">
                        {currentPlan.usage.bots} / {currentPlan.usage.botsLimit === 999 ? 'Unlimited' : currentPlan.usage.botsLimit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-green-500"
                        style={{ 
                          width: `${(currentPlan.usage.bots / currentPlan.usage.botsLimit) * 100}%` 
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-600">Within limits</span>
                    </div>
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

export default Billing;