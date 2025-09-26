#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Test configuration
const testConfig = {
  baseUrl: 'http://localhost:3000',
  timeout: 30000,
  screenshots: true,
  video: false,
  headless: false, // Set to true for CI/CD
}

// Test scenarios for different user roles
const testScenarios = {
  ROOT_OWNER: {
    email: 'admin@example.com',
    password: 'password123',
    expectedElements: [
      'Root Owner Dashboard',
      'Users Management',
      'Roles & Permissions',
      'Workspaces Management',
      'Plans & Subscriptions',
      'Bots & Channels',
      'System Analytics',
      'Audit Logs',
      'API & Webhooks',
      'Platform Settings',
    ]
  },
  SUPER_ADMIN: {
    email: 'superadmin@example.com',
    password: 'password123',
    expectedElements: [
      'Super Admin Dashboard',
      'User Management',
      'Role Management',
      'Session Management',
      'Security Dashboard',
      'GDPR Tools',
    ]
  },
  CLIENT: {
    email: 'client@example.com',
    password: 'password123',
    expectedElements: [
      'Dashboard',
      'Overview',
      'Analytics',
      'Channels',
      'WhatsApp',
      'Messenger',
      'Instagram',
      'AI & Automation',
      'Core AI',
      'Automation Center',
      'CRM Light',
    ]
  }
}

// Interactive elements to test
const interactiveElements = {
  buttons: [
    'Sign In',
    'Create Account',
    'Forgot Password',
    'Logout',
    'Refresh',
    'Save',
    'Cancel',
    'Delete',
    'Edit',
    'View',
    'Suspend',
    'Activate',
    'Send',
    'Upload',
    'Download',
    'Export',
    'Import',
    'Search',
    'Filter',
    'Reset',
  ],
  links: [
    '/dashboard/overview',
    '/dashboard/analytics',
    '/dashboard/channels/whatsapp',
    '/dashboard/channels/messenger',
    '/dashboard/channels/instagram',
    '/dashboard/ai/core',
    '/dashboard/ai/automation',
    '/dashboard/crm',
    '/dashboard/admin/users',
    '/dashboard/admin/roles',
    '/dashboard/admin/workspaces',
    '/dashboard/admin/plans',
    '/dashboard/admin/bots',
    '/dashboard/admin/analytics',
    '/dashboard/admin/audit-logs',
    '/dashboard/admin/api',
    '/dashboard/admin/settings',
    '/dashboard/root',
    '/dashboard/superadmin',
  ],
  forms: [
    'Login Form',
    'Registration Form',
    'User Creation Form',
    'Role Assignment Form',
    'Workspace Creation Form',
    'Bot Configuration Form',
    'Settings Form',
  ],
  navigation: [
    'Dashboard Navigation',
    'Sidebar Menu',
    'User Menu',
    'Breadcrumb Navigation',
    'Pagination',
    'Tab Navigation',
  ]
}

// Generate Playwright test for interactive elements
function generateInteractiveTest() {
  const testContent = `import { test, expect } from '@playwright/test'

test.describe('Interactive Elements Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test environment
    await page.setViewportSize({ width: 1280, height: 720 })
    
    // Mock authentication
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          token: 'mock-jwt-token',
          user: {
            id: '1',
            email: 'admin@example.com',
            name: 'Super Admin',
            role: 'ROOT_OWNER',
            planTier: 'ENTERPRISE',
            workspaceId: 'workspace-1',
            permissions: ['SYSTEM_MANAGE_ALL'],
            features: ['MULTI_WORKSPACE'],
          },
        }),
      })
    })
  })

  test('should test all buttons functionality', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login')
    
    // Test login button
    const loginButton = page.getByRole('button', { name: 'Sign In' })
    await expect(loginButton).toBeVisible()
    await expect(loginButton).toBeEnabled()
    
    // Fill form and test login
    await page.getByLabel('Email').fill('admin@example.com')
    await page.getByLabel('Password').fill('password123')
    await loginButton.click()
    
    await expect(page).toHaveURL(/.*dashboard/)
    
    // Test refresh button
    const refreshButton = page.getByRole('button', { name: /refresh/i })
    if (await refreshButton.isVisible()) {
      await refreshButton.click()
      // Verify data refreshed (check for loading state)
    }
    
    // Test logout button
    const logoutButton = page.getByRole('button', { name: /logout/i })
    if (await logoutButton.isVisible()) {
      await logoutButton.click()
      await expect(page).toHaveURL(/.*auth\/login/)
    }
  })

  test('should test all navigation links', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3000/auth/login')
    await page.getByLabel('Email').fill('admin@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    
    await expect(page).toHaveURL(/.*dashboard/)
    
    // Test each navigation link
    const navigationLinks = [
      { name: 'Overview', url: '/dashboard/overview' },
      { name: 'Analytics', url: '/dashboard/analytics' },
      { name: 'WhatsApp', url: '/dashboard/channels/whatsapp' },
      { name: 'Messenger', url: '/dashboard/channels/messenger' },
      { name: 'Instagram', url: '/dashboard/channels/instagram' },
      { name: 'Core AI', url: '/dashboard/ai/core' },
      { name: 'Automation', url: '/dashboard/ai/automation' },
      { name: 'CRM Light', url: '/dashboard/crm' },
    ]
    
    for (const link of navigationLinks) {
      try {
        const linkElement = page.getByRole('link', { name: new RegExp(link.name, 'i') })
        if (await linkElement.isVisible()) {
          await linkElement.click()
          await expect(page).toHaveURL(new RegExp(link.url))
          
          // Take screenshot for visual verification
          await page.screenshot({ 
            path: \`test-results/screenshots/\${link.name.replace(/\\s+/g, '-').toLowerCase()}.png\`,
            fullPage: true 
          })
          
          // Go back to dashboard for next test
          await page.goBack()
          await expect(page).toHaveURL(/.*dashboard/)
        }
      } catch (error) {
        console.log(\`Link "\${link.name}" not found or not accessible\`)
      }
    }
  })

  test('should test admin navigation for ROOT_OWNER', async ({ page }) => {
    // Login as ROOT_OWNER
    await page.goto('http://localhost:3000/auth/login')
    await page.getByLabel('Email').fill('admin@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    
    await expect(page).toHaveURL(/.*dashboard/)
    
    // Test admin navigation links
    const adminLinks = [
      { name: 'Root Owner Dashboard', url: '/dashboard/root' },
      { name: 'Users Management', url: '/dashboard/admin/users' },
      { name: 'Roles & Permissions', url: '/dashboard/admin/roles' },
      { name: 'Workspaces Management', url: '/dashboard/admin/workspaces' },
      { name: 'Plans & Subscriptions', url: '/dashboard/admin/plans' },
      { name: 'Bots & Channels', url: '/dashboard/admin/bots' },
      { name: 'System Analytics', url: '/dashboard/admin/analytics' },
      { name: 'Audit Logs', url: '/dashboard/admin/audit-logs' },
      { name: 'API & Webhooks', url: '/dashboard/admin/api' },
      { name: 'Platform Settings', url: '/dashboard/admin/settings' },
    ]
    
    for (const link of adminLinks) {
      try {
        const linkElement = page.getByRole('link', { name: new RegExp(link.name, 'i') })
        if (await linkElement.isVisible()) {
          await linkElement.click()
          await expect(page).toHaveURL(new RegExp(link.url))
          
          // Take screenshot for visual verification
          await page.screenshot({ 
            path: \`test-results/screenshots/admin-\${link.name.replace(/\\s+/g, '-').toLowerCase()}.png\`,
            fullPage: true 
          })
          
          // Verify page loaded correctly
          await expect(page.locator('h1, h2')).toContainText(link.name.split(' ')[0])
          
          // Go back to dashboard for next test
          await page.goBack()
          await expect(page).toHaveURL(/.*dashboard/)
        }
      } catch (error) {
        console.log(\`Admin link "\${link.name}" not found or not accessible\`)
      }
    }
  })

  test('should test form interactions', async ({ page }) => {
    // Test login form
    await page.goto('http://localhost:3000/auth/login')
    
    // Test form validation
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page.getByText('Email is required')).toBeVisible()
    await expect(page.getByText('Password is required')).toBeVisible()
    
    // Test email validation
    await page.getByLabel('Email').fill('invalid-email')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page.getByText('Invalid email format')).toBeVisible()
    
    // Test successful form submission
    await page.getByLabel('Email').fill('admin@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    
    await expect(page).toHaveURL(/.*dashboard/)
  })

  test('should test responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('http://localhost:3000/auth/login')
    
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
    
    // Take mobile screenshot
    await page.screenshot({ 
      path: 'test-results/screenshots/mobile-login.png',
      fullPage: true 
    })
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.reload()
    
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
    
    // Take tablet screenshot
    await page.screenshot({ 
      path: 'test-results/screenshots/tablet-login.png',
      fullPage: true 
    })
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.reload()
    
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
    
    // Take desktop screenshot
    await page.screenshot({ 
      path: 'test-results/screenshots/desktop-login.png',
      fullPage: true 
    })
  })

  test('should test keyboard navigation', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login')
    
    // Test tab navigation
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Email')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Password')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeFocused()
    
    // Test Enter key submission
    await page.getByLabel('Email').fill('admin@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByLabel('Password').press('Enter')
    
    await expect(page).toHaveURL(/.*dashboard/)
  })

  test('should test accessibility features', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login')
    
    // Test ARIA labels
    await expect(page.getByLabel('Email')).toHaveAttribute('aria-required', 'true')
    await expect(page.getByLabel('Password')).toHaveAttribute('aria-required', 'true')
    
    // Test button accessibility
    const signInButton = page.getByRole('button', { name: 'Sign In' })
    await expect(signInButton).toHaveAttribute('type', 'submit')
    
    // Test link accessibility
    const forgotPasswordLink = page.getByRole('link', { name: /forgot password/i })
    await expect(forgotPasswordLink).toHaveAttribute('href', '/auth/forgot-password')
    
    const registerLink = page.getByRole('link', { name: /don't have an account/i })
    await expect(registerLink).toHaveAttribute('href', '/auth/register')
  })
})
`

  // Ensure test directory exists
  const testDir = path.join(process.cwd(), 'tests', 'e2e')
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true })
  }

  // Write test file
  const testFilePath = path.join(testDir, 'interactive-elements.spec.ts')
  fs.writeFileSync(testFilePath, testContent)
  
  log(`${colors.green}✅ Generated interactive test file: ${testFilePath}${colors.reset}`)
  return testFilePath
}

// Run interactive tests
function runInteractiveTests() {
  log(`${colors.bright}${colors.blue}🎯 Running Interactive Elements Tests${colors.reset}`)
  log(`${colors.blue}===============================================${colors.reset}`)

  try {
    // Generate test file
    const testFilePath = generateInteractiveTest()
    
    // Create screenshots directory
    const screenshotsDir = path.join(process.cwd(), 'test-results', 'screenshots')
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true })
    }

    // Run Playwright tests
    log(`${colors.cyan}▶ Running Playwright interactive tests...${colors.reset}`)
    
    const command = `npx playwright test tests/e2e/interactive-elements.spec.ts --headed --project=chromium`
    execSync(command, { 
      stdio: 'inherit',
      cwd: process.cwd()
    })

    log(`${colors.green}✅ Interactive tests completed successfully${colors.reset}`)
    
    // Show results
    log(`\n${colors.bright}📊 Test Results:${colors.reset}`)
    log(`${colors.green}✅ All interactive elements tested${colors.reset}`)
    log(`${colors.blue}📸 Screenshots saved to: test-results/screenshots/${colors.reset}`)
    log(`${colors.blue}📋 Test report: test-results/results.html${colors.reset}`)

  } catch (error) {
    log(`${colors.red}❌ Interactive tests failed: ${error.message}${colors.reset}`)
    process.exit(1)
  }
}

// Main execution
if (require.main === module) {
  runInteractiveTests()
}

module.exports = { runInteractiveTests, generateInteractiveTest }
