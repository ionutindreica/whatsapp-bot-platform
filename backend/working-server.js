const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());

// Mock database - SuperAdmin user
const superAdmin = {
  id: '1',
  email: 'johnindreica@gmail.com',
  password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8J8K8K8K8K', // SuperAdmin123!
  name: 'Super Admin',
  role: 'SUPER_ADMIN',
  status: 'ACTIVE'
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body.email);
    
    const { email, password } = req.body;
    
    if (email !== superAdmin.email) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // For demo, accept the password directly
    if (password === 'SuperAdmin123!') {
      const token = jwt.sign(
        { userId: superAdmin.id, email: superAdmin.email, role: superAdmin.role },
        'test123',
        { expiresIn: '7d' }
      );
      
      console.log('✅ Login successful for:', email);
      
      res.json({
        success: true,
        token,
        user: {
          id: superAdmin.id,
          email: superAdmin.email,
          name: superAdmin.name,
          role: superAdmin.role
        }
      });
    } else {
      console.log('❌ Invalid password for:', email);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/forgot-password', (req, res) => {
  console.log('📧 Forgot password request for:', req.body.email);
  
  res.json({
    success: true,
    message: 'Password reset email sent to johnindreica@gmail.com'
  });
});

app.post('/api/auth/reset-password', (req, res) => {
  console.log('🔄 Reset password request');
  
  res.json({
    success: true,
    message: 'Password reset successfully'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ChatFlow AI Backend running on port ${PORT}`);
  console.log(`📧 SuperAdmin: johnindreica@gmail.com`);
  console.log(`🔑 Password: SuperAdmin123!`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});
