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

app.listen(PORT, () => {
  console.log(`🚀 ChatFlow AI Backend running on port ${PORT}`);
  console.log(`📧 SuperAdmin: johnindreica@gmail.com`);
  console.log(`🔑 Password: SuperAdmin123!`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Database: ${DB_FILE}`);
  console.log(`🔐 OAuth providers: Google, Microsoft, Apple, GitHub`);
  console.log(`📱 2FA methods: TOTP, SMS, Email`);
  console.log(`🔗 Magic Link login enabled`);
});
