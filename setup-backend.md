# 🚀 ChatFlow AI Backend Setup Guide

## 📋 **Prerequisites**
- Node.js 18+ installed
- MySQL database running
- Stripe account (for payments)
- SendGrid account (for emails)

## 🔧 **Setup Steps**

### 1. **Install Dependencies**
```bash
cd backend
npm install
```

### 2. **Database Setup**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Open Prisma Studio
npm run db:studio
```

### 3. **Environment Variables**
Copy `env.local` to `.env` and update with your values:

```bash
cp env.local .env
```

**Required Environment Variables:**
- `DATABASE_URL` - Your MySQL connection string
- `JWT_SECRET` - A secure random string
- `SENDGRID_API_KEY` - Your SendGrid API key
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key

### 4. **Start Backend Server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 5. **Test API**
```bash
# Run API tests
node test-api.js
```

## 🌐 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### **User Management**
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/usage` - Get usage statistics
- `GET /api/user/subscription` - Get subscription info
- `PUT /api/user/change-password` - Change password

### **Billing & Payments**
- `GET /api/billing/plans` - Get subscription plans
- `POST /api/billing/create-checkout-session` - Create Stripe checkout
- `POST /api/billing/create-portal-session` - Create customer portal
- `POST /api/billing/webhook` - Stripe webhook handler

## 🔐 **Security Features**
- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation

## 📧 **Email Features**
- Email verification
- Password reset emails
- Welcome emails
- Beautiful HTML templates

## 💳 **Payment Features**
- Stripe integration
- Subscription management
- Webhook handling
- Customer portal

## 🚨 **Troubleshooting**

### **Database Connection Issues**
```bash
# Check if MySQL is running
mysql -u root -p

# Test connection
mysql -u root -p -e "SHOW DATABASES;"
```

### **Port Already in Use**
```bash
# Kill process on port 3001
npx kill-port 3001
```

### **Environment Variables Not Loading**
```bash
# Check if .env file exists
ls -la .env

# Verify file permissions
chmod 644 .env
```

## 📊 **Monitoring**
- Health check: `GET /health`
- Prisma Studio: `npm run db:studio`
- API testing: `node test-api.js`

## 🔄 **Development Workflow**
1. Make changes to code
2. Restart server: `npm run dev`
3. Test endpoints: `node test-api.js`
4. Check database: `npm run db:studio`

## 🚀 **Production Deployment**
1. Set `NODE_ENV=production`
2. Use production database
3. Configure production Stripe keys
4. Set up proper email service
5. Configure webhook endpoints
6. Set up monitoring and logging

---

**Backend will run on:** `http://localhost:3001`
**API Base URL:** `http://localhost:3001/api`
**Health Check:** `http://localhost:3001/health`
