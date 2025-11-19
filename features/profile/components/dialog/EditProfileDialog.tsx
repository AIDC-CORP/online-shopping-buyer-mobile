import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { EditProfileProps } from '../../index';
import ProfileService from '../../../../services/profile/ProfileService';
import type { UserProfile } from '../../../../services/profile/ProfileService';

const EditProfile: React.FC<EditProfileProps> = ({ onClose }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [allergies, setAllergies] = useState('');

  const activityLevelLabels = { low: 'Thấp', medium: 'Trung bình', high: 'Cao' };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await ProfileService.getUserProfile();
      setProfile(data);
      
      if (data) {
        setAge(data.age?.toString() || '');
        setLocation(data.location?.join(', ') || '');
        setHeight(data.health?.height?.toString() || '');
        setWeight(data.health?.weight?.toString() || '');
        setActivityLevel(data.health?.activity_level || 'medium');
        setAllergies(data.health?.allergies?.join(', ') || '');
      }
    } catch (error) {
      console.error('[EditProfile] Failed to fetch profile:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin hồ sơ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const updateData: any = {};
      
      if (age) {
        const ageNum = parseInt(age, 10);
        if (!isNaN(ageNum) && ageNum > 0) {
          updateData.age = ageNum;
        }
      }
      
      if (location) {
        updateData.location = [location];
      }

      const health: any = {};
      if (height) {
        const heightNum = parseFloat(height);
        if (!isNaN(heightNum) && heightNum > 0) {
          health.height = heightNum;
        }
      }
      
      if (weight) {
        const weightNum = parseFloat(weight);
        if (!isNaN(weightNum) && weightNum > 0) {
          health.weight = weightNum;
        }
      }
      
      health.activity_level = activityLevel;
      
      if (allergies) {
        health.allergies = allergies.split(',').map(a => a.trim()).filter(Boolean);
      }

      if (Object.keys(health).length > 0) {
        updateData.health = health;
      }

      await ProfileService.updateUserProfile(updateData);
      Alert.alert('Thành công', 'Hồ sơ đã được cập nhật', [
        { text: 'OK', onPress: onClose }
      ]);
    } catch (error) {
      console.error('[EditProfile] Failed to update profile:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật hồ sơ');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={{ marginTop: 16, color: '#6b7280' }}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb', padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937' }}>Chỉnh sửa hồ sơ</Text>
        <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
          <Text style={{ fontSize: 16, color: '#6b7280' }}>Đóng</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 24, paddingVertical: 24, backgroundColor: '#ffffff', borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Tuổi</Text>
          <TextInput
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
            placeholder="Nhập tuổi"
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              fontSize: 16,
              borderWidth: 1,
              borderColor: '#d1d5db',
              borderRadius: 6,
              backgroundColor: '#ffffff',
              color: '#1f2937',
            }}
          />
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Địa điểm</Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Nhập địa điểm"
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              fontSize: 16,
              borderWidth: 1,
              borderColor: '#d1d5db',
              borderRadius: 6,
              backgroundColor: '#ffffff',
              color: '#1f2937',
            }}
          />
        </View>

        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Chiều cao (cm)</Text>
            <TextInput
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
              placeholder="Nhập chiều cao"
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 6,
                backgroundColor: '#ffffff',
                color: '#1f2937',
              }}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Cân nặng (kg)</Text>
            <TextInput
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
              placeholder="Nhập cân nặng"
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 6,
                backgroundColor: '#ffffff',
                color: '#1f2937',
              }}
            />
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151', marginBottom: 8 }}>Mức độ hoạt động</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['low', 'medium', 'high'] as const).map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => setActivityLevel(level)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: activityLevel === level ? '#10b981' : '#d1d5db',
                  backgroundColor: activityLevel === level ? '#d1fae5' : '#ffffff',
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '600',
                    color: activityLevel === level ? '#047857' : '#6b7280',
                  }}
                >
                  {activityLevelLabels[level]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Dị ứng (cách nhau bởi dấu phẩy)</Text>
          <TextInput
            value={allergies}
            onChangeText={setAllergies}
            placeholder="VD: Sữa, Đậu phộng"
            multiline
            numberOfLines={3}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              fontSize: 16,
              borderWidth: 1,
              borderColor: '#d1d5db',
              borderRadius: 6,
              backgroundColor: '#ffffff',
              color: '#1f2937',
              textAlignVertical: 'top',
            }}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSave}
        disabled={isSaving}
        style={{
          marginTop: 24,
          marginBottom: 40,
          paddingVertical: 16,
          backgroundColor: isSaving ? '#9ca3af' : '#10b981',
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        {isSaving ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>Lưu thay đổi</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfile;
