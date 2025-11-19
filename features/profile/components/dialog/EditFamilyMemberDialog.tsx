import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useEditFamilyMember } from '../../hooks/useEditFamilyMember';
import ProfileService from '../../../../services/profile/ProfileService';

interface EditFamilyMemberProps {
  onClose: () => void;
  member: {
    id?: string;
    first_name?: string;
    last_name?: string;
    age?: number;
    location?: string[] | null;
    health?: {
      height?: number;
      weight?: number;
      activity_level?: 'low' | 'medium' | 'high';
      allergies?: string[];
    };
  };
}

const EditFamilyMember: React.FC<EditFamilyMemberProps> = ({ onClose, member }) => {
  const { handleEditFamilyMember, isLoading, activityLevels, activityLevelLabels } = useEditFamilyMember();

  console.log('[EditFamilyMember] Received member:', member);
  console.log('[EditFamilyMember] Member ID:', member.id);

  const fullName = `${member.first_name || ''} ${member.last_name || ''}`.trim();
  
  const [name, setName] = useState(fullName);
  const [age, setAge] = useState(String(member.age || ''));
  const [location, setLocation] = useState(Array.isArray(member.location) ? member.location.join(', ') : '');
  const [height, setHeight] = useState(String(member.health?.height || ''));
  const [weight, setWeight] = useState(String(member.health?.weight || ''));
  const [activityLevel, setActivityLevel] = useState<'low' | 'medium' | 'high'>(member.health?.activity_level || 'medium');
  const [allergies, setAllergies] = useState(member.health?.allergies?.join(', ') || '');

  const onSave = async () => {
    if (!name || !age || !height || !weight) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    if (!member.id) {
      Alert.alert('Lỗi', 'Không tìm thấy ID thành viên');
      return;
    }
    
    try {
      await handleEditFamilyMember(member.id, {
        name,
        age: Number(age),
        location: location.split(',').map(s => s.trim()).filter(s => s),
        height: Number(height),
        weight: Number(weight),
        activityLevel,
        allergies: allergies.split(',').map(s => s.trim()).filter(s => s)
      });
      onClose();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin thành viên');
    }
  };

  const onDelete = async () => {
    if (!member.id) {
      Alert.alert('Lỗi', 'Không tìm thấy ID thành viên');
      return;
    }

    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa thành viên "${fullName}"?`,
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await ProfileService.deleteMembers([member.id!]);
              Alert.alert('Thành công', 'Đã xóa thành viên');
              onClose();
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa thành viên');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb', padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937' }}>Chỉnh sửa thành viên gia đình</Text>
        <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
          <Text style={{ fontSize: 16, color: '#6b7280' }}>Đóng</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 24, paddingVertical: 24, backgroundColor: '#ffffff', borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Tên</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Nhập tên"
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
          <View style={{ flexDirection: 'row' }}>
            {activityLevels.map((level, idx) => (
              <TouchableOpacity
                key={level}
                onPress={() => setActivityLevel(level)}
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
                  borderColor: activityLevel === level ? '#10b981' : '#d1d5db',
                  backgroundColor: activityLevel === level ? '#10b981' : '#ffffff',
                }}
              >
                <Text style={{
                  color: activityLevel === level ? '#ffffff' : '#374151',
                  fontWeight: activityLevel === level ? '600' : '400',
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
            value={allergies}
            onChangeText={setAllergies}
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

        {/* Delete button */}
        <TouchableOpacity
          onPress={onDelete}
          style={{
            marginTop: 24,
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: '#fee2e2',
            borderRadius: 8,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#fecaca',
          }}
        >
          <Text style={{ color: '#dc2626', textAlign: 'center', fontWeight: '600', fontSize: 16 }}>🗑️ Xóa thành viên</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', gap: 16, marginTop: 16 }}>
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
            disabled={isLoading || !name || !age || !height || !weight}
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

export default EditFamilyMember;