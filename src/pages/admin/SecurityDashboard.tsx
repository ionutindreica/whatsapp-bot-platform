import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminPageLayout from '@/components/AdminPageLayout';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Clock, 
  User, 
  Globe,
  Lock,
  Unlock,
  Activity,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Ban,
  Check,
  Database
} from 'lucide-react';
import { useAuthorization } from '@/hooks/useAuthorization';

interface SecurityDashboardProps {}

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'failed_login' | 'suspicious_activity' | 'blocked_ip' | '2fa_enabled' | 'password_changed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ipAddress: string;
  location: string;
  userAgent: string;
  timestamp: string;
  userId?: string;
  userEmail?: string;
  metadata?: any;
}

interface BlockedIP {
  id: string;
  ipAddress: string;
  reason: string;
  blockedAt: string;
  blockedBy: string;
  expiresAt?: string;
  isActive: boolean;
}

interface SecurityStats {
  totalEvents: number;
  criticalEvents: number;
  blockedIPs: number;
  failedLogins: number;
  suspiciousActivities: number;
  activeSessions: number;
  uniqueUsers: number;
  last24Hours: {
    loginAttempts: number;
    failedLogins: number;
    blockedIPs: number;
  };
}

const SecurityDashboard: React.FC<SecurityDashboardProps> = () => {
  const { hasPermission } = useAuthorization();
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([]);
  const [threatAnalysis, setThreatAnalysis] = useState<any>(null);
  const [stats, setStats] = useState<SecurityStats>({
    totalEvents: 0,
    criticalEvents: 0,
    blockedIPs: 0,
    failedLogins: 0,
    suspiciousActivities: 0,
    activeSessions: 0,
    uniqueUsers: 0,
    last24Hours: {
      loginAttempts: 0,
      failedLogins: 0,
      blockedIPs: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      
      // Load main security data
      const securityResponse = await fetch('http://localhost:5000/api/admin/security', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (securityResponse.ok) {
        const data = await securityResponse.json();
        setSecurityEvents(data.events || []);
        setBlockedIPs(data.blockedIPs || []);
        setStats(data.stats || stats);
      }

      // Load threat analysis data
      const threatResponse = await fetch('http://localhost:5000/api/admin/security/threat-analysis', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (threatResponse.ok) {
        const threatData = await threatResponse.json();
        setThreatAnalysis(threatData);
      }
    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockIP = async (ipAddress: string, reason: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/security/block-ip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ ipAddress, reason })
      });

      if (response.ok) {
        await loadSecurityData();
      }
    } catch (error) {
      console.error('Failed to block IP:', error);
    }
  };

  const handleUnblockIP = async (ipId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/security/blocked-ips/${ipId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        await loadSecurityData();
      }
    } catch (error) {
      console.error('Failed to unblock IP:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login_attempt':
        return <User className="h-4 w-4 text-blue-600" />;
      case 'failed_login':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'suspicious_activity':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'blocked_ip':
        return <Ban className="h-4 w-4 text-red-600" />;
      case '2fa_enabled':
        return <Shield className="h-4 w-4 text-green-600" />;
      case 'password_changed':
        return <Lock className="h-4 w-4 text-blue-600" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getLocationFromIP = (ipAddress: string) => {
    // Mock location data for demo
    const mockLocations: Record<string, string> = {
      '192.168.1.1': 'Bucharest, Romania',
      '127.0.0.1': 'Localhost',
      '10.0.0.1': 'Internal Network',
      '8.8.8.8': 'Mountain View, CA',
      '1.1.1.1': 'San Francisco, CA'
    };
    
    return mockLocations[ipAddress] || 'Unknown Location';
  };

  if (!hasPermission('security', 'read')) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            You don't have permission to view security dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <AdminPageLayout 
      title="Security Dashboard"
      description="Monitor security events, blocked IPs, and system threats"
    >
      <div className="flex items-center justify-between">
        <div>
        
        <Button onClick={loadSecurityData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
        </div>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{stats.totalEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Critical Events</p>
                <p className="text-2xl font-bold">{stats.criticalEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Ban className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Blocked IPs</p>
                <p className="text-2xl font-bold">{stats.blockedIPs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Failed Logins</p>
                <p className="text-2xl font-bold">{stats.failedLogins}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 24h Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Last 24 Hours</CardTitle>
          <CardDescription>
            Security activity overview for the past 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                <span className="text-2xl font-bold">{stats.last24Hours.loginAttempts}</span>
              </div>
              <p className="text-sm text-muted-foreground">Login Attempts</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingDown className="h-6 w-6 text-red-600 mr-2" />
                <span className="text-2xl font-bold">{stats.last24Hours.failedLogins}</span>
              </div>
              <p className="text-sm text-muted-foreground">Failed Logins</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Ban className="h-6 w-6 text-orange-600 mr-2" />
                <span className="text-2xl font-bold">{stats.last24Hours.blockedIPs}</span>
              </div>
              <p className="text-sm text-muted-foreground">IPs Blocked</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Tabs */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="blocked-ips">Blocked IPs</TabsTrigger>
          <TabsTrigger value="threats">Threat Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>
                Monitor all security-related activities and incidents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getEventIcon(event.type)}
                            <div>
                              <p className="font-medium">{event.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {event.type.replace('_', ' ').toUpperCase()}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge className={getSeverityColor(event.severity)}>
                            {event.severity.toUpperCase()}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          {event.userEmail ? (
                            <div>
                              <p className="font-medium">{event.userEmail}</p>
                              <p className="text-xs text-muted-foreground">ID: {event.userId}</p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Anonymous</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{getLocationFromIP(event.ipAddress)}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(event.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {event.type === 'failed_login' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleBlockIP(event.ipAddress, 'Multiple failed login attempts')}
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="blocked-ips">
          <Card>
            <CardHeader>
              <CardTitle>Blocked IP Addresses</CardTitle>
              <CardDescription>
                Manage IP addresses that have been blocked due to suspicious activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Blocked By</TableHead>
                    <TableHead>Blocked At</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blockedIPs.map((blockedIP) => (
                    <TableRow key={blockedIP.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono">{blockedIP.ipAddress}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-sm">{blockedIP.reason}</span>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-sm">{blockedIP.blockedBy}</span>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-sm">
                          {new Date(blockedIP.blockedAt).toLocaleString()}
                        </span>
                      </TableCell>
                      
                      <TableCell>
                        {blockedIP.expiresAt ? (
                          <span className="text-sm">
                            {new Date(blockedIP.expiresAt).toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">Never</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={blockedIP.isActive ? getSeverityColor('high') : getSeverityColor('low')}>
                          {blockedIP.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex space-x-2">
                          {blockedIP.isActive ? (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleUnblockIP(blockedIP.id)}
                            >
                              <Unlock className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" disabled>
                              <Lock className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="threats">
          <div className="space-y-6">
            {/* Threat Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">High Risk Threats</p>
                      <p className="text-2xl font-bold text-red-600">{threatAnalysis?.overview?.highRiskThreats || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Active Monitoring</p>
                      <p className="text-2xl font-bold text-yellow-600">{threatAnalysis?.overview?.activeMonitoring || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Threats Blocked</p>
                      <p className="text-2xl font-bold text-green-600">{threatAnalysis?.overview?.threatsBlocked || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Threat Detection Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Threat Detection Rules
                </CardTitle>
                <CardDescription>
                  Configure automated threat detection and response rules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Ban className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Multiple Failed Login Attempts</h4>
                        <p className="text-sm text-muted-foreground">Block IP after 5 failed attempts in 10 minutes</p>
                      </div>
                    </div>
                    <Badge variant="destructive">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Suspicious User Agent</h4>
                        <p className="text-sm text-muted-foreground">Flag requests with unusual user agents</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <MapPin className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Geographic Anomaly</h4>
                        <p className="text-sm text-muted-foreground">Alert on login from new country</p>
                      </div>
                    </div>
                    <Badge variant="outline">Inactive</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Clock className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Time-based Anomaly</h4>
                        <p className="text-sm text-muted-foreground">Flag logins outside normal hours</p>
                      </div>
                    </div>
                    <Badge variant="outline">Inactive</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Threat Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                  Recent Threat Alerts
                </CardTitle>
                <CardDescription>
                  Latest security threats and suspicious activities detected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {threatAnalysis?.threatAlerts?.length > 0 ? (
                    threatAnalysis.threatAlerts.map((alert, index) => {
                      const borderColor = alert.severity === 'high' ? 'border-red-500' : 
                                         alert.severity === 'medium' ? 'border-yellow-500' : 'border-blue-500';
                      const bgColor = alert.severity === 'high' ? 'bg-red-50' : 
                                     alert.severity === 'medium' ? 'bg-yellow-50' : 'bg-blue-50';
                      const textColor = alert.severity === 'high' ? 'text-red-900' : 
                                       alert.severity === 'medium' ? 'text-yellow-900' : 'text-blue-900';
                      const iconColor = alert.severity === 'high' ? 'text-red-600' : 
                                       alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600';
                      
                      const timeAgo = new Date(alert.timestamp).toLocaleString();
                      
                      return (
                        <div key={alert.id} className={`flex items-start space-x-3 p-4 border-l-4 ${borderColor} ${bgColor} rounded-r-lg`}>
                          <AlertTriangle className={`h-5 w-5 ${iconColor} mt-0.5`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className={`font-medium ${textColor}`}>{alert.title}</h4>
                              <span className={`text-xs ${textColor.replace('900', '700')}`}>{timeAgo}</span>
                            </div>
                            <p className={`text-sm ${textColor.replace('900', '800')} mt-1`}>
                              {alert.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge 
                                variant={alert.risk === 'HIGH RISK' ? 'destructive' : 
                                        alert.risk === 'MEDIUM RISK' ? 'secondary' : 'outline'} 
                                className="text-xs"
                              >
                                {alert.risk}
                              </Badge>
                              <Badge variant="outline" className="text-xs">{alert.status}</Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p className="text-muted-foreground">No recent threat alerts detected</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Threat Intelligence */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Threat Intelligence
                </CardTitle>
                <CardDescription>
                  External threat intelligence and security insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Known Malicious IPs</h4>
                    <div className="space-y-2">
                      {threatAnalysis?.knownMaliciousIPs?.length > 0 ? (
                        threatAnalysis.knownMaliciousIPs.map((ip, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                            <span className="font-mono text-sm">{ip.ip}</span>
                            <Badge variant="destructive" className="text-xs">{ip.status}</Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No malicious IPs detected</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Security Score</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Overall Security</span>
                        <span className="font-bold text-green-600">{threatAnalysis?.securityScores?.overallSecurity || 0}/10</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Threat Detection</span>
                        <span className="font-bold text-blue-600">{threatAnalysis?.securityScores?.threatDetection || 0}/10</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Response Time</span>
                        <span className="font-bold text-yellow-600">{threatAnalysis?.securityScores?.responseTime || 0}/10</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Prevention Rate</span>
                        <span className="font-bold text-green-600">{threatAnalysis?.securityScores?.preventionRate || 0}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </AdminPageLayout>
  );
};

export default SecurityDashboard;
