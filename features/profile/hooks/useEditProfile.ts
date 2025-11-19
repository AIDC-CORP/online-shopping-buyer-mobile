import { useState, useCallback } from 'react';
import { useAppContext } from '../../../context/AppContext';
import ProfileService from '../../../services/profile/ProfileService';
import { User } from '../../../types';

export const useProfile = () => {
  const { user, setUser } = useAppContext();
  const [profile, setProfile] = useState<User>(user!);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback(<K extends keyof User>(key: K, value: User[K]) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    setIsLoading(true);
    try {
      // Map User type to ProfileService types
      const updateData: any = {};
      
      if (profile.age !== undefined) {
        updateData.age = profile.age;
      }
      
      if (profile.location && profile.location.length > 0) {
        updateData.location = profile.location;
      }

      // Map health-related fields
      const health: any = {};
      if (profile.height) health.height = profile.height;
      if (profile.weight) health.weight = profile.weight;
      if (profile.activityLevel) {
        health.activity_level = profile.activityLevel;
      }
      if (profile.allergies && profile.allergies.length > 0) {
        health.allergies = profile.allergies;
      }

      if (Object.keys(health).length > 0) {
        updateData.health = health;
      }

      await ProfileService.updateUserProfile(updateData);
      
      // Update local state
      setUser(profile);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [profile, setUser]);

  const activityLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  const activityLevelLabels = { low: 'Thấp', medium: 'Trung bình', high: 'Cao' };

  return {
    profile,
    isEditing,
    isLoading,
    setIsEditing,
    handleInputChange,
    handleSave,
    activityLevels,
    activityLevelLabels,
  };
};