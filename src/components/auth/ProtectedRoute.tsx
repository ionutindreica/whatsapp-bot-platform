import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthorization } from '@/hooks/useAuthorization';
import { UserRole, Resource, Action } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredRoles?: UserRole[];
  requiredPermission?: {
    resource: Resource;
    action: Action;
  };
  requiredPermissions?: Array<{
    resource: Resource;
    action: Action;
  }>;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredRoles,
  requiredPermission,
  requiredPermissions,
  fallback,
  redirectTo = '/login'
}) => {
  const { user, loading } = useAuth();
  const { hasRole, hasAnyRole, hasPermission, hasHigherRole } = useAuthorization();
  const location = useLocation();

  // Show loading while auth is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRole && !hasRole(requiredRole)) {
    if (fallback) return <>{fallback}</>;
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    if (fallback) return <>{fallback}</>;
    return <Navigate to="/unauthorized" replace />;
  }

  // Check permission requirements
  if (requiredPermission && !hasPermission(requiredPermission.resource, requiredPermission.action)) {
    if (fallback) return <>{fallback}</>;
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermissions) {
    const hasAllPermissions = requiredPermissions.every(perm => 
      hasPermission(perm.resource, perm.action)
    );
    
    if (!hasAllPermissions) {
      if (fallback) return <>{fallback}</>;
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
