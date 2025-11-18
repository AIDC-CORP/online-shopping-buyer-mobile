/**
 * API Configuration
 * Cấu hình base URL và endpoints cho Auth Service
 */

// Base URL của backend API
export const API_CONFIG = {
  // Development
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.4:8111',
  
  // Production (thay đổi khi deploy)
  // BASE_URL: 'https://api.yourdomain.com',
  
  // Timeout cho API calls (ms)
  TIMEOUT: 30000,
  
  // API version
  VERSION: 'v1',
};

// Endpoints cho Auth Service
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/v1/online-shopping/public/auth/login',
  REGISTER_CUSTOMER: '/api/v1/online-shopping/public/auth/register-customer',
  REGISTER_ADMIN_SELLER: '/api/v1/online-shopping/public/auth/register-admin-seller',
  VERIFY_TOKEN: '/api/v1/online-shopping/public/auth/login-verify',
  LOGOUT: '/api/v1/online-shopping/public/auth/logout',
  USER_INFO: '/api/v1/online-shopping/public/auth/user-info',
  HEALTH_CHECK: '/api/v1/online-shopping/public/healthz',
};

// Helper function để build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
