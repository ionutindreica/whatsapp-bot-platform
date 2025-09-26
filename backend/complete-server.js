const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Database file
const DB_FILE = path.join(__dirname, 'database.json');

// Email configuration
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Initialize database
function initDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      users: [
        {
          id: '1',
          email: 'johnindreica@gmail.com',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8J8K8K8K8K',
          name: 'Root Owner',
          role: 'ROOT_OWNER',
          planTier: 'ENTERPRISE',
          workspaceId: null,
          permissions: ['SYSTEM_MANAGE_ALL', 'WORKSPACE_MANAGE_ALL', 'USER_MANAGE_ALL', 'BOT_MANAGE_ALL', 'ROOT_ACCESS', 'INFRASTRUCTURE_MANAGE'],
          features: ['MULTI_WORKSPACE', 'SSO_SCIM', 'WHITE_LABEL', 'AI_RAG', 'CUSTOM_GPT', 'DATA_EXPORT', 'ADVANCED_ANALYTICS', 'CUSTOM_ROLES', 'API_UNLIMITED', 'PRIORITY_SUPPORT', 'ROOT_FEATURES'],
          status: 'ACTIVE',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          email: 'root@platform.com',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8J8K8K8K8K',
          name: 'Root Owner',
          role: 'ROOT_OWNER',
          planTier: 'ENTERPRISE',
          workspaceId: null,
          permissions: ['SYSTEM_MANAGE_ALL', 'SYSTEM_CREATE_SUPERADMINS', 'SYSTEM_DELETE_SUPERADMINS'],
          features: ['MULTI_WORKSPACE', 'SSO_SCIM', 'WHITE_LABEL', 'AI_RAG', 'CUSTOM_GPT', 'DATA_EXPORT', 'ADVANCED_ANALYTICS', 'CUSTOM_ROLES', 'API_UNLIMITED', 'PRIORITY_SUPPORT'],
          status: 'ACTIVE',
          createdAt: new Date().toISOString()
        }
      ],
      workspaces: [
        {
          id: 'ws-1',
          name: 'Default Workspace',
          planTier: 'PRO',
          ownerId: '1',
          isActive: true,
          limits: {
            activeBots: 5,
            channels: 4,
            conversationsPerMonth: 10000,
            apiRequestsPerDay: 1000,
            users: 25,
            workspaces: 3
          },
          features: ['MULTI_WORKSPACE', 'AI_RAG', 'CUSTOM_GPT', 'DATA_EXPORT', 'ADVANCED_ANALYTICS'],
          createdAt: new Date().toISOString()
        }
      ],
      sessions: [],
      passwordResets: [],
      auditLogs: [],
      blockedIPs: [],
      customRoles: []
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
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082'],
  credentials: true
}));
app.use(express.json());

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  console.log('🔐 Auth attempt:', { authHeader: authHeader ? 'present' : 'missing', token: token ? 'present' : 'missing' });

  if (!token) {
    console.log('❌ No token provided');
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
    console.log('🔍 Received password:', password);
    console.log('🔍 Expected password: SuperAdmin123!');
    console.log('🔍 Passwords match:', password === 'SuperAdmin123!');
    
    if (password === 'SuperAdmin123!') {
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Update user's last login
      const userIndex = db.users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        db.users[userIndex].lastLoginAt = new Date().toISOString();
      }
      
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

app.get('/api/user/usage', authenticateToken, (req, res) => {
  try {
    console.log('📊 User usage request from:', req.user.email);
    
    const db = readDatabase();
    const user = db.users.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Mock usage data based on user role
    const usageData = {
      totalUsers: user.role === 'SUPER_ADMIN' ? db.users.length : 1,
      activeUsers: user.role === 'SUPER_ADMIN' ? db.users.filter(u => u.status === 'ACTIVE').length : 1,
      totalRevenue: user.role === 'SUPER_ADMIN' ? 12500 : 0,
      monthlyRevenue: user.role === 'SUPER_ADMIN' ? 2500 : 0,
      totalBots: user.role === 'SUPER_ADMIN' ? 15 : 3,
      totalMessages: user.role === 'SUPER_ADMIN' ? 1250 : 45
    };
    
    res.json(usageData);
  } catch (error) {
    console.error('❌ Usage error:', error);
    res.status(500).json({ error: 'Failed to get usage data' });
  }
});

app.get('/api/bots', authenticateToken, (req, res) => {
  try {
    console.log('🤖 Bots request from:', req.user.email);
    
    // Mock bots data
    const bots = [
      {
        id: '1',
        name: 'Customer Support Bot',
        status: 'ACTIVE',
        channels: ['whatsapp', 'instagram'],
        messages: 1250,
        users: 45,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Sales Assistant',
        status: 'ACTIVE',
        channels: ['whatsapp', 'messenger'],
        messages: 890,
        users: 32,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Lead Generation Bot',
        status: 'PAUSED',
        channels: ['website', 'instagram'],
        messages: 456,
        users: 18,
        createdAt: new Date().toISOString()
      }
    ];
    
    res.json({
      success: true,
      bots: bots
    });
  } catch (error) {
    console.error('❌ Bots error:', error);
    res.status(500).json({ error: 'Failed to get bots' });
  }
});

app.post('/api/bots/:id/toggle', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔄 Toggle bot request for:', id);
    
    // Mock toggle response
    res.json({
      success: true,
      message: 'Bot status updated successfully'
    });
  } catch (error) {
    console.error('❌ Toggle bot error:', error);
    res.status(500).json({ error: 'Failed to toggle bot' });
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
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
      }))
    });
  } catch (error) {
    console.error('❌ Admin users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Initialize database and start server
initDatabase();

// OAuth Routes
app.get('/api/auth/oauth/:provider', (req, res) => {
  const { provider } = req.params;
  const state = Math.random().toString(36).substring(7);
  
  // Store state for verification
  const db = readDatabase();
  db.oauthStates = db.oauthStates || [];
  db.oauthStates.push({
    state,
    provider,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
  });
  writeDatabase(db);

  const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/oauth/${provider}/callback`;
  
  let authUrl = '';
  switch (provider) {
    case 'google':
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${process.env.GOOGLE_CLIENT_ID || 'demo-client-id'}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=email profile&` +
        `response_type=code&` +
        `state=${state}`;
      break;
    case 'microsoft':
      authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
        `client_id=${process.env.MICROSOFT_CLIENT_ID || 'demo-client-id'}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=openid email profile&` +
        `response_type=code&` +
        `state=${state}`;
      break;
    case 'apple':
      authUrl = `https://appleid.apple.com/auth/authorize?` +
        `client_id=${process.env.APPLE_CLIENT_ID || 'demo-client-id'}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=name email&` +
        `response_type=code&` +
        `state=${state}`;
      break;
    case 'github':
      authUrl = `https://github.com/login/oauth/authorize?` +
        `client_id=${process.env.GITHUB_CLIENT_ID || 'demo-client-id'}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=user:email&` +
        `state=${state}`;
      break;
    default:
      return res.status(400).json({ error: 'Unsupported OAuth provider' });
  }
  
  res.redirect(authUrl);
});

app.get('/api/auth/oauth/:provider/callback', async (req, res) => {
  const { provider } = req.params;
  const { code, state } = req.query;
  
  // Verify state
  const db = readDatabase();
  const stateRecord = db.oauthStates?.find(s => s.state === state && s.provider === provider);
  
  if (!stateRecord || new Date(stateRecord.expiresAt) < new Date()) {
    return res.send(`
      <script>
        window.opener.postMessage({ type: 'OAUTH_ERROR', error: 'Invalid or expired state' }, '*');
        window.close();
      </script>
    `);
  }
  
  // Remove used state
  db.oauthStates = db.oauthStates.filter(s => s.state !== state);
  writeDatabase(db);
  
  try {
    let userInfo;
    
    // Exchange code for token and get user info
    switch (provider) {
      case 'google':
        userInfo = await exchangeGoogleCode(code);
        break;
      case 'microsoft':
        userInfo = await exchangeMicrosoftCode(code);
        break;
      case 'apple':
        userInfo = await exchangeAppleCode(code);
        break;
      case 'github':
        userInfo = await exchangeGitHubCode(code);
        break;
      default:
        throw new Error('Unsupported provider');
    }
    
    // Find or create user
    let user = db.users.find(u => u.email === userInfo.email);
    
    if (!user) {
      // Create new user from OAuth
      user = {
        id: Date.now().toString(),
        email: userInfo.email,
        name: userInfo.name || userInfo.email,
        role: 'USER',
        status: 'ACTIVE',
        provider: provider,
        providerId: userInfo.id,
        createdAt: new Date().toISOString()
      };
      db.users.push(user);
      writeDatabase(db);
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Store session
    db.sessions.push({
      userId: user.id,
      token,
      provider,
      createdAt: new Date().toISOString()
    });
    writeDatabase(db);
    
    res.send(`
      <script>
        window.opener.postMessage({ 
          type: 'OAUTH_SUCCESS', 
          token: '${token}',
          user: ${JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status
          })}
        }, '*');
        window.close();
      </script>
    `);
    
  } catch (error) {
    console.error('OAuth error:', error);
    res.send(`
      <script>
        window.opener.postMessage({ type: 'OAUTH_ERROR', error: 'Authentication failed' }, '*');
        window.close();
      </script>
    `);
  }
});

// OAuth Helper Functions
async function exchangeGoogleCode(code) {
  // In production, exchange code for access token
  // For demo, return mock user info
  return {
    id: 'google_' + Math.random().toString(36).substring(7),
    email: 'user@gmail.com',
    name: 'Google User'
  };
}

async function exchangeMicrosoftCode(code) {
  return {
    id: 'microsoft_' + Math.random().toString(36).substring(7),
    email: 'user@outlook.com',
    name: 'Microsoft User'
  };
}

async function exchangeAppleCode(code) {
  return {
    id: 'apple_' + Math.random().toString(36).substring(7),
    email: 'user@icloud.com',
    name: 'Apple User'
  };
}

async function exchangeGitHubCode(code) {
  return {
    id: 'github_' + Math.random().toString(36).substring(7),
    email: 'user@github.com',
    name: 'GitHub User'
  };
}

// 2FA Routes
app.post('/api/auth/2fa/totp/setup', authenticateToken, (req, res) => {
  // Generate TOTP secret and QR code
  const secret = 'DEMO_SECRET_' + Math.random().toString(36).substring(7);
  const qrCode = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;
  
  res.json({ secret, qrCode });
});

app.post('/api/auth/2fa/totp/verify', authenticateToken, (req, res) => {
  const { code, secret } = req.body;
  
  // In production, verify TOTP code
  if (code === '123456') {
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid verification code' });
  }
});

app.post('/api/auth/2fa/sms/setup', authenticateToken, (req, res) => {
  const { phoneNumber } = req.body;
  
  // In production, send SMS
  console.log(`📱 SMS sent to ${phoneNumber}: Your verification code is 123456`);
  
  res.json({ success: true, message: 'SMS sent' });
});

app.post('/api/auth/2fa/sms/verify', authenticateToken, (req, res) => {
  const { code, phoneNumber } = req.body;
  
  // In production, verify SMS code
  if (code === '123456') {
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid SMS code' });
  }
});

app.post('/api/auth/2fa/email/setup', authenticateToken, (req, res) => {
  // In production, send email
  console.log(`📧 Email sent to ${req.user.email}: Your verification code is 123456`);
  
  res.json({ success: true, message: 'Email sent' });
});

app.post('/api/auth/2fa/email/verify', authenticateToken, (req, res) => {
  const { code } = req.body;
  
  // In production, verify email code
  if (code === '123456') {
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid email code' });
  }
});

app.post('/api/auth/2fa/verify', (req, res) => {
  const { email, code, method } = req.body;
  
  // In production, verify 2FA code
  if (code === '123456') {
    const db = readDatabase();
    const user = db.users.find(u => u.email === email);
    
    if (user) {
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.json({ success: true, token });
    } else {
      res.status(400).json({ error: 'User not found' });
    }
  } else {
    res.status(400).json({ error: 'Invalid verification code' });
  }
});

app.post('/api/auth/2fa/resend', (req, res) => {
  const { email, method } = req.body;
  
  // In production, resend code
  console.log(`📧 Resending ${method} code to ${email}: 123456`);
  
  res.json({ success: true, message: 'Code resent' });
});

app.post('/api/auth/2fa/backup-codes', authenticateToken, (req, res) => {
  // Generate backup codes
  const codes = Array.from({ length: 10 }, () => 
    Math.random().toString(36).substring(2, 8).toUpperCase()
  );
  
  res.json({ codes });
});

// Magic Link Routes
app.post('/api/auth/magic-link', async (req, res) => {
  const { email } = req.body;
  
  try {
    // Generate magic link
    const magicToken = jwt.sign({ email, type: 'magic-link' }, JWT_SECRET, { expiresIn: '15m' });
    const magicLink = `${req.protocol}://${req.get('host')}/api/auth/magic-link/verify?token=${magicToken}`;
    
    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@chatflow.ai',
      to: email,
      subject: '🔗 Your Magic Link - ChatFlow AI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">ChatFlow AI</h1>
            <p style="color: #e0e0e0; margin: 10px 0 0 0;">Your Magic Link is Ready</p>
          </div>
          
          <div style="padding: 40px 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Sign in to your account</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
              Click the button below to securely sign in to your ChatFlow AI account. 
              This link will expire in <strong>15 minutes</strong> for your security.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${magicLink}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                🚀 Sign In Now
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
              If the button doesn't work, copy and paste this link:<br>
              <a href="${magicLink}" style="color: #667eea; word-break: break-all;">${magicLink}</a>
            </p>
          </div>
          
          <div style="background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px;">
            <p>This email was sent to ${email}. If you didn't request this, please ignore it.</p>
            <p>© 2025 ChatFlow AI. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    // Try to send email, fallback to console log
    try {
      await emailTransporter.sendMail(mailOptions);
      console.log(`📧 Magic link email sent to ${email}`);
    } catch (emailError) {
      console.log(`⚠️  Email sending failed (${emailError.message}), showing link in console:`);
      console.log(`🔗 Magic link for ${email}: ${magicLink}`);
    }
    
    res.json({ success: true, message: 'Magic link sent' });
    
  } catch (error) {
    console.error('Magic link error:', error);
    res.status(500).json({ error: 'Failed to send magic link' });
  }
});

app.get('/api/auth/magic-link/verify', (req, res) => {
  const { token } = req.query;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.type === 'magic-link') {
      const db = readDatabase();
      let user = db.users.find(u => u.email === decoded.email);
      
      if (!user) {
        // Create new user
        user = {
          id: Date.now().toString(),
          email: decoded.email,
          name: decoded.email.split('@')[0],
          role: 'USER',
          status: 'ACTIVE',
          createdAt: new Date().toISOString()
        };
        db.users.push(user);
        writeDatabase(db);
      }
      
      const authToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.redirect(`/login?token=${authToken}`);
    } else {
      res.status(400).send('Invalid magic link');
    }
  } catch (error) {
    res.status(400).send('Invalid or expired magic link');
  }
});

app.get('/api/auth/magic-link/status', authenticateToken, (req, res) => {
  res.json({ authenticated: true });
});

// Admin Routes
app.get('/api/admin/users', authenticateToken, (req, res) => {
  try {
    const db = readDatabase();
    const users = db.users.map(user => ({
      ...user,
      password: undefined // Don't send password
    }));
    
    const stats = {
      total: users.length,
      active: users.filter(u => u.status === 'ACTIVE').length,
      pending: users.filter(u => u.status === 'PENDING_VERIFICATION').length,
      suspended: users.filter(u => u.status === 'SUSPENDED').length,
      online: users.filter(u => {
        // Check if user has active session in last 5 minutes
        const activeSessions = db.sessions.filter(s => 
          s.userId === u.id && 
          new Date(s.createdAt) > new Date(Date.now() - 5 * 60 * 1000)
        );
        return activeSessions.length > 0;
      }).length
    };
    
    res.json({ users, stats });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Failed to load users' });
  }
});

app.post('/api/admin/users/invite', authenticateToken, (req, res) => {
  try {
    const { email, name, role } = req.body;
    const db = readDatabase();
    
    // Check if user already exists
    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create invitation (in production, send email)
    const invitation = {
      id: Date.now().toString(),
      email,
      name,
      role: role || 'AGENT',
      status: 'PENDING_VERIFICATION',
      createdAt: new Date().toISOString(),
      invitedBy: req.user.userId
    };
    
    db.invitations = db.invitations || [];
    db.invitations.push(invitation);
    writeDatabase(db);
    
    console.log(`📧 User invitation sent to ${email} for role ${role}`);
    
    res.json({ success: true, message: 'Invitation sent successfully' });
  } catch (error) {
    console.error('Invite user error:', error);
    res.status(500).json({ error: 'Failed to invite user' });
  }
});

app.put('/api/admin/users/:userId', authenticateToken, (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, role, status } = req.body;
    const db = readDatabase();
    
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user
    db.users[userIndex] = {
      ...db.users[userIndex],
      name,
      email,
      role,
      status,
      updatedAt: new Date().toISOString()
    };
    
    writeDatabase(db);
    
    // Log the action
    logAuditEvent(req.user.userId, req.user.email, 'update', 'users', userId, {
      name, email, role, status
    });
    
    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.post('/api/admin/users/:userId/:action', authenticateToken, (req, res) => {
  try {
    const { userId, action } = req.params;
    const db = readDatabase();
    
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    switch (action) {
      case 'suspend':
        db.users[userIndex].status = 'SUSPENDED';
        break;
      case 'activate':
        db.users[userIndex].status = 'ACTIVE';
        break;
      case 'delete':
        db.users = db.users.filter(u => u.id !== userId);
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    
    writeDatabase(db);
    
    // Log the action
    logAuditEvent(req.user.userId, req.user.email, action, 'users', userId);
    
    res.json({ success: true, message: `User ${action} successfully` });
  } catch (error) {
    console.error('User action error:', error);
    res.status(500).json({ error: `Failed to ${req.params.action} user` });
  }
});

// Audit Logs
app.get('/api/admin/audit-logs', authenticateToken, (req, res) => {
  try {
    const db = readDatabase();
    const logs = db.auditLogs || [];
    
    // Sort by timestamp (newest first)
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json({ logs });
  } catch (error) {
    console.error('Audit logs error:', error);
    res.status(500).json({ error: 'Failed to load audit logs' });
  }
});

app.get('/api/admin/audit-logs/export', authenticateToken, (req, res) => {
  try {
    const db = readDatabase();
    const logs = db.auditLogs || [];
    
    // Convert to CSV
    const csvHeader = 'Timestamp,User,Action,Resource,Resource ID,Severity,IP Address,Details\n';
    const csvData = logs.map(log => 
      `${log.timestamp},${log.userEmail},${log.action},${log.resource},${log.resourceId || ''},${log.severity},${log.ipAddress || ''},"${JSON.stringify(log.details || {}).replace(/"/g, '""')}"`
    ).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="audit-logs.csv"');
    res.send(csvHeader + csvData);
  } catch (error) {
    console.error('Export audit logs error:', error);
    res.status(500).json({ error: 'Failed to export audit logs' });
  }
});

// Role Management
app.get('/api/admin/roles', authenticateToken, (req, res) => {
  try {
    const db = readDatabase();
    const roles = db.roles || [];
    
    res.json({ roles });
  } catch (error) {
    console.error('Roles error:', error);
    res.status(500).json({ error: 'Failed to load roles' });
  }
});

app.get('/api/admin/permissions', authenticateToken, (req, res) => {
  try {
    // Return all available permissions
    const permissions = [
      // User permissions
      { id: 'users_read', name: 'View Users', resource: 'users', action: 'read' },
      { id: 'users_create', name: 'Create Users', resource: 'users', action: 'create' },
      { id: 'users_update', name: 'Edit Users', resource: 'users', action: 'update' },
      { id: 'users_delete', name: 'Delete Users', resource: 'users', action: 'delete' },
      { id: 'users_invite', name: 'Invite Users', resource: 'users', action: 'invite' },
      
      // Bot permissions
      { id: 'bots_read', name: 'View Bots', resource: 'bots', action: 'read' },
      { id: 'bots_create', name: 'Create Bots', resource: 'bots', action: 'create' },
      { id: 'bots_update', name: 'Edit Bots', resource: 'bots', action: 'update' },
      { id: 'bots_delete', name: 'Delete Bots', resource: 'bots', action: 'delete' },
      { id: 'bots_manage', name: 'Manage Bots', resource: 'bots', action: 'manage' },
      
      // Conversation permissions
      { id: 'conversations_read', name: 'View Conversations', resource: 'conversations', action: 'read' },
      { id: 'conversations_update', name: 'Manage Conversations', resource: 'conversations', action: 'update' },
      
      // Analytics permissions
      { id: 'analytics_read', name: 'View Analytics', resource: 'analytics', action: 'read' },
      { id: 'analytics_export', name: 'Export Analytics', resource: 'analytics', action: 'export' },
      
      // Settings permissions
      { id: 'settings_read', name: 'View Settings', resource: 'settings', action: 'read' },
      { id: 'settings_manage', name: 'Manage Settings', resource: 'settings', action: 'manage' },
      
      // Integration permissions
      { id: 'integrations_read', name: 'View Integrations', resource: 'integrations', action: 'read' },
      { id: 'integrations_manage', name: 'Manage Integrations', resource: 'integrations', action: 'manage' },
      
      // Team permissions
      { id: 'team_read', name: 'View Team', resource: 'team', action: 'read' },
      { id: 'team_manage', name: 'Manage Team', resource: 'team', action: 'manage' },
      
      // Role permissions
      { id: 'roles_read', name: 'View Roles', resource: 'roles', action: 'read' },
      { id: 'roles_create', name: 'Create Roles', resource: 'roles', action: 'create' },
      { id: 'roles_update', name: 'Edit Roles', resource: 'roles', action: 'update' },
      { id: 'roles_delete', name: 'Delete Roles', resource: 'roles', action: 'delete' },
      
      // Audit permissions
      { id: 'audit_logs_read', name: 'View Audit Logs', resource: 'audit_logs', action: 'read' },
      { id: 'audit_logs_export', name: 'Export Audit Logs', resource: 'audit_logs', action: 'export' }
    ];
    
    res.json({ permissions });
  } catch (error) {
    console.error('Permissions error:', error);
    res.status(500).json({ error: 'Failed to load permissions' });
  }
});

app.post('/api/admin/roles', authenticateToken, (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    const db = readDatabase();
    
    // Check if role already exists
    const existingRole = db.roles?.find(r => r.name === name);
    if (existingRole) {
      return res.status(400).json({ error: 'Role already exists' });
    }
    
    const newRole = {
      id: Date.now().toString(),
      name,
      description,
      permissions: permissions || [],
      isSystem: false,
      createdAt: new Date().toISOString()
    };
    
    db.roles = db.roles || [];
    db.roles.push(newRole);
    writeDatabase(db);
    
    // Log the action
    logAuditEvent(req.user.userId, req.user.email, 'create', 'roles', newRole.id, {
      name, description
    });
    
    res.json({ success: true, role: newRole });
  } catch (error) {
    console.error('Create role error:', error);
    res.status(500).json({ error: 'Failed to create role' });
  }
});

app.put('/api/admin/roles/:roleId', authenticateToken, (req, res) => {
  try {
    const { roleId } = req.params;
    const { name, description, permissions } = req.body;
    const db = readDatabase();
    
    const roleIndex = db.roles?.findIndex(r => r.id === roleId);
    if (roleIndex === -1 || !db.roles) {
      return res.status(404).json({ error: 'Role not found' });
    }
    
    // Don't allow editing system roles
    if (db.roles[roleIndex].isSystem) {
      return res.status(400).json({ error: 'Cannot edit system roles' });
    }
    
    db.roles[roleIndex] = {
      ...db.roles[roleIndex],
      name,
      description,
      permissions: permissions || [],
      updatedAt: new Date().toISOString()
    };
    
    writeDatabase(db);
    
    // Log the action
    logAuditEvent(req.user.userId, req.user.email, 'update', 'roles', roleId, {
      name, description
    });
    
    res.json({ success: true, role: db.roles[roleIndex] });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

app.delete('/api/admin/roles/:roleId', authenticateToken, (req, res) => {
  try {
    const { roleId } = req.params;
    const db = readDatabase();
    
    const roleIndex = db.roles?.findIndex(r => r.id === roleId);
    if (roleIndex === -1 || !db.roles) {
      return res.status(404).json({ error: 'Role not found' });
    }
    
    // Don't allow deleting system roles
    if (db.roles[roleIndex].isSystem) {
      return res.status(400).json({ error: 'Cannot delete system roles' });
    }
    
    const roleName = db.roles[roleIndex].name;
    db.roles = db.roles.filter(r => r.id !== roleId);
    writeDatabase(db);
    
    // Log the action
    logAuditEvent(req.user.userId, req.user.email, 'delete', 'roles', roleId, {
      name: roleName
    });
    
    res.json({ success: true, message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({ error: 'Failed to delete role' });
  }
});

// Helper function to log audit events
function logAuditEvent(userId, userEmail, action, resource, resourceId, details = {}) {
  const db = readDatabase();
  
  const auditLog = {
    id: Date.now().toString(),
    userId,
    userEmail,
    action,
    resource,
    resourceId,
    details,
    timestamp: new Date().toISOString(),
    severity: getSeverityForAction(action),
    ipAddress: null, // In production, get from request
    userAgent: null  // In production, get from request
  };
  
  db.auditLogs = db.auditLogs || [];
  db.auditLogs.push(auditLog);
  
  // Keep only last 1000 audit logs
  if (db.auditLogs.length > 1000) {
    db.auditLogs = db.auditLogs.slice(-1000);
  }
  
  writeDatabase(db);
}

function getSeverityForAction(action) {
  switch (action) {
    case 'delete':
      return 'high';
    case 'suspend':
    case 'ban':
      return 'medium';
    case 'create':
    case 'update':
      return 'low';
    default:
      return 'low';
  }
}

// Session Management Routes
app.get('/api/admin/sessions', authenticateToken, (req, res) => {
  try {
    const db = readDatabase();
    const sessions = db.sessions || [];
    
    // Add user information to sessions
    const sessionsWithUsers = sessions.map(session => {
      const user = db.users.find(u => u.id === session.userId);
      return {
        ...session,
        userEmail: user?.email || 'Unknown',
        device: session.device || {
          type: 'desktop',
          name: 'Unknown Device',
          os: 'Unknown OS'
        }
      };
    });
    
    res.json({ sessions: sessionsWithUsers });
  } catch (error) {
    console.error('Sessions error:', error);
    res.status(500).json({ error: 'Failed to load sessions' });
  }
});

app.delete('/api/admin/sessions/:sessionId', authenticateToken, (req, res) => {
  try {
    const { sessionId } = req.params;
    const db = readDatabase();
    
    const sessionIndex = db.sessions?.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1 || !db.sessions) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Don't allow terminating current session
    const currentToken = req.headers.authorization?.replace('Bearer ', '');
    if (db.sessions[sessionIndex].token === currentToken) {
      return res.status(400).json({ error: 'Cannot terminate current session' });
    }
    
    const session = db.sessions[sessionIndex];
    db.sessions = db.sessions.filter(s => s.id !== sessionId);
    writeDatabase(db);
    
    // Log the action
    logAuditEvent(req.user.userId, req.user.email, 'terminate_session', 'sessions', sessionId, {
      userId: session.userId
    });
    
    res.json({ success: true, message: 'Session terminated successfully' });
  } catch (error) {
    console.error('Terminate session error:', error);
    res.status(500).json({ error: 'Failed to terminate session' });
  }
});

app.delete('/api/admin/users/:userId/sessions', authenticateToken, (req, res) => {
  try {
    const { userId } = req.params;
    const db = readDatabase();
    
    const currentToken = req.headers.authorization?.replace('Bearer ', '');
    const userSessions = db.sessions?.filter(s => s.userId === userId) || [];
    
    // Don't allow terminating current session
    const hasCurrentSession = userSessions.some(s => s.token === currentToken);
    if (hasCurrentSession) {
      return res.status(400).json({ error: 'Cannot terminate current session' });
    }
    
    db.sessions = db.sessions?.filter(s => s.userId !== userId) || [];
    writeDatabase(db);
    
    // Log the action
    logAuditEvent(req.user.userId, req.user.email, 'terminate_all_sessions', 'sessions', userId);
    
    res.json({ success: true, message: 'All user sessions terminated successfully' });
  } catch (error) {
    console.error('Terminate all sessions error:', error);
    res.status(500).json({ error: 'Failed to terminate all sessions' });
  }
});

// Security Dashboard Routes
app.get('/api/admin/security', authenticateToken, (req, res) => {
  try {
    const db = readDatabase();
    
    // Get real audit logs for security events
    const auditLogs = db.auditLogs || [];
    const sessions = db.sessions || [];
    const users = db.users || [];
    
    // Filter security-related audit logs from last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentLogs = auditLogs.filter(log => new Date(log.timestamp) > sevenDaysAgo);
    
    // Convert audit logs to security events
    const securityEvents = recentLogs.map(log => {
      let severity = 'low';
      let type = 'login_attempt';
      
      // Determine severity and type based on action
      if (log.action.includes('failed') || log.action.includes('invalid')) {
        severity = 'medium';
        type = 'failed_login';
      } else if (log.action.includes('block') || log.action.includes('suspend')) {
        severity = 'high';
        type = 'suspicious_activity';
      } else if (log.action.includes('login') || log.action.includes('auth')) {
        severity = 'low';
        type = 'login_attempt';
      } else if (log.action.includes('2fa') || log.action.includes('mfa')) {
        severity = 'low';
        type = '2fa_enabled';
      } else if (log.action.includes('password')) {
        severity = 'medium';
        type = 'password_changed';
      }
      
      const user = users.find(u => u.id === log.userId);
      
      return {
        id: log.id,
        type: type,
        severity: severity,
        description: log.action,
        ipAddress: log.ipAddress || 'Unknown',
        location: log.metadata?.location || 'Unknown',
        userAgent: log.metadata?.userAgent || 'Unknown',
        timestamp: log.timestamp,
        userId: log.userId,
        userEmail: user?.email || 'Unknown',
        metadata: log.metadata
      };
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Get blocked IPs from database
    const blockedIPs = db.blockedIPs || [];
    
    // Calculate real stats
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last24HourEvents = securityEvents.filter(e => new Date(e.timestamp) > last24Hours);
    
    const stats = {
      totalEvents: securityEvents.length,
      criticalEvents: securityEvents.filter(e => e.severity === 'critical').length,
      blockedIPs: blockedIPs.filter(ip => ip.isActive).length,
      failedLogins: securityEvents.filter(e => e.type === 'failed_login').length,
      suspiciousActivities: securityEvents.filter(e => e.type === 'suspicious_activity').length,
      activeSessions: sessions.filter(s => s.isActive).length,
      uniqueUsers: new Set(sessions.map(s => s.userId)).size,
      last24Hours: {
        loginAttempts: last24HourEvents.filter(e => e.type === 'login_attempt').length,
        failedLogins: last24HourEvents.filter(e => e.type === 'failed_login').length,
        blockedIPs: blockedIPs.filter(ip => ip.isActive && new Date(ip.blockedAt) > last24Hours).length
      }
    };
    
    res.json({ events: securityEvents, blockedIPs, stats });
  } catch (error) {
    console.error('Security dashboard error:', error);
    res.status(500).json({ error: 'Failed to load security data' });
  }
});

app.post('/api/admin/security/block-ip', authenticateToken, (req, res) => {
  try {
    const { ipAddress, reason } = req.body;
    const db = readDatabase();
    
    // Check if IP is already blocked
    const existingBlock = db.blockedIPs?.find(ip => ip.ipAddress === ipAddress && ip.isActive);
    if (existingBlock) {
      return res.status(400).json({ error: 'IP address is already blocked' });
    }
    
    const newBlock = {
      id: Date.now().toString(),
      ipAddress,
      reason,
      blockedAt: new Date().toISOString(),
      blockedBy: req.user.email,
      isActive: true
    };
    
    db.blockedIPs = db.blockedIPs || [];
    db.blockedIPs.push(newBlock);
    writeDatabase(db);
    
    // Log the action
    logAuditEvent(req.user.userId, req.user.email, 'block_ip', 'security', newBlock.id, {
      ipAddress, reason
    });
    
    res.json({ success: true, message: 'IP address blocked successfully' });
  } catch (error) {
    console.error('Block IP error:', error);
    res.status(500).json({ error: 'Failed to block IP address' });
  }
});

app.delete('/api/admin/security/blocked-ips/:ipId', authenticateToken, (req, res) => {
  try {
    const { ipId } = req.params;
    const db = readDatabase();
    
    const ipIndex = db.blockedIPs?.findIndex(ip => ip.id === ipId);
    if (ipIndex === -1 || !db.blockedIPs) {
      return res.status(404).json({ error: 'Blocked IP not found' });
    }
    
    const blockedIP = db.blockedIPs[ipIndex];
    db.blockedIPs[ipIndex].isActive = false;
    db.blockedIPs[ipIndex].unblockedAt = new Date().toISOString();
    db.blockedIPs[ipIndex].unblockedBy = req.user.email;
    
    writeDatabase(db);
    
    // Log the action
    logAuditEvent(req.user.userId, req.user.email, 'unblock_ip', 'security', ipId, {
      ipAddress: blockedIP.ipAddress
    });
    
    res.json({ success: true, message: 'IP address unblocked successfully' });
  } catch (error) {
    console.error('Unblock IP error:', error);
    res.status(500).json({ error: 'Failed to unblock IP address' });
  }
});

// Threat Analysis endpoint
app.get('/api/admin/security/threat-analysis', authenticateToken, (req, res) => {
  try {
    const db = readDatabase();
    
    // Get real data for threat analysis
    const auditLogs = db.auditLogs || [];
    const sessions = db.sessions || [];
    const users = db.users || [];
    const blockedIPs = db.blockedIPs || [];
    
    // Calculate threat metrics from real data
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Recent security events
    const recentEvents = auditLogs.filter(log => new Date(log.timestamp) > last7Days);
    
    // Calculate high risk threats (failed logins, blocked IPs, suspicious activity)
    const highRiskThreats = recentEvents.filter(log => 
      log.action.includes('failed') || 
      log.action.includes('block') || 
      log.action.includes('suspend')
    ).length;
    
    // Active monitoring (ongoing suspicious activities)
    const activeMonitoring = blockedIPs.filter(ip => ip.isActive).length + 
                           sessions.filter(s => s.isActive && new Date(s.createdAt) > last24Hours).length;
    
    // Threats blocked (successful blocks and suspensions)
    const threatsBlocked = blockedIPs.filter(ip => ip.isActive).length + 
                          recentEvents.filter(log => log.action.includes('block')).length;
    
    // Generate threat alerts based on real events
    const threatAlerts = recentEvents.slice(0, 4).map(log => {
      const user = users.find(u => u.id === log.userId);
      let severity = 'low';
      let risk = 'LOW RISK';
      
      if (log.action.includes('failed') || log.action.includes('invalid')) {
        severity = 'high';
        risk = 'HIGH RISK';
      } else if (log.action.includes('block') || log.action.includes('suspend')) {
        severity = 'high';
        risk = 'HIGH RISK';
      } else if (log.action.includes('login') && new Date(log.timestamp).getHours() < 6) {
        severity = 'medium';
        risk = 'MEDIUM RISK';
      }
      
      return {
        id: log.id,
        title: log.action,
        description: log.action + (user ? ` by ${user.email}` : ''),
        severity: severity,
        risk: risk,
        timestamp: log.timestamp,
        status: log.action.includes('block') ? 'Blocked' : 'Under Review'
      };
    });
    
    // Known malicious IPs (from blocked IPs)
    const knownMaliciousIPs = blockedIPs.filter(ip => ip.isActive).map(ip => ({
      ip: ip.ipAddress,
      status: 'Blocked',
      reason: ip.reason
    }));
    
    // Calculate security scores based on real metrics
    const totalEvents = recentEvents.length;
    const criticalEvents = recentEvents.filter(log => 
      log.action.includes('failed') || log.action.includes('block')
    ).length;
    
    const overallSecurity = Math.max(0, 10 - (criticalEvents * 0.5) - (blockedIPs.length * 0.2));
    const threatDetection = Math.max(0, 10 - (highRiskThreats * 0.3));
    const responseTime = Math.max(0, 10 - (totalEvents > 10 ? 2 : 0));
    const preventionRate = Math.min(100, Math.max(0, 100 - (criticalEvents / totalEvents * 100)));
    
    const threatAnalysis = {
      overview: {
        highRiskThreats: highRiskThreats,
        activeMonitoring: activeMonitoring,
        threatsBlocked: threatsBlocked
      },
      threatAlerts: threatAlerts,
      knownMaliciousIPs: knownMaliciousIPs,
      securityScores: {
        overallSecurity: Math.round(overallSecurity * 10) / 10,
        threatDetection: Math.round(threatDetection * 10) / 10,
        responseTime: Math.round(responseTime * 10) / 10,
        preventionRate: Math.round(preventionRate)
      }
    };
    
    res.json(threatAnalysis);
  } catch (error) {
    console.error('Threat analysis error:', error);
    res.status(500).json({ error: 'Failed to load threat analysis data' });
  }
});

// GDPR Routes
app.get('/api/admin/gdpr', authenticateToken, (req, res) => {
  try {
    const db = readDatabase();
    
    // Generate mock GDPR data for demo
    const dataRequests = [
      {
        id: '1',
        userId: 'user1',
        userEmail: 'user1@example.com',
        requestType: 'export',
        status: 'completed',
        requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
        dataSize: '2.3 MB',
        downloadUrl: '/downloads/user1-data.zip'
      },
      {
        id: '2',
        userId: 'user2',
        userEmail: 'user2@example.com',
        requestType: 'delete',
        status: 'pending',
        requestedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: '3',
        userId: 'user3',
        userEmail: 'user3@example.com',
        requestType: 'portability',
        status: 'processing',
        requestedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
      }
    ];
    
    const dataExports = [
      {
        id: '1',
        userId: 'user1',
        userEmail: 'user1@example.com',
        dataTypes: ['profile', 'conversations', 'settings', 'analytics'],
        exportedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days
        downloadCount: 1,
        isExpired: false
      },
      {
        id: '2',
        userId: 'user4',
        userEmail: 'user4@example.com',
        dataTypes: ['profile', 'conversations'],
        exportedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
        expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // Expired
        downloadCount: 3,
        isExpired: true
      }
    ];
    
    const dataDeletions = [
      {
        id: '1',
        userId: 'user5',
        userEmail: 'user5@example.com',
        deletedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        deletedBy: 'admin@example.com',
        dataTypes: ['profile', 'conversations', 'settings'],
        reason: 'User requested data deletion (GDPR Article 17)'
      },
      {
        id: '2',
        userId: 'user6',
        userEmail: 'user6@example.com',
        deletedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        deletedBy: 'system',
        dataTypes: ['profile', 'conversations', 'analytics'],
        reason: 'Account inactive for 2 years - automatic cleanup'
      }
    ];
    
    res.json({ requests: dataRequests, exports: dataExports, deletions: dataDeletions });
  } catch (error) {
    console.error('GDPR data error:', error);
    res.status(500).json({ error: 'Failed to load GDPR data' });
  }
});

app.post('/api/admin/gdpr/export', authenticateToken, (req, res) => {
  try {
    const { userId, userEmail } = req.body;
    
    // In production, this would:
    // 1. Gather all user data from database
    // 2. Create a ZIP file with structured data
    // 3. Store the export record
    // 4. Send download link to user
    
    // For demo, create a mock ZIP file
    const mockData = {
      user: { id: userId, email: userEmail },
      profile: { name: 'John Doe', createdAt: new Date().toISOString() },
      conversations: [],
      settings: {},
      analytics: {}
    };
    
    // Log the action
    logAuditEvent(req.user.userId, req.user.email, 'export_data', 'gdpr', userId, {
      userEmail, dataTypes: ['profile', 'conversations', 'settings', 'analytics']
    });
    
    // In production, return actual ZIP file
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="user-data-${userEmail}.zip"`);
    res.send(Buffer.from('Mock ZIP file content'));
    
    console.log(`📦 Data export generated for ${userEmail}`);
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({ error: 'Failed to export user data' });
  }
});

app.post('/api/admin/gdpr/delete', authenticateToken, (req, res) => {
  try {
    const { userId, userEmail, reason } = req.body;
    const db = readDatabase();
    
    // In production, this would:
    // 1. Delete/anonymize all user data
    // 2. Update related records
    // 3. Log the deletion
    // 4. Send confirmation to user
    
    // For demo, just log the action
    const deletionRecord = {
      id: Date.now().toString(),
      userId,
      userEmail,
      deletedAt: new Date().toISOString(),
      deletedBy: req.user.email,
      dataTypes: ['profile', 'conversations', 'settings', 'analytics'],
      reason: reason || 'Admin initiated deletion'
    };
    
    db.gdprDeletions = db.gdprDeletions || [];
    db.gdprDeletions.push(deletionRecord);
    writeDatabase(db);
    
    // Log the action
    logAuditEvent(req.user.userId, req.user.email, 'delete_data', 'gdpr', userId, {
      userEmail, reason, dataTypes: deletionRecord.dataTypes
    });
    
    res.json({ success: true, message: 'User data deleted successfully' });
    console.log(`🗑️ Data deleted for user ${userEmail}: ${reason}`);
  } catch (error) {
    console.error('Delete data error:', error);
    res.status(500).json({ error: 'Failed to delete user data' });
  }
});

app.put('/api/admin/gdpr/requests/:requestId', authenticateToken, (req, res) => {
  try {
    const { requestId } = req.params;
    const { action, reason } = req.body;
    
    // In production, this would update the request status and trigger appropriate actions
    
    // Log the action
    logAuditEvent(req.user.userId, req.user.email, `${action}_gdpr_request`, 'gdpr', requestId, {
      reason
    });
    
    res.json({ success: true, message: `Request ${action} successfully` });
    console.log(`📋 GDPR request ${requestId} ${action} by ${req.user.email}`);
  } catch (error) {
    console.error('Process GDPR request error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// RBAC Endpoints
app.get('/api/rbac/roles', authenticateToken, (req, res) => {
  const roles = [
    { role: 'ROOT_OWNER', level: 6, displayName: 'Root Owner', description: 'System Owner - Creator of the platform' },
    { role: 'SUPER_ADMIN', level: 5, displayName: 'Super Admin', description: 'Global Administrator' },
    { role: 'OWNER', level: 4, displayName: 'Owner', description: 'Workspace Owner / Account Admin' },
    { role: 'MANAGER', level: 3, displayName: 'Manager', description: 'Team Admin / Manager' },
    { role: 'AGENT', level: 2, displayName: 'Agent', description: 'Agent / Member' },
    { role: 'VIEWER', level: 1, displayName: 'Viewer', description: 'Viewer / Guest' }
  ];
  res.json(roles);
});

app.get('/api/rbac/permissions', authenticateToken, (req, res) => {
  const permissions = {
    'System Management': [
      'SYSTEM_MANAGE_ALL',
      'SYSTEM_CREATE_SUPERADMINS',
      'SYSTEM_DELETE_SUPERADMINS',
      'SYSTEM_VIEW_LOGS',
      'SYSTEM_MANAGE_LICENSES'
    ],
    'Workspace Management': [
      'WORKSPACE_MANAGE_ALL',
      'WORKSPACE_CREATE',
      'WORKSPACE_DELETE',
      'WORKSPACE_MANAGE_BILLING',
      'WORKSPACE_VIEW_ANALYTICS'
    ],
    'User Management': [
      'USER_MANAGE_ALL',
      'USER_CREATE',
      'USER_EDIT',
      'USER_DELETE',
      'USER_SUSPEND',
      'USER_ACTIVATE',
      'USER_VIEW_DETAILS'
    ],
    'Bot Management': [
      'BOT_MANAGE_ALL',
      'BOT_CREATE',
      'BOT_EDIT',
      'BOT_DELETE',
      'BOT_VIEW',
      'BOT_PUBLISH',
      'BOT_ANALYTICS'
    ],
    'Conversation Management': [
      'CONVERSATION_MANAGE_ALL',
      'CONVERSATION_VIEW_ALL',
      'CONVERSATION_REPLY',
      'CONVERSATION_ASSIGN',
      'CONVERSATION_CLOSE',
      'CONVERSATION_EXPORT'
    ],
    'Channel Management': [
      'CHANNEL_MANAGE_ALL',
      'CHANNEL_CONNECT',
      'CHANNEL_DISCONNECT',
      'CHANNEL_VIEW_ANALYTICS'
    ],
    'Integration Management': [
      'INTEGRATION_MANAGE_ALL',
      'INTEGRATION_CREATE',
      'INTEGRATION_EDIT',
      'INTEGRATION_DELETE'
    ],
    'Broadcast Management': [
      'BROADCAST_MANAGE_ALL',
      'BROADCAST_CREATE',
      'BROADCAST_SEND',
      'BROADCAST_VIEW_ANALYTICS'
    ],
    'Analytics & Reporting': [
      'ANALYTICS_VIEW_ALL',
      'ANALYTICS_EXPORT',
      'ANALYTICS_CUSTOM_REPORTS'
    ],
    'API Management': [
      'API_MANAGE_KEYS',
      'API_VIEW_USAGE',
      'API_RATE_LIMIT_MANAGE'
    ]
  };
  res.json(permissions);
});

app.get('/api/rbac/features', authenticateToken, (req, res) => {
  const features = {
    'Workspace Features': [
      'MULTI_WORKSPACE',
      'SSO_SCIM',
      'WHITE_LABEL'
    ],
    'AI Features': [
      'AI_RAG',
      'CUSTOM_GPT'
    ],
    'Data & Analytics': [
      'DATA_EXPORT',
      'ADVANCED_ANALYTICS'
    ],
    'Advanced Features': [
      'CUSTOM_ROLES',
      'API_UNLIMITED',
      'PRIORITY_SUPPORT'
    ]
  };
  res.json(features);
});

app.get('/api/rbac/role-permissions', authenticateToken, (req, res) => {
  const rolePermissions = {
    'ROOT_OWNER': [
      'SYSTEM_MANAGE_ALL', 'SYSTEM_CREATE_SUPERADMINS', 'SYSTEM_DELETE_SUPERADMINS',
      'SYSTEM_VIEW_LOGS', 'SYSTEM_MANAGE_LICENSES',
      'WORKSPACE_MANAGE_ALL', 'WORKSPACE_CREATE', 'WORKSPACE_DELETE', 'WORKSPACE_MANAGE_BILLING',
      'USER_MANAGE_ALL', 'USER_CREATE', 'USER_EDIT', 'USER_DELETE', 'USER_SUSPEND', 'USER_ACTIVATE',
      'BOT_MANAGE_ALL', 'BOT_CREATE', 'BOT_EDIT', 'BOT_DELETE', 'BOT_VIEW', 'BOT_PUBLISH',
      'CONVERSATION_MANAGE_ALL', 'CONVERSATION_VIEW_ALL', 'CONVERSATION_REPLY', 'CONVERSATION_ASSIGN',
      'CHANNEL_MANAGE_ALL', 'CHANNEL_CONNECT', 'CHANNEL_DISCONNECT',
      'INTEGRATION_MANAGE_ALL', 'INTEGRATION_CREATE', 'INTEGRATION_EDIT',
      'BROADCAST_MANAGE_ALL', 'BROADCAST_CREATE', 'BROADCAST_SEND',
      'ANALYTICS_VIEW_ALL', 'ANALYTICS_EXPORT', 'ANALYTICS_CUSTOM_REPORTS',
      'API_MANAGE_KEYS', 'API_VIEW_USAGE', 'API_RATE_LIMIT_MANAGE'
    ],
    'SUPER_ADMIN': [
      'WORKSPACE_MANAGE_ALL', 'WORKSPACE_CREATE', 'WORKSPACE_DELETE', 'WORKSPACE_MANAGE_BILLING',
      'USER_MANAGE_ALL', 'USER_CREATE', 'USER_EDIT', 'USER_DELETE', 'USER_SUSPEND', 'USER_ACTIVATE',
      'BOT_MANAGE_ALL', 'BOT_CREATE', 'BOT_EDIT', 'BOT_DELETE', 'BOT_VIEW', 'BOT_PUBLISH',
      'CONVERSATION_MANAGE_ALL', 'CONVERSATION_VIEW_ALL', 'CONVERSATION_REPLY', 'CONVERSATION_ASSIGN',
      'CHANNEL_MANAGE_ALL', 'CHANNEL_CONNECT', 'CHANNEL_DISCONNECT',
      'INTEGRATION_MANAGE_ALL', 'INTEGRATION_CREATE', 'INTEGRATION_EDIT',
      'BROADCAST_MANAGE_ALL', 'BROADCAST_CREATE', 'BROADCAST_SEND',
      'ANALYTICS_VIEW_ALL', 'ANALYTICS_EXPORT', 'ANALYTICS_CUSTOM_REPORTS',
      'API_MANAGE_KEYS', 'API_VIEW_USAGE', 'API_RATE_LIMIT_MANAGE'
    ],
    'OWNER': [
      'USER_MANAGE_ALL', 'USER_CREATE', 'USER_EDIT', 'USER_DELETE', 'USER_SUSPEND', 'USER_ACTIVATE',
      'BOT_MANAGE_ALL', 'BOT_CREATE', 'BOT_EDIT', 'BOT_DELETE', 'BOT_VIEW', 'BOT_PUBLISH',
      'CONVERSATION_MANAGE_ALL', 'CONVERSATION_VIEW_ALL', 'CONVERSATION_REPLY', 'CONVERSATION_ASSIGN',
      'CHANNEL_MANAGE_ALL', 'CHANNEL_CONNECT', 'CHANNEL_DISCONNECT',
      'INTEGRATION_MANAGE_ALL', 'INTEGRATION_CREATE', 'INTEGRATION_EDIT',
      'BROADCAST_MANAGE_ALL', 'BROADCAST_CREATE', 'BROADCAST_SEND',
      'ANALYTICS_VIEW_ALL', 'ANALYTICS_EXPORT', 'ANALYTICS_CUSTOM_REPORTS',
      'API_MANAGE_KEYS', 'API_VIEW_USAGE'
    ],
    'MANAGER': [
      'USER_CREATE', 'USER_EDIT', 'USER_VIEW_DETAILS',
      'BOT_CREATE', 'BOT_EDIT', 'BOT_VIEW', 'BOT_PUBLISH', 'BOT_ANALYTICS',
      'CONVERSATION_VIEW_ALL', 'CONVERSATION_REPLY', 'CONVERSATION_ASSIGN', 'CONVERSATION_CLOSE',
      'CHANNEL_CONNECT', 'CHANNEL_VIEW_ANALYTICS',
      'INTEGRATION_CREATE', 'INTEGRATION_EDIT',
      'BROADCAST_CREATE', 'BROADCAST_SEND', 'BROADCAST_VIEW_ANALYTICS',
      'ANALYTICS_VIEW_ALL', 'ANALYTICS_EXPORT'
    ],
    'AGENT': [
      'BOT_VIEW', 'BOT_ANALYTICS',
      'CONVERSATION_REPLY', 'CONVERSATION_CLOSE',
      'CHANNEL_VIEW_ANALYTICS',
      'ANALYTICS_VIEW_ALL'
    ],
    'VIEWER': [
      'BOT_VIEW',
      'CONVERSATION_VIEW_ALL',
      'CHANNEL_VIEW_ANALYTICS',
      'ANALYTICS_VIEW_ALL'
    ]
  };
  res.json(rolePermissions);
});

app.get('/api/rbac/tier-features', authenticateToken, (req, res) => {
  const tierFeatures = {
    'STARTER': [],
    'PRO': [
      'MULTI_WORKSPACE',
      'AI_RAG',
      'CUSTOM_GPT',
      'DATA_EXPORT',
      'ADVANCED_ANALYTICS'
    ],
    'ENTERPRISE': [
      'MULTI_WORKSPACE',
      'SSO_SCIM',
      'WHITE_LABEL',
      'CUSTOM_ROLES',
      'AI_RAG',
      'CUSTOM_GPT',
      'DATA_EXPORT',
      'ADVANCED_ANALYTICS',
      'API_UNLIMITED',
      'PRIORITY_SUPPORT'
    ]
  };
  res.json(tierFeatures);
});

// Custom Roles Endpoints
app.get('/api/admin/custom-roles', authenticateToken, (req, res) => {
  try {
    const db = readDatabase();
    const customRoles = db.customRoles || [];
    res.json(customRoles);
  } catch (error) {
    console.error('Error fetching custom roles:', error);
    res.status(500).json({ error: 'Failed to fetch custom roles' });
  }
});

app.post('/api/admin/custom-roles', authenticateToken, (req, res) => {
  try {
    const { name, description, permissions, isActive } = req.body;
    
    // Validate required fields
    if (!name || !permissions || !Array.isArray(permissions)) {
      return res.status(400).json({ error: 'Name and permissions are required' });
    }

    // Check if user has permission to create custom roles
    const user = req.user;
    if (user.role !== 'ROOT_OWNER' && user.role !== 'SUPER_ADMIN' && 
        (user.role !== 'OWNER' || user.planTier !== 'ENTERPRISE')) {
      return res.status(403).json({ error: 'Insufficient permissions to create custom roles' });
    }

    const db = readDatabase();
    const newRole = {
      id: Date.now().toString(),
      name,
      description: description || '',
      permissions,
      isActive: isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.email,
      usageCount: 0
    };

    if (!db.customRoles) {
      db.customRoles = [];
    }
    
    db.customRoles.push(newRole);
    writeDatabase(db);

    // Log the action
    const auditLog = {
      id: Date.now().toString(),
      userId: user.id,
      action: 'CREATE_CUSTOM_ROLE',
      resource: 'custom_role',
      resourceId: newRole.id,
      metadata: { roleName: name, permissions: permissions.length },
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      createdAt: new Date().toISOString()
    };

    if (!db.auditLogs) {
      db.auditLogs = [];
    }
    db.auditLogs.push(auditLog);
    writeDatabase(db);

    res.status(201).json(newRole);
  } catch (error) {
    console.error('Error creating custom role:', error);
    res.status(500).json({ error: 'Failed to create custom role' });
  }
});

app.put('/api/admin/custom-roles/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, permissions, isActive } = req.body;
    
    const user = req.user;
    const db = readDatabase();
    
    if (!db.customRoles) {
      return res.status(404).json({ error: 'Custom role not found' });
    }

    const roleIndex = db.customRoles.findIndex(role => role.id === id);
    if (roleIndex === -1) {
      return res.status(404).json({ error: 'Custom role not found' });
    }

    const role = db.customRoles[roleIndex];
    
    // Check permissions
    if (user.role !== 'ROOT_OWNER' && user.role !== 'SUPER_ADMIN' && 
        (user.role !== 'OWNER' || user.planTier !== 'ENTERPRISE' || role.createdBy !== user.email)) {
      return res.status(403).json({ error: 'Insufficient permissions to update this role' });
    }

    // Update role
    db.customRoles[roleIndex] = {
      ...role,
      name: name || role.name,
      description: description !== undefined ? description : role.description,
      permissions: permissions || role.permissions,
      isActive: isActive !== undefined ? isActive : role.isActive,
      updatedAt: new Date().toISOString()
    };

    writeDatabase(db);

    // Log the action
    const auditLog = {
      id: Date.now().toString(),
      userId: user.id,
      action: 'UPDATE_CUSTOM_ROLE',
      resource: 'custom_role',
      resourceId: id,
      metadata: { roleName: name, permissions: permissions?.length },
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      createdAt: new Date().toISOString()
    };

    if (!db.auditLogs) {
      db.auditLogs = [];
    }
    db.auditLogs.push(auditLog);
    writeDatabase(db);

    res.json(db.customRoles[roleIndex]);
  } catch (error) {
    console.error('Error updating custom role:', error);
    res.status(500).json({ error: 'Failed to update custom role' });
  }
});

app.delete('/api/admin/custom-roles/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const db = readDatabase();
    
    if (!db.customRoles) {
      return res.status(404).json({ error: 'Custom role not found' });
    }

    const roleIndex = db.customRoles.findIndex(role => role.id === id);
    if (roleIndex === -1) {
      return res.status(404).json({ error: 'Custom role not found' });
    }

    const role = db.customRoles[roleIndex];
    
    // Check permissions
    if (user.role !== 'ROOT_OWNER' && user.role !== 'SUPER_ADMIN' && 
        (user.role !== 'OWNER' || user.planTier !== 'ENTERPRISE' || role.createdBy !== user.email)) {
      return res.status(403).json({ error: 'Insufficient permissions to delete this role' });
    }

    // Check if role is in use
    if (role.usageCount > 0) {
      return res.status(400).json({ error: 'Cannot delete role that is currently in use' });
    }

    // Remove role
    db.customRoles.splice(roleIndex, 1);
    writeDatabase(db);

    // Log the action
    const auditLog = {
      id: Date.now().toString(),
      userId: user.id,
      action: 'DELETE_CUSTOM_ROLE',
      resource: 'custom_role',
      resourceId: id,
      metadata: { roleName: role.name },
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      createdAt: new Date().toISOString()
    };

    if (!db.auditLogs) {
      db.auditLogs = [];
    }
    db.auditLogs.push(auditLog);
    writeDatabase(db);

    res.json({ message: 'Custom role deleted successfully' });
  } catch (error) {
    console.error('Error deleting custom role:', error);
    res.status(500).json({ error: 'Failed to delete custom role' });
  }
});

// Bot Testing Endpoints
app.post('/api/bot/test', async (req, res) => {
  try {
    const db = readDatabase();
    const { message, botConfig } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Enhanced AI response logic
    const responses = {
      greeting: [
        "Hello! How can I help you today?",
        "Hi there! What can I do for you?",
        "Greetings! I'm here to assist you."
      ],
      help: [
        "I can help you with various tasks. What do you need?",
        "I'm here to assist you. What would you like to know?",
        "How can I be of service to you today?"
      ],
      pricing: [
        "We have flexible pricing plans. Would you like to see our options?",
        "I can help you understand our pricing structure. What's your budget range?",
        "Let me show you our current pricing plans and features."
      ],
      weather: [
        "I can't check the weather directly, but I can help you with other information!",
        "For weather updates, I'd recommend checking a weather app or website.",
        "I'm not connected to weather services, but I can help with other questions!"
      ],
      default: [
        "I understand you're looking for help. Can you be more specific?",
        "That's interesting! Tell me more about what you need.",
        "I'm here to help. What specific information do you need?"
      ]
    };

    // Enhanced keyword matching
    const lowerMessage = message.toLowerCase();
    let responseType = 'default';
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('good morning') || lowerMessage.includes('good afternoon')) {
      responseType = 'greeting';
    } else if (lowerMessage.includes('help') || lowerMessage.includes('assist') || lowerMessage.includes('support') || lowerMessage.includes('can you help')) {
      responseType = 'help';
    } else if (lowerMessage.includes('price') || lowerMessage.includes('pricing') || lowerMessage.includes('cost') || lowerMessage.includes('plan') || lowerMessage.includes('subscription')) {
      responseType = 'pricing';
    } else if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('sunny') || lowerMessage.includes('temperature')) {
      responseType = 'weather';
    }

    const responseOptions = responses[responseType];
    const randomResponse = responseOptions[Math.floor(Math.random() * responseOptions.length)];

    // Log the test interaction
    const testLog = {
      id: Date.now().toString(),
      message,
      response: randomResponse,
      botConfig: botConfig || {},
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent'),
      ip: req.ip
    };

    if (!db.botTests) {
      db.botTests = [];
    }
    db.botTests.push(testLog);
    // writeDatabase(db); // Temporarily disabled for testing

    res.json({
      success: true,
      response: randomResponse,
      testId: testLog.id,
      timestamp: testLog.timestamp
    });

  } catch (error) {
    console.error('Error testing bot:', error);
    res.status(500).json({ error: 'Failed to test bot' });
  }
});

// Get bot test history
app.get('/api/bot/tests', (req, res) => {
  try {
    const db = readDatabase();
    const tests = db.botTests || [];
    res.json({ tests });
  } catch (error) {
    console.error('Error fetching bot tests:', error);
    res.status(500).json({ error: 'Failed to fetch bot tests' });
  }
});

// Clear bot test history
app.delete('/api/bot/tests', (req, res) => {
  try {
    const db = readDatabase();
    db.botTests = [];
    writeDatabase(db);
    res.json({ message: 'Bot test history cleared' });
  } catch (error) {
    console.error('Error clearing bot tests:', error);
    res.status(500).json({ error: 'Failed to clear bot tests' });
  }
});

// RAG Chat Endpoint
app.post('/api/rag/chat', async (req, res) => {
  try {
    const db = readDatabase(); // Added this line
    const { message, sessionId, conversationHistory } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Enhanced RAG with real document search
    const lowerMessage = message.toLowerCase();
    
    // Search through ingested documents for relevant content
    const relevantDocs = db.ragDocuments ? db.ragDocuments.filter(doc => {
      const docText = doc.text.toLowerCase();
      const docTitle = (doc.metadata?.title || '').toLowerCase();
      const docCategory = (doc.metadata?.category || '').toLowerCase();
      
      // Check for keyword matches
      const keywords = lowerMessage.split(' ').filter(word => word.length > 3);
      return keywords.some(keyword => 
        docText.includes(keyword) || 
        docTitle.includes(keyword) || 
        docCategory.includes(keyword)
      );
    }) : [];

    let reply = '';
    let confidence = 0.6;
    let method = 'rag_simulation';

    if (relevantDocs.length > 0) {
      // Use real document content for response
      const bestDoc = relevantDocs[0];
      const docText = bestDoc.text;
      
      // Extract relevant sentences based on query
      const sentences = docText.split(/[.!?]+/).filter(s => s.trim().length > 20);
      const relevantSentences = sentences.filter(sentence => {
        const sentenceLower = sentence.toLowerCase();
        return lowerMessage.split(' ').some(word => 
          word.length > 3 && sentenceLower.includes(word)
        );
      });

      if (relevantSentences.length > 0) {
        reply = relevantSentences.slice(0, 2).join('. ').trim() + '.';
        confidence = 0.85;
        method = 'document_search';
      } else {
        // Fallback to document summary
        reply = docText.substring(0, 200) + '...';
        confidence = 0.75;
        method = 'document_fallback';
      }
    } else {
      // Fallback to keyword-based responses
      const responses = {
        greeting: [
          "Hello! I'm your AI assistant. How can I help you today?",
          "Hi there! I'm here to assist you with any questions.",
          "Greetings! I'm ready to help you with information and support."
        ],
        help: [
          "I can help you with various topics. What specific information do you need?",
          "I'm here to assist you. What would you like to know about?",
          "How can I be of service to you today? I have access to helpful information."
        ],
        budget: [
          "For Amazon business, you typically need $2000-5000 initial investment. This includes inventory, tools, and marketing budget.",
          "Starting an Amazon business requires $2000-3000 minimum for first 3 months, including FBA fees and advertising.",
          "Budget for Amazon business: $2000-5000 startup costs, plus $1000-3000 monthly for ads and operations."
        ],
        amazon: [
          "Amazon business requires proper planning, product research, and marketing strategy. Budget: $2000-5000 initial investment.",
          "For Amazon FBA, you need business registration, inventory budget, and marketing funds. Start with $2000-3000.",
          "Amazon sellers typically need $2000-5000 to start, including inventory, tools, and advertising budget."
        ],
        default: [
          "I understand you're looking for help. Can you be more specific about what you need?",
          "That's an interesting question! Tell me more about what you're trying to find out.",
          "I'm here to help. What specific information are you looking for?"
        ]
      };

      let responseType = 'default';
      
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        responseType = 'greeting';
      } else if (lowerMessage.includes('help') || lowerMessage.includes('assist') || lowerMessage.includes('support')) {
        responseType = 'help';
      } else if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('money') || lowerMessage.includes('investment')) {
        responseType = 'budget';
      } else if (lowerMessage.includes('amazon') || lowerMessage.includes('amz') || lowerMessage.includes('fba') || lowerMessage.includes('business')) {
        responseType = 'amazon';
      }

      const responseOptions = responses[responseType];
      reply = responseOptions[Math.floor(Math.random() * responseOptions.length)];
      confidence = responseType === 'budget' ? 0.8 : responseType === 'amazon' ? 0.8 : 0.6;
    }

    // Enhanced logging for training data
    const ragLog = {
      id: Date.now().toString(),
      message,
      response: reply,
      sessionId: sessionId || 'unknown',
      confidence,
      method,
      sources: relevantDocs.length > 0 ? relevantDocs.map(doc => ({
        id: doc.id,
        title: doc.metadata?.title,
        category: doc.metadata?.category,
        score: confidence
      })) : [],
      userFeedback: null, // Will be updated when user provides feedback
      improvementSuggestions: [],
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      trainingData: {
        keywords: lowerMessage.split(' ').filter(word => word.length > 3),
        intent: responseType || 'unknown',
        context: conversationHistory || [],
        success: confidence > 0.7
      }
    };

    if (!db.ragLogs) {
      db.ragLogs = [];
    }
    db.ragLogs.push(ragLog);
    
    // Save training data for improvement
    if (!db.trainingData) {
      db.trainingData = {
        conversations: [],
        feedback: [],
        improvements: [],
        patterns: []
      };
    }
    
    // Add to training conversations
    db.trainingData.conversations.push({
      id: ragLog.id,
      query: message,
      response: reply,
      confidence,
      method,
      timestamp: new Date().toISOString(),
      sessionId
    });
    
    // Analyze patterns for improvement
    if (confidence < 0.6) {
      db.trainingData.patterns.push({
        type: 'low_confidence',
        query: message,
        response: reply,
        suggestedImprovement: 'Add more specific training data for this topic',
        timestamp: new Date().toISOString()
      });
    }
    
    writeDatabase(db);

    res.json({
      reply: reply,
      sources: relevantDocs.length > 0 ? [{ id: relevantDocs[0].id, score: confidence }] : [{ id: 'fallback', score: confidence }],
      confidence: confidence,
      method: method
    });

  } catch (error) {
    console.error('Error in RAG chat:', error);
    res.status(500).json({ error: 'Failed to process RAG request' });
  }
});

// RAG Ingest Endpoint
app.post('/api/rag/ingest', async (req, res) => {
  try {
    const db = readDatabase(); // Added this line
    const { text, metadata } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Simulate document ingestion (without vector DB for now)
    const docId = Date.now().toString();
    const document = {
      id: docId,
      text: text.trim(),
      metadata: {
        ...metadata,
        createdAt: new Date().toISOString(),
        status: 'ingested'
      }
    };

    if (!db.ragDocuments) {
      db.ragDocuments = [];
    }
    db.ragDocuments.push(document);
    writeDatabase(db);

    res.json({
      id: docId,
      success: true,
      message: "Document ingested successfully (simulated)"
    });

  } catch (error) {
    console.error('Error ingesting document:', error);
    res.status(500).json({ error: 'Failed to ingest document' });
  }
});

// Training Feedback Endpoint
app.post('/api/rag/feedback', async (req, res) => {
  try {
    const db = readDatabase();
    const { conversationId, rating, feedback, improvement } = req.body;
    
    if (!conversationId || !rating) {
      return res.status(400).json({ error: 'Conversation ID and rating are required' });
    }

    // Find the conversation
    const conversation = db.ragLogs?.find(log => log.id === conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Update conversation with feedback
    conversation.userFeedback = {
      rating: parseInt(rating), // 1-5 scale
      feedback: feedback || '',
      improvement: improvement || '',
      timestamp: new Date().toISOString()
    };

    // Add to training feedback
    if (!db.trainingData) {
      db.trainingData = { conversations: [], feedback: [], improvements: [], patterns: [] };
    }
    
    db.trainingData.feedback.push({
      conversationId,
      rating: parseInt(rating),
      feedback,
      improvement,
      originalQuery: conversation.message,
      originalResponse: conversation.response,
      timestamp: new Date().toISOString()
    });

    // Generate improvement suggestions
    if (rating <= 2) {
      db.trainingData.improvements.push({
        type: 'negative_feedback',
        conversationId,
        suggestion: 'Consider adding more training data for this topic',
        priority: 'high',
        timestamp: new Date().toISOString()
      });
    }

    writeDatabase(db);
    res.json({ success: true, message: 'Feedback recorded for training' });

  } catch (error) {
    console.error('Error recording feedback:', error);
    res.status(500).json({ error: 'Failed to record feedback' });
  }
});

// Training Analytics Endpoint
app.get('/api/rag/training/analytics', async (req, res) => {
  try {
    const db = readDatabase();
    
    if (!db.trainingData) {
      return res.json({
        totalConversations: 0,
        averageConfidence: 0,
        feedbackStats: { positive: 0, negative: 0, neutral: 0 },
        improvementAreas: [],
        patterns: []
      });
    }

    const conversations = db.trainingData.conversations || [];
    const feedback = db.trainingData.feedback || [];
    const patterns = db.trainingData.patterns || [];

    // Calculate analytics
    const totalConversations = conversations.length;
    const averageConfidence = conversations.length > 0 
      ? conversations.reduce((sum, conv) => sum + conv.confidence, 0) / conversations.length 
      : 0;

    const feedbackStats = {
      positive: feedback.filter(f => f.rating >= 4).length,
      negative: feedback.filter(f => f.rating <= 2).length,
      neutral: feedback.filter(f => f.rating === 3).length
    };

    const improvementAreas = patterns.map(pattern => ({
      type: pattern.type,
      count: patterns.filter(p => p.type === pattern.type).length,
      suggestion: pattern.suggestedImprovement
    }));

    res.json({
      totalConversations,
      averageConfidence: Math.round(averageConfidence * 100) / 100,
      feedbackStats,
      improvementAreas,
      patterns: patterns.slice(-10), // Last 10 patterns
      recentFeedback: feedback.slice(-5) // Last 5 feedback entries
    });

  } catch (error) {
    console.error('Error getting training analytics:', error);
    res.status(500).json({ error: 'Failed to get training analytics' });
  }
});

// Export Training Data
app.get('/api/rag/training/export', async (req, res) => {
  try {
    const db = readDatabase();
    
    const exportData = {
      conversations: db.trainingData?.conversations || [],
      feedback: db.trainingData?.feedback || [],
      patterns: db.trainingData?.patterns || [],
      documents: db.ragDocuments || [],
      exportDate: new Date().toISOString(),
      totalRecords: (db.trainingData?.conversations?.length || 0) + (db.trainingData?.feedback?.length || 0)
    };

    res.json(exportData);

  } catch (error) {
    console.error('Error exporting training data:', error);
    res.status(500).json({ error: 'Failed to export training data' });
  }
});

// ==================== AUTOMATION ENDPOINTS ====================

// Get all automations
app.get('/api/automation', async (req, res) => {
  try {
    const db = readDatabase();
    const automations = db.automations || [];
    res.json({ automations });
  } catch (error) {
    console.error('Error fetching automations:', error);
    res.status(500).json({ error: 'Failed to fetch automations' });
  }
});

// Create new automation
app.post('/api/automation', async (req, res) => {
  try {
    const db = readDatabase();
    const { name, category, trigger, actions, conditions } = req.body;
    
    if (!name || !category || !trigger) {
      return res.status(400).json({ error: 'Name, category, and trigger are required' });
    }

    const automation = {
      id: Date.now().toString(),
      name,
      category,
      status: 'draft',
      trigger,
      actions: actions || [],
      conditions: conditions || [],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      stats: {
        executions: 0,
        successRate: 0,
        lastExecuted: null
      }
    };

    if (!db.automations) {
      db.automations = [];
    }
    db.automations.push(automation);
    writeDatabase(db);

    res.json({ success: true, automation });
  } catch (error) {
    console.error('Error creating automation:', error);
    res.status(500).json({ error: 'Failed to create automation' });
  }
});

// Update automation
app.put('/api/automation/:id', async (req, res) => {
  try {
    const db = readDatabase();
    const { id } = req.params;
    const updates = req.body;

    if (!db.automations) {
      return res.status(404).json({ error: 'Automation not found' });
    }

    const automationIndex = db.automations.findIndex(auto => auto.id === id);
    if (automationIndex === -1) {
      return res.status(404).json({ error: 'Automation not found' });
    }

    db.automations[automationIndex] = {
      ...db.automations[automationIndex],
      ...updates,
      lastModified: new Date().toISOString()
    };

    writeDatabase(db);
    res.json({ success: true, automation: db.automations[automationIndex] });
  } catch (error) {
    console.error('Error updating automation:', error);
    res.status(500).json({ error: 'Failed to update automation' });
  }
});

// Delete automation
app.delete('/api/automation/:id', async (req, res) => {
  try {
    const db = readDatabase();
    const { id } = req.params;

    if (!db.automations) {
      return res.status(404).json({ error: 'Automation not found' });
    }

    db.automations = db.automations.filter(auto => auto.id !== id);
    writeDatabase(db);

    res.json({ success: true, message: 'Automation deleted' });
  } catch (error) {
    console.error('Error deleting automation:', error);
    res.status(500).json({ error: 'Failed to delete automation' });
  }
});

// Execute automation
app.post('/api/automation/:id/execute', async (req, res) => {
  try {
    const db = readDatabase();
    const { id } = req.params;
    const { context } = req.body;

    const automation = db.automations?.find(auto => auto.id === id);
    if (!automation) {
      return res.status(404).json({ error: 'Automation not found' });
    }

    if (automation.status !== 'active') {
      return res.status(400).json({ error: 'Automation is not active' });
    }

    // Simulate automation execution
    const execution = {
      id: Date.now().toString(),
      automationId: id,
      status: 'success',
      executedAt: new Date().toISOString(),
      context,
      results: []
    };

    // Log execution
    if (!db.automationExecutions) {
      db.automationExecutions = [];
    }
    db.automationExecutions.push(execution);

    // Update automation stats
    automation.stats.executions += 1;
    automation.stats.lastExecuted = new Date().toISOString();

    writeDatabase(db);

    res.json({ 
      success: true, 
      execution,
      message: `Automation "${automation.name}" executed successfully`
    });
  } catch (error) {
    console.error('Error executing automation:', error);
    res.status(500).json({ error: 'Failed to execute automation' });
  }
});

// Get automation analytics
app.get('/api/automation/analytics', async (req, res) => {
  try {
    const db = readDatabase();
    
    const automations = db.automations || [];
    const executions = db.automationExecutions || [];

    const analytics = {
      totalAutomations: automations.length,
      activeAutomations: automations.filter(auto => auto.status === 'active').length,
      totalExecutions: executions.length,
      successRate: executions.length > 0 
        ? (executions.filter(exec => exec.status === 'success').length / executions.length) * 100 
        : 0,
      categoryBreakdown: {},
      recentExecutions: executions.slice(-10)
    };

    // Calculate category breakdown
    automations.forEach(auto => {
      if (!analytics.categoryBreakdown[auto.category]) {
        analytics.categoryBreakdown[auto.category] = 0;
      }
      analytics.categoryBreakdown[auto.category]++;
    });

    res.json(analytics);
  } catch (error) {
    console.error('Error getting automation analytics:', error);
    res.status(500).json({ error: 'Failed to get automation analytics' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 ChatFlow AI Backend running on port ${PORT}`);
  console.log(`📧 SuperAdmin: johnindreica@gmail.com`);
  console.log(`🔑 Password: SuperAdmin123!`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Database: ${DB_FILE}`);
  console.log(`🔐 OAuth providers: Google, Microsoft, Apple, GitHub`);
  console.log(`📱 2FA methods: TOTP, SMS, Email`);
  console.log(`🔗 Magic Link login enabled`);
  console.log(`🔐 RBAC system enabled with 6 user levels`);
  console.log(`🤖 Bot testing endpoints: /api/bot/test, /api/bot/tests`);
  console.log(`🧠 RAG endpoints: /api/rag/chat, /api/rag/ingest`);
  console.log(`🤖 Automation endpoints: /api/automation/*`);
});
