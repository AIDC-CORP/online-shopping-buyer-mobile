import { useState, useCallback } from 'react';
import { useAppContext } from '../../../context/AppContext';
import ProfileService from '../../../services/profile/ProfileService';

export const useAddFamilyMember = () => {
  const { user, setUser } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddFamilyMember = useCallback(async (member: { name: string; age: number; location: string; height: number; weight: number; activityLevel: 'low' | 'medium' | 'high'; allergies: string[] }) => {
    setIsLoading(true);
    try {
      // Parse name to first_name and last_name
      const nameParts = member.name.trim().split(/\s+/).filter(Boolean);
      
      // If only one name provided, use it as first_name and last_name
      // Backend requires both first_name and last_name with min_length=1
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

      const createdMembers = await ProfileService.createMembers([memberData]);

      // Update local user state
      if (createdMembers.length > 0) {
        const newMember = createdMembers[0];
        const updatedUser = {
          ...user!,
          familyMembers: [
            ...(user!.familyMembers || []),
            {
              member_id: newMember.id,
              name: `${newMember.first_name} ${newMember.last_name}`,
              age: newMember.age || 0,
              location: newMember.location || [],
              height: newMember.health?.height || 0,
              weight: newMember.health?.weight || 0,
              activityLevel: newMember.health?.activity_level || 'medium',
              allergies: newMember.health?.allergies || [],
            },
          ],
        };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Failed to add family member:', error);
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
    handleAddFamilyMember,
    activityLevels,
    activityLevelLabels,
  };
};
