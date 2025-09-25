const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock database
const users = [
  {
    id: '1',
    email: 'johnindreica@gmail.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8J8K8K8K8K', // SuperAdmin123!
    name: 'Super Admin',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE'
  }
];

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      'test123',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  
  // Mock response
  res.json({
    success: true,
    message: 'Password reset email sent'
  });
});

app.post('/api/auth/reset-password', (req, res) => {
  const { token, password } = req.body;
  
  // Mock response
  res.json({
    success: true,
    message: 'Password reset successfully'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple Backend running on port ${PORT}`);
  console.log(`📧 Test login: johnindreica@gmail.com / SuperAdmin123!`);
});
