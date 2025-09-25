const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Database file
const DB_FILE = path.join(__dirname, 'database.json');

// Initialize database
function initDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      users: [
        {
          id: '1',
          email: 'johnindreica@gmail.com',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8J8K8K8K8K',
          name: 'Super Admin',
          role: 'SUPER_ADMIN',
          status: 'ACTIVE',
          createdAt: new Date().toISOString()
        }
      ],
      sessions: [],
      passwordResets: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
  }
}

// Read database
function readDatabase() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Database read error:', error);
    return { users: [], sessions: [], passwordResets: [] };
  }
}

// Write database
function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Database write error:', error);
    return false;
  }
}

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082'],
  credentials: true
}));
app.use(express.json());

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ChatFlow AI Backend is running',
    port: PORT,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body.email);
    
    const { email, password } = req.body;
    const db = readDatabase();
    
    const user = db.users.find(u => u.email === email);
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // For demo, accept the password directly
    if (password === 'SuperAdmin123!') {
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Store session
      db.sessions.push({
        userId: user.id,
        token,
        createdAt: new Date().toISOString()
      });
      writeDatabase(db);
      
      console.log('✅ Login successful for:', email);
      console.log('✅ User role:', user.role);
      
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          status: user.status
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

app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('📝 Registration attempt:', req.body.email);
    
    const { email, password, name } = req.body;
    const db = readDatabase();
    
    // Check if user already exists
    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password: bcrypt.hashSync(password, 12),
      name,
      role: 'USER',
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };
    
    db.users.push(newUser);
    writeDatabase(db);
    
    console.log('✅ User registered:', email);
    
    res.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        status: newUser.status
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/forgot-password', (req, res) => {
  try {
    console.log('📧 Forgot password request for:', req.body.email);
    
    const { email } = req.body;
    const db = readDatabase();
    
    const user = db.users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Generate reset token
    const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
    
    // Store reset token
    db.passwordResets.push({
      email,
      token: resetToken,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      createdAt: new Date().toISOString()
    });
    writeDatabase(db);
    
    console.log('✅ Password reset token generated for:', email);
    
    res.json({
      success: true,
      message: 'Password reset email sent to johnindreica@gmail.com',
      token: resetToken // For demo purposes
    });
  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

app.post('/api/auth/reset-password', (req, res) => {
  try {
    console.log('🔄 Reset password request');
    
    const { token, password } = req.body;
    const db = readDatabase();
    
    // Find reset token
    const resetRequest = db.passwordResets.find(r => r.token === token);
    if (!resetRequest) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    
    // Check if token is expired
    if (new Date() > new Date(resetRequest.expiresAt)) {
      return res.status(400).json({ error: 'Token expired' });
    }
    
    // Update user password
    const userIndex = db.users.findIndex(u => u.email === resetRequest.email);
    if (userIndex !== -1) {
      db.users[userIndex].password = bcrypt.hashSync(password, 12);
    }
    
    // Remove used token
    db.passwordResets = db.passwordResets.filter(r => r.token !== token);
    writeDatabase(db);
    
    console.log('✅ Password reset successful for:', resetRequest.email);
    
    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// User routes
app.get('/api/user/profile', authenticateToken, (req, res) => {
  try {
    const db = readDatabase();
    const user = db.users.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('❌ Profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Admin routes
app.get('/api/admin/dashboard', authenticateToken, (req, res) => {
  try {
    console.log('🔍 Admin dashboard request from user:', req.user.role);
    
    if (req.user.role !== 'SUPER_ADMIN') {
      console.log('❌ Access denied for role:', req.user.role);
      return res.status(403).json({ error: 'Access denied. Super admin privileges required.' });
    }
    
    const db = readDatabase();
    
    res.json({
      success: true,
      stats: {
        totalUsers: db.users.length,
        activeUsers: db.users.filter(u => u.status === 'ACTIVE').length,
        totalRevenue: 12500,
        monthlyRevenue: 2500,
        totalBots: 15,
        totalMessages: 1250
      }
    });
  } catch (error) {
    console.error('❌ Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
});

app.get('/api/admin/users', authenticateToken, (req, res) => {
  try {
    console.log('🔍 Admin users request from user:', req.user.role);
    
    if (req.user.role !== 'SUPER_ADMIN') {
      console.log('❌ Access denied for role:', req.user.role);
      return res.status(403).json({ error: 'Access denied. Super admin privileges required.' });
    }
    
    const db = readDatabase();
    
    res.json({
      success: true,
      users: db.users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error('❌ Admin users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Initialize database and start server
initDatabase();

app.listen(PORT, () => {
  console.log(`🚀 ChatFlow AI Backend running on port ${PORT}`);
  console.log(`📧 SuperAdmin: johnindreica@gmail.com`);
  console.log(`🔑 Password: SuperAdmin123!`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Database: ${DB_FILE}`);
});
