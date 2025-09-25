import { UserRole, Permission, FeatureFlag, hasPermission, hasFeature, ROLE_HIERARCHY } from '@/types/rbac';
import { User } from '@/types/rbac';

export interface RBACContext {
  user: User;
  resourceOwnerId?: string;
  workspaceId?: string;
}

export interface RBACOptions {
  requiredPermissions?: Permission[];
  requiredFeatures?: FeatureFlag[];
  requiredRole?: UserRole;
  minRoleLevel?: UserRole;
  allowOwnResource?: boolean;
  allowSameWorkspace?: boolean;
}

export class RBACError extends Error {
  constructor(
    message: string,
    public code: 'INSUFFICIENT_PERMISSIONS' | 'INSUFFICIENT_FEATURES' | 'INSUFFICIENT_ROLE' | 'ACCESS_DENIED',
    public statusCode: number = 403
  ) {
    super(message);
    this.name = 'RBACError';
  }
}

export class RBACMiddleware {
  /**
   * Check if user has required permissions
   */
  static checkPermissions(
    context: RBACContext,
    options: RBACOptions = {}
  ): boolean {
    const { user } = context;
    const { requiredPermissions = [] } = options;

    // Root Owner has all permissions
    if (user.role === 'ROOT_OWNER') {
      return true;
    }

    // Check each required permission
    for (const permission of requiredPermissions) {
      if (!hasPermission(user, permission)) {
        throw new RBACError(
          `Insufficient permissions. Required: ${permission}`,
          'INSUFFICIENT_PERMISSIONS'
        );
      }
    }

    return true;
  }

  /**
   * Check if user has required features (tier-based)
   */
  static checkFeatures(
    context: RBACContext,
    options: RBACOptions = {}
  ): boolean {
    const { user } = context;
    const { requiredFeatures = [] } = options;

    // Root Owner and SuperAdmin have all features
    if (user.role === 'ROOT_OWNER' || user.role === 'SUPER_ADMIN') {
      return true;
    }

    // Check each required feature
    for (const feature of requiredFeatures) {
      if (!hasFeature(user, feature)) {
        throw new RBACError(
          `Feature not available in your plan. Required: ${feature}`,
          'INSUFFICIENT_FEATURES',
          402 // Payment Required
        );
      }
    }

    return true;
  }

  /**
   * Check if user has required role level
   */
  static checkRole(
    context: RBACContext,
    options: RBACOptions = {}
  ): boolean {
    const { user } = context;
    const { requiredRole, minRoleLevel } = options;

    // Check exact role
    if (requiredRole && user.role !== requiredRole) {
      throw new RBACError(
        `Insufficient role. Required: ${requiredRole}, Current: ${user.role}`,
        'INSUFFICIENT_ROLE'
      );
    }

    // Check minimum role level
    if (minRoleLevel && ROLE_HIERARCHY[user.role] < ROLE_HIERARCHY[minRoleLevel]) {
      throw new RBACError(
        `Insufficient role level. Required: ${minRoleLevel} or higher, Current: ${user.role}`,
        'INSUFFICIENT_ROLE'
      );
    }

    return true;
  }

  /**
   * Check resource access (ownership/workspace)
   */
  static checkResourceAccess(
    context: RBACContext,
    options: RBACOptions = {}
  ): boolean {
    const { user, resourceOwnerId, workspaceId } = context;
    const { allowOwnResource = true, allowSameWorkspace = false } = options;

    // Root Owner and SuperAdmin can access all resources
    if (user.role === 'ROOT_OWNER' || user.role === 'SUPER_ADMIN') {
      return true;
    }

    // Check ownership
    if (allowOwnResource && resourceOwnerId && user.id === resourceOwnerId) {
      return true;
    }

    // Check workspace access
    if (allowSameWorkspace && workspaceId && user.workspaceId === workspaceId) {
      return true;
    }

    throw new RBACError(
      'Access denied to this resource',
      'ACCESS_DENIED'
    );
  }

  /**
   * Main RBAC check method
   */
  static authorize(
    context: RBACContext,
    options: RBACOptions = {}
  ): boolean {
    try {
      // Check permissions
      this.checkPermissions(context, options);
      
      // Check features
      this.checkFeatures(context, options);
      
      // Check role
      this.checkRole(context, options);
      
      // Check resource access
      this.checkResourceAccess(context, options);
      
      return true;
    } catch (error) {
      if (error instanceof RBACError) {
        throw error;
      }
      throw new RBACError(
        'Authorization failed',
        'ACCESS_DENIED',
        500
      );
    }
  }

  /**
   * Check if user can perform action on another user
   */
  static canManageUser(
    manager: User,
    targetUser: User
  ): boolean {
    // Root Owner can manage anyone
    if (manager.role === 'ROOT_OWNER') {
      return true;
    }

    // SuperAdmin can manage anyone except Root Owner
    if (manager.role === 'SUPER_ADMIN' && targetUser.role !== 'ROOT_OWNER') {
      return true;
    }

    // Owner can manage users in their workspace (except other owners/admins)
    if (manager.role === 'OWNER' && 
        targetUser.role !== 'ROOT_OWNER' && 
        targetUser.role !== 'SUPER_ADMIN' && 
        targetUser.role !== 'OWNER' &&
        manager.workspaceId === targetUser.workspaceId) {
      return true;
    }

    // Manager can manage agents and viewers in their workspace
    if (manager.role === 'MANAGER' && 
        (targetUser.role === 'AGENT' || targetUser.role === 'VIEWER') &&
        manager.workspaceId === targetUser.workspaceId) {
      return true;
    }

    return false;
  }

  /**
   * Get accessible roles for a user to assign
   */
  static getAssignableRoles(user: User): UserRole[] {
    const allRoles: UserRole[] = ['ROOT_OWNER', 'SUPER_ADMIN', 'OWNER', 'MANAGER', 'AGENT', 'VIEWER'];
    
    switch (user.role) {
      case 'ROOT_OWNER':
        return allRoles; // Can assign any role
      
      case 'SUPER_ADMIN':
        return ['SUPER_ADMIN', 'OWNER', 'MANAGER', 'AGENT', 'VIEWER']; // Cannot assign Root Owner
      
      case 'OWNER':
        return ['MANAGER', 'AGENT', 'VIEWER']; // Can only assign lower roles in workspace
      
      case 'MANAGER':
        return ['AGENT', 'VIEWER']; // Can only assign agent/viewer roles
      
      case 'AGENT':
      case 'VIEWER':
        return []; // Cannot assign any roles
      
      default:
        return [];
    }
  }

  /**
   * Check if user can access admin panel
   */
  static canAccessAdminPanel(user: User): boolean {
    return ['ROOT_OWNER', 'SUPER_ADMIN'].includes(user.role);
  }

  /**
   * Check if user can access super admin panel
   */
  static canAccessSuperAdminPanel(user: User): boolean {
    return user.role === 'ROOT_OWNER';
  }
}

// Route protection decorators for React components
export const withRBAC = (
  Component: React.ComponentType<any>,
  options: RBACOptions = {}
) => {
  return (props: any) => {
    // This would be used in a React context where user is available
    // Implementation depends on your auth context
    return <Component {...props} />;
  };
};

// Utility functions for common checks
export const requirePermission = (permission: Permission) => {
  return (context: RBACContext) => {
    return RBACMiddleware.authorize(context, { requiredPermissions: [permission] });
  };
};

export const requireFeature = (feature: FeatureFlag) => {
  return (context: RBACContext) => {
    return RBACMiddleware.authorize(context, { requiredFeatures: [feature] });
  };
};

export const requireRole = (role: UserRole) => {
  return (context: RBACContext) => {
    return RBACMiddleware.authorize(context, { requiredRole: role });
  };
};

export const requireMinRole = (minRole: UserRole) => {
  return (context: RBACContext) => {
    return RBACMiddleware.authorize(context, { minRoleLevel: minRole });
  };
};
