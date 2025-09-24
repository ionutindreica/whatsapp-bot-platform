// API utilities for Vite/React (replacing Next.js API routes)
import { User, UserRole, getCurrentSession, hasRole, isSuperAdmin } from "./auth";

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Helper function for API responses
export const apiResponse = <T>(
  data: T,
  success: boolean = true,
  message?: string
): ApiResponse<T> => ({
  success,
  data,
  message,
});

export const apiError = (error: string, status: number = 400): Response => {
  return new Response(
    JSON.stringify({ success: false, error }),
    { 
      status,
      headers: { "Content-Type": "application/json" }
    }
  );
};

// Mock API functions for development
export const mockApiCall = async <T>(
  data: T,
  delay: number = 1000
): Promise<ApiResponse<T>> => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return apiResponse(data);
};

// Auth helpers for client-side use
export const checkAuth = async (): Promise<User | null> => {
  const session = await getCurrentSession();
  return session?.user || null;
};

export const checkRole = async (role: UserRole): Promise<boolean> => {
  const session = await getCurrentSession();
  return hasRole(session, role);
};

export const checkAdmin = async (): Promise<boolean> => {
  const session = await getCurrentSession();
  return isSuperAdmin(session);
};

// Mock data for development
export const mockBots = [
  {
    id: "1",
    name: "Customer Support Bot",
    description: "Handles customer inquiries",
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    id: "2", 
    name: "Sales Assistant Bot",
    description: "Helps with sales queries",
    status: "inactive",
    createdAt: new Date().toISOString()
  }
];

export const mockUsers = [
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
  }
];

// Mock API endpoints
export const getBots = async (): Promise<ApiResponse<typeof mockBots>> => {
  return mockApiCall(mockBots);
};

export const getUsers = async (): Promise<ApiResponse<typeof mockUsers>> => {
  return mockApiCall(mockUsers);
};

export const createBot = async (botData: any): Promise<ApiResponse> => {
  return mockApiCall({ id: Date.now().toString(), ...botData });
};

export const updateBot = async (id: string, botData: any): Promise<ApiResponse> => {
  return mockApiCall({ id, ...botData });
};

export const deleteBot = async (id: string): Promise<ApiResponse> => {
  return mockApiCall({ success: true, id });
};