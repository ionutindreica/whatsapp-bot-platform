// Authentication and Authorization Types

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  profile?: UserProfile;
  permissions?: Permission[];
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
  provider?: string;
  providerId?: string;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  timezone?: string;
  language?: string;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showOnlineStatus: boolean;
  };
}

export type UserRole = 
  | 'ROOT_OWNER'
  | 'SUPER_ADMIN'
  | 'ADMIN' 
  | 'MANAGER'
  | 'AGENT'
  | 'VIEWER'
  | 'CLIENT';

export type UserStatus = 
  | 'ACTIVE'
  | 'INACTIVE'
  | 'SUSPENDED'
  | 'PENDING_VERIFICATION'
  | 'BANNED';

export interface Permission {
  id: string;
  name: string;
  resource: Resource;
  action: Action;
  conditions?: PermissionCondition[];
}

export type Resource = 
  | 'users'
  | 'bots'
  | 'conversations'
  | 'analytics'
  | 'billing'
  | 'settings'
  | 'integrations'
  | 'broadcasts'
  | 'polls'
  | 'flows'
  | 'templates'
  | 'channels'
  | 'webhooks'
  | 'api_keys'
  | 'team'
  | 'roles'
  | 'audit_logs';

export type Action = 
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'manage'
  | 'invite'
  | 'export'
  | 'import'
  | 'execute'
  | 'approve'
  | 'suspend';

export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'in' | 'not_in' | 'greater_than' | 'less_than';
  value: any;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  device?: Device;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  lastActivityAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface Device {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
  location?: string;
  isTrusted: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Role Definitions
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ROOT_OWNER: [
    // All permissions - highest level
    { id: 'all', name: 'All Permissions', resource: 'all' as any, action: 'manage' as any }
  ],
  
  SUPER_ADMIN: [
    // All permissions
    { id: 'all', name: 'All Permissions', resource: 'all' as any, action: 'manage' as any }
  ],
  
  ADMIN: [
    // User Management
    { id: 'users_read', name: 'View Users', resource: 'users', action: 'read' },
    { id: 'users_create', name: 'Create Users', resource: 'users', action: 'create' },
    { id: 'users_update', name: 'Edit Users', resource: 'users', action: 'update' },
    { id: 'users_delete', name: 'Delete Users', resource: 'users', action: 'delete' },
    { id: 'users_invite', name: 'Invite Users', resource: 'users', action: 'invite' },
    
    // Bot Management
    { id: 'bots_manage', name: 'Manage Bots', resource: 'bots', action: 'manage' },
    { id: 'conversations_manage', name: 'Manage Conversations', resource: 'conversations', action: 'manage' },
    { id: 'analytics_read', name: 'View Analytics', resource: 'analytics', action: 'read' },
    
    // System Settings
    { id: 'settings_manage', name: 'Manage Settings', resource: 'settings', action: 'manage' },
    { id: 'integrations_manage', name: 'Manage Integrations', resource: 'integrations', action: 'manage' },
    { id: 'billing_read', name: 'View Billing', resource: 'billing', action: 'read' },
    
    // Content Management
    { id: 'broadcasts_manage', name: 'Manage Broadcasts', resource: 'broadcasts', action: 'manage' },
    { id: 'polls_manage', name: 'Manage Polls', resource: 'polls', action: 'manage' },
    { id: 'flows_manage', name: 'Manage Flows', resource: 'flows', action: 'manage' },
    { id: 'templates_manage', name: 'Manage Templates', resource: 'templates', action: 'manage' },
    
    // Channels
    { id: 'channels_manage', name: 'Manage Channels', resource: 'channels', action: 'manage' },
    { id: 'webhooks_manage', name: 'Manage Webhooks', resource: 'webhooks', action: 'manage' },
    
    // Team Management
    { id: 'team_manage', name: 'Manage Team', resource: 'team', action: 'manage' },
    { id: 'roles_read', name: 'View Roles', resource: 'roles', action: 'read' },
    { id: 'audit_logs_read', name: 'View Audit Logs', resource: 'audit_logs', action: 'read' }
  ],
  
  MANAGER: [
    // Bot Management
    { id: 'bots_read', name: 'View Bots', resource: 'bots', action: 'read' },
    { id: 'bots_create', name: 'Create Bots', resource: 'bots', action: 'create' },
    { id: 'bots_update', name: 'Edit Bots', resource: 'bots', action: 'update' },
    { id: 'bots_delete', name: 'Delete Bots', resource: 'bots', action: 'delete' },
    
    // Conversation Management
    { id: 'conversations_read', name: 'View Conversations', resource: 'conversations', action: 'read' },
    { id: 'conversations_update', name: 'Manage Conversations', resource: 'conversations', action: 'update' },
    
    // Analytics
    { id: 'analytics_read', name: 'View Analytics', resource: 'analytics', action: 'read' },
    { id: 'analytics_export', name: 'Export Analytics', resource: 'analytics', action: 'export' },
    
    // Content Management
    { id: 'broadcasts_read', name: 'View Broadcasts', resource: 'broadcasts', action: 'read' },
    { id: 'broadcasts_create', name: 'Create Broadcasts', resource: 'broadcasts', action: 'create' },
    { id: 'broadcasts_update', name: 'Edit Broadcasts', resource: 'broadcasts', action: 'update' },
    
    { id: 'polls_read', name: 'View Polls', resource: 'polls', action: 'read' },
    { id: 'polls_create', name: 'Create Polls', resource: 'polls', action: 'create' },
    { id: 'polls_update', name: 'Edit Polls', resource: 'polls', action: 'update' },
    
    { id: 'flows_read', name: 'View Flows', resource: 'flows', action: 'read' },
    { id: 'flows_create', name: 'Create Flows', resource: 'flows', action: 'create' },
    { id: 'flows_update', name: 'Edit Flows', resource: 'flows', action: 'update' },
    { id: 'flows_delete', name: 'Delete Flows', resource: 'flows', action: 'delete' },
    
    { id: 'templates_read', name: 'View Templates', resource: 'templates', action: 'read' },
    { id: 'templates_create', name: 'Create Templates', resource: 'templates', action: 'create' },
    { id: 'templates_update', name: 'Edit Templates', resource: 'templates', action: 'update' },
    
    // Channels
    { id: 'channels_read', name: 'View Channels', resource: 'channels', action: 'read' },
    { id: 'channels_update', name: 'Edit Channels', resource: 'channels', action: 'update' },
    
    // Team Management (limited)
    { id: 'team_read', name: 'View Team', resource: 'team', action: 'read' },
    { id: 'team_invite', name: 'Invite Team Members', resource: 'team', action: 'invite' }
  ],
  
  AGENT: [
    // Conversations
    { id: 'conversations_read', name: 'View Conversations', resource: 'conversations', action: 'read' },
    { id: 'conversations_update', name: 'Respond to Conversations', resource: 'conversations', action: 'update' },
    
    // Limited Bot Access
    { id: 'bots_read', name: 'View Assigned Bots', resource: 'bots', action: 'read' },
    
    // Templates
    { id: 'templates_read', name: 'View Templates', resource: 'templates', action: 'read' },
    
    // Limited Analytics
    { id: 'analytics_read', name: 'View Personal Analytics', resource: 'analytics', action: 'read' }
  ],
  
  VIEWER: [
    // Read-only access
    { id: 'bots_read', name: 'View Bots', resource: 'bots', action: 'read' },
    { id: 'conversations_read', name: 'View Conversations', resource: 'conversations', action: 'read' },
    { id: 'analytics_read', name: 'View Analytics', resource: 'analytics', action: 'read' },
    { id: 'broadcasts_read', name: 'View Broadcasts', resource: 'broadcasts', action: 'read' },
    { id: 'polls_read', name: 'View Polls', resource: 'polls', action: 'read' }
  ],
  
  CLIENT: [
    // Minimal access
    { id: 'profile_read', name: 'View Profile', resource: 'users', action: 'read' },
    { id: 'settings_read', name: 'View Settings', resource: 'settings', action: 'read' },
    { id: 'billing_read', name: 'View Billing', resource: 'billing', action: 'read' }
  ]
};

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  ROOT_OWNER: 110,
  SUPER_ADMIN: 100,
  ADMIN: 80,
  MANAGER: 60,
  AGENT: 40,
  VIEWER: 20,
  CLIENT: 10
};
