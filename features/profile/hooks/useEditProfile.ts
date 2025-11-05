import { useState, useCallback } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { updateUserProfile } from '../../../services/api/mockApiService';
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
      const updatedUser = await updateUserProfile(profile);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
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