import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AdminPageLayout from '@/components/AdminPageLayout';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  MapPin, 
  Clock, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  X,
  RefreshCw,
  Activity,
  Globe,
  User,
  MoreVertical,
  LogOut
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuthorization } from '@/hooks/useAuthorization';
import { Session, Device } from '@/types/auth';

interface SessionManagementProps {}

const SessionManagement: React.FC<SessionManagementProps> = () => {
  const { hasPermission } = useAuthorization();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/sessions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        await loadSessions();
      } else {
        setError('Failed to terminate session');
      }
    } catch (error) {
      setError('Failed to terminate session');
    }
  };

  const handleTerminateAllSessions = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/sessions`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        await loadSessions();
      } else {
        setError('Failed to terminate all sessions');
      }
    } catch (error) {
      setError('Failed to terminate all sessions');
    }
  };

  const getDeviceIcon = (device: Device) => {
    switch (device.type) {
      case 'desktop':
        return <Monitor className="h-4 w-4" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getDeviceColor = (device: Device) => {
    switch (device.type) {
      case 'desktop':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'mobile':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'tablet':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getLocationFromIP = (ipAddress?: string) => {
    // In production, use a GeoIP service
    if (!ipAddress) return 'Unknown';
    
    // Mock location data for demo
    const mockLocations: Record<string, string> = {
      '192.168.1.1': 'Bucharest, Romania',
      '127.0.0.1': 'Localhost',
      '10.0.0.1': 'Internal Network'
    };
    
    return mockLocations[ipAddress] || 'Unknown Location';
  };

  const formatUserAgent = (userAgent?: string) => {
    if (!userAgent) return 'Unknown Browser';
    
    // Simple user agent parsing
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    
    return userAgent.split(' ')[0] || 'Unknown Browser';
  };

  const isCurrentSession = (session: Session) => {
    const currentToken = localStorage.getItem('authToken');
    return session.token === currentToken;
  };

  if (!hasPermission('users', 'read')) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            You don't have permission to view session management.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Group sessions by user
  const sessionsByUser = sessions.reduce((acc, session) => {
    if (!acc[session.userId]) {
      acc[session.userId] = [];
    }
    acc[session.userId].push(session);
    return acc;
  }, {} as Record<string, Session[]>);

  return (
    <AdminPageLayout 
      title="Session Management"
      description="Monitor and manage active user sessions across all devices"
    >
      <div className="flex items-center justify-between">
        <div>
        
        <Button onClick={loadSessions} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{sessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                <p className="text-2xl font-bold">
                  {sessions.filter(s => s.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Unique Users</p>
                <p className="text-2xl font-bold">
                  {new Set(sessions.map(s => s.userId)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Monitor className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Devices</p>
                <p className="text-2xl font-bold">
                  {new Set(sessions.map(s => s.device?.type).filter(Boolean)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions by User */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          Object.entries(sessionsByUser).map(([userId, userSessions]) => (
            <Card key={userId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {userSessions[0].userEmail?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {userSessions[0].userEmail}
                      </CardTitle>
                      <CardDescription>
                        {userSessions.length} active session{userSessions.length !== 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                  </div>
                  
                  {hasPermission('users', 'update') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTerminateAllSessions(userId)}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Terminate All
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Browser</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userSessions.map((session) => (
                      <TableRow key={session.id} className={isCurrentSession(session) ? 'bg-blue-50 dark:bg-blue-950' : ''}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {session.device && (
                              <>
                                {getDeviceIcon(session.device)}
                                <div>
                                  <p className="font-medium">{session.device.name}</p>
                                  <Badge className={getDeviceColor(session.device)} variant="secondary">
                                    {session.device.type}
                                  </Badge>
                                </div>
                              </>
                            )}
                            {!session.device && (
                              <div className="flex items-center space-x-2">
                                <Monitor className="h-4 w-4" />
                                <span>Unknown Device</span>
                              </div>
                            )}
                            {isCurrentSession(session) && (
                              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                Current
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {getLocationFromIP(session.ipAddress)}
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {formatUserAgent(session.userAgent)}
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(session.lastActivityAt).toLocaleString()}
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <span className="text-sm">
                            {new Date(session.createdAt).toLocaleDateString()}
                          </span>
                        </TableCell>
                        
                        <TableCell>
                          <Badge className={getStatusColor(session.isActive)}>
                            {session.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Shield className="mr-2 h-4 w-4" />
                                Mark as Trusted
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {hasPermission('users', 'update') && !isCurrentSession(session) && (
                                <DropdownMenuItem 
                                  onClick={() => handleTerminateSession(session.id)}
                                  className="text-red-600"
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Terminate Session
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </AdminPageLayout>
  );
};

export default SessionManagement;
