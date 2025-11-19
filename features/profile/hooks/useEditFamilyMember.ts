import { useState, useCallback } from 'react';
import { useAppContext } from '../../../context/AppContext';
import ProfileService from '../../../services/profile/ProfileService';

export const useEditFamilyMember = () => {
  const { user, setUser } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleEditFamilyMember = useCallback(async (memberId: string, member: { name: string; age: number; location: string[]; height: number; weight: number; activityLevel: 'low' | 'medium' | 'high'; allergies: string[] }) => {
    setIsLoading(true);
    try {
      // Parse name to first_name and last_name
      const nameParts = member.name.trim().split(/\s+/).filter(Boolean);
      const firstName = nameParts[0] || member.name.trim();
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : firstName;

      const memberData = {
        first_name: firstName,
        last_name: lastName,
        age: member.age,
        health: {
          height: member.height,
          weight: member.weight,
          activity_level: member.activityLevel,
          allergies: member.allergies,
        },
      };

      console.log('Updating member with ID:', memberId);
      await ProfileService.updateMember(memberId, memberData);

      // Update local user state
      const updatedUser = {
        ...user!,
        familyMembers: (user!.familyMembers || []).map((m) => 
          m.member_id === memberId
            ? {
                ...m,
                name: member.name,
                age: member.age,
                location: member.location,
                height: member.height,
                weight: member.weight,
                activityLevel: member.activityLevel,
                allergies: member.allergies,
              }
            : m
        )
      };
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to edit family member:', error);
      throw error;
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
