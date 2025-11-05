import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useProfile } from '../../hooks/useProfile';

interface EditProfileProps {
  onClose: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ onClose }) => {
  const { profile, isLoading, handleInputChange, handleSave, activityLevels, activityLevelLabels } = useProfile();

  const onSave = async () => {
    await handleSave();
    onClose();
  };

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
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Tên</Text>
          <TextInput
            value={profile.name}
            onChangeText={(text) => handleInputChange('name', text)}
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
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Tuổi</Text>
          <TextInput
            keyboardType="numeric"
            value={String(profile.age)}
            onChangeText={(text) => handleInputChange('age', Number(text))}
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
            value={profile.location}
            onChangeText={(text) => handleInputChange('location', text)}
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
              value={String(profile.height)}
              onChangeText={(text) => handleInputChange('height', Number(text))}
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
              value={String(profile.weight)}
              onChangeText={(text) => handleInputChange('weight', Number(text))}
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
          <View style={{ flexDirection: 'row' }}>
            {activityLevels.map((level, idx) => (
              <TouchableOpacity
                key={level}
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
            onChangeText={(text) => handleInputChange('allergies', text.split(',').map(s => s.trim()))}
            placeholder="Nhập dị ứng, ví dụ: Đậu phộng, Sữa"
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

        <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity
            onPress={onClose}
            style={{
              flex: 1,
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: '#d1d5db',
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#374151', textAlign: 'center', fontWeight: '600', fontSize: 16 }}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSave}
            disabled={isLoading}
            style={{
              flex: 1,
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: isLoading ? '#a7f3d0' : '#10b981',
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isLoading ? <ActivityIndicator color="#ffffff" size="small" /> : <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: '600', fontSize: 16 }}>Lưu</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfile;
