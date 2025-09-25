import { useAuth } from '@/contexts/AuthContext';
import { 
  Permission, 
  FeatureFlag, 
  UserRole, 
  hasPermission, 
  hasFeature, 
  ROLE_HIERARCHY,
  RBACMiddleware 
} from '@/types/rbac';
import { RBACContext } from '@/middleware/rbac';

export interface RBACOptions {
  requiredPermissions?: Permission[];
  requiredFeatures?: FeatureFlag[];
  requiredRole?: UserRole;
  minRoleLevel?: UserRole;
  allowOwnResource?: boolean;
  allowSameWorkspace?: boolean;
}

export interface RBACResult {
  canAccess: boolean;
  reason?: string;
  missingPermissions?: Permission[];
  missingFeatures?: FeatureFlag[];
  insufficientRole?: boolean;
}

export const useRBAC = () => {
  const { user } = useAuth();

  const checkAccess = (options: RBACOptions = {}): RBACResult => {
    if (!user) {
      return {
        canAccess: false,
        reason: 'User not authenticated'
      };
    }

    try {
      const context: RBACContext = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
          planTier: user.planTier as any,
          workspaceId: user.workspaceId,
          permissions: user.permissions || [],
          features: user.features || [],
          limits: user.limits || {},
          isActive: user.status === 'ACTIVE',
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt)
        }
      };

      RBACMiddleware.authorize(context, options);

      return {
        canAccess: true
      };
    } catch (error: any) {
      if (error instanceof Error) {
        return {
          canAccess: false,
          reason: error.message,
          missingPermissions: options.requiredPermissions?.filter(p => !hasPermission(user, p)),
          missingFeatures: options.requiredFeatures?.filter(f => !hasFeature(user, f)),
          insufficientRole: error.message.includes('Insufficient role')
        };
      }
      return {
        canAccess: false,
        reason: 'Authorization failed'
      };
    }
  };

  const hasPermissionCheck = (permission: Permission): boolean => {
    if (!user) return false;
    return hasPermission(user, permission);
  };

  const hasFeatureCheck = (feature: FeatureFlag): boolean => {
    if (!user) return false;
    return hasFeature(user, feature);
  };

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  const hasMinRole = (minRole: UserRole): boolean => {
    if (!user) return false;
    return ROLE_HIERARCHY[user.role as UserRole] >= ROLE_HIERARCHY[minRole];
  };

  const canManageUser = (targetUserId: string): boolean => {
    if (!user) return false;
    
    // Mock target user for now - in real app, you'd fetch this
    const targetUser = {
      id: targetUserId,
      role: 'AGENT' as UserRole, // This would come from API
      workspaceId: user.workspaceId
    };

    return RBACMiddleware.canManageUser(user, targetUser);
  };

  const getAssignableRoles = (): UserRole[] => {
    if (!user) return [];
    return RBACMiddleware.getAssignableRoles(user);
  };

  const canAccessAdminPanel = (): boolean => {
    if (!user) return false;
    return RBACMiddleware.canAccessAdminPanel(user);
  };

  const canAccessSuperAdminPanel = (): boolean => {
    if (!user) return false;
    return RBACMiddleware.canAccessSuperAdminPanel(user);
  };

  const canCreateCustomRoles = (): boolean => {
    if (!user) return false;
    return user.role === 'ROOT_OWNER' || 
           user.role === 'SUPER_ADMIN' || 
           (user.role === 'OWNER' && user.planTier === 'ENTERPRISE');
  };

  return {
    user,
    checkAccess,
    hasPermission: hasPermissionCheck,
    hasFeature: hasFeatureCheck,
    hasRole,
    hasMinRole,
    canManageUser,
    getAssignableRoles,
    canAccessAdminPanel,
    canAccessSuperAdminPanel,
    canCreateCustomRoles
  };
};

export default useRBAC;
