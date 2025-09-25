import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthorization } from '@/hooks/useAuthorization';
import { UserRole, Resource, Action } from '@/types/auth';
import RBACRoute from './RBACRoute';
import { Permission, FeatureFlag } from '@/types/rbac';

interface ProtectedRouteProps {
  children: React.ReactNode;
  // Legacy props for backward compatibility
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
  // New RBAC props
  rbacPermissions?: Permission[];
  rbacFeatures?: FeatureFlag[];
  rbacRole?: UserRole;
  rbacMinRole?: UserRole;
  fallback?: React.ReactNode;
  redirectTo?: string;
  useRBAC?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  // Legacy props
  requiredRole,
  requiredRoles,
  requiredPermission,
  requiredPermissions,
  // New RBAC props
  rbacPermissions,
  rbacFeatures,
  rbacRole,
  rbacMinRole,
  fallback,
  redirectTo = '/login',
  useRBAC = false
}) => {
  const { user, loading } = useAuth();
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
    console.log('🔒 ProtectedRoute: User not authenticated, redirecting to login');
    console.log('🔒 Current location:', location.pathname);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  console.log('✅ ProtectedRoute: User authenticated:', user.email, 'Role:', user.role);
  
  // Root admin has access to everything
  if (user.role === 'ROOT_OWNER') {
    console.log('👑 Root Owner detected - granting full access');
    return <>{children}</>;
  }

  // Use new RBAC system if requested or if RBAC props are provided
  if (useRBAC || rbacPermissions || rbacFeatures || rbacRole || rbacMinRole) {
    return (
      <RBACRoute
        requiredPermissions={rbacPermissions}
        requiredFeatures={rbacFeatures}
        requiredRole={rbacRole}
        minRoleLevel={rbacMinRole}
        fallbackPath={redirectTo}
        showAccessDenied={true}
      >
        {children}
      </RBACRoute>
    );
  }

  // Legacy authorization system
  const { hasRole, hasAnyRole, hasPermission } = useAuthorization();

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
