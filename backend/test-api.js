const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

const testApi = async () => {
  console.log('🧪 Testing ChatFlow AI Backend API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get('http://localhost:3001/health');
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: Register User
    console.log('2. Testing User Registration...');
    const registerData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };
    
    try {
      const registerResponse = await axios.post(`${API_BASE}/auth/register`, registerData);
      console.log('✅ Registration:', registerResponse.data);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️  User already exists (expected for testing)');
      } else {
        throw error;
      }
    }
    console.log('');

    // Test 3: Login
    console.log('3. Testing User Login...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginData);
    console.log('✅ Login:', { message: loginResponse.data.message, hasToken: !!loginResponse.data.token });
    
    const token = loginResponse.data.token;
    console.log('');

    // Test 4: Get User Profile
    console.log('4. Testing Get User Profile...');
    const profileResponse = await axios.get(`${API_BASE}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile:', { 
      email: profileResponse.data.user.email,
      name: profileResponse.data.user.name,
      role: profileResponse.data.user.role
    });
    console.log('');

    // Test 5: Update Profile
    console.log('5. Testing Update Profile...');
    const updateData = {
      firstName: 'Updated',
      lastName: 'User',
      company: 'Test Company'
    };
    
    const updateResponse = await axios.put(`${API_BASE}/user/profile`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile Updated:', updateResponse.data.message);
    console.log('');

    // Test 6: Get Usage Stats
    console.log('6. Testing Get Usage Stats...');
    const usageResponse = await axios.get(`${API_BASE}/user/usage`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Usage Stats:', usageResponse.data);
    console.log('');

    // Test 7: Get Subscription
    console.log('7. Testing Get Subscription...');
    try {
      const subscriptionResponse = await axios.get(`${API_BASE}/user/subscription`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Subscription:', subscriptionResponse.data);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('ℹ️  No subscription found (expected for new user)');
      } else {
        throw error;
      }
    }
    console.log('');

    // Test 8: Forgot Password
    console.log('8. Testing Forgot Password...');
    const forgotResponse = await axios.post(`${API_BASE}/auth/forgot-password`, {
      email: 'test@example.com'
    });
    console.log('✅ Forgot Password:', forgotResponse.data.message);
    console.log('');

    console.log('🎉 All API tests completed successfully!');
    console.log('');
    console.log('📋 Test Summary:');
    console.log('✅ Health Check - OK');
    console.log('✅ User Registration - OK');
    console.log('✅ User Login - OK');
    console.log('✅ Get Profile - OK');
    console.log('✅ Update Profile - OK');
    console.log('✅ Get Usage Stats - OK');
    console.log('✅ Get Subscription - OK');
    console.log('✅ Forgot Password - OK');
    console.log('');
    console.log('🚀 Backend API is working correctly!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Make sure the backend server is running on port 3001');
    console.log('2. Check if the database is connected');
    console.log('3. Verify environment variables are set correctly');
    console.log('4. Run: cd backend && npm install && npm run dev');
  }
};

// Run tests
testApi();
