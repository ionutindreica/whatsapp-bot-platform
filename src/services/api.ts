const API_BASE_URL = 'http://localhost:5000/api';

class ApiError extends Error {
  constructor(public status: number, message: string, public details?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || `HTTP ${response.status}`,
      errorData.details
    );
  }
  return response.json();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const authApi = {
  // Register user
  register: async (data: {
    email: string;
    password: string;
    name: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Login user
  login: async (data: {
    email: string;
    password: string;
  }) => {
    console.log('🌐 API: Sending login request to:', `${API_BASE_URL}/auth/login`);
    console.log('🌐 API: Request data:', data);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    console.log('🌐 API: Response status:', response.status);
    console.log('🌐 API: Response ok:', response.ok);
    
    const result = await handleResponse(response);
    console.log('🌐 API: Response result:', result);
    
    // Store token
    if (result.token) {
      console.log('🔑 API: Storing token in localStorage');
      localStorage.setItem('authToken', result.token);
    } else {
      console.log('❌ API: No token in response');
    }
    
    return result;
  },

  // Verify email
  verifyEmail: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    return handleResponse(response);
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  // Reset password
  resetPassword: async (data: {
    token: string;
    password: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
  },
};

export const userApi = {
  // Get user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Update user profile
  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    company?: string;
    phone?: string;
    timezone?: string;
    language?: string;
    preferences?: any;
  }) => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Get usage statistics
  getUsage: async () => {
    const response = await fetch(`${API_BASE_URL}/user/usage`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Get subscription info
  getSubscription: async () => {
    const response = await fetch(`${API_BASE_URL}/user/subscription`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Change password
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/user/change-password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export { ApiError };
