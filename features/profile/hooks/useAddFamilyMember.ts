import { useState, useCallback } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { addFamilyMember } from '../../../services/api/mockApiService';

export const useAddFamilyMember = () => {
  const { user, setUser } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddFamilyMember = useCallback(async (member: { name: string; age: number; location: string; height: number; weight: number; activityLevel: 'low' | 'medium' | 'high'; allergies: string[] }) => {
    setIsLoading(true);
    try {
      const newMember = await addFamilyMember(member);
      const updatedUser = { ...user!, familyMembers: [...user!.familyMembers, newMember] };
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to add family member:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, setUser]);

  const activityLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  const activityLevelLabels = { low: 'Thấp', medium: 'Trung bình', high: 'Cao' };

  return {
    profile: user,
    isLoading,
    handleAddFamilyMember,
    activityLevels,
    activityLevelLabels,
  };
};
