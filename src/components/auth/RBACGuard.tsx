import React from 'react';
import { useRBAC, RBACOptions } from '@/hooks/useRBAC';

interface RBACGuardProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredFeatures?: string[];
  requiredRole?: string;
  minRoleLevel?: string;
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

const RBACGuard: React.FC<RBACGuardProps> = ({
  children,
  requiredPermissions = [],
  requiredFeatures = [],
  requiredRole,
  minRoleLevel,
  fallback = null,
  showFallback = false
}) => {
  const { checkAccess } = useRBAC();

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

  if (showFallback && fallback) {
    return <>{fallback}</>;
  }

  return null;
};

export default RBACGuard;
