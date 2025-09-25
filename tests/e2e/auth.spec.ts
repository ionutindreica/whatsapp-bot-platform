import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login')
  })

  test('should display login form correctly', async ({ page }) => {
    // Check if login form elements are visible
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
    
    // Check for additional elements
    await expect(page.getByRole('link', { name: /forgot password/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /don't have an account/i })).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign In' }).click()
    
    await expect(page.getByText('Email is required')).toBeVisible()
    await expect(page.getByText('Password is required')).toBeVisible()
  })

  test('should show validation error for invalid email', async ({ page }) => {
    await page.getByLabel('Email').fill('invalid-email')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()
    
    await expect(page.getByText('Invalid email format')).toBeVisible()
  })

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByLabel('Password')
    const toggleButton = page.getByRole('button', { name: /toggle password visibility/i })
    
    await passwordInput.fill('password123')
    
    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Click toggle to show password
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'text')
    
    // Click toggle to hide password again
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('should navigate to forgot password page', async ({ page }) => {
    await page.getByRole('link', { name: /forgot password/i }).click()
    await expect(page).toHaveURL(/.*auth\/forgot-password/)
  })

  test('should navigate to register page', async ({ page }) => {
    await page.getByRole('link', { name: /don't have an account/i }).click()
    await expect(page).toHaveURL(/.*auth\/register/)
  })

  test('should handle successful login', async ({ page }) => {
    // Mock successful login response
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          token: 'mock-jwt-token',
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            role: 'ROOT_OWNER',
            planTier: 'ENTERPRISE',
            workspaceId: 'workspace-1',
            permissions: ['SYSTEM_MANAGE_ALL'],
            features: ['MULTI_WORKSPACE'],
          },
        }),
      })
    })

    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/)
    
    // Should show user info in sidebar
    await expect(page.getByText('Test User')).toBeVisible()
    await expect(page.getByText('test@example.com')).toBeVisible()
  })

  test('should handle login failure', async ({ page }) => {
    // Mock failed login response
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

    // Should show error message
    await expect(page.getByText('Invalid credentials')).toBeVisible()
    
    // Should stay on login page
    await expect(page).toHaveURL(/.*auth\/login/)
  })

  test('should show loading state during login', async ({ page }) => {
    // Mock slow login response
    await page.route('**/api/auth/login', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, token: 'token' }),
      })
    })

    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign In' }).click()

    // Should show loading state
    await expect(page.getByText('Signing in...')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Signing in...' })).toBeDisabled()
  })

  test('should support keyboard navigation', async ({ page }) => {
    // Tab through form elements
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Email')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByLabel('Password')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeFocused()
  })

  test('should submit form on Enter key', async ({ page }) => {
    // Mock successful login response
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, token: 'token' }),
      })
    })

    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Password').fill('password123')
    
    // Press Enter in password field
    await page.getByLabel('Password').press('Enter')

    // Should submit form and redirect
    await expect(page).toHaveURL(/.*dashboard/)
  })
})

test.describe('Registration Flow', () => {
  test('should display registration form', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/register')
    
    await expect(page.getByLabel('Name')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()
    await expect(page.getByLabel('Confirm Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible()
  })

  test('should validate password confirmation', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/register')
    
    await page.getByLabel('Name').fill('Test User')
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByLabel('Confirm Password').fill('differentpassword')
    await page.getByRole('button', { name: 'Create Account' }).click()
    
    await expect(page.getByText('Passwords do not match')).toBeVisible()
  })

  test('should handle successful registration', async ({ page }) => {
    await page.route('**/api/auth/register', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Account created successfully',
        }),
      })
    })

    await page.goto('http://localhost:3000/auth/register')
    
    await page.getByLabel('Name').fill('Test User')
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByLabel('Confirm Password').fill('password123')
    await page.getByRole('button', { name: 'Create Account' }).click()
    
    await expect(page.getByText('Account created successfully')).toBeVisible()
  })
})
