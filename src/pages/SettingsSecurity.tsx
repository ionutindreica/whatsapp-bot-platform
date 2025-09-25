import React, { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Key, 
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Trash2,
  Settings
} from "lucide-react";

const SettingsSecurity = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30 minutes");

  const securityEvents = [
    {
      id: "1",
      type: "login",
      description: "Successful login from Chrome on Windows",
      location: "San Francisco, CA",
      ip: "192.168.1.100",
      timestamp: "2 hours ago",
      status: "success"
    },
    {
      id: "2",
      type: "password_change",
      description: "Password changed successfully",
      location: "San Francisco, CA",
      ip: "192.168.1.100",
      timestamp: "1 week ago",
      status: "success"
    },
    {
      id: "3",
      type: "failed_login",
      description: "Failed login attempt",
      location: "Unknown",
      ip: "203.0.113.1",
      timestamp: "3 days ago",
      status: "failed"
    },
    {
      id: "4",
      type: "2fa_enabled",
      description: "Two-factor authentication enabled",
      location: "San Francisco, CA",
      ip: "192.168.1.100",
      timestamp: "2 weeks ago",
      status: "success"
    }
  ];

  const activeSessions = [
    {
      id: "1",
      device: "Chrome on Windows",
      location: "San Francisco, CA",
      ip: "192.168.1.100",
      lastActive: "2 hours ago",
      current: true
    },
    {
      id: "2",
      device: "Safari on iPhone",
      location: "San Francisco, CA",
      ip: "192.168.1.101",
      lastActive: "1 day ago",
      current: false
    },
    {
      id: "3",
      device: "Firefox on Mac",
      location: "New York, NY",
      ip: "203.0.113.1",
      lastActive: "3 days ago",
      current: false
    }
  ];

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordUpdate = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    console.log("Password updated");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "login":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "password_change":
        return <Key className="w-4 h-4 text-blue-600" />;
      case "failed_login":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "2fa_enabled":
        return <Shield className="w-4 h-4 text-purple-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-muted text-muted-foreground";
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
              <Shield className="w-8 h-8 text-whatsapp" />
              Security Settings
            </h1>
            <p className="text-muted-foreground">Manage your account security and privacy settings</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 w-4 h-4" />
              Export Data
            </Button>
            <Button className="bg-whatsapp hover:bg-whatsapp/90">
              <Shield className="mr-2 w-4 h-4" />
              Security Audit
            </Button>
          </div>
        </div>

        <Tabs defaultValue="password" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="2fa">Two-Factor</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Password Tab */}
          <TabsContent value="password" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Change Password
                </CardTitle>
                <CardDescription>Update your account password for better security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Current Password</label>
                  <div className="relative mt-1">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">New Password</label>
                  <div className="relative mt-1">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Confirm New Password</label>
                  <div className="relative mt-1">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <Button onClick={handlePasswordUpdate} className="bg-whatsapp hover:bg-whatsapp/90">
                  <Key className="mr-2 w-4 h-4" />
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Two-Factor Tab */}
          <TabsContent value="2fa" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Two-Factor Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMS Authentication</h4>
                      <p className="text-sm text-muted-foreground">Receive codes via SMS</p>
                    </div>
                    <Badge className={twoFactorEnabled ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}>
                      {twoFactorEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Authenticator App</h4>
                      <p className="text-sm text-muted-foreground">Use Google Authenticator or similar</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Backup Codes</h4>
                      <p className="text-sm text-muted-foreground">Emergency access codes</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">8 remaining</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 w-4 h-4" />
                    Configure 2FA
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Login Alerts</span>
                      <Badge className={loginAlerts ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}>
                        {loginAlerts ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Session Timeout</span>
                      <span className="text-sm text-muted-foreground">{sessionTimeout}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Password Last Changed</span>
                      <span className="text-sm text-muted-foreground">1 week ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Security Score</span>
                      <Badge className="bg-green-100 text-green-800">Strong</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Active Sessions
                </CardTitle>
                <CardDescription>Manage your active login sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Smartphone className="w-5 h-5 text-whatsapp" />
                        <div>
                          <h4 className="font-medium">{session.device}</h4>
                          <p className="text-sm text-muted-foreground">{session.location} • {session.ip}</p>
                          <p className="text-xs text-muted-foreground">Last active: {session.lastActive}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.current && (
                          <Badge className="bg-green-100 text-green-800">Current</Badge>
                        )}
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Security Activity
                </CardTitle>
                <CardDescription>Recent security events and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      {getEventIcon(event.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.location} • {event.ip} • {event.timestamp}
                        </p>
                      </div>
                      <Badge className={getEventStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsSecurity;
