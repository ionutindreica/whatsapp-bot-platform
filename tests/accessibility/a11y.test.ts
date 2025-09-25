import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test('should not have any automatically detectable accessibility issues on login page', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login')
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should not have any automatically detectable accessibility issues on dashboard', async ({ page }) => {
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
    
    await expect(page).toHaveURL(/.*dashboard/)
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper heading structure', async ({ page }) => {
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
    
    await expect(page).toHaveURL(/.*dashboard/)
    
    // Check for proper heading hierarchy
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    
    const headings = page.locator('h1, h2, h3, h4, h5, h6')
    const headingTexts = await headings.allTextContents()
    
    // Should have at least one main heading
    expect(headingTexts.length).toBeGreaterThan(0)
  })

  test('should have proper form labels and ARIA attributes', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login')
    
    // Check form labels
    const emailInput = page.getByLabel('Email')
    const passwordInput = page.getByLabel('Password')
    
    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    
    // Check ARIA attributes
    await expect(emailInput).toHaveAttribute('type', 'email')
    await expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Check for required attributes
    await expect(emailInput).toHaveAttribute('required')
    await expect(passwordInput).toHaveAttribute('required')
  })

  test('should have proper button accessibility', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login')
    
    const signInButton = page.getByRole('button', { name: 'Sign In' })
    await expect(signInButton).toBeVisible()
    await expect(signInButton).toHaveAttribute('type', 'submit')
    
    // Check for loading state accessibility
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Password').fill('password123')
    await signInButton.click()
    
    // Button should be disabled during loading
    await expect(signInButton).toBeDisabled()
  })

  test('should have proper link accessibility', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login')
    
    const forgotPasswordLink = page.getByRole('link', { name: /forgot password/i })
    const registerLink = page.getByRole('link', { name: /don't have an account/i })
    
    await expect(forgotPasswordLink).toBeVisible()
    await expect(registerLink).toBeVisible()
    
    // Links should have proper href attributes
    await expect(forgotPasswordLink).toHaveAttribute('href', '/auth/forgot-password')
    await expect(registerLink).toHaveAttribute('href', '/auth/register')
  })

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['color-contrast'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login')
    
    // Tab through form elements
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Email')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Password')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: /forgot password/i })).toBeFocused()
  })

  test('should have proper focus indicators', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login')
    
    // Focus on elements and check for visible focus indicators
    await page.getByLabel('Email').focus()
    const emailFocusStyles = await page.getByLabel('Email').evaluate(el => 
      window.getComputedStyle(el).outline
    )
    expect(emailFocusStyles).not.toBe('none')
    
    await page.getByLabel('Password').focus()
    const passwordFocusStyles = await page.getByLabel('Password').evaluate(el => 
      window.getComputedStyle(el).outline
    )
    expect(passwordFocusStyles).not.toBe('none')
  })

  test('should have proper ARIA landmarks', async ({ page }) => {
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
    
    await expect(page).toHaveURL(/.*dashboard/)
    
    // Check for main navigation landmark
    await expect(page.getByRole('navigation')).toBeVisible()
    
    // Check for main content landmark
    await expect(page.getByRole('main')).toBeVisible()
  })

  test('should have proper error message accessibility', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login')
    
    // Submit empty form to trigger validation errors
    await page.getByRole('button', { name: 'Sign In' }).click()
    
    // Check that error messages are properly associated with form fields
    const emailError = page.getByText('Email is required')
    const passwordError = page.getByText('Password is required')
    
    await expect(emailError).toBeVisible()
    await expect(passwordError).toBeVisible()
    
    // Error messages should have proper ARIA attributes
    await expect(emailError).toHaveAttribute('role', 'alert')
    await expect(passwordError).toHaveAttribute('role', 'alert')
  })

  test('should work with screen reader', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login')
    
    // Check for proper ARIA labels and descriptions
    const emailInput = page.getByLabel('Email')
    const passwordInput = page.getByLabel('Password')
    
    await expect(emailInput).toHaveAttribute('aria-required', 'true')
    await expect(passwordInput).toHaveAttribute('aria-required', 'true')
    
    // Check for proper button labels
    const signInButton = page.getByRole('button', { name: 'Sign In' })
    await expect(signInButton).toHaveAttribute('type', 'submit')
  })

  test('should handle dynamic content changes accessibly', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login')
    
    // Mock failed login to test error message accessibility
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Invalid credentials',
        }),
      })
    })

    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Sign In' }).click()
    
    // Error message should be announced to screen readers
    const errorMessage = page.getByText('Invalid credentials')
    await expect(errorMessage).toBeVisible()
    await expect(errorMessage).toHaveAttribute('role', 'alert')
  })
})
