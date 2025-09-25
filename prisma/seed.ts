import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Permissions
  console.log('📝 Creating permissions...');
  const permissions = [
    // System Management
    { key: 'SYSTEM_MANAGE_ALL', name: 'Manage All System', description: 'Full system access', category: 'System Management' },
    { key: 'SYSTEM_CREATE_SUPERADMINS', name: 'Create Super Admins', description: 'Create super admin users', category: 'System Management' },
    { key: 'SYSTEM_DELETE_SUPERADMINS', name: 'Delete Super Admins', description: 'Delete super admin users', category: 'System Management' },
    { key: 'SYSTEM_VIEW_LOGS', name: 'View System Logs', description: 'View system audit logs', category: 'System Management' },
    { key: 'SYSTEM_MANAGE_LICENSES', name: 'Manage Licenses', description: 'Manage system licenses', category: 'System Management' },
    
    // Workspace Management
    { key: 'WORKSPACE_MANAGE_ALL', name: 'Manage All Workspaces', description: 'Full workspace access', category: 'Workspace Management' },
    { key: 'WORKSPACE_CREATE', name: 'Create Workspaces', description: 'Create new workspaces', category: 'Workspace Management' },
    { key: 'WORKSPACE_DELETE', name: 'Delete Workspaces', description: 'Delete workspaces', category: 'Workspace Management' },
    { key: 'WORKSPACE_MANAGE_BILLING', name: 'Manage Billing', description: 'Manage workspace billing', category: 'Workspace Management' },
    { key: 'WORKSPACE_VIEW_ANALYTICS', name: 'View Analytics', description: 'View workspace analytics', category: 'Workspace Management' },
    
    // User Management
    { key: 'USER_MANAGE_ALL', name: 'Manage All Users', description: 'Full user management', category: 'User Management' },
    { key: 'USER_CREATE', name: 'Create Users', description: 'Create new users', category: 'User Management' },
    { key: 'USER_EDIT', name: 'Edit Users', description: 'Edit user information', category: 'User Management' },
    { key: 'USER_DELETE', name: 'Delete Users', description: 'Delete users', category: 'User Management' },
    { key: 'USER_SUSPEND', name: 'Suspend Users', description: 'Suspend user accounts', category: 'User Management' },
    { key: 'USER_ACTIVATE', name: 'Activate Users', description: 'Activate user accounts', category: 'User Management' },
    { key: 'USER_VIEW_DETAILS', name: 'View User Details', description: 'View detailed user information', category: 'User Management' },
    
    // Bot Management
    { key: 'BOT_MANAGE_ALL', name: 'Manage All Bots', description: 'Full bot management', category: 'Bot Management' },
    { key: 'BOT_CREATE', name: 'Create Bots', description: 'Create new bots', category: 'Bot Management' },
    { key: 'BOT_EDIT', name: 'Edit Bots', description: 'Edit bot configuration', category: 'Bot Management' },
    { key: 'BOT_DELETE', name: 'Delete Bots', description: 'Delete bots', category: 'Bot Management' },
    { key: 'BOT_VIEW', name: 'View Bots', description: 'View bot information', category: 'Bot Management' },
    { key: 'BOT_PUBLISH', name: 'Publish Bots', description: 'Publish bots to platforms', category: 'Bot Management' },
    { key: 'BOT_ANALYTICS', name: 'Bot Analytics', description: 'View bot analytics', category: 'Bot Management' },
    
    // Conversation Management
    { key: 'CONVERSATION_MANAGE_ALL', name: 'Manage All Conversations', description: 'Full conversation management', category: 'Conversation Management' },
    { key: 'CONVERSATION_VIEW_ALL', name: 'View All Conversations', description: 'View all conversations', category: 'Conversation Management' },
    { key: 'CONVERSATION_REPLY', name: 'Reply to Conversations', description: 'Reply to conversations', category: 'Conversation Management' },
    { key: 'CONVERSATION_ASSIGN', name: 'Assign Conversations', description: 'Assign conversations to agents', category: 'Conversation Management' },
    { key: 'CONVERSATION_CLOSE', name: 'Close Conversations', description: 'Close conversations', category: 'Conversation Management' },
    { key: 'CONVERSATION_EXPORT', name: 'Export Conversations', description: 'Export conversation data', category: 'Conversation Management' },
    
    // Channel Management
    { key: 'CHANNEL_MANAGE_ALL', name: 'Manage All Channels', description: 'Full channel management', category: 'Channel Management' },
    { key: 'CHANNEL_CONNECT', name: 'Connect Channels', description: 'Connect new channels', category: 'Channel Management' },
    { key: 'CHANNEL_DISCONNECT', name: 'Disconnect Channels', description: 'Disconnect channels', category: 'Channel Management' },
    { key: 'CHANNEL_VIEW_ANALYTICS', name: 'Channel Analytics', description: 'View channel analytics', category: 'Channel Management' },
    
    // Integration Management
    { key: 'INTEGRATION_MANAGE_ALL', name: 'Manage All Integrations', description: 'Full integration management', category: 'Integration Management' },
    { key: 'INTEGRATION_CREATE', name: 'Create Integrations', description: 'Create new integrations', category: 'Integration Management' },
    { key: 'INTEGRATION_EDIT', name: 'Edit Integrations', description: 'Edit integrations', category: 'Integration Management' },
    { key: 'INTEGRATION_DELETE', name: 'Delete Integrations', description: 'Delete integrations', category: 'Integration Management' },
    
    // Broadcast Management
    { key: 'BROADCAST_MANAGE_ALL', name: 'Manage All Broadcasts', description: 'Full broadcast management', category: 'Broadcast Management' },
    { key: 'BROADCAST_CREATE', name: 'Create Broadcasts', description: 'Create new broadcasts', category: 'Broadcast Management' },
    { key: 'BROADCAST_SEND', name: 'Send Broadcasts', description: 'Send broadcast messages', category: 'Broadcast Management' },
    { key: 'BROADCAST_VIEW_ANALYTICS', name: 'Broadcast Analytics', description: 'View broadcast analytics', category: 'Broadcast Management' },
    
    // Analytics & Reporting
    { key: 'ANALYTICS_VIEW_ALL', name: 'View All Analytics', description: 'View all analytics data', category: 'Analytics & Reporting' },
    { key: 'ANALYTICS_EXPORT', name: 'Export Analytics', description: 'Export analytics data', category: 'Analytics & Reporting' },
    { key: 'ANALYTICS_CUSTOM_REPORTS', name: 'Custom Reports', description: 'Create custom reports', category: 'Analytics & Reporting' },
    
    // API Management
    { key: 'API_MANAGE_KEYS', name: 'Manage API Keys', description: 'Manage API keys', category: 'API Management' },
    { key: 'API_VIEW_USAGE', name: 'View API Usage', description: 'View API usage statistics', category: 'API Management' },
    { key: 'API_RATE_LIMIT_MANAGE', name: 'Manage Rate Limits', description: 'Manage API rate limits', category: 'API Management' }
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { key: permission.key },
      update: permission,
      create: permission,
    });
  }

  // Create Roles
  console.log('👑 Creating roles...');
  
  // Root Owner Role
  const rootRole = await prisma.role.upsert({
    where: { name: 'ROOT_OWNER' },
    update: {},
    create: {
      name: 'ROOT_OWNER',
      description: 'System Owner - Creator of the platform',
      level: 100,
      isSystem: true,
    },
  });

  // Super Admin Role
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: {
      name: 'SUPER_ADMIN',
      description: 'Global Administrator',
      level: 90,
      isSystem: true,
    },
  });

  // Owner Role
  const ownerRole = await prisma.role.upsert({
    where: { name: 'OWNER' },
    update: {},
    create: {
      name: 'OWNER',
      description: 'Workspace Owner / Account Admin',
      level: 80,
      isSystem: true,
    },
  });

  // Manager Role
  const managerRole = await prisma.role.upsert({
    where: { name: 'MANAGER' },
    update: {},
    create: {
      name: 'MANAGER',
      description: 'Team Admin / Manager',
      level: 70,
      isSystem: true,
    },
  });

  // Agent Role
  const agentRole = await prisma.role.upsert({
    where: { name: 'AGENT' },
    update: {},
    create: {
      name: 'AGENT',
      description: 'Agent / Member',
      level: 60,
      isSystem: true,
    },
  });

  // Viewer Role
  const viewerRole = await prisma.role.upsert({
    where: { name: 'VIEWER' },
    update: {},
    create: {
      name: 'VIEWER',
      description: 'Viewer / Guest',
      level: 50,
      isSystem: true,
    },
  });

  // Assign permissions to roles
  console.log('🔗 Assigning permissions to roles...');

  // Root Owner gets all permissions
  const allPermissions = await prisma.permission.findMany();
  await prisma.role.update({
    where: { id: rootRole.id },
    data: {
      permissions: {
        connect: allPermissions.map(p => ({ id: p.id })),
      },
    },
  });

  // Super Admin permissions (all except system management)
  const superAdminPermissions = allPermissions.filter(p => 
    !p.key.includes('SYSTEM_CREATE_SUPERADMINS') && 
    !p.key.includes('SYSTEM_DELETE_SUPERADMINS') &&
    !p.key.includes('SYSTEM_MANAGE_LICENSES')
  );
  await prisma.role.update({
    where: { id: superAdminRole.id },
    data: {
      permissions: {
        connect: superAdminPermissions.map(p => ({ id: p.id })),
      },
    },
  });

  // Owner permissions (workspace-level management)
  const ownerPermissions = allPermissions.filter(p => 
    p.key.includes('USER_') ||
    p.key.includes('BOT_') ||
    p.key.includes('CONVERSATION_') ||
    p.key.includes('CHANNEL_') ||
    p.key.includes('INTEGRATION_') ||
    p.key.includes('BROADCAST_') ||
    p.key.includes('ANALYTICS_') ||
    p.key.includes('API_MANAGE_KEYS') ||
    p.key.includes('API_VIEW_USAGE')
  );
  await prisma.role.update({
    where: { id: ownerRole.id },
    data: {
      permissions: {
        connect: ownerPermissions.map(p => ({ id: p.id })),
      },
    },
  });

  // Manager permissions
  const managerPermissions = allPermissions.filter(p => 
    p.key.includes('USER_CREATE') ||
    p.key.includes('USER_EDIT') ||
    p.key.includes('USER_VIEW_DETAILS') ||
    p.key.includes('BOT_CREATE') ||
    p.key.includes('BOT_EDIT') ||
    p.key.includes('BOT_VIEW') ||
    p.key.includes('BOT_PUBLISH') ||
    p.key.includes('BOT_ANALYTICS') ||
    p.key.includes('CONVERSATION_VIEW_ALL') ||
    p.key.includes('CONVERSATION_REPLY') ||
    p.key.includes('CONVERSATION_ASSIGN') ||
    p.key.includes('CONVERSATION_CLOSE') ||
    p.key.includes('CHANNEL_CONNECT') ||
    p.key.includes('CHANNEL_VIEW_ANALYTICS') ||
    p.key.includes('INTEGRATION_CREATE') ||
    p.key.includes('INTEGRATION_EDIT') ||
    p.key.includes('BROADCAST_CREATE') ||
    p.key.includes('BROADCAST_SEND') ||
    p.key.includes('BROADCAST_VIEW_ANALYTICS') ||
    p.key.includes('ANALYTICS_VIEW_ALL') ||
    p.key.includes('ANALYTICS_EXPORT')
  );
  await prisma.role.update({
    where: { id: managerRole.id },
    data: {
      permissions: {
        connect: managerPermissions.map(p => ({ id: p.id })),
      },
    },
  });

  // Agent permissions
  const agentPermissions = allPermissions.filter(p => 
    p.key.includes('BOT_VIEW') ||
    p.key.includes('BOT_ANALYTICS') ||
    p.key.includes('CONVERSATION_REPLY') ||
    p.key.includes('CONVERSATION_CLOSE') ||
    p.key.includes('CHANNEL_VIEW_ANALYTICS') ||
    p.key.includes('ANALYTICS_VIEW_ALL')
  );
  await prisma.role.update({
    where: { id: agentRole.id },
    data: {
      permissions: {
        connect: agentPermissions.map(p => ({ id: p.id })),
      },
    },
  });

  // Viewer permissions
  const viewerPermissions = allPermissions.filter(p => 
    p.key.includes('BOT_VIEW') ||
    p.key.includes('CONVERSATION_VIEW_ALL') ||
    p.key.includes('CHANNEL_VIEW_ANALYTICS') ||
    p.key.includes('ANALYTICS_VIEW_ALL')
  );
  await prisma.role.update({
    where: { id: viewerRole.id },
    data: {
      permissions: {
        connect: viewerPermissions.map(p => ({ id: p.id })),
      },
    },
  });

  // Create Plans
  console.log('💰 Creating plans...');

  const starterPlan = await prisma.plan.upsert({
    where: { name: 'starter' },
    update: {},
    create: {
      name: 'starter',
      displayName: 'Starter',
      description: 'Perfect for small teams getting started',
      price: 2900, // $29/month
      currency: 'USD',
      interval: 'month',
      features: JSON.stringify({
        'MULTI_WORKSPACE': false,
        'SSO_SCIM': false,
        'WHITE_LABEL': false,
        'AI_RAG': false,
        'CUSTOM_GPT': false,
        'DATA_EXPORT': false,
        'ADVANCED_ANALYTICS': false,
        'CUSTOM_ROLES': false,
        'API_UNLIMITED': false,
        'PRIORITY_SUPPORT': false
      }),
      limits: JSON.stringify({
        'activeBots': 1,
        'channels': 2,
        'conversationsPerMonth': 1000,
        'apiRequestsPerDay': 100,
        'users': 5,
        'workspaces': 1
      }),
    },
  });

  const proPlan = await prisma.plan.upsert({
    where: { name: 'pro' },
    update: {},
    create: {
      name: 'pro',
      displayName: 'Pro',
      description: 'Advanced features for growing businesses',
      price: 9900, // $99/month
      currency: 'USD',
      interval: 'month',
      features: JSON.stringify({
        'MULTI_WORKSPACE': true,
        'SSO_SCIM': false,
        'WHITE_LABEL': false,
        'AI_RAG': true,
        'CUSTOM_GPT': true,
        'DATA_EXPORT': true,
        'ADVANCED_ANALYTICS': true,
        'CUSTOM_ROLES': false,
        'API_UNLIMITED': false,
        'PRIORITY_SUPPORT': false
      }),
      limits: JSON.stringify({
        'activeBots': 5,
        'channels': 4,
        'conversationsPerMonth': 10000,
        'apiRequestsPerDay': 1000,
        'users': 25,
        'workspaces': 3
      }),
    },
  });

  const enterprisePlan = await prisma.plan.upsert({
    where: { name: 'enterprise' },
    update: {},
    create: {
      name: 'enterprise',
      displayName: 'Enterprise',
      description: 'Complete solution for large organizations',
      price: 29900, // $299/month
      currency: 'USD',
      interval: 'month',
      features: JSON.stringify({
        'MULTI_WORKSPACE': true,
        'SSO_SCIM': true,
        'WHITE_LABEL': true,
        'AI_RAG': true,
        'CUSTOM_GPT': true,
        'DATA_EXPORT': true,
        'ADVANCED_ANALYTICS': true,
        'CUSTOM_ROLES': true,
        'API_UNLIMITED': true,
        'PRIORITY_SUPPORT': true
      }),
      limits: JSON.stringify({
        'activeBots': 'unlimited',
        'channels': 'unlimited',
        'conversationsPerMonth': 'unlimited',
        'apiRequestsPerDay': 'unlimited',
        'users': 'unlimited',
        'workspaces': 'unlimited'
      }),
    },
  });

  // Create default workspace
  console.log('🏢 Creating default workspace...');
  const defaultWorkspace = await prisma.workspace.upsert({
    where: { id: 'default-workspace' },
    update: {},
    create: {
      id: 'default-workspace',
      name: 'Default Workspace',
      planId: proPlan.id,
    },
  });

  // Create default users
  console.log('👤 Creating default users...');
  
  // Root Owner
  const rootOwner = await prisma.user.upsert({
    where: { email: 'root@platform.com' },
    update: {},
    create: {
      email: 'root@platform.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8J8K8K8K8K', // SuperAdmin123!
      name: 'Root Owner',
      roleId: rootRole.id,
    },
  });

  // Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'johnindreica@gmail.com' },
    update: {},
    create: {
      email: 'johnindreica@gmail.com',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8J8K8K8K8K', // SuperAdmin123!
      name: 'Super Admin',
      roleId: superAdminRole.id,
    },
  });

  // Add users to workspace
  await prisma.workspaceMember.upsert({
    where: {
      userId_workspaceId: {
        userId: superAdmin.id,
        workspaceId: defaultWorkspace.id,
      },
    },
    update: {},
    create: {
      userId: superAdmin.id,
      workspaceId: defaultWorkspace.id,
      role: 'OWNER',
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('🔑 Default users created:');
  console.log('   Root Owner: root@platform.com');
  console.log('   Super Admin: johnindreica@gmail.com');
  console.log('   Password: SuperAdmin123!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
