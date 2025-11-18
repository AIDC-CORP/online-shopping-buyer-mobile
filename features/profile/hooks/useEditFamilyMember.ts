import { useState, useCallback } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { updateFamilyMember } from '../../../services/api/mockApiService';

export const useEditFamilyMember = () => {
  const { user, setUser } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleEditFamilyMember = useCallback(async (index: number, member: { name: string; age: number; location: string; height: number; weight: number; activityLevel: 'low' | 'medium' | 'high'; allergies: string[] }) => {
    setIsLoading(true);
    try {
      const updatedMember = await updateFamilyMember(member);
      const updatedUser = { ...user!, familyMembers: user!.familyMembers.map((m, i) => i === index ? updatedMember : m) };
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to edit family member:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, setUser]);

  const activityLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  const activityLevelLabels = { low: 'Thấp', medium: 'Trung bình', high: 'Cao' };

  return {
    profile: user,
    isLoading,
    handleEditFamilyMember,
    activityLevels,
    activityLevelLabels,
  };
};
