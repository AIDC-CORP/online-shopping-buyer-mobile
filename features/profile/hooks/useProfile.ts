import { useState, useCallback } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { updateUserProfile, addFamilyMember, updateFamilyMember } from '../../../services/api/mockApiService';
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

  const handleAddFamilyMember = useCallback(async (member: { name: string; age: number; location: string; height: number; weight: number; activityLevel: 'low' | 'medium' | 'high'; allergies: string[] }) => {
    setIsLoading(true);
    try {
      const newMember = await addFamilyMember(member);
      const updatedUser = { ...user!, familyMembers: [...user!.familyMembers, newMember] };
      setUser(updatedUser);
      setProfile(updatedUser);
    } catch (error) {
      console.error('Failed to add family member:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, setUser]);

  const handleEditFamilyMember = useCallback(async (index: number, member: { name: string; age: number; location: string; height: number; weight: number; activityLevel: 'low' | 'medium' | 'high'; allergies: string[] }) => {
    setIsLoading(true);
    try {
      const updatedMember = await updateFamilyMember(member);
      const updatedUser = { ...user!, familyMembers: user!.familyMembers.map((m, i) => i === index ? updatedMember : m) };
      setUser(updatedUser);
      setProfile(updatedUser);
    } catch (error) {
      console.error('Failed to edit family member:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, setUser]);

  const activityLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  const activityLevelLabels = { low: 'Thấp', medium: 'Trung bình', high: 'Cao' };

  return {
    profile,
    isEditing,
    isLoading,
    setIsEditing,
    handleInputChange,
    handleSave,
    handleAddFamilyMember,
    handleEditFamilyMember,
    activityLevels,
    activityLevelLabels,
  };
};