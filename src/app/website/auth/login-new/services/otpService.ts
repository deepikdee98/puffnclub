import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface SendOtpRequest {
  email?: string;
  mobile?: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  sessionId: string;
  expiresIn: number;
}

export interface VerifyOtpRequest {
  email?: string;
  mobile?: string;
  otp: string;
  sessionId: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    mobile?: string;
    email?: string;
    name: string;
    isNewUser: boolean;
  };
}

export interface ResendOtpRequest {
  email?: string;
  mobile?: string;
  sessionId: string;
}

/**
 * Send OTP to email or mobile
 */
export const sendOtp = async (data: SendOtpRequest): Promise<SendOtpResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/website/auth/send-otp`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to send OTP');
  }
};

/**
 * Verify OTP
 */
export const verifyOtp = async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/website/auth/verify-otp`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to verify OTP');
  }
};

/**
 * Resend OTP
 */
export const resendOtp = async (data: ResendOtpRequest): Promise<SendOtpResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/website/auth/resend-otp`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to resend OTP');
  }
};