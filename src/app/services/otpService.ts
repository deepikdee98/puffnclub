import { apiRequest } from './api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const OTP_ENDPOINTS = {
  SEND_OTP: `${API_BASE_URL}/website/auth/send-otp`,
  VERIFY_OTP: `${API_BASE_URL}/website/auth/verify-otp`,
  RESEND_OTP: `${API_BASE_URL}/website/auth/resend-otp`,
};

export interface SendOtpRequest {
  email: string;
}

export interface SendOtpResponse {
  message: string;
  sessionId: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  sessionId: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    mobile: string;
    name?: string;
    email?: string;
    isNewUser: boolean;
  };
}

export interface ResendOtpRequest {
  email: string;
  sessionId: string;
}

export interface ResendOtpResponse {
  message: string;
  sessionId: string;
}

class OtpService {
  /**
   * Send OTP to email
   */
  async sendOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
    try {
      const response = await apiRequest<SendOtpResponse>(
        OTP_ENDPOINTS.SEND_OTP,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send OTP');
    }
  }

  /**
   * Verify OTP
   */
  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    try {
      const response = await apiRequest<VerifyOtpResponse>(
        OTP_ENDPOINTS.VERIFY_OTP,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to verify OTP');
    }
  }

  /**
   * Resend OTP
   */
  async resendOtp(data: ResendOtpRequest): Promise<ResendOtpResponse> {
    try {
      const response = await apiRequest<ResendOtpResponse>(
        OTP_ENDPOINTS.RESEND_OTP,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to resend OTP');
    }
  }

  /**
   * Validate OTP format
   */
  validateOtp(otp: string): boolean {
    return /^\d{6}$/.test(otp);
  }
}

export const otpService = new OtpService();