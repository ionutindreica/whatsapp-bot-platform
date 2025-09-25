import React, { createContext, useContext, useEffect, useState } from 'react';
import { userApi, authApi, isAuthenticated } from '@/services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    company?: string;
    phone?: string;
    timezone?: string;
    language?: string;
    preferences?: any;
  };
  billingInfo?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      console.log('🔍 Checking authentication...');
      console.log('🔍 Token exists:', !!localStorage.getItem('authToken'));
      console.log('🔍 Token value:', localStorage.getItem('authToken'));
      
      if (isAuthenticated()) {
        console.log('✅ User is authenticated, setting user object');
        // For now, just set a basic user object
        // TODO: Implement proper profile loading
        const rootUser = {
          id: '1',
          email: 'johnindreica@gmail.com',
          name: 'Root Owner',
          role: 'ROOT_OWNER',
          status: 'ACTIVE'
        };
        console.log('👤 Setting super admin user:', rootUser);
        setUser(rootUser);
        console.log('✅ User object set successfully');
      } else {
        console.log('❌ User is not authenticated');
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login for:', email);
      const response = await authApi.login({ email, password });
      console.log('✅ Login response:', response);
      console.log('🔑 Token stored:', !!localStorage.getItem('authToken'));
      
      // Set user data from response
      if (response.user) {
        console.log('👤 Setting user from response:', response.user);
        setUser(response.user);
      } else {
        // Fallback to hardcoded user for johnindreica@gmail.com
        if (email === 'johnindreica@gmail.com') {
          const rootOwnerUser = {
            id: '1',
            email: 'johnindreica@gmail.com',
            name: 'Root Owner',
            role: 'ROOT_OWNER',
            status: 'ACTIVE'
          };
          console.log('👤 Setting hardcoded root owner user:', rootOwnerUser);
          setUser(rootOwnerUser);
        }
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      await authApi.register({ email, password, name });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    // Redirect to login page
    window.location.href = '/login';
  };

  const updateProfile = async (data: any) => {
    try {
      const response = await userApi.updateProfile(data);
      if (user) {
        setUser({ ...user, profile: response.profile });
      }
    } catch (error) {
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      await authApi.verifyEmail(token);
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authApi.forgotPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      await authApi.resetPassword({ token, password });
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        verifyEmail,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
