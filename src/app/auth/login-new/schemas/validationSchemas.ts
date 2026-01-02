import * as yup from 'yup';

// Phone Login Schema
export const phoneLoginSchema = yup.object().shape({
  mobile: yup
    .string()
    .matches(/^[6-9][0-9]{9}$/, 'Please enter a valid 10-digit mobile number')
    .required('Mobile number is required'),
});

// Email Login Schema
export const emailLoginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

// Combined Login Schema (for backward compatibility)
export const loginSchema = yup.object().shape({
  mobile: yup
    .string()
    .matches(/^[6-9][0-9]{9}$/, 'Please enter a valid 10-digit mobile number')
    .required('Mobile number is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

// OTP Form Schema
export const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .matches(/^[0-9]{6}$/, 'OTP must be exactly 6 digits')
    .required('OTP is required'),
});