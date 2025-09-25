import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Home, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Unauthorized: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this resource
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                Your account ({user?.email}) doesn't have the required permissions to view this page.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  If you believe this is an error, please contact your administrator.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link to="/dashboard">
                    <Home className="w-4 h-4 mr-2" />
                    Go to Dashboard
                  </Link>
                </Button>
                
                <Button variant="outline" onClick={() => window.history.back()} className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </div>

            {user?.role && (
              <div className="pt-4 border-t">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Current role: <span className="font-medium">{user.role}</span>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Unauthorized;
