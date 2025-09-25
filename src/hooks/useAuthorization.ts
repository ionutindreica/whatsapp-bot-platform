import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, Permission, Resource, Action, ROLE_PERMISSIONS, ROLE_HIERARCHY } from '@/types/auth';

interface UseAuthorizationReturn {
  hasPermission: (resource: Resource, action: Action) => boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasHigherRole: (role: UserRole) => boolean;
  canAccess: (resource: Resource) => boolean;
  userPermissions: Permission[];
  userRole: UserRole;
  roleLevel: number;
}

export function useAuthorization(): UseAuthorizationReturn {
  const { user } = useAuth();

  const userPermissions = useMemo(() => {
    if (!user) return [];
    return ROLE_PERMISSIONS[user.role] || [];
  }, [user?.role]);

  const hasPermission = (resource: Resource, action: Action): boolean => {
    if (!user) return false;
    
    // Root Owner has all permissions
    if (user.role === 'ROOT_OWNER') return true;
    
    // Super Admin has all permissions
    if (user.role === 'SUPER_ADMIN') return true;
    
    return userPermissions.some(permission => 
      (permission.resource === resource && permission.action === action) ||
      (permission.resource === resource && permission.action === 'manage') ||
      (permission.action === action && permission.resource === 'all')
    );
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const hasHigherRole = (role: UserRole): boolean => {
    if (!user) return false;
    return ROLE_HIERARCHY[user.role] > ROLE_HIERARCHY[role];
  };

  const canAccess = (resource: Resource): boolean => {
    return hasPermission(resource, 'read') || hasPermission(resource, 'manage');
  };

  const userRole = user?.role || 'CLIENT';
  const roleLevel = ROLE_HIERARCHY[userRole];

  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    hasHigherRole,
    canAccess,
    userPermissions,
    userRole,
    roleLevel
  };
}

// Helper hooks for common permission checks
export function useCanManageUsers(): boolean {
  const { hasPermission } = useAuthorization();
  return hasPermission('users', 'manage');
}

export function useCanManageBots(): boolean {
  const { hasPermission } = useAuthorization();
  return hasPermission('bots', 'manage');
}

export function useCanViewAnalytics(): boolean {
  const { hasPermission } = useAuthorization();
  return hasPermission('analytics', 'read');
}

export function useCanManageSettings(): boolean {
  const { hasPermission } = useAuthorization();
  return hasPermission('settings', 'manage');
}

export function useCanViewAuditLogs(): boolean {
  const { hasPermission } = useAuthorization();
  return hasPermission('audit_logs', 'read');
}

export function useCanManageTeam(): boolean {
  const { hasPermission } = useAuthorization();
  return hasPermission('team', 'manage');
}

export function useCanManageIntegrations(): boolean {
  const { hasPermission } = useAuthorization();
  return hasPermission('integrations', 'manage');
}

export function useCanManageBroadcasts(): boolean {
  const { hasPermission } = useAuthorization();
  return hasPermission('broadcasts', 'manage');
}

export function useCanManageFlows(): boolean {
  const { hasPermission } = useAuthorization();
  return hasPermission('flows', 'manage');
}

export function useCanManageChannels(): boolean {
  const { hasPermission } = useAuthorization();
  return hasPermission('channels', 'manage');
}

export function useCanViewBilling(): boolean {
  const { hasPermission } = useAuthorization();
  return hasPermission('billing', 'read');
}

export function useCanExportData(): boolean {
  const { hasPermission } = useAuthorization();
  return hasPermission('analytics', 'export') || hasPermission('users', 'export');
}
