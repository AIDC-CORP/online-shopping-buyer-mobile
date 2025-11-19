/**
 * Profile Service - Buyer App
 * Handles user profile and family member operations
 */

import { httpClient } from '../auth/config';

const PROFILE_BASE_URL = process.env.EXPO_PUBLIC_PROFILE_URL || 'http://192.168.1.4:8113';
const API_PREFIX = '/api/v1/online-shopping/public';

export interface HealthInfo {
  height?: number;
  weight?: number;
  activity_level?: 'low' | 'medium' | 'high';
  allergies?: string[];
}

export interface MemberProfile {
  id: string;
  first_name: string;
  last_name: string;
  age?: number;
  location?: string[] | null;
  health?: HealthInfo;
}

export interface UserProfile {
  user_id: string;
  age?: number;
  location?: string[];
  health?: HealthInfo;
  first_name?: string;
  last_name?: string;
  members?: MemberProfile[];
}

export interface UserProfileCreateRequest {
  age?: number;
  location?: string[];
  health?: HealthInfo;
}

export interface UserProfileUpdateRequest {
  age?: number;
  location?: string[];
  health?: HealthInfo;
}

export interface MemberProfileCreateRequest {
  first_name: string;
  last_name: string;
  age?: number;
  location?: string[];
  health?: HealthInfo;
}

export interface MemberProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  age?: number;
  location?: string[];
  health?: HealthInfo;
}

class ProfileService {
  private static instance: ProfileService;

  private constructor() {}

  static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  /**
   * Get current user profile (with members)
   */
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      console.log('[ProfileService] Getting user profile...');
      const response = await httpClient.get(`${PROFILE_BASE_URL}${API_PREFIX}/profile/user`);
      console.log('[ProfileService] Profile found:', response.data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Profile doesn't exist yet
        console.log('[ProfileService] Profile not found (404), returning null');
        return null;
      }
      console.error('[ProfileService] Failed to get user profile:', error);
      throw error;
    }
  }

  /**
   * Create user profile
   */
  async createUserProfile(data: UserProfileCreateRequest): Promise<UserProfile> {
    try {
      console.log('[ProfileService] Creating user profile with data:', data);
      const response = await httpClient.post(
        `${PROFILE_BASE_URL}${API_PREFIX}/profile/user`,
        data
      );
      console.log('[ProfileService] User profile created, response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[ProfileService] Failed to create user profile:', error);
      throw new Error(error.response?.data?.detail || 'Failed to create profile');
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(data: UserProfileUpdateRequest): Promise<void> {
    try {
      await httpClient.patch(`${PROFILE_BASE_URL}${API_PREFIX}/profile/user`, data);
    } catch (error: any) {
      console.error('[ProfileService] Failed to update user profile:', error);
      throw new Error(error.response?.data?.detail || 'Failed to update profile');
    }
  }

  /**
   * Create multiple family members
   */
  async createMembers(members: MemberProfileCreateRequest[]): Promise<MemberProfile[]> {
    try {
      console.log('[ProfileService] Creating members:', members);
      const response = await httpClient.post(
        `${PROFILE_BASE_URL}${API_PREFIX}/profile/members`,
        { members }
      );
      console.log('[ProfileService] Members response:', response);
      console.log('[ProfileService] Members data:', response.data);
      
      // Backend returns array directly
      const membersData = Array.isArray(response.data) ? response.data : [];
      console.log('[ProfileService] Parsed members:', membersData);
      return membersData;
    } catch (error: any) {
      console.error('[ProfileService] Failed to create members:', error);
      throw new Error(error.response?.data?.detail || 'Failed to create members');
    }
  }

  /**
   * Update family member
   */
  async updateMember(
    memberId: string,
    data: MemberProfileUpdateRequest
  ): Promise<MemberProfile> {
    try {
      const response = await httpClient.patch(
        `${PROFILE_BASE_URL}${API_PREFIX}/profile/members/${memberId}`,
        data
      );
      return response.data;
    } catch (error: any) {
      console.error('[ProfileService] Failed to update member:', error);
      throw new Error(error.response?.data?.detail || 'Failed to update member');
    }
  }

  /**
   * Delete family members
   */
  async deleteMembers(memberIds: string[]): Promise<{ messages: string[] }> {
    try {
      const response = await httpClient.delete(
        `${PROFILE_BASE_URL}${API_PREFIX}/profile/members`,
        {
          data: { member_ids: memberIds },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('[ProfileService] Failed to delete members:', error);
      throw new Error(error.response?.data?.detail || 'Failed to delete members');
    }
  }

  /**
   * Upload avatar or cover image
   */
  async uploadFile(file: {
    uri: string;
    type: string;
    name: string;
  }, uploadType: 'avatar' | 'cover'): Promise<{
    bucket: string;
    object_name: string;
    size: number;
    content_type: string;
    url: string;
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file as any);
      formData.append('upload_type', uploadType);

      const response = await httpClient.post(
        `${PROFILE_BASE_URL}${API_PREFIX}/profile/upload-file`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('[ProfileService] Failed to upload file:', error);
      throw new Error(error.response?.data?.detail || 'Failed to upload file');
    }
  }
}

export default ProfileService.getInstance();
