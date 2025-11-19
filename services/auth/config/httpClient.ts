/**
 * HTTP Client Configuration
 * Axios instance với interceptors cho authentication và error handling
 */

import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, AUTH_ENDPOINTS } from './apiConfig';

// Flag để tránh multiple refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Tạo axios instance
const httpClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Thêm token vào header
httpClient.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    try {
      // Lấy token từ AsyncStorage
      const token = await AsyncStorage.getItem('access_token');
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      console.log(`[HTTP Request] ${config.method?.toUpperCase()} ${config.url}`);
    } catch (error) {
      console.error('[HTTP] Failed to get token from storage:', error);
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('[HTTP Request Error]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Xử lý response và errors
httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[HTTP Response] ${response.status} ${response.config.url}`);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    
    console.error('[HTTP Response Error]', error.response?.status, error.message);
    
    // Xử lý lỗi 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh, đợi refresh xong rồi retry
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return httpClient.request(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('[Auth] Token expired, attempting to re-authenticate...');
        
        // Lấy saved credentials để tự động đăng nhập lại
        const savedUsername = await AsyncStorage.getItem('saved_username');
        const savedPassword = await AsyncStorage.getItem('saved_password');
        
        if (savedUsername && savedPassword) {
          console.log('[Auth] Re-authenticating with saved credentials...');
          
          // Tạo request đăng nhập mới (không dùng httpClient để tránh loop)
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.LOGIN}`,
            { username: savedUsername, password: savedPassword }
          );

          const { access_token } = response.data;
          
          if (access_token) {
            // Lưu token mới
            await AsyncStorage.setItem('access_token', access_token);
            
            // Update header cho request ban đầu
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access_token}`;
            }
            
            processQueue(null, access_token);
            isRefreshing = false;
            
            console.log('[Auth] Re-authentication successful, retrying original request');
            return httpClient.request(originalRequest);
          }
        }
        
        // Không có saved credentials hoặc re-auth thất bại
        console.log('[Auth] No saved credentials or re-auth failed, clearing session');
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
        
        processQueue(new Error('Session expired, please login again'), null);
        isRefreshing = false;
        
        return Promise.reject(error);
        
      } catch (refreshError) {
        console.error('[Auth] Re-authentication failed:', refreshError);
        
        // Clear tokens
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('refresh_token');
        
        processQueue(refreshError, null);
        isRefreshing = false;
        
        return Promise.reject(refreshError);
      }
    }
    
    // Xử lý lỗi 403 - Forbidden
    if (error.response?.status === 403) {
      console.log('[Auth] Access forbidden - insufficient permissions');
    }
    
    // Xử lý lỗi network
    if (!error.response) {
      console.error('[Network Error] Unable to reach server');
    }
    
    return Promise.reject(error);
  }
);

export default httpClient;
