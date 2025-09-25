// Database types based on Prisma schema
export interface User {
  id: string;
  email: string;
  password: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
  roleId: string;
  role: Role;
  workspaces: WorkspaceMember[];
  sessions: Session[];
  auditLogs: AuditLog[];
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  level: number;
  permissions: Permission[];
  users: User[];
  isSystem: boolean;
}

export interface Permission {
  id: string;
  key: string;
  name: string;
  description: string | null;
  category: string;
  roles: Role[];
}

export interface Workspace {
  id: string;
  name: string;
  planId: string;
  plan: Plan;
  createdAt: Date;
  updatedAt: Date;
  members: WorkspaceMember[];
  bots: Bot[];
  conversations: Conversation[];
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: WorkspaceRole;
  user: User;
  workspace: Workspace;
  createdAt: Date;
  updatedAt: Date;
}

export interface Plan {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  price: number;
  currency: string;
  interval: string;
  features: Record<string, boolean>;
  limits: Record<string, number | string>;
  workspaces: Workspace[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bot {
  id: string;
  name: string;
  platform: Platform;
  workspaceId: string;
  workspace: Workspace;
  config: Record<string, any>;
  status: BotStatus;
  createdAt: Date;
  updatedAt: Date;
  conversations: Conversation[];
}

export interface Conversation {
  id: string;
  workspaceId: string;
  botId: string | null;
  workspace: Workspace;
  bot: Bot | null;
  platform: Platform;
  status: ConversationStatus;
  metadata: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  conversation: Conversation;
  content: string;
  role: MessageRole;
  metadata: Record<string, any> | null;
  createdAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  user: User;
  token: string;
  ip: string | null;
  userAgent: string | null;
  createdAt: Date;
  expiresAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  user: User | null;
  action: string;
  resource: string;
  resourceId: string | null;
  metadata: Record<string, any> | null;
  ip: string | null;
  userAgent: string | null;
  createdAt: Date;
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  workspaceId: string | null;
  permissions: Record<string, any> | null;
  lastUsed: Date | null;
  expiresAt: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  workspaceId: string | null;
  events: Record<string, any>;
  secret: string | null;
  isActive: boolean;
  lastTriggered: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string | null;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  metadata: Record<string, any> | null;
  createdAt: Date;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string | null;
  content: string;
  tags: Record<string, any> | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Broadcast {
  id: string;
  name: string;
  message: string;
  workspaceId: string | null;
  status: BroadcastStatus;
  scheduledAt: Date | null;
  sentAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Poll {
  id: string;
  title: string;
  description: string | null;
  options: Record<string, any>;
  type: PollType;
  status: PollStatus;
  workspaceId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Trigger {
  id: string;
  name: string;
  type: TriggerType;
  conditions: Record<string, any>;
  actions: Record<string, any>;
  isActive: boolean;
  workspaceId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Flow {
  id: string;
  name: string;
  description: string | null;
  nodes: Record<string, any>;
  edges: Record<string, any>;
  status: FlowStatus;
  workspaceId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  config: Record<string, any>;
  workspaceId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  id: string;
  workspaceId: string | null;
  metric: string;
  value: number;
  date: Date;
  metadata: Record<string, any> | null;
  createdAt: Date;
}

export interface BillingInfo {
  id: string;
  workspaceId: string;
  customerId: string | null;
  subscriptionId: string | null;
  planId: string;
  status: BillingStatus;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamInvite {
  id: string;
  email: string;
  workspaceId: string;
  role: WorkspaceRole;
  token: string;
  expiresAt: Date;
  acceptedAt: Date | null;
  createdAt: Date;
}

// Enums
export enum WorkspaceRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  AGENT = 'AGENT',
  VIEWER = 'VIEWER',
  GUEST = 'GUEST'
}

export enum Platform {
  WHATSAPP = 'WHATSAPP',
  FACEBOOK_MESSENGER = 'FACEBOOK_MESSENGER',
  INSTAGRAM = 'INSTAGRAM',
  WEB_CHAT = 'WEB_CHAT',
  TELEGRAM = 'TELEGRAM',
  EMAIL = 'EMAIL',
  SMS = 'SMS'
}

export enum BotStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED'
}

export enum ConversationStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ENDED = 'ENDED',
  ARCHIVED = 'ARCHIVED'
}

export enum MessageRole {
  USER = 'USER',
  ASSISTANT = 'ASSISTANT',
  SYSTEM = 'SYSTEM'
}

export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export enum BroadcastStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  SENDING = 'SENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum PollType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TEXT = 'TEXT',
  RATING = 'RATING'
}

export enum PollStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED'
}

export enum TriggerType {
  KEYWORD = 'KEYWORD',
  INTENT = 'INTENT',
  ENTITY = 'ENTITY',
  TIME = 'TIME',
  EVENT = 'EVENT',
  WEBHOOK = 'WEBHOOK'
}

export enum FlowStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED'
}

export enum BillingStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  PAST_DUE = 'PAST_DUE',
  UNPAID = 'UNPAID',
  TRIALING = 'TRIALING'
}

// Utility types for API responses
export interface UserWithRole extends Omit<User, 'password'> {
  role: Role & {
    permissions: Permission[];
  };
}

export interface WorkspaceWithPlan extends Workspace {
  plan: Plan;
  members: (WorkspaceMember & {
    user: UserWithRole;
  })[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: {
    id: string;
    name: string;
    level: number;
    permissions: Permission[];
  };
  workspace?: {
    id: string;
    name: string;
    role: WorkspaceRole;
    plan: {
      name: string;
      features: Record<string, boolean>;
      limits: Record<string, number | string>;
    };
  };
}
