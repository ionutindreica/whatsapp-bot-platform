// RBAC (Role-Based Access Control) System Types

export type UserRole = 
  | 'ROOT_OWNER'      // System Owner - Creator of the platform
  | 'SUPER_ADMIN'     // Global Administrator
  | 'OWNER'           // Workspace Owner / Account Admin
  | 'MANAGER'         // Team Admin / Manager
  | 'AGENT'           // Agent / Member
  | 'VIEWER';         // Viewer / Guest

export type PlanTier = 
  | 'STARTER'         // Basic plan
  | 'PRO'            // Professional plan
  | 'ENTERPRISE';    // Enterprise plan

// Granular permissions for each action
export type Permission = 
  // System Management
  | 'SYSTEM_MANAGE_ALL'
  | 'SYSTEM_CREATE_SUPERADMINS'
  | 'SYSTEM_DELETE_SUPERADMINS'
  | 'SYSTEM_VIEW_LOGS'
  | 'SYSTEM_MANAGE_LICENSES'
  
  // Workspace Management
  | 'WORKSPACE_MANAGE_ALL'
  | 'WORKSPACE_CREATE'
  | 'WORKSPACE_DELETE'
  | 'WORKSPACE_MANAGE_BILLING'
  | 'WORKSPACE_VIEW_ANALYTICS'
  
  // User Management
  | 'USER_MANAGE_ALL'
  | 'USER_CREATE'
  | 'USER_EDIT'
  | 'USER_DELETE'
  | 'USER_SUSPEND'
  | 'USER_ACTIVATE'
  | 'USER_VIEW_DETAILS'
  
  // Bot Management
  | 'BOT_MANAGE_ALL'
  | 'BOT_CREATE'
  | 'BOT_EDIT'
  | 'BOT_DELETE'
  | 'BOT_VIEW'
  | 'BOT_PUBLISH'
  | 'BOT_ANALYTICS'
  
  // Conversation Management
  | 'CONVERSATION_MANAGE_ALL'
  | 'CONVERSATION_VIEW_ALL'
  | 'CONVERSATION_REPLY'
  | 'CONVERSATION_ASSIGN'
  | 'CONVERSATION_CLOSE'
  | 'CONVERSATION_EXPORT'
  
  // Channel Management
  | 'CHANNEL_MANAGE_ALL'
  | 'CHANNEL_CONNECT'
  | 'CHANNEL_DISCONNECT'
  | 'CHANNEL_VIEW_ANALYTICS'
  
  // Integration Management
  | 'INTEGRATION_MANAGE_ALL'
  | 'INTEGRATION_CREATE'
  | 'INTEGRATION_EDIT'
  | 'INTEGRATION_DELETE'
  
  // Broadcast Management
  | 'BROADCAST_MANAGE_ALL'
  | 'BROADCAST_CREATE'
  | 'BROADCAST_SEND'
  | 'BROADCAST_VIEW_ANALYTICS'
  
  // Analytics & Reporting
  | 'ANALYTICS_VIEW_ALL'
  | 'ANALYTICS_EXPORT'
  | 'ANALYTICS_CUSTOM_REPORTS'
  
  // API Management
  | 'API_MANAGE_KEYS'
  | 'API_VIEW_USAGE'
  | 'API_RATE_LIMIT_MANAGE';

// Feature flags for tier-based access
export type FeatureFlag = 
  | 'MULTI_WORKSPACE'
  | 'SSO_SCIM'
  | 'WHITE_LABEL'
  | 'CUSTOM_ROLES'
  | 'AI_RAG'
  | 'CUSTOM_GPT'
  | 'DATA_EXPORT'
  | 'ADVANCED_ANALYTICS'
  | 'API_UNLIMITED'
  | 'PRIORITY_SUPPORT';

// Role hierarchy and permissions mapping
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'ROOT_OWNER': 6,
  'SUPER_ADMIN': 5,
  'OWNER': 4,
  'MANAGER': 3,
  'AGENT': 2,
  'VIEWER': 1
};

// Role permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  'ROOT_OWNER': [
    // Has ALL permissions
    'SYSTEM_MANAGE_ALL', 'SYSTEM_CREATE_SUPERADMINS', 'SYSTEM_DELETE_SUPERADMINS',
    'SYSTEM_VIEW_LOGS', 'SYSTEM_MANAGE_LICENSES',
    'WORKSPACE_MANAGE_ALL', 'WORKSPACE_CREATE', 'WORKSPACE_DELETE', 'WORKSPACE_MANAGE_BILLING',
    'USER_MANAGE_ALL', 'USER_CREATE', 'USER_EDIT', 'USER_DELETE', 'USER_SUSPEND', 'USER_ACTIVATE',
    'BOT_MANAGE_ALL', 'BOT_CREATE', 'BOT_EDIT', 'BOT_DELETE', 'BOT_VIEW', 'BOT_PUBLISH',
    'CONVERSATION_MANAGE_ALL', 'CONVERSATION_VIEW_ALL', 'CONVERSATION_REPLY', 'CONVERSATION_ASSIGN',
    'CHANNEL_MANAGE_ALL', 'CHANNEL_CONNECT', 'CHANNEL_DISCONNECT',
    'INTEGRATION_MANAGE_ALL', 'INTEGRATION_CREATE', 'INTEGRATION_EDIT',
    'BROADCAST_MANAGE_ALL', 'BROADCAST_CREATE', 'BROADCAST_SEND',
    'ANALYTICS_VIEW_ALL', 'ANALYTICS_EXPORT', 'ANALYTICS_CUSTOM_REPORTS',
    'API_MANAGE_KEYS', 'API_VIEW_USAGE', 'API_RATE_LIMIT_MANAGE'
  ],
  
  'SUPER_ADMIN': [
    'WORKSPACE_MANAGE_ALL', 'WORKSPACE_CREATE', 'WORKSPACE_DELETE', 'WORKSPACE_MANAGE_BILLING',
    'USER_MANAGE_ALL', 'USER_CREATE', 'USER_EDIT', 'USER_DELETE', 'USER_SUSPEND', 'USER_ACTIVATE',
    'BOT_MANAGE_ALL', 'BOT_CREATE', 'BOT_EDIT', 'BOT_DELETE', 'BOT_VIEW', 'BOT_PUBLISH',
    'CONVERSATION_MANAGE_ALL', 'CONVERSATION_VIEW_ALL', 'CONVERSATION_REPLY', 'CONVERSATION_ASSIGN',
    'CHANNEL_MANAGE_ALL', 'CHANNEL_CONNECT', 'CHANNEL_DISCONNECT',
    'INTEGRATION_MANAGE_ALL', 'INTEGRATION_CREATE', 'INTEGRATION_EDIT',
    'BROADCAST_MANAGE_ALL', 'BROADCAST_CREATE', 'BROADCAST_SEND',
    'ANALYTICS_VIEW_ALL', 'ANALYTICS_EXPORT', 'ANALYTICS_CUSTOM_REPORTS',
    'API_MANAGE_KEYS', 'API_VIEW_USAGE', 'API_RATE_LIMIT_MANAGE'
  ],
  
  'OWNER': [
    'USER_MANAGE_ALL', 'USER_CREATE', 'USER_EDIT', 'USER_DELETE', 'USER_SUSPEND', 'USER_ACTIVATE',
    'BOT_MANAGE_ALL', 'BOT_CREATE', 'BOT_EDIT', 'BOT_DELETE', 'BOT_VIEW', 'BOT_PUBLISH',
    'CONVERSATION_MANAGE_ALL', 'CONVERSATION_VIEW_ALL', 'CONVERSATION_REPLY', 'CONVERSATION_ASSIGN',
    'CHANNEL_MANAGE_ALL', 'CHANNEL_CONNECT', 'CHANNEL_DISCONNECT',
    'INTEGRATION_MANAGE_ALL', 'INTEGRATION_CREATE', 'INTEGRATION_EDIT',
    'BROADCAST_MANAGE_ALL', 'BROADCAST_CREATE', 'BROADCAST_SEND',
    'ANALYTICS_VIEW_ALL', 'ANALYTICS_EXPORT', 'ANALYTICS_CUSTOM_REPORTS',
    'API_MANAGE_KEYS', 'API_VIEW_USAGE'
  ],
  
  'MANAGER': [
    'USER_CREATE', 'USER_EDIT', 'USER_VIEW_DETAILS',
    'BOT_CREATE', 'BOT_EDIT', 'BOT_VIEW', 'BOT_PUBLISH', 'BOT_ANALYTICS',
    'CONVERSATION_VIEW_ALL', 'CONVERSATION_REPLY', 'CONVERSATION_ASSIGN', 'CONVERSATION_CLOSE',
    'CHANNEL_CONNECT', 'CHANNEL_VIEW_ANALYTICS',
    'INTEGRATION_CREATE', 'INTEGRATION_EDIT',
    'BROADCAST_CREATE', 'BROADCAST_SEND', 'BROADCAST_VIEW_ANALYTICS',
    'ANALYTICS_VIEW_ALL', 'ANALYTICS_EXPORT'
  ],
  
  'AGENT': [
    'BOT_VIEW', 'BOT_ANALYTICS',
    'CONVERSATION_REPLY', 'CONVERSATION_CLOSE',
    'CHANNEL_VIEW_ANALYTICS',
    'ANALYTICS_VIEW_ALL'
  ],
  
  'VIEWER': [
    'BOT_VIEW',
    'CONVERSATION_VIEW_ALL',
    'CHANNEL_VIEW_ANALYTICS',
    'ANALYTICS_VIEW_ALL'
  ]
};

// Tier-based feature access
export const TIER_FEATURES: Record<PlanTier, FeatureFlag[]> = {
  'STARTER': [
    // Basic features only
  ],
  'PRO': [
    'MULTI_WORKSPACE',
    'AI_RAG',
    'CUSTOM_GPT',
    'DATA_EXPORT',
    'ADVANCED_ANALYTICS'
  ],
  'ENTERPRISE': [
    'MULTI_WORKSPACE',
    'SSO_SCIM',
    'WHITE_LABEL',
    'CUSTOM_ROLES',
    'AI_RAG',
    'CUSTOM_GPT',
    'DATA_EXPORT',
    'ADVANCED_ANALYTICS',
    'API_UNLIMITED',
    'PRIORITY_SUPPORT'
  ]
};

// Tier limits
export const TIER_LIMITS: Record<PlanTier, Record<string, number | 'unlimited'>> = {
  'STARTER': {
    activeBots: 1,
    channels: 2,
    conversationsPerMonth: 1000,
    apiRequestsPerDay: 100,
    users: 5,
    workspaces: 1
  },
  'PRO': {
    activeBots: 5,
    channels: 4,
    conversationsPerMonth: 10000,
    apiRequestsPerDay: 1000,
    users: 25,
    workspaces: 3
  },
  'ENTERPRISE': {
    activeBots: 'unlimited',
    channels: 'unlimited',
    conversationsPerMonth: 'unlimited',
    apiRequestsPerDay: 'unlimited',
    users: 'unlimited',
    workspaces: 'unlimited'
  }
};

// User interface types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  planTier: PlanTier;
  workspaceId?: string;
  permissions: Permission[];
  features: FeatureFlag[];
  limits: Record<string, number | 'unlimited'>;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  planTier: PlanTier;
  ownerId: string;
  isActive: boolean;
  limits: Record<string, number | 'unlimited'>;
  features: FeatureFlag[];
  createdAt: Date;
  updatedAt: Date;
}

// Permission checking utilities
export const hasPermission = (user: User, permission: Permission): boolean => {
  return user.permissions.includes(permission);
};

export const hasFeature = (user: User, feature: FeatureFlag): boolean => {
  return user.features.includes(feature);
};

export const canAccessResource = (user: User, resourceOwnerId: string): boolean => {
  // Root and SuperAdmin can access all resources
  if (user.role === 'ROOT_OWNER' || user.role === 'SUPER_ADMIN') {
    return true;
  }
  
  // Others can only access resources in their workspace
  return user.id === resourceOwnerId;
};

export const isHigherRole = (userRole: UserRole, targetRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] > ROLE_HIERARCHY[targetRole];
};

export const getRoleDisplayName = (role: UserRole): string => {
  const displayNames: Record<UserRole, string> = {
    'ROOT_OWNER': 'Root Owner',
    'SUPER_ADMIN': 'Super Admin',
    'OWNER': 'Owner',
    'MANAGER': 'Manager',
    'AGENT': 'Agent',
    'VIEWER': 'Viewer'
  };
  return displayNames[role];
};

export const getPlanDisplayName = (tier: PlanTier): string => {
  const displayNames: Record<PlanTier, string> = {
    'STARTER': 'Starter',
    'PRO': 'Pro',
    'ENTERPRISE': 'Enterprise'
  };
  return displayNames[tier];
};
