import { apiRequest, API_ENDPOINTS, setAuthToken, removeAuthToken } from './api';

export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  addresses: Address[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  fullName?: string; // Optional fullName field for convenience
}

export interface Address {
  _id: string;
  type: 'home' | 'work' | 'other';
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  customer: Customer;
  token: string;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterOtpResponse {
  message: string;
  sessionId: string;
}

export type RegisterResponse = AuthResponse | RegisterOtpResponse;

export const authService = {
  // Register new customer
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    const response = await apiRequest<RegisterResponse>(
      API_ENDPOINTS.WEBSITE.AUTH.REGISTER,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    

    // Only set token if present (for non-OTP flows)
    if ('token' in response && response.token) {
      setAuthToken(response.token);
    }

    return response;
  },

  // Login customer
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>(
      API_ENDPOINTS.WEBSITE.AUTH.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    
    // if (response.token) {
    //   setAuthToken(response.token);
    // }
     if (response.token) {
      setAuthToken(response.token);
      // Persist token and customer info to localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("customer", JSON.stringify(response.customer));
    }
    console.log("login info", response);

    return response;

    
  },

  // Get customer profile
  getProfile: async (): Promise<{ customer: Customer }> => {
    return apiRequest<{ customer: Customer }>(API_ENDPOINTS.WEBSITE.AUTH.PROFILE);
  },

  // Update customer profile
  updateProfile: async (data: ProfileUpdateData): Promise<{ message: string; customer: Customer }> => {
    return apiRequest<{ message: string; customer: Customer }>(
      API_ENDPOINTS.WEBSITE.AUTH.UPDATE_PROFILE,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  },

  // Change password
  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(
      API_ENDPOINTS.WEBSITE.AUTH.CHANGE_PASSWORD,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(
      API_ENDPOINTS.WEBSITE.AUTH.FORGOT_PASSWORD,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  // Reset password
  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(
      API_ENDPOINTS.WEBSITE.AUTH.RESET_PASSWORD,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  // Logout customer
  logout: (): void => {
    removeAuthToken();
    // Remove persisted login info on logout
    localStorage.removeItem("token");
    localStorage.removeItem("customer");

  },
};