#!/usr/bin/env tsx

import { prisma } from '../lib/prisma';
import { logger } from '../lib/logger';
import { auditLog } from '../lib/audit';
import bcrypt from 'bcryptjs';

async function setupDatabase() {
  logger.info('Setting up database...');

  try {
    // Create default roles
    const defaultRoles = [
      {
        name: 'ROOT_OWNER',
        description: 'System Root Owner with ultimate control',
        permissions: ['SYSTEM_MANAGE_ALL', 'WORKSPACE_MANAGE_ALL', 'USER_MANAGE_ALL', 'BOT_MANAGE_ALL', 'ROOT_ACCESS', 'INFRASTRUCTURE_MANAGE'],
        features: ['MULTI_WORKSPACE', 'SSO_SCIM', 'WHITE_LABEL', 'AI_RAG', 'CUSTOM_GPT', 'DATA_EXPORT', 'ADVANCED_ANALYTICS', 'CUSTOM_ROLES', 'API_UNLIMITED', 'PRIORITY_SUPPORT', 'ROOT_FEATURES'],
        level: 110,
        isSystem: true,
      },
      {
        name: 'SUPER_ADMIN',
        description: 'Global Administrator with full platform management',
        permissions: ['SYSTEM_MANAGE_ALL', 'WORKSPACE_MANAGE_ALL', 'USER_MANAGE_ALL', 'BOT_MANAGE_ALL'],
        features: ['MULTI_WORKSPACE', 'SSO_SCIM', 'WHITE_LABEL', 'AI_RAG', 'CUSTOM_GPT', 'DATA_EXPORT', 'ADVANCED_ANALYTICS', 'CUSTOM_ROLES', 'API_UNLIMITED', 'PRIORITY_SUPPORT'],
        level: 100,
        isSystem: true,
      },
      {
        name: 'ADMIN',
        description: 'Workspace Administrator with full workspace control',
        permissions: ['WORKSPACE_MANAGE_ALL', 'USER_MANAGE_ALL', 'BOT_MANAGE_ALL'],
        features: ['MULTI_WORKSPACE', 'AI_RAG', 'CUSTOM_GPT', 'DATA_EXPORT', 'ADVANCED_ANALYTICS', 'API_UNLIMITED'],
        level: 80,
        isSystem: true,
      },
      {
        name: 'MANAGER',
        description: 'Team Manager with bot and user management',
        permissions: ['USER_MANAGE_ALL', 'BOT_MANAGE_ALL'],
        features: ['AI_RAG', 'CUSTOM_GPT', 'DATA_EXPORT', 'ADVANCED_ANALYTICS'],
        level: 60,
        isSystem: true,
      },
      {
        name: 'AGENT',
        description: 'Support Agent with conversation management',
        permissions: ['BOT_MANAGE_ALL'],
        features: ['AI_RAG', 'CUSTOM_GPT'],
        level: 40,
        isSystem: true,
      },
      {
        name: 'VIEWER',
        description: 'Read-only access to data and reports',
        permissions: ['DATA_READ_ALL'],
        features: ['ADVANCED_ANALYTICS'],
        level: 20,
        isSystem: true,
      },
      {
        name: 'CLIENT',
        description: 'Basic client access',
        permissions: ['DATA_READ_OWN'],
        features: [],
        level: 10,
        isSystem: true,
      },
    ];

    for (const roleData of defaultRoles) {
      await prisma.role.upsert({
        where: { name: roleData.name },
        update: roleData,
        create: roleData,
      });
    }

    logger.info('Default roles created/updated');

    // Create default workspace
    const defaultWorkspace = await prisma.workspace.upsert({
      where: { id: 'default-workspace' },
      update: {
        name: 'Default Workspace',
        domain: 'default',
        planTier: 'ENTERPRISE',
        status: 'ACTIVE',
        settings: {
          timezone: 'UTC',
          language: 'en',
          features: {
            ai: true,
            analytics: true,
            webhooks: true,
          },
        },
        limits: {
          users: -1,
          bots: -1,
          messages: 1000000,
          storage: 1000,
        },
      },
      create: {
        id: 'default-workspace',
        name: 'Default Workspace',
        domain: 'default',
        planTier: 'ENTERPRISE',
        status: 'ACTIVE',
        settings: {
          timezone: 'UTC',
          language: 'en',
          features: {
            ai: true,
            analytics: true,
            webhooks: true,
          },
        },
        limits: {
          users: -1,
          bots: -1,
          messages: 1000000,
          storage: 1000,
        },
      },
    });

    logger.info('Default workspace created/updated');

    // Create root owner user
    const rootOwnerEmail = process.env.ROOT_OWNER_EMAIL || 'admin@example.com';
    const rootOwnerPassword = process.env.ROOT_OWNER_PASSWORD || 'RootOwner123!';
    
    const hashedPassword = await bcrypt.hash(rootOwnerPassword, 12);

    const rootOwner = await prisma.user.upsert({
      where: { email: rootOwnerEmail },
      update: {
        name: 'Root Owner',
        role: 'ROOT_OWNER',
        status: 'ACTIVE',
        planTier: 'ENTERPRISE',
        workspaceId: defaultWorkspace.id,
        permissions: ['SYSTEM_MANAGE_ALL', 'WORKSPACE_MANAGE_ALL', 'USER_MANAGE_ALL', 'BOT_MANAGE_ALL', 'ROOT_ACCESS', 'INFRASTRUCTURE_MANAGE'],
        features: ['MULTI_WORKSPACE', 'SSO_SCIM', 'WHITE_LABEL', 'AI_RAG', 'CUSTOM_GPT', 'DATA_EXPORT', 'ADVANCED_ANALYTICS', 'CUSTOM_ROLES', 'API_UNLIMITED', 'PRIORITY_SUPPORT', 'ROOT_FEATURES'],
        twoFactorEnabled: false,
      },
      create: {
        email: rootOwnerEmail,
        name: 'Root Owner',
        password: hashedPassword,
        role: 'ROOT_OWNER',
        status: 'ACTIVE',
        planTier: 'ENTERPRISE',
        workspaceId: defaultWorkspace.id,
        permissions: ['SYSTEM_MANAGE_ALL', 'WORKSPACE_MANAGE_ALL', 'USER_MANAGE_ALL', 'BOT_MANAGE_ALL', 'ROOT_ACCESS', 'INFRASTRUCTURE_MANAGE'],
        features: ['MULTI_WORKSPACE', 'SSO_SCIM', 'WHITE_LABEL', 'AI_RAG', 'CUSTOM_GPT', 'DATA_EXPORT', 'ADVANCED_ANALYTICS', 'CUSTOM_ROLES', 'API_UNLIMITED', 'PRIORITY_SUPPORT', 'ROOT_FEATURES'],
        twoFactorEnabled: false,
      },
    });

    logger.info('Root owner user created/updated', {
      email: rootOwnerEmail,
      userId: rootOwner.id,
    });

    // Audit log the setup
    await auditLog({
      action: 'SYSTEM_SETUP',
      resource: 'database',
      userId: rootOwner.id,
      metadata: {
        setupVersion: '1.0.0',
        rolesCreated: defaultRoles.length,
        workspaceCreated: defaultWorkspace.id,
      },
    });

    logger.info('Database setup completed successfully');

  } catch (error) {
    logger.error('Database setup failed', {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

async function createIndexes() {
  logger.info('Creating database indexes...');

  try {
    // Create indexes for better performance
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `;
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_users_workspace_id ON users(workspace_id);
    `;
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
    `;
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_workspace_id ON audit_logs(workspace_id);
    `;
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
    `;
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
    `;
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
    `;
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
    `;
    
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
    `;

    logger.info('Database indexes created successfully');
  } catch (error) {
    logger.error('Index creation failed', {
      error: error.message,
    });
    throw error;
  }
}

async function main() {
  try {
    logger.info('Starting database setup...');
    
    await setupDatabase();
    await createIndexes();
    
    logger.info('Database setup completed successfully!');
    
    console.log('\n✅ Setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log('  • Default roles created');
    console.log('  • Default workspace created');
    console.log('  • Root owner user created');
    console.log('  • Database indexes created');
    console.log('\n🔑 Root Owner Credentials:');
    console.log(`  Email: ${process.env.ROOT_OWNER_EMAIL || 'admin@example.com'}`);
    console.log(`  Password: ${process.env.ROOT_OWNER_PASSWORD || 'RootOwner123!'}`);
    console.log('\n🚀 You can now start the application!');
    
  } catch (error) {
    logger.error('Setup failed', {
      error: error.message,
      stack: error.stack,
    });
    
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  main();
}

export { setupDatabase, createIndexes };
