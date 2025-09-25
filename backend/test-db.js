const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Test user query
    const userCount = await prisma.user.count();
    console.log(`📊 Total users in database: ${userCount}`);
    
    // Test SuperAdmin user
    const superAdmin = await prisma.user.findUnique({
      where: { email: 'johnindreica@gmail.com' }
    });
    
    if (superAdmin) {
      console.log('✅ SuperAdmin found:', superAdmin.email);
    } else {
      console.log('❌ SuperAdmin not found');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
