const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    console.log('🔐 Creating SuperAdmin account...');

    // Check if super admin already exists
    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' }
    });

    if (existingSuperAdmin) {
      console.log('⚠️  SuperAdmin already exists:', existingSuperAdmin.email);
      console.log('   If you want to create a new one, delete the existing one first.');
      return;
    }

    // SuperAdmin credentials
    const superAdminData = {
      email: 'superadmin@chatflow.ai',
      password: 'SuperAdmin123!',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      emailVerified: true
    };

    // Hash password
    const hashedPassword = await bcrypt.hash(superAdminData.password, 12);

    // Create SuperAdmin user
    const superAdmin = await prisma.user.create({
      data: {
        email: superAdminData.email,
        password: hashedPassword,
        name: superAdminData.name,
        role: superAdminData.role,
        status: superAdminData.status,
        emailVerified: superAdminData.emailVerified
      }
    });

    // Create SuperAdmin profile
    await prisma.userProfile.create({
      data: {
        userId: superAdmin.id,
        firstName: 'Super',
        lastName: 'Admin',
        company: 'ChatFlow AI',
        timezone: 'UTC',
        language: 'en',
        preferences: {
          theme: 'system',
          notifications: true,
          emailUpdates: true
        }
      }
    });

    // Create initial system settings
    const defaultSettings = [
      {
        key: 'max_users',
        value: 10000,
        updatedBy: superAdmin.id
      },
      {
        key: 'max_bots_per_user',
        value: 50,
        updatedBy: superAdmin.id
      },
      {
        key: 'max_messages_per_day',
        value: 1000000,
        updatedBy: superAdmin.id
      },
      {
        key: 'email_verification_required',
        value: true,
        updatedBy: superAdmin.id
      },
      {
        key: 'registration_enabled',
        value: true,
        updatedBy: superAdmin.id
      },
      {
        key: 'maintenance_mode',
        value: false,
        updatedBy: superAdmin.id
      }
    ];

    for (const setting of defaultSettings) {
      await prisma.systemSettings.create({
        data: setting
      });
    }

    console.log('✅ SuperAdmin created successfully!');
    console.log('');
    console.log('📧 Email:', superAdminData.email);
    console.log('🔑 Password:', superAdminData.password);
    console.log('');
    console.log('🚨 IMPORTANT SECURITY NOTES:');
    console.log('1. Change the default password immediately');
    console.log('2. Enable 2FA if possible');
    console.log('3. Use a secure email address');
    console.log('4. Keep these credentials safe');
    console.log('');
    console.log('🌐 Access SuperAdmin Dashboard:');
    console.log('   http://localhost:8080/superadmin');
    console.log('');
    console.log('🔧 Backend API:');
    console.log('   http://localhost:3001/api/admin/dashboard');

  } catch (error) {
    console.error('❌ Error creating SuperAdmin:', error);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure the database is running');
    console.log('2. Check if Prisma schema is up to date');
    console.log('3. Run: npm run db:push');
    console.log('4. Verify environment variables');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createSuperAdmin();
