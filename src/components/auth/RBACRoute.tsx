import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRBAC, RBACOptions } from '@/hooks/useRBAC';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, AlertTriangle, Crown, Users } from 'lucide-react';

interface RBACRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredFeatures?: string[];
  requiredRole?: string;
  minRoleLevel?: string;
  fallbackPath?: string;
  showAccessDenied?: boolean;
  customAccessDeniedMessage?: string;
}

const RBACRoute: React.FC<RBACRouteProps> = ({
  children,
  requiredPermissions = [],
  requiredFeatures = [],
  requiredRole,
  minRoleLevel,
  fallbackPath = '/dashboard',
  showAccessDenied = true,
  customAccessDeniedMessage
}) => {
  const location = useLocation();
  const { checkAccess, user, canAccessAdminPanel, canAccessSuperAdminPanel } = useRBAC();

  const rbacOptions: RBACOptions = {
    requiredPermissions: requiredPermissions as any[],
    requiredFeatures: requiredFeatures as any[],
    requiredRole: requiredRole as any,
    minRoleLevel: minRoleLevel as any
  };

  const accessResult = checkAccess(rbacOptions);

  if (accessResult.canAccess) {
    return <>{children}</>;
  }

  // If access is denied and we don't want to show the access denied page
  if (!showAccessDenied) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Determine the type of access denied
  const getAccessDeniedInfo = () => {
    if (accessResult.missingFeatures?.length) {
      return {
        icon: <Crown className="w-8 h-8 text-yellow-600" />,
        title: "Feature Not Available",
        description: customAccessDeniedMessage || 
          "This feature is not available in your current plan. Please upgrade to access this functionality.",
        action: "Upgrade Plan",
        actionPath: "/dashboard/billing"
      };
    }

    if (accessResult.insufficientRole) {
      return {
        icon: <Users className="w-8 h-8 text-blue-600" />,
        title: "Insufficient Role",
        description: customAccessDeniedMessage || 
          "You don't have the required role to access this resource. Please contact your administrator.",
        action: "Contact Admin",
        actionPath: "/dashboard/support"
      };
    }

    if (accessResult.missingPermissions?.length) {
      return {
        icon: <Lock className="w-8 h-8 text-red-600" />,
        title: "Insufficient Permissions",
        description: customAccessDeniedMessage || 
          "You don't have the required permissions to access this resource.",
        action: "Go Back",
        actionPath: fallbackPath
      };
    }

    return {
      icon: <Shield className="w-8 h-8 text-gray-600" />,
      title: "Access Denied",
      description: customAccessDeniedMessage || accessResult.reason || 
        "You don't have permission to access this resource.",
      action: "Go Back",
      actionPath: fallbackPath
    };
  };

  const accessInfo = getAccessDeniedInfo();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {accessInfo.icon}
          </div>
          <CardTitle className="text-xl">{accessInfo.title}</CardTitle>
          <CardDescription>
            {accessInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {accessResult.missingPermissions?.length && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Missing Permissions:</strong>
                <ul className="mt-1 list-disc list-inside text-sm">
                  {accessResult.missingPermissions.map((permission, index) => (
                    <li key={index}>{permission.replace(/_/g, ' ').toLowerCase()}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {accessResult.missingFeatures?.length && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Missing Features:</strong>
                <ul className="mt-1 list-disc list-inside text-sm">
                  {accessResult.missingFeatures.map((feature, index) => (
                    <li key={index}>{feature.replace(/_/g, ' ').toLowerCase()}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col space-y-2">
            <Button 
              asChild 
              className="w-full"
              onClick={() => window.location.href = accessInfo.actionPath}
            >
              <a href={accessInfo.actionPath}>{accessInfo.action}</a>
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>

          {/* Debug info for development */}
          {process.env.NODE_ENV === 'development' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <details className="text-xs">
                  <summary className="cursor-pointer">Debug Info</summary>
                  <div className="mt-2 space-y-1">
                    <div><strong>User Role:</strong> {user?.role}</div>
                    <div><strong>Plan Tier:</strong> {user?.planTier}</div>
                    <div><strong>Can Access Admin:</strong> {canAccessAdminPanel() ? 'Yes' : 'No'}</div>
                    <div><strong>Can Access Super Admin:</strong> {canAccessSuperAdminPanel() ? 'Yes' : 'No'}</div>
                    <div><strong>Path:</strong> {location.pathname}</div>
                    <div><strong>Required Permissions:</strong> {requiredPermissions.join(', ') || 'None'}</div>
                    <div><strong>Required Features:</strong> {requiredFeatures.join(', ') || 'None'}</div>
                    <div><strong>Required Role:</strong> {requiredRole || 'None'}</div>
                    <div><strong>Min Role Level:</strong> {minRoleLevel || 'None'}</div>
                  </div>
                </details>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RBACRoute;
