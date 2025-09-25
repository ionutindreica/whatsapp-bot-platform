import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import SuperAdminDashboard from '@/pages/SuperAdminDashboard'
import { AuthProvider } from '@/contexts/AuthContext'

// Mock the auth context
const mockAuthContext = {
  user: {
    id: '1',
    email: 'admin@example.com',
    name: 'Super Admin',
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

// Mock fetch
global.fetch = jest.fn()

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('SuperAdminDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockClear()
  })

  it('renders dashboard with correct title and user info', () => {
    renderWithRouter(<SuperAdminDashboard />)
    
    expect(screen.getByText('Root Owner Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Super Admin')).toBeInTheDocument()
    expect(screen.getByText('admin@example.com')).toBeInTheDocument()
    expect(screen.getByText('Root Owner Access')).toBeInTheDocument()
  })

  it('renders stats overview cards', async () => {
    const mockStats = {
      totalUsers: 150,
      activeUsers: 120,
      totalWorkspaces: 25,
      totalBots: 45,
      totalMessages: 12500,
      systemUptime: '99.9%',
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockStats),
    })

    renderWithRouter(<SuperAdminDashboard />)

    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument() // Total Users
      expect(screen.getByText('120')).toBeInTheDocument() // Active Users
      expect(screen.getByText('25')).toBeInTheDocument() // Total Workspaces
      expect(screen.getByText('45')).toBeInTheDocument() // Total Bots
    })
  })

  it('renders admin management tools section', () => {
    renderWithRouter(<SuperAdminDashboard />)
    
    expect(screen.getByText('Admin Management Tools')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /user management/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /audit logs/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /role management/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /session management/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /security dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /gdpr tools/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /access control/i })).toBeInTheDocument()
  })

  it('handles user actions (suspend, activate, delete)', async () => {
    const mockUsers = [
      {
        id: '1',
        email: 'user1@example.com',
        name: 'User One',
        status: 'ACTIVE',
        role: 'CLIENT',
        lastLoginAt: '2024-01-20T10:00:00Z',
      },
      {
        id: '2',
        email: 'user2@example.com',
        name: 'User Two',
        status: 'INACTIVE',
        role: 'AGENT',
        lastLoginAt: '2024-01-19T15:30:00Z',
      },
    ]

    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ users: mockUsers }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })

    renderWithRouter(<SuperAdminDashboard />)

    await waitFor(() => {
      expect(screen.getByText('user1@example.com')).toBeInTheDocument()
      expect(screen.getByText('user2@example.com')).toBeInTheDocument()
    })

    // Test suspend user action
    const suspendButton = screen.getAllByRole('button', { name: /suspend/i })[0]
    fireEvent.click(suspendButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/users/'),
        expect.objectContaining({
          method: 'PATCH',
          body: expect.stringContaining('SUSPENDED'),
        })
      )
    })
  })

  it('shows loading states', () => {
    renderWithRouter(<SuperAdminDashboard />)
    
    // Should show loading indicators while fetching data
    expect(screen.getAllByText(/loading/i)).toHaveLength(2) // Stats and Users sections
  })

  it('handles API errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'))

    renderWithRouter(<SuperAdminDashboard />)

    await waitFor(() => {
      expect(screen.getByText(/error loading data/i)).toBeInTheDocument()
    })
  })

  it('renders with correct navigation links', () => {
    renderWithRouter(<SuperAdminDashboard />)
    
    const userManagementLink = screen.getByRole('link', { name: /user management/i })
    expect(userManagementLink).toHaveAttribute('href', '/dashboard/admin/users')

    const auditLogsLink = screen.getByRole('link', { name: /audit logs/i })
    expect(auditLogsLink).toHaveAttribute('href', '/dashboard/admin/audit-logs')

    const securityDashboardLink = screen.getByRole('link', { name: /security dashboard/i })
    expect(securityDashboardLink).toHaveAttribute('href', '/dashboard/admin/security')
  })

  it('shows user role badge with correct styling', () => {
    renderWithRouter(<SuperAdminDashboard />)
    
    const roleBadge = screen.getByText('Root Owner Access')
    expect(roleBadge).toBeInTheDocument()
    expect(roleBadge).toHaveClass('bg-yellow-100', 'text-yellow-800')
  })

  it('handles refresh functionality', async () => {
    const mockStats = { totalUsers: 100 }
    
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockStats),
    })

    renderWithRouter(<SuperAdminDashboard />)

    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument()
    })

    // Click refresh button
    const refreshButton = screen.getByRole('button', { name: /refresh/i })
    fireEvent.click(refreshButton)

    // Should refetch data
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2) // Initial load + refresh
    })
  })

  it('displays recent activity section', async () => {
    const mockActivity = [
      {
        id: '1',
        action: 'USER_LOGIN',
        userId: 'user1',
        timestamp: '2024-01-20T10:00:00Z',
        metadata: { ip: '192.168.1.1' },
      },
      {
        id: '2',
        action: 'USER_CREATED',
        userId: 'user2',
        timestamp: '2024-01-20T09:30:00Z',
        metadata: { createdBy: 'admin' },
      },
    ]

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ activity: mockActivity }),
    })

    renderWithRouter(<SuperAdminDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Recent Activity')).toBeInTheDocument()
      expect(screen.getByText('USER_LOGIN')).toBeInTheDocument()
      expect(screen.getByText('USER_CREATED')).toBeInTheDocument()
    })
  })

  it('handles empty states', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ users: [], activity: [] }),
    })

    renderWithRouter(<SuperAdminDashboard />)

    await waitFor(() => {
      expect(screen.getByText(/no users found/i)).toBeInTheDocument()
      expect(screen.getByText(/no recent activity/i)).toBeInTheDocument()
    })
  })
})
