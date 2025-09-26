import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Shield, 
  Building2, 
  CreditCard, 
  Bot, 
  BarChart3, 
  FileText, 
  Key, 
  Settings,
  Menu,
  X,
  Crown,
  LogOut,
  ChevronRight,
  Activity
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    {
      name: 'Users Management',
      href: '/dashboard/admin/users',
      icon: Users,
      description: 'Manage users, roles, and permissions'
    },
    {
      name: 'Roles & Permissions',
      href: '/dashboard/admin/roles',
      icon: Shield,
      description: 'Define roles and access controls'
    },
    {
      name: 'Workspaces',
      href: '/dashboard/admin/workspaces',
      icon: Building2,
      description: 'Manage workspaces and teams'
    },
    {
      name: 'Plans & Subscriptions',
      href: '/dashboard/admin/plans',
      icon: CreditCard,
      description: 'Manage subscription plans'
    },
    {
      name: 'Bots & Channels',
      href: '/dashboard/admin/bots',
      icon: Bot,
      description: 'Monitor bots and channels'
    },
    {
      name: 'System Analytics',
      href: '/dashboard/admin/analytics',
      icon: BarChart3,
      description: 'Platform usage analytics'
    },
    {
      name: 'Audit Logs',
      href: '/dashboard/admin/audit-logs',
      icon: FileText,
      description: 'System activity logs'
    },
    {
      name: 'API & Webhooks',
      href: '/dashboard/admin/api',
      icon: Key,
      description: 'API keys and webhooks'
    },
    {
      name: 'Platform Settings',
      href: '/dashboard/admin/settings',
      icon: Settings,
      description: 'Global platform configuration'
    }
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-yellow-400" />
              <div>
                <h2 className="text-xl font-bold">Root Panel</h2>
                <p className="text-xs text-slate-400">Enterprise Control</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <Crown className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                <div className="flex items-center mt-1">
                  <Badge className="bg-red-100 text-red-800 text-xs">
                    {user?.role}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200
                    ${isActive(item.href) 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-slate-400">{item.description}</div>
                  </div>
                  {isActive(item.href) && <ChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center space-x-2 text-xs text-slate-400 mb-3">
              <Activity className="h-4 w-4" />
              <span>System Status: Online</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <Crown className="h-6 w-6 text-yellow-400" />
              <span className="font-semibold">Root Panel</span>
            </div>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto p-6 space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Badge component for user role
const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

export default AdminLayout;
