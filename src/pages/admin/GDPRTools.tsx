import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AdminPageLayout from '@/components/AdminPageLayout';
import { 
  Download, 
  Trash2, 
  Search, 
  User, 
  FileText, 
  Database, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
  Archive,
  Lock,
  Unlock,
  UserX,
  FileX
} from 'lucide-react';
import { useAuthorization } from '@/hooks/useAuthorization';

interface GDPRToolsProps {}

interface DataRequest {
  id: string;
  userId: string;
  userEmail: string;
  requestType: 'export' | 'delete' | 'portability' | 'rectification';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestedAt: string;
  completedAt?: string;
  reason?: string;
  dataSize?: string;
  downloadUrl?: string;
}

interface DataExport {
  id: string;
  userId: string;
  userEmail: string;
  dataTypes: string[];
  exportedAt: string;
  expiresAt: string;
  downloadCount: number;
  isExpired: boolean;
}

interface DataDeletion {
  id: string;
  userId: string;
  userEmail: string;
  deletedAt: string;
  deletedBy: string;
  dataTypes: string[];
  reason: string;
}

const GDPRTools: React.FC<GDPRToolsProps> = () => {
  const { hasPermission } = useAuthorization();
  const [dataRequests, setDataRequests] = useState<DataRequest[]>([]);
  const [dataExports, setDataExports] = useState<DataExport[]>([]);
  const [dataDeletions, setDataDeletions] = useState<DataDeletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadGDPRData();
  }, []);

  const loadGDPRData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/gdpr', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDataRequests(data.requests || []);
        setDataExports(data.exports || []);
        setDataDeletions(data.deletions || []);
      }
    } catch (error) {
      setError('Failed to load GDPR data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportUserData = async (userId: string, userEmail: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/gdpr/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ userId, userEmail })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user-data-${userEmail}-${new Date().toISOString().split('T')[0]}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        await loadGDPRData();
      } else {
        setError('Failed to export user data');
      }
    } catch (error) {
      setError('Failed to export user data');
    }
  };

  const handleDeleteUserData = async (userId: string, userEmail: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/gdpr/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ 
          userId, 
          userEmail, 
          reason: deleteReason 
        })
      });

      if (response.ok) {
        setShowDeleteDialog(false);
        setDeleteReason('');
        await loadGDPRData();
      } else {
        setError('Failed to delete user data');
      }
    } catch (error) {
      setError('Failed to delete user data');
    }
  };

  const handleProcessRequest = async (requestId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/gdpr/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ action, reason })
      });

      if (response.ok) {
        await loadGDPRData();
      } else {
        setError('Failed to process request');
      }
    } catch (error) {
      setError('Failed to process request');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'export':
        return <Download className="h-4 w-4" />;
      case 'delete':
        return <Trash2 className="h-4 w-4" />;
      case 'portability':
        return <Archive className="h-4 w-4" />;
      case 'rectification':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredRequests = dataRequests.filter(request => {
    const matchesSearch = request.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = !selectedUser || request.userId === selectedUser;
    return matchesSearch && matchesUser;
  });

  if (!hasPermission('users', 'delete')) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            You don't have permission to access GDPR tools.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <AdminPageLayout 
      title="GDPR Tools"
      description="Manage data privacy requests, exports, and deletions in compliance with GDPR"
    >
      <div className="flex items-center justify-between">
        <div>
        
        <Button onClick={loadGDPRData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
        </div>
      </div>

      {/* GDPR Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-bold">
                  {dataRequests.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Download className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Data Exports</p>
                <p className="text-2xl font-bold">{dataExports.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Trash2 className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Data Deletions</p>
                <p className="text-2xl font-bold">{dataDeletions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Compliance Score</p>
                <p className="text-2xl font-bold">98%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GDPR Compliance Alert */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>GDPR Compliance:</strong> All data processing activities are logged and auditable. 
          Users have the right to access, rectify, port, and delete their personal data within 30 days of request.
        </AlertDescription>
      </Alert>

      {/* GDPR Tools Tabs */}
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Data Requests</TabsTrigger>
          <TabsTrigger value="exports">Data Exports</TabsTrigger>
          <TabsTrigger value="deletions">Data Deletions</TabsTrigger>
          <TabsTrigger value="tools">Quick Tools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Data Privacy Requests</CardTitle>
                  <CardDescription>
                    Manage user requests for data access, portability, and deletion
                  </CardDescription>
                </div>
                
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search requests..."
                      className="pl-10 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
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
                      <TableHead>Request Type</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested At</TableHead>
                      <TableHead>Completed At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getRequestTypeIcon(request.requestType)}
                            <span className="capitalize">{request.requestType}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.userEmail}</p>
                            <p className="text-xs text-muted-foreground">ID: {request.userId}</p>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <span className="text-sm">
                            {new Date(request.requestedAt).toLocaleString()}
                          </span>
                        </TableCell>
                        
                        <TableCell>
                          {request.completedAt ? (
                            <span className="text-sm">
                              {new Date(request.completedAt).toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex space-x-2">
                            {request.status === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleProcessRequest(request.id, 'approve')}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleProcessRequest(request.id, 'reject')}
                                >
                                  <AlertTriangle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {request.status === 'completed' && request.downloadUrl && (
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
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
        
        <TabsContent value="exports">
          <Card>
            <CardHeader>
              <CardTitle>Data Exports</CardTitle>
              <CardDescription>
                Track all user data exports and their expiration status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Data Types</TableHead>
                    <TableHead>Exported At</TableHead>
                    <TableHead>Expires At</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataExports.map((export_) => (
                    <TableRow key={export_.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{export_.userEmail}</p>
                          <p className="text-xs text-muted-foreground">ID: {export_.userId}</p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {export_.dataTypes.map((type) => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-sm">
                          {new Date(export_.exportedAt).toLocaleString()}
                        </span>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-sm">
                          {new Date(export_.expiresAt).toLocaleString()}
                        </span>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-sm">{export_.downloadCount}</span>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={export_.isExpired ? getStatusColor('rejected') : getStatusColor('completed')}>
                          {export_.isExpired ? 'EXPIRED' : 'ACTIVE'}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        {!export_.isExpired && (
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="deletions">
          <Card>
            <CardHeader>
              <CardTitle>Data Deletions</CardTitle>
              <CardDescription>
                Audit trail of all user data deletions and anonymization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Data Types</TableHead>
                    <TableHead>Deleted At</TableHead>
                    <TableHead>Deleted By</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataDeletions.map((deletion) => (
                    <TableRow key={deletion.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{deletion.userEmail}</p>
                          <p className="text-xs text-muted-foreground">ID: {deletion.userId}</p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {deletion.dataTypes.map((type) => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-sm">
                          {new Date(deletion.deletedAt).toLocaleString()}
                        </span>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-sm">{deletion.deletedBy}</span>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-sm">{deletion.reason}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tools">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Data Export</CardTitle>
                <CardDescription>
                  Export user data for a specific user
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="export-user">User Email</Label>
                  <Input
                    id="export-user"
                    placeholder="user@example.com"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => {
                    const userEmail = selectedUser;
                    const userId = 'user-id'; // In production, get from API
                    handleExportUserData(userId, userEmail);
                  }}
                  disabled={!selectedUser}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export User Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Data Deletion</CardTitle>
                <CardDescription>
                  Permanently delete all user data (GDPR Article 17)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="delete-user">User Email</Label>
                  <Input
                    id="delete-user"
                    placeholder="user@example.com"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="delete-reason">Deletion Reason</Label>
                  <Input
                    id="delete-reason"
                    placeholder="User requested data deletion"
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                  />
                </div>
                
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="destructive"
                      disabled={!selectedUser || !deleteReason}
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete User Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Data Deletion</DialogTitle>
                      <DialogDescription>
                        This action will permanently delete all data for user: {selectedUser}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          This action cannot be undone. All user data will be permanently deleted.
                        </AlertDescription>
                      </Alert>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => {
                          const userEmail = selectedUser;
                          const userId = 'user-id'; // In production, get from API
                          handleDeleteUserData(userId, userEmail);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Permanently
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </AdminPageLayout>
  );
};

export default GDPRTools;
