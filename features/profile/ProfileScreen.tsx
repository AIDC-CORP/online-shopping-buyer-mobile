
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { updateUserProfile } from '../../services/mockApiService';
import { User } from '../../types';

interface ProfileScreenProps {
  onLogout: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const { user } = useAppContext();
  const [profile, setProfile] = useState<User>(user!);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = <K extends keyof User>(key: K, value: User[K]) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSave = async () => {
    setIsLoading(true);
    await updateUserProfile(profile);
    setIsLoading(false);
    setIsEditing(false);
  }
  
  const activityLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
  const activityLevelLabels = { low: 'Thấp', medium: 'Trung bình', high: 'Cao' };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }} contentContainerStyle={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937' }}>Hồ sơ của bạn</Text>
        <TouchableOpacity
          onPress={() => setIsEditing(!isEditing)}
          style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#dbeafe', borderRadius: 9999 }}
        >
          <Text style={{ color: '#0c4a6e', fontSize: 12, fontWeight: '600' }}>
            {isEditing ? 'Hủy' : 'Chỉnh sửa'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 24, paddingVertical: 24, backgroundColor: '#ffffff', borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Tên</Text>
          <TextInput 
            value={profile.name}
            editable={isEditing}
            onChangeText={(text) => handleInputChange('name', text)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              fontSize: 16,
              borderWidth: 1,
              borderColor: '#d1d5db',
              borderRadius: 6,
              backgroundColor: isEditing ? '#ffffff' : '#f3f4f6',
              color: '#1f2937',
            }}
          />
        </View>

        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Chiều cao (cm)</Text>
              <TextInput 
                keyboardType="numeric"
                value={String(profile.height)}
                editable={isEditing}
                onChangeText={(text) => handleInputChange('height', Number(text))}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 6,
                  backgroundColor: isEditing ? '#ffffff' : '#f3f4f6',
                  color: '#1f2937',
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Cân nặng (kg)</Text>
              <TextInput 
                keyboardType="numeric"
                value={String(profile.weight)}
                editable={isEditing}
                onChangeText={(text) => handleInputChange('weight', Number(text))}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 6,
                  backgroundColor: isEditing ? '#ffffff' : '#f3f4f6',
                  color: '#1f2937',
                }}
              />
            </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151', marginBottom: 8 }}>Mức độ hoạt động</Text>
          <View style={{ flexDirection: 'row' }}>
            {activityLevels.map((level, idx) => (
                <TouchableOpacity 
                    key={level}
                    disabled={!isEditing}
                    onPress={() => handleInputChange('activityLevel', level)}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      paddingVertical: 8,
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                      borderRightWidth: 1,
                      borderLeftWidth: idx === 0 ? 1 : 0,
                      borderTopLeftRadius: idx === 0 ? 6 : 0,
                      borderBottomLeftRadius: idx === 0 ? 6 : 0,
                      borderTopRightRadius: idx === activityLevels.length - 1 ? 6 : 0,
                      borderBottomRightRadius: idx === activityLevels.length - 1 ? 6 : 0,
                      borderColor: profile.activityLevel === level ? '#10b981' : '#d1d5db',
                      backgroundColor: profile.activityLevel === level ? '#10b981' : '#ffffff',
                    }}
                >
                    <Text style={{
                      color: profile.activityLevel === level ? '#ffffff' : '#374151',
                      fontWeight: profile.activityLevel === level ? '600' : '400',
                    }}>
                        {activityLevelLabels[level]}
                    </Text>
                </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Dị ứng (cách nhau bởi dấu phẩy)</Text>
          <TextInput 
            value={profile.allergies.join(', ')}
            editable={isEditing}
            onChangeText={(text) => handleInputChange('allergies', text.split(',').map(s => s.trim()))}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              fontSize: 16,
              borderWidth: 1,
              borderColor: '#d1d5db',
              borderRadius: 6,
              backgroundColor: isEditing ? '#ffffff' : '#f3f4f6',
              color: '#1f2937',
            }}
          />
        </View>

        {isEditing && (
          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading}
            style={{
              width: '100%',
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: isLoading ? '#a7f3d0' : '#10b981',
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isLoading ? <ActivityIndicator color="#ffffff" size="small" /> : <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: '600', fontSize: 16 }}>Lưu thay đổi</Text>}
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity
        onPress={onLogout}
        style={{
          width: '100%',
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginTop: 24,
          backgroundColor: '#ef4444',
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: '600', fontSize: 16 }}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;
