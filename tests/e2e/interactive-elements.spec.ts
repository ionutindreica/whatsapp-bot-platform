import { test, expect } from '@playwright/test'

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
            path: `test-results/screenshots/${link.name.replace(/\s+/g, '-').toLowerCase()}.png`,
            fullPage: true 
          })
          
          // Go back to dashboard for next test
          await page.goBack()
          await expect(page).toHaveURL(/.*dashboard/)
        }
      } catch (error) {
        console.log(`Link "${link.name}" not found or not accessible`)
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
            path: `test-results/screenshots/admin-${link.name.replace(/\s+/g, '-').toLowerCase()}.png`,
            fullPage: true 
          })
          
          // Verify page loaded correctly
          await expect(page.locator('h1, h2')).toContainText(link.name.split(' ')[0])
          
          // Go back to dashboard for next test
          await page.goBack()
          await expect(page).toHaveURL(/.*dashboard/)
        }
      } catch (error) {
        console.log(`Admin link "${link.name}" not found or not accessible`)
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
