import { test, expect } from '@playwright/test'

test.describe('Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
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

    // Login first
    await page.goto('http://localhost:3000/auth/login')
    await page.getByLabel('Email').fill('admin@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    
    // Wait for dashboard to load
    await expect(page).toHaveURL(/.*dashboard/)
  })

  test('should render sidebar with all navigation items', async ({ page }) => {
    // Check main sections
    await expect(page.getByText('Dashboard')).toBeVisible()
    await expect(page.getByText('Channels')).toBeVisible()
    await expect(page.getByText('AI & Automation')).toBeVisible()
    await expect(page.getByText('Team')).toBeVisible()
    
    // Check specific navigation items
    await expect(page.getByRole('link', { name: /overview/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /analytics/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /whatsapp/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /messenger/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /core ai/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /automation/i })).toBeVisible()
  })

  test('should show ROOT_OWNER specific sections', async ({ page }) => {
    await expect(page.getByText('Root Admin')).toBeVisible()
    await expect(page.getByRole('link', { name: /root owner dashboard/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /users management/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /roles & permissions/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /workspaces management/i })).toBeVisible()
  })

  test('should navigate to different dashboard sections', async ({ page }) => {
    // Test Overview navigation
    await page.getByRole('link', { name: /overview/i }).click()
    await expect(page).toHaveURL(/.*dashboard\/overview/)
    
    // Test Analytics navigation
    await page.getByRole('link', { name: /analytics/i }).click()
    await expect(page).toHaveURL(/.*dashboard\/analytics/)
    
    // Test WhatsApp navigation
    await page.getByRole('link', { name: /whatsapp/i }).click()
    await expect(page).toHaveURL(/.*dashboard\/channels\/whatsapp/)
    
    // Test Core AI navigation
    await page.getByRole('link', { name: /core ai/i }).click()
    await expect(page).toHaveURL(/.*dashboard\/ai\/core/)
  })

  test('should navigate to admin sections', async ({ page }) => {
    // Test Root Owner Dashboard
    await page.getByRole('link', { name: /root owner dashboard/i }).click()
    await expect(page).toHaveURL(/.*dashboard\/root/)
    
    // Test Users Management
    await page.getByRole('link', { name: /users management/i }).click()
    await expect(page).toHaveURL(/.*dashboard\/admin\/users/)
    
    // Test Roles & Permissions
    await page.getByRole('link', { name: /roles & permissions/i }).click()
    await expect(page).toHaveURL(/.*dashboard\/admin\/roles/)
    
    // Test Workspaces Management
    await page.getByRole('link', { name: /workspaces management/i }).click()
    await expect(page).toHaveURL(/.*dashboard\/admin\/workspaces/)
  })

  test('should display user information in sidebar', async ({ page }) => {
    await expect(page.getByText('Super Admin')).toBeVisible()
    await expect(page.getByText('admin@example.com')).toBeVisible()
    await expect(page.getByText('ROOT OWNER')).toBeVisible()
  })

  test('should handle logout functionality', async ({ page }) => {
    await page.route('**/api/auth/logout', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })

    await page.getByRole('button', { name: /logout/i }).click()
    
    // Should redirect to login page
    await expect(page).toHaveURL(/.*auth\/login/)
  })
})

test.describe('Super Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication and data
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

    await page.route('**/api/admin/stats', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          totalUsers: 150,
          activeUsers: 120,
          totalWorkspaces: 25,
          totalBots: 45,
          totalMessages: 12500,
          systemUptime: '99.9%',
        }),
      })
    })

    await page.route('**/api/admin/users', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          users: [
            {
              id: '1',
              email: 'user1@example.com',
              name: 'User One',
              status: 'ACTIVE',
              role: 'CLIENT',
              lastLoginAt: '2024-01-20T10:00:00Z',
            },
          ],
        }),
      })
    })

    // Login and navigate to admin dashboard
    await page.goto('http://localhost:3000/auth/login')
    await page.getByLabel('Email').fill('admin@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    
    await page.getByRole('link', { name: /root owner dashboard/i }).click()
  })

  test('should display dashboard stats correctly', async ({ page }) => {
    await expect(page.getByText('Root Owner Dashboard')).toBeVisible()
    await expect(page.getByText('150')).toBeVisible() // Total Users
    await expect(page.getByText('120')).toBeVisible() // Active Users
    await expect(page.getByText('25')).toBeVisible() // Total Workspaces
    await expect(page.getByText('45')).toBeVisible() // Total Bots
  })

  test('should display admin management tools', async ({ page }) => {
    await expect(page.getByText('Admin Management Tools')).toBeVisible()
    await expect(page.getByRole('link', { name: /user management/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /audit logs/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /role management/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /session management/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /security dashboard/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /gdpr tools/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /access control/i })).toBeVisible()
  })

  test('should navigate to admin management pages', async ({ page }) => {
    // Test User Management navigation
    await page.getByRole('link', { name: /user management/i }).click()
    await expect(page).toHaveURL(/.*dashboard\/admin\/users/)
    
    // Go back to dashboard
    await page.goBack()
    
    // Test Audit Logs navigation
    await page.getByRole('link', { name: /audit logs/i }).click()
    await expect(page).toHaveURL(/.*dashboard\/admin\/audit-logs/)
    
    // Go back to dashboard
    await page.goBack()
    
    // Test Security Dashboard navigation
    await page.getByRole('link', { name: /security dashboard/i }).click()
    await expect(page).toHaveURL(/.*dashboard\/admin\/security/)
  })

  test('should handle user actions', async ({ page }) => {
    await page.route('**/api/admin/users/*/suspend', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })

    // Find and click suspend button
    const suspendButton = page.getByRole('button', { name: /suspend/i }).first()
    await suspendButton.click()
    
    // Should show success message or update UI
    await expect(page.getByText(/success/i)).toBeVisible()
  })

  test('should refresh data when refresh button is clicked', async ({ page }) => {
    let requestCount = 0
    
    await page.route('**/api/admin/stats', async route => {
      requestCount++
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          totalUsers: 150 + requestCount, // Increment to show refresh worked
          activeUsers: 120,
          totalWorkspaces: 25,
          totalBots: 45,
          totalMessages: 12500,
          systemUptime: '99.9%',
        }),
      })
    })

    // Click refresh button
    await page.getByRole('button', { name: /refresh/i }).click()
    
    // Should refetch data
    await expect(page.getByText('151')).toBeVisible() // Updated total users
  })
})

test.describe('Responsive Design', () => {
  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
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

    await page.goto('http://localhost:3000/auth/login')
    await page.getByLabel('Email').fill('admin@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    
    // Should still show navigation (possibly in mobile menu)
    await expect(page.getByText('Dashboard')).toBeVisible()
  })

  test('should work on tablet devices', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    
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

    await page.goto('http://localhost:3000/auth/login')
    await page.getByLabel('Email').fill('admin@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    
    // Should show full navigation
    await expect(page.getByText('Dashboard')).toBeVisible()
    await expect(page.getByText('Channels')).toBeVisible()
  })
})
