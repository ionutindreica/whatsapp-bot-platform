const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function createSuperAdmin() {
  try {
    console.log('🔐 Creating SuperAdmin account...');

    // Create simple JSON database for demo
    const dbPath = path.join(__dirname, 'demo-db.json');
    let db = { users: [], settings: [] };

    // Check if database exists
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      db = JSON.parse(data);
    }

    // Check if super admin already exists
    const existingSuperAdmin = db.users.find(user => user.role === 'SUPER_ADMIN');

    if (existingSuperAdmin) {
      console.log('⚠️  SuperAdmin already exists:', existingSuperAdmin.email);
      console.log('   If you want to create a new one, delete the existing one first.');
      return;
    }

    // SuperAdmin credentials
    const superAdminData = {
      id: 'superadmin-' + Date.now(),
      email: 'superadmin@chatflow.ai',
      password: 'SuperAdmin123!',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      createdAt: new Date().toISOString()
    };

    // Hash password
    const hashedPassword = await bcrypt.hash(superAdminData.password, 12);

    // Create SuperAdmin user
    const superAdmin = {
      ...superAdminData,
      password: hashedPassword
    };

    db.users.push(superAdmin);

    // Create initial system settings
    const defaultSettings = [
      { key: 'max_users', value: 10000 },
      { key: 'max_bots_per_user', value: 50 },
      { key: 'max_messages_per_day', value: 1000000 },
      { key: 'email_verification_required', value: true },
      { key: 'registration_enabled', value: true },
      { key: 'maintenance_mode', value: false }
    ];

    db.settings = defaultSettings;

    // Save to file
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

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
    console.log('📁 Demo database saved to:', dbPath);

  } catch (error) {
    console.error('❌ Error creating SuperAdmin:', error);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure you have write permissions');
    console.log('2. Check if the directory exists');
    console.log('3. Verify Node.js is installed');
  }
}

// Run the script
createSuperAdmin();
