/**
 * OTP Utility Functions
 * Helper functions for OTP-related operations across the application
 */

/**
 * Check if user is logged in via OTP
 */
export const isOtpUser = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userMobile = localStorage.getItem('user_mobile');
  const userInfo = localStorage.getItem('user_info');
  
  return !!(userMobile && userInfo);
};

/**
 * Get OTP user information
 */
export const getOtpUserInfo = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userInfo = localStorage.getItem('user_info');
    const userMobile = localStorage.getItem('user_mobile');
    
    if (userInfo && userMobile) {
      return {
        ...JSON.parse(userInfo),
        mobile: userMobile
      };
    }
  } catch (error) {
    console.error('Error parsing OTP user info:', error);
  }
  
  return null;
};

/**
 * Format mobile number for display
 */
export const formatMobileForDisplay = (mobile: string): string => {
  // Remove any non-digit characters
  const cleanMobile = mobile.replace(/\D/g, '');
  
  // If it starts with 91, format as +91 XXXXX XXXXX
  if (cleanMobile.startsWith('91') && cleanMobile.length === 12) {
    const number = cleanMobile.substring(2);
    return `+91 ${number.substring(0, 5)} ${number.substring(5)}`;
  }
  
  // If it's 10 digits, format as +91 XXXXX XXXXX
  if (cleanMobile.length === 10) {
    return `+91 ${cleanMobile.substring(0, 5)} ${cleanMobile.substring(5)}`;
  }
  
  return mobile;
};

/**
 * Check if current user needs profile completion
 * (useful for OTP users who might not have complete profiles)
 */
export const needsProfileCompletion = (): boolean => {
  const userInfo = getOtpUserInfo();
  
  if (!userInfo) return false;
  
  // Check if essential profile fields are missing
  return userInfo.isNewUser || !userInfo.name || !userInfo.email;
};

/**
 * Redirect to profile completion if needed
 */
export const redirectToProfileIfNeeded = (router: any): boolean => {
  if (needsProfileCompletion()) {
    router.push('/website/profile/complete');
    return true;
  }
  return false;
};

/**
 * Get user display name (works for both email and OTP users)
 */
export const getUserDisplayName = (): string => {
  const otpUser = getOtpUserInfo();
  
  if (otpUser) {
    if (otpUser.name) return otpUser.name;
    if (otpUser.mobile) return formatMobileForDisplay(otpUser.mobile);
  }
  
  // Fallback to regular auth context user
  const customer = localStorage.getItem('customer');
  if (customer) {
    try {
      const parsed = JSON.parse(customer);
      return `${parsed.firstName} ${parsed.lastName}`.trim();
    } catch (error) {
      console.error('Error parsing customer data:', error);
    }
  }
  
  return 'User';
};

/**
 * Clear all OTP-related data
 */
export const clearOtpData = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('user_info');
  localStorage.removeItem('user_mobile');
};

/**
 * Validate if mobile number belongs to current user
 */
export const isCurrentUserMobile = (mobile: string): boolean => {
  const currentMobile = localStorage.getItem('user_mobile');
  if (!currentMobile) return false;
  
  const cleanCurrent = currentMobile.replace(/\D/g, '');
  const cleanInput = mobile.replace(/\D/g, '');
  
  return cleanCurrent.includes(cleanInput) || cleanInput.includes(cleanCurrent);
};