# 🧪 Testing Guide

## Overview

This project includes a comprehensive testing suite covering unit tests, integration tests, end-to-end tests, accessibility tests, and performance tests.

## Test Structure

```
tests/
├── e2e/                    # End-to-end tests
│   ├── auth.spec.ts       # Authentication flow tests
│   ├── dashboard.spec.ts  # Dashboard functionality tests
│   └── interactive-elements.spec.ts # Interactive elements tests
├── accessibility/          # Accessibility tests
│   └── a11y.test.ts       # A11y compliance tests
├── performance/           # Performance tests
│   └── performance.test.ts # Performance benchmarks
├── global-setup.ts        # Global test setup
└── global-teardown.ts     # Global test cleanup

src/
├── __tests__/             # Unit and integration tests
│   ├── api/              # API endpoint tests
│   └── components/       # Component tests
└── components/
    ├── __tests__/        # Component unit tests
    └── auth/
        └── __tests__/    # Authentication component tests
```

## Test Types

### 1. Unit Tests
Test individual components and functions in isolation.

```bash
# Run unit tests
npm run test:unit

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### 2. Integration Tests
Test API endpoints and service integrations.

```bash
# Run integration tests
npm run test:integration
```

### 3. End-to-End Tests
Test complete user workflows using Playwright.

```bash
# Run E2E tests (headless)
npm run test:e2e

# Run E2E tests (headed)
npm run test:e2e:headed

# Run specific test file
npx playwright test tests/e2e/auth.spec.ts
```

### 4. Accessibility Tests
Test for accessibility compliance using axe-core.

```bash
# Run accessibility tests
npm run test:a11y
```

### 5. Performance Tests
Test performance metrics and Core Web Vitals.

```bash
# Run performance tests
npm run test:performance
```

### 6. Interactive Element Tests
Test all buttons, links, and interactive elements.

```bash
# Run interactive element tests
npm run test:interactive
```

## Running All Tests

```bash
# Run complete test suite
npm run test:all

# Run tests for CI/CD
npm run test:ci
```

## Test Configuration

### Jest Configuration
- **File**: `jest.config.js`
- **Setup**: `jest.setup.js`
- **Environment**: jsdom
- **Coverage**: 80% threshold

### Playwright Configuration
- **File**: `playwright.config.ts`
- **Browsers**: Chrome, Firefox, Safari
- **Devices**: Desktop, Mobile, Tablet
- **Screenshots**: On failure
- **Videos**: On failure

## Test Data and Mocking

### Authentication Mocking
```typescript
// Mock successful login
await page.route('**/api/auth/login', async route => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      success: true,
      token: 'mock-jwt-token',
      user: { /* user data */ }
    }),
  })
})
```

### Database Mocking
```typescript
// Mock Prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}))
```

## Test Scenarios

### User Roles Tested
- **ROOT_OWNER**: Full system access
- **SUPER_ADMIN**: Admin panel access
- **CLIENT**: Basic dashboard access
- **AGENT**: Limited access

### Key Test Scenarios

#### Authentication Flow
- ✅ Login form validation
- ✅ Successful login
- ✅ Failed login handling
- ✅ Password visibility toggle
- ✅ Forgot password flow
- ✅ Registration flow
- ✅ Logout functionality

#### Dashboard Navigation
- ✅ Sidebar navigation
- ✅ Role-based menu filtering
- ✅ Admin panel access
- ✅ Responsive design
- ✅ Keyboard navigation

#### Interactive Elements
- ✅ All buttons functional
- ✅ All links working
- ✅ Form submissions
- ✅ User actions (suspend, activate, delete)
- ✅ Data refresh functionality

#### Accessibility
- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Color contrast compliance
- ✅ Focus indicators

#### Performance
- ✅ Page load times
- ✅ Core Web Vitals
- ✅ Large dataset handling
- ✅ Concurrent API requests
- ✅ Memory usage

## Test Reports

### Coverage Reports
- **Location**: `coverage/`
- **Format**: HTML, JSON, LCOV
- **Threshold**: 80% minimum

### Playwright Reports
- **Location**: `test-results/`
- **Formats**: HTML, JSON, JUnit
- **Screenshots**: On failure
- **Videos**: On failure

### Interactive Test Reports
- **Location**: `test-results/test-summary.md`
- **Screenshots**: `test-results/screenshots/`
- **Coverage**: Per test type

## CI/CD Integration

### GitHub Actions
```yaml
# .github/workflows/test.yml
- name: Run Tests
  run: |
    npm install
    npm run test:ci
    npm run test:e2e
```

### Test Commands for CI
```bash
# Install dependencies
npm ci

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run unit tests
npm run test:ci

# Run E2E tests
npm run test:e2e

# Run security audit
npm audit
```

## Debugging Tests

### Debug Unit Tests
```bash
# Debug specific test
npm test -- --testNamePattern="Button Component"

# Debug with verbose output
npm test -- --verbose

# Debug specific file
npm test -- src/components/__tests__/Button.test.tsx
```

### Debug E2E Tests
```bash
# Debug with headed browser
npm run test:e2e:headed

# Debug specific test
npx playwright test tests/e2e/auth.spec.ts --debug

# Open test results
npm run test:report
```

### Debug Interactive Tests
```bash
# Run with screenshots
npm run test:interactive

# View screenshots
open test-results/screenshots/
```

## Best Practices

### Writing Tests
1. **Test user behavior**, not implementation details
2. **Use semantic selectors** (role, label, text)
3. **Mock external dependencies**
4. **Test error scenarios**
5. **Keep tests independent**
6. **Use descriptive test names**

### Test Data
1. **Use consistent test data**
2. **Clean up after tests**
3. **Use factories for test data**
4. **Mock sensitive information**

### Performance
1. **Run tests in parallel**
2. **Use test-specific databases**
3. **Mock slow operations**
4. **Optimize test setup/teardown**

## Troubleshooting

### Common Issues

#### Tests Failing
```bash
# Check test output
npm test -- --verbose

# Check for linting errors
npm run lint

# Check type errors
npm run type-check
```

#### E2E Tests Timing Out
```bash
# Increase timeout in playwright.config.ts
timeout: 60000

# Check if dev server is running
npm run dev
```

#### Coverage Below Threshold
```bash
# Check coverage report
npm run test:coverage

# Add missing tests for uncovered code
```

#### Accessibility Tests Failing
```bash
# Check specific violations
npm run test:a11y -- --reporter=line

# Fix ARIA labels and roles
```

## Test Maintenance

### Regular Tasks
- [ ] Update test data monthly
- [ ] Review test coverage quarterly
- [ ] Update dependencies regularly
- [ ] Refactor flaky tests
- [ ] Add tests for new features

### Test Review Checklist
- [ ] All user flows covered
- [ ] Error scenarios tested
- [ ] Accessibility compliance
- [ ] Performance benchmarks met
- [ ] Security considerations tested

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Library Documentation](https://testing-library.com/docs/)
- [Axe-Core Documentation](https://www.deque.com/axe/core-documentation/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Happy Testing! 🧪✨**
