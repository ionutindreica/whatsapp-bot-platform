import React, { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  FileText, 
  Database,
  Mail,
  MessageSquare,
  Bot,
  Users,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Archive,
  Trash2,
  RefreshCw
} from "lucide-react";

const SettingsExport = () => {
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState("json");
  const [dateRange, setDateRange] = useState("all");
  
  const dataTypes = [
    {
      id: "profile",
      name: "Profile Data",
      description: "Personal information and account settings",
      size: "2.3 KB",
      icon: Users,
      color: "text-blue-600"
    },
    {
      id: "conversations",
      name: "Conversations",
      description: "All chat conversations and messages",
      size: "15.7 MB",
      icon: MessageSquare,
      color: "text-green-600"
    },
    {
      id: "bots",
      name: "Bot Configurations",
      description: "AI bot settings and training data",
      size: "8.2 MB",
      icon: Bot,
      color: "text-whatsapp"
    },
    {
      id: "analytics",
      name: "Analytics Data",
      description: "Usage statistics and performance metrics",
      size: "3.1 MB",
      icon: Database,
      color: "text-purple-600"
    },
    {
      id: "integrations",
      name: "Integrations",
      description: "API keys, webhooks, and third-party connections",
      size: "1.5 KB",
      icon: Settings,
      color: "text-orange-600"
    },
    {
      id: "team",
      name: "Team Data",
      description: "Team members, roles, and permissions",
      size: "0.8 KB",
      icon: Users,
      color: "text-red-600"
    }
  ];

  const exportHistory = [
    {
      id: "1",
      name: "Complete Data Export",
      date: "2024-01-15",
      size: "28.9 MB",
      format: "JSON",
      status: "completed",
      downloadUrl: "#"
    },
    {
      id: "2",
      name: "Conversations Only",
      date: "2024-01-10",
      size: "15.7 MB",
      format: "CSV",
      status: "completed",
      downloadUrl: "#"
    },
    {
      id: "3",
      name: "Analytics Export",
      date: "2024-01-05",
      size: "3.1 MB",
      format: "Excel",
      status: "failed",
      downloadUrl: null
    },
    {
      id: "4",
      name: "Profile Data",
      date: "2024-01-01",
      size: "2.3 KB",
      format: "JSON",
      status: "completed",
      downloadUrl: "#"
    }
  ];

  const handleDataSelection = (dataId: string) => {
    setSelectedData(prev => 
      prev.includes(dataId) 
        ? prev.filter(id => id !== dataId)
        : [...prev, dataId]
    );
  };

  const handleExport = () => {
    console.log("Exporting data:", {
      selectedData,
      format: exportFormat,
      dateRange
    });
    // Here you would typically trigger the export process
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "processing":
        return <RefreshCw className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const totalSize = dataTypes
    .filter(data => selectedData.includes(data.id))
    .reduce((sum, data) => sum + parseFloat(data.size.replace(' MB', '').replace(' KB', '')), 0);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back to Dashboard */}
        <BackToDashboard title="Back to Dashboard" />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Download className="w-8 h-8 text-whatsapp" />
              Export Data
            </h1>
            <p className="text-muted-foreground">Export your data in various formats for backup or migration</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Archive className="mr-2 w-4 h-4" />
              Auto Backup
            </Button>
            <Button className="bg-whatsapp hover:bg-whatsapp/90">
              <Download className="mr-2 w-4 h-4" />
              Export All
            </Button>
          </div>
        </div>

        <Tabs defaultValue="export" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="export">Export Data</TabsTrigger>
            <TabsTrigger value="history">Export History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Select Data to Export
                  </CardTitle>
                  <CardDescription>Choose which data you want to include in your export</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {dataTypes.map((data) => (
                      <div
                        key={data.id}
                        className={`p-3 border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                          selectedData.includes(data.id) ? 'ring-2 ring-whatsapp bg-whatsapp/5' : ''
                        }`}
                        onClick={() => handleDataSelection(data.id)}
                      >
                        <div className="flex items-center gap-3">
                          <data.icon className={`w-5 h-5 ${data.color}`} />
                          <div className="flex-1">
                            <h4 className="font-medium">{data.name}</h4>
                            <p className="text-sm text-muted-foreground">{data.description}</p>
                            <p className="text-xs text-muted-foreground">Size: {data.size}</p>
                          </div>
                          <div className="w-4 h-4 border rounded flex items-center justify-center">
                            {selectedData.includes(data.id) && (
                              <CheckCircle className="w-3 h-3 text-whatsapp" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Export Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Export Format</label>
                    <select
                      value={exportFormat}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="w-full p-2 border rounded-md mt-1"
                    >
                      <option value="json">JSON</option>
                      <option value="csv">CSV</option>
                      <option value="excel">Excel</option>
                      <option value="pdf">PDF</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Date Range</label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full p-2 border rounded-md mt-1"
                    >
                      <option value="all">All Time</option>
                      <option value="last_month">Last Month</option>
                      <option value="last_3_months">Last 3 Months</option>
                      <option value="last_year">Last Year</option>
                    </select>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Size</span>
                      <span className="text-sm text-muted-foreground">
                        {totalSize.toFixed(1)} MB
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-medium">Selected Items</span>
                      <span className="text-sm text-muted-foreground">
                        {selectedData.length} of {dataTypes.length}
                      </span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleExport}
                    className="w-full bg-whatsapp hover:bg-whatsapp/90"
                    disabled={selectedData.length === 0}
                  >
                    <Download className="mr-2 w-4 h-4" />
                    Export Selected Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Export History
                </CardTitle>
                <CardDescription>View your previous data exports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exportHistory.map((export_item) => (
                    <div key={export_item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <FileText className="w-5 h-5 text-whatsapp" />
                        <div>
                          <h4 className="font-medium">{export_item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {export_item.date} • {export_item.size} • {export_item.format}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(export_item.status)}
                        <Badge className={getStatusColor(export_item.status)}>
                          {export_item.status}
                        </Badge>
                        {export_item.downloadUrl && (
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
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
                  <CardTitle className="flex items-center gap-2">
                    <Archive className="w-5 h-5" />
                    Auto Backup Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto Backup</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Backup Frequency</span>
                      <span className="text-sm text-muted-foreground">Weekly</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Retention Period</span>
                      <span className="text-sm text-muted-foreground">6 months</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cloud Storage</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Export Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Include deleted data",
                      "Compress large exports",
                      "Email export notifications",
                      "Auto-delete old exports",
                      "Include metadata"
                    ].map((preference, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-whatsapp rounded-full mt-2" />
                        <span className="text-sm">{preference}</span>
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

export default SettingsExport;
