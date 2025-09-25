import React from 'react';
import { useAuthorization } from '@/hooks/useAuthorization';
import { UserRole, Resource, Action } from '@/types/auth';

interface ConditionalRenderProps {
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
  mode?: 'hide' | 'disable' | 'show-fallback';
}

const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  requiredRole,
  requiredRoles,
  requiredPermission,
  requiredPermissions,
  fallback = null,
  mode = 'hide'
}) => {
  const { hasRole, hasAnyRole, hasPermission } = useAuthorization();

  // Check role requirements
  let hasRequiredRole = true;
  if (requiredRole && !hasRole(requiredRole)) {
    hasRequiredRole = false;
  }
  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    hasRequiredRole = false;
  }

  // Check permission requirements
  let hasRequiredPermissions = true;
  if (requiredPermission && !hasPermission(requiredPermission.resource, requiredPermission.action)) {
    hasRequiredPermissions = false;
  }
  if (requiredPermissions) {
    const hasAllPermissions = requiredPermissions.every(perm => 
      hasPermission(perm.resource, perm.action)
    );
    if (!hasAllPermissions) {
      hasRequiredPermissions = false;
    }
  }

  const canRender = hasRequiredRole && hasRequiredPermissions;

  if (!canRender) {
    switch (mode) {
      case 'hide':
        return null;
      case 'show-fallback':
        return <>{fallback}</>;
      case 'disable':
        return (
          <div className="opacity-50 pointer-events-none">
            {children}
          </div>
        );
      default:
        return null;
    }
  }

  return <>{children}</>;
};

export default ConditionalRender;
