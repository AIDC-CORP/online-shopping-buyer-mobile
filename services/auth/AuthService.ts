/**
 * Auth Service - Buyer App
 * Handles authentication logic for customer users
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { httpClient, AUTH_ENDPOINTS } from './config';

export interface User {
  id: string;
  email: string;
  username: string;
  name?: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN' | 'SUPER_ADMIN';
  user_role?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}

interface BackendLoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  id_token?: string;
}

interface BackendTokenVerifyResponse {
  is_valid: boolean;
  user_id?: string;
  user_role?: string;
  username?: string;
  email?: string;
}

export interface RegisterCustomerRequest {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {
    this.loadTokensFromStorage();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async loadTokensFromStorage(): Promise<void> {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      
      if (this.accessToken) {
        await this.verifyAndSetUserInfo();
      }
    } catch (error) {
      console.error('Failed to load tokens from storage:', error);
    }
  }

  private async saveTokensToStorage(accessToken: string, refreshToken?: string): Promise<void> {
    try {
      await AsyncStorage.setItem('access_token', accessToken);
      
      if (refreshToken) {
        await AsyncStorage.setItem('refresh_token', refreshToken);
      }
      
      this.accessToken = accessToken;
      this.refreshToken = refreshToken || null;
      
      console.log('Tokens saved to storage');
    } catch (error) {
      console.error('Failed to save tokens to storage:', error);
    }
  }

  private async clearTokensFromStorage(): Promise<void> {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      
      this.accessToken = null;
      this.refreshToken = null;
      
      console.log('Tokens cleared from storage');
    } catch (error) {
      console.error('Failed to clear tokens from storage:', error);
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await httpClient.post(
        AUTH_ENDPOINTS.LOGIN,
        {
          username: credentials.username,
          password: credentials.password,
        }
      );

      const { access_token, refresh_token, token_type, expires_in } = response.data;

      await this.saveTokensToStorage(access_token, refresh_token);
      
      // Save credentials for auto re-authentication
      await AsyncStorage.setItem('saved_username', credentials.username);
      await AsyncStorage.setItem('saved_password', credentials.password);

      await this.verifyAndSetUserInfo();

      if (!this.currentUser) {
        throw new Error('Failed to get user info after login');
      }

      return {
        user: this.currentUser,
        access_token,
        refresh_token,
        token_type,
        expires_in,
      };
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Login failed. Please check your credentials.');
    }
  }

  private async verifyAndSetUserInfo(): Promise<void> {
    if (!this.accessToken) return;

    try {
      const response = await httpClient.post(
        AUTH_ENDPOINTS.VERIFY_TOKEN,
        { token: this.accessToken }
      );

      const { is_valid, user_id, user_role, username, email } = response.data;

      if (is_valid && user_id) {
        this.currentUser = {
          id: user_id,
          username: username || '',
          email: email || '',
          role: (user_role as any) || 'CUSTOMER',
          user_role: user_role,
        };
      } else {
        await this.clearTokensFromStorage();
        this.currentUser = null;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      await this.clearTokensFromStorage();
      this.currentUser = null;
    }
  }

  async getUserInfo(): Promise<User | null> {
    if (!this.accessToken) return null;

    try {
      const response = await httpClient.get(AUTH_ENDPOINTS.USER_INFO, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      const { user_id, user_role, username, email } = response.data;

      this.currentUser = {
        id: user_id,
        username,
        email,
        role: (user_role as any) || 'CUSTOMER',
        user_role,
      };

      return this.currentUser;
    } catch (error) {
      console.error('Failed to get user info:', error);
      return null;
    }
  }

  async registerCustomer(request: RegisterCustomerRequest): Promise<{ message: string }> {
    try {
      const response = await httpClient.post(
        AUTH_ENDPOINTS.REGISTER_CUSTOMER,
        request
      );

      return response.data;
    } catch (error: any) {
      console.error('Customer registration failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Registration failed.');
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.refreshToken) {
        await httpClient.post(AUTH_ENDPOINTS.LOGOUT, {
          refresh_token: this.refreshToken,
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      this.currentUser = null;
      await this.clearTokensFromStorage();
      
      await AsyncStorage.removeItem('saved_username');
      await AsyncStorage.removeItem('saved_password');
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken && !!this.currentUser;
  }
}

export default AuthService.getInstance();
