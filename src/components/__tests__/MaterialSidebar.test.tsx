import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import MaterialSidebar from '@/components/MaterialSidebar'
import { AuthProvider } from '@/contexts/AuthContext'

// Mock the auth context
const mockAuthContext = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'ROOT_OWNER',
    planTier: 'ENTERPRISE',
    workspaceId: 'workspace-1',
    permissions: ['SYSTEM_MANAGE_ALL'],
    features: ['MULTI_WORKSPACE', 'SSO_SCIM'],
  },
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn(),
  loading: false,
}

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('MaterialSidebar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders sidebar with user information', () => {
    renderWithRouter(<MaterialSidebar />)
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('ROOT OWNER')).toBeInTheDocument()
  })

  it('renders all main navigation sections', () => {
    renderWithRouter(<MaterialSidebar />)
    
    // Dashboard section
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /overview/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /analytics/i })).toBeInTheDocument()
    
    // Channels section
    expect(screen.getByText('Channels')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /whatsapp/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /messenger/i })).toBeInTheDocument()
    
    // AI & Automation section
    expect(screen.getByText('AI & Automation')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /core ai/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /automation/i })).toBeInTheDocument()
  })

  it('shows ROOT_OWNER specific sections', () => {
    renderWithRouter(<MaterialSidebar />)
    
    expect(screen.getByText('Root Admin')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /root owner dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /users management/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /roles & permissions/i })).toBeInTheDocument()
  })

  it('shows SUPER_ADMIN sections when user is SUPER_ADMIN', () => {
    const superAdminContext = {
      ...mockAuthContext,
      user: {
        ...mockAuthContext.user,
        role: 'SUPER_ADMIN',
      },
    }

    jest.doMock('@/contexts/AuthContext', () => ({
      useAuth: () => superAdminContext,
      AuthProvider: ({ children }: { children: React.ReactNode }) => children,
    }))

    renderWithRouter(<MaterialSidebar />)
    
    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /super admin dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /user management/i })).toBeInTheDocument()
  })

  it('handles menu item clicks', () => {
    renderWithRouter(<MaterialSidebar />)
    
    const overviewLink = screen.getByRole('link', { name: /overview/i })
    expect(overviewLink).toHaveAttribute('href', '/dashboard/overview')
    
    const analyticsLink = screen.getByRole('link', { name: /analytics/i })
    expect(analyticsLink).toHaveAttribute('href', '/dashboard/analytics')
  })

  it('shows correct icons for menu items', () => {
    renderWithRouter(<MaterialSidebar />)
    
    // Check for icon presence (they should be rendered as SVG or icon components)
    const sidebar = screen.getByRole('navigation')
    expect(sidebar).toBeInTheDocument()
    
    // Icons are typically rendered as SVG elements or icon components
    const icons = sidebar.querySelectorAll('svg, [data-icon]')
    expect(icons.length).toBeGreaterThan(0)
  })

  it('handles logout functionality', () => {
    renderWithRouter(<MaterialSidebar />)
    
    const logoutButton = screen.getByRole('button', { name: /logout/i })
    fireEvent.click(logoutButton)
    
    expect(mockAuthContext.logout).toHaveBeenCalledTimes(1)
  })

  it('shows user role badge', () => {
    renderWithRouter(<MaterialSidebar />)
    
    const roleBadge = screen.getByText('ROOT OWNER')
    expect(roleBadge).toBeInTheDocument()
    expect(roleBadge).toHaveClass('bg-yellow-100', 'text-yellow-800') // Badge styling
  })

  it('filters menu items based on user permissions', () => {
    const limitedUserContext = {
      ...mockAuthContext,
      user: {
        ...mockAuthContext.user,
        role: 'AGENT',
        permissions: ['BOT_MANAGE_ALL'],
        features: [],
      },
    }

    jest.doMock('@/contexts/AuthContext', () => ({
      useAuth: () => limitedUserContext,
      AuthProvider: ({ children }: { children: React.ReactNode }) => children,
    }))

    renderWithRouter(<MaterialSidebar />)
    
    // Should not show admin sections for limited user
    expect(screen.queryByText('Root Admin')).not.toBeInTheDocument()
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument()
    
    // Should still show basic sections
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Channels')).toBeInTheDocument()
  })

  it('handles responsive behavior', () => {
    renderWithRouter(<MaterialSidebar />)
    
    const sidebar = screen.getByRole('navigation')
    expect(sidebar).toBeInTheDocument()
    
    // Check if sidebar has proper responsive classes
    expect(sidebar).toHaveClass('fixed', 'inset-y-0', 'left-0') // Desktop positioning
  })

  it('shows workspace information when available', () => {
    const contextWithWorkspace = {
      ...mockAuthContext,
      user: {
        ...mockAuthContext.user,
        workspaceId: 'workspace-123',
      },
    }

    jest.doMock('@/contexts/AuthContext', () => ({
      useAuth: () => contextWithWorkspace,
      AuthProvider: ({ children }: { children: React.ReactNode }) => children,
    }))

    renderWithRouter(<MaterialSidebar />)
    
    // Should show workspace context in navigation
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })
})
