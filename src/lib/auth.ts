// Simple auth system for Vite/React (replacing Next.js NextAuth)
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN", 
  SUPER_ADMIN = "SUPER_ADMIN"
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: string;
}

export interface Session {
  user: User;
  expires: string;
}

// Mock user data for development
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: UserRole.ADMIN,
    status: "active"
  },
  {
    id: "2", 
    email: "user@example.com",
    name: "Regular User",
    role: UserRole.USER,
    status: "active"
  },
  {
    id: "3",
    email: "superadmin@example.com", 
    name: "Super Admin",
    role: UserRole.SUPER_ADMIN,
    status: "active"
  }
];

// Simple session management
let currentSession: Session | null = null;

export const getCurrentSession = async (): Promise<Session | null> => {
  if (currentSession && new Date(currentSession.expires) > new Date()) {
    return currentSession;
  }
  return null;
};

export const signIn = async (email: string, password: string): Promise<Session | null> => {
  const user = mockUsers.find(u => u.email === email);
  if (user && password === "password") { // Simple mock auth
    currentSession = {
      user,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    return currentSession;
  }
  return null;
};

export const signOut = async (): Promise<void> => {
  currentSession = null;
};

export const hasRole = (session: Session | null, role: UserRole): boolean => {
  return session?.user?.role === role;
};

export const isAdmin = (session: Session | null): boolean => {
  return hasRole(session, UserRole.ADMIN) || isSuperAdmin(session);
};

export const isSuperAdmin = (session: Session | null): boolean => {
  return hasRole(session, UserRole.SUPER_ADMIN);
};

export const requireAuth = (session: Session | null): Session => {
  if (!session) {
    throw new Error("Authentication required");
  }
  return session;
};

export const requireRole = (session: Session | null, role: UserRole): Session => {
  const authSession = requireAuth(session);
  if (!hasRole(authSession, role)) {
    throw new Error(`Role ${role} required`);
  }
  return authSession;
};

export const requireAdmin = (session: Session | null): Session => {
  const authSession = requireAuth(session);
  if (!isAdmin(authSession)) {
    throw new Error("Admin role required");
  }
  return authSession;
};

export const requireSuperAdmin = (session: Session | null): Session => {
  const authSession = requireAuth(session);
  if (!isSuperAdmin(authSession)) {
    throw new Error("Super admin role required");
  }
  return authSession;
};