import { test, expect } from '@playwright/test'

test.describe('Performance Tests', () => {
  test('should load login page within performance budget', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('http://localhost:3000/auth/login')
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle')
    
    const loadTime = Date.now() - startTime
    
    // Should load within 2 seconds
    expect(loadTime).toBeLessThan(2000)
    
    // Check for performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      }
    })
    
    // DOM should be ready within 1 second
    expect(performanceMetrics.domContentLoaded).toBeLessThan(1000)
    
    // Page should be fully loaded within 2 seconds
    expect(performanceMetrics.loadComplete).toBeLessThan(2000)
  })

  test('should load dashboard within performance budget', async ({ page }) => {
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

    const startTime = Date.now()
    
    await page.goto('http://localhost:3000/auth/login')
    await page.getByLabel('Email').fill('admin@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    
    await expect(page).toHaveURL(/.*dashboard/)
    await page.waitForLoadState('networkidle')
    
    const loadTime = Date.now() - startTime
    
    // Dashboard should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login')
    
    // Measure Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const vitals = {}
          
          entries.forEach((entry) => {
            if (entry.name === 'LCP') {
              vitals.lcp = entry.startTime
            } else if (entry.name === 'FID') {
              vitals.fid = entry.duration
            } else if (entry.name === 'CLS') {
              vitals.cls = entry.value
            }
          })
          
          resolve(vitals)
        })
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
        
        // Fallback if no entries are captured
        setTimeout(() => resolve({}), 5000)
      })
    })
    
    // LCP should be under 2.5 seconds
    if (vitals.lcp) {
      expect(vitals.lcp).toBeLessThan(2500)
    }
    
    // FID should be under 100ms
    if (vitals.fid) {
      expect(vitals.fid).toBeLessThan(100)
    }
    
    // CLS should be under 0.1
    if (vitals.cls) {
      expect(vitals.cls).toBeLessThan(0.1)
    }
  })

  test('should handle large datasets efficiently', async ({ page }) => {
    // Mock large dataset
    const largeUserList = Array.from({ length: 1000 }, (_, i) => ({
      id: `user-${i}`,
      email: `user${i}@example.com`,
      name: `User ${i}`,
      status: 'ACTIVE',
      role: 'CLIENT',
      lastLoginAt: new Date().toISOString(),
    }))

    await page.route('**/api/admin/users', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ users: largeUserList }),
      })
    })

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

    const startTime = Date.now()
    
    await page.goto('http://localhost:3000/auth/login')
    await page.getByLabel('Email').fill('admin@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    
    await expect(page).toHaveURL(/.*dashboard/)
    
    // Navigate to user management page
    await page.getByRole('link', { name: /users management/i }).click()
    await expect(page).toHaveURL(/.*dashboard\/admin\/users/)
    
    await page.waitForLoadState('networkidle')
    
    const loadTime = Date.now() - startTime
    
    // Should handle large dataset within 5 seconds
    expect(loadTime).toBeLessThan(5000)
    
    // Should show pagination or virtualization for large datasets
    const pagination = page.locator('[data-testid="pagination"]')
    const virtualList = page.locator('[data-testid="virtual-list"]')
    
    expect(pagination.count() > 0 || virtualList.count() > 0).toBeTruthy()
  })

  test('should handle concurrent API requests efficiently', async ({ page }) => {
    let requestCount = 0
    
    // Mock multiple API endpoints with delays
    await page.route('**/api/admin/stats', async route => {
      requestCount++
      await new Promise(resolve => setTimeout(resolve, 100))
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
      requestCount++
      await new Promise(resolve => setTimeout(resolve, 150))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ users: [] }),
      })
    })

    await page.route('**/api/admin/activity', async route => {
      requestCount++
      await new Promise(resolve => setTimeout(resolve, 200))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ activity: [] }),
      })
    })

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

    const startTime = Date.now()
    
    await page.goto('http://localhost:3000/auth/login')
    await page.getByLabel('Email').fill('admin@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    
    await expect(page).toHaveURL(/.*dashboard/)
    await page.waitForLoadState('networkidle')
    
    const loadTime = Date.now() - startTime
    
    // Should handle concurrent requests efficiently
    expect(loadTime).toBeLessThan(1000) // Should be faster than sequential requests
    expect(requestCount).toBe(3) // All three endpoints should be called
  })

  test('should handle slow network conditions', async ({ page, context }) => {
    // Simulate slow 3G network
    await context.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 200))
      await route.continue()
    })

    const startTime = Date.now()
    
    await page.goto('http://localhost:3000/auth/login')
    await page.waitForLoadState('networkidle')
    
    const loadTime = Date.now() - startTime
    
    // Should still load within reasonable time even on slow network
    expect(loadTime).toBeLessThan(5000)
    
    // Should show loading states
    const loadingIndicators = page.locator('[data-testid="loading"]')
    expect(loadingIndicators.count()).toBeGreaterThan(0)
  })

  test('should handle memory efficiently', async ({ page }) => {
    // Navigate to multiple pages to test memory usage
    await page.goto('http://localhost:3000/auth/login')
    
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

    await page.getByLabel('Email').fill('admin@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    
    await expect(page).toHaveURL(/.*dashboard/)
    
    // Navigate to multiple pages
    await page.getByRole('link', { name: /overview/i }).click()
    await page.getByRole('link', { name: /analytics/i }).click()
    await page.getByRole('link', { name: /whatsapp/i }).click()
    await page.getByRole('link', { name: /core ai/i }).click()
    
    // Check memory usage
    const memoryInfo = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory
      }
      return null
    })
    
    if (memoryInfo) {
      // Used JS heap size should be reasonable (less than 50MB)
      expect(memoryInfo.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024)
    }
  })

  test('should handle image loading efficiently', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login')
    
    // Check for image optimization
    const images = await page.locator('img').all()
    
    for (const img of images) {
      // Images should have proper loading attributes
      const loading = await img.getAttribute('loading')
      const decoding = await img.getAttribute('decoding')
      
      if (loading) {
        expect(['lazy', 'eager']).toContain(loading)
      }
      
      if (decoding) {
        expect(['async', 'sync', 'auto']).toContain(decoding)
      }
    }
  })

  test('should handle JavaScript errors gracefully', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('http://localhost:3000/auth/login')
    await page.waitForLoadState('networkidle')
    
    // Should not have critical JavaScript errors
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('404') &&
      !error.includes('network')
    )
    
    expect(criticalErrors.length).toBe(0)
  })
})
