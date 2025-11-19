import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileService } from '../../../services/profile';
import type {
  UserProfileCreateRequest,
  MemberProfileCreateRequest,
} from '../../../services/profile';

interface SetupProfileScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface MemberForm {
  id: string;
  first_name: string;
  last_name: string;
  age: string;
  height: string;
  weight: string;
  activity_level: 'low' | 'medium' | 'high';
  allergies: string;
}

export default function SetupProfileScreen({ onComplete, onSkip }: SetupProfileScreenProps) {
  const [isLoading, setIsLoading] = useState(false);

  // User Profile State
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [allergies, setAllergies] = useState('');

  // Members State
  const [members, setMembers] = useState<MemberForm[]>([]);

  const addMember = () => {
    const newMember: MemberForm = {
      id: Date.now().toString(),
      first_name: '',
      last_name: '',
      age: '',
      height: '',
      weight: '',
      activity_level: 'medium',
      allergies: '',
    };
    setMembers([...members, newMember]);
  };

  const removeMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const updateMember = (id: string, field: keyof MemberForm, value: any) => {
    setMembers(members.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const userProfileData: UserProfileCreateRequest = {};
      
      if (age) {
        const ageNum = parseInt(age, 10);
        if (isNaN(ageNum) || ageNum <= 0) {
          Alert.alert('Lỗi', 'Tuổi không hợp lệ');
          setIsLoading(false);
          return;
        }
        userProfileData.age = ageNum;
      }

      if (location) {
        userProfileData.location = [location];
      }

      const healthInfo: any = {};
      if (height) {
        const heightNum = parseFloat(height);
        if (isNaN(heightNum) || heightNum <= 0) {
          Alert.alert('Lỗi', 'Chiều cao không hợp lệ');
          setIsLoading(false);
          return;
        }
        healthInfo.height = heightNum;
      }

      if (weight) {
        const weightNum = parseFloat(weight);
        if (isNaN(weightNum) || weightNum <= 0) {
          Alert.alert('Lỗi', 'Cân nặng không hợp lệ');
          setIsLoading(false);
          return;
        }
        healthInfo.weight = weightNum;
      }

      healthInfo.activity_level = activityLevel;

      if (allergies) {
        healthInfo.allergies = allergies.split(',').map((a) => a.trim()).filter(Boolean);
      }

      if (Object.keys(healthInfo).length > 0) {
        userProfileData.health = healthInfo;
      }

      if (Object.keys(userProfileData).length > 0) {
        await ProfileService.createUserProfile(userProfileData);
      }

      if (members.length > 0) {
        const membersData: MemberProfileCreateRequest[] = members
          .filter((m) => m.first_name.trim() && m.last_name.trim())
          .map((m) => {
            const memberData: MemberProfileCreateRequest = {
              first_name: m.first_name.trim(),
              last_name: m.last_name.trim(),
            };

            if (m.age) {
              const ageNum = parseInt(m.age, 10);
              if (!isNaN(ageNum) && ageNum > 0) {
                memberData.age = ageNum;
              }
            }

            const memberHealth: any = {};
            if (m.height) {
              const heightNum = parseFloat(m.height);
              if (!isNaN(heightNum) && heightNum > 0) {
                memberHealth.height = heightNum;
              }
            }

            if (m.weight) {
              const weightNum = parseFloat(m.weight);
              if (!isNaN(weightNum) && weightNum > 0) {
                memberHealth.weight = weightNum;
              }
            }

            memberHealth.activity_level = m.activity_level;

            if (m.allergies) {
              memberHealth.allergies = m.allergies.split(',').map((a) => a.trim()).filter(Boolean);
            }

            if (Object.keys(memberHealth).length > 0) {
              memberData.health = memberHealth;
            }

            return memberData;
          });

        if (membersData.length > 0) {
          console.log('[SetupProfile] Creating members:', membersData);
          const createdMembers = await ProfileService.createMembers(membersData);
          console.log('[SetupProfile] Members created successfully:', createdMembers);
        }
      }

      console.log('[SetupProfile] Profile setup complete, calling onComplete');
      Alert.alert('Thành công', 'Hồ sơ đã được thiết lập', [
        { text: 'OK', onPress: onComplete },
      ]);
    } catch (error: any) {
      console.error('[SetupProfile] Save failed:', error);
      Alert.alert('Lỗi', error.message || 'Không thể lưu hồ sơ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={{ backgroundColor: '#10b981', paddingHorizontal: 24, paddingVertical: 20 }}>
          <Text style={{ fontSize: 26, fontWeight: 'bold', color: 'white' }}>
            🎯 Thiết lập hồ sơ
          </Text>
          <Text style={{ fontSize: 14, color: '#d1fae5', marginTop: 6 }}>
            Hoàn thành hồ sơ để nhận đề xuất phù hợp hơn
          </Text>
        </View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Section: Thông tin cá nhân */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 16 }}>
              👤 Thông tin cá nhân
            </Text>

            {/* Age */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                Tuổi
              </Text>
              <TextInput
                value={age}
                onChangeText={setAge}
                placeholder="Nhập tuổi của bạn (VD: 25)"
                keyboardType="number-pad"
                style={{
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 15,
                  color: '#1f2937'
                }}
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Location */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                Địa chỉ
              </Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="VD: Hồ Chí Minh, Hà Nội, Đà Nẵng"
                style={{
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 15,
                  color: '#1f2937'
                }}
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Height & Weight */}
            <View style={{ flexDirection: 'row', marginBottom: 20, gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                  Chiều cao (cm)
                </Text>
                <TextInput
                  value={height}
                  onChangeText={setHeight}
                  placeholder="170"
                  keyboardType="decimal-pad"
                  style={{
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 15,
                    color: '#1f2937'
                  }}
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                  Cân nặng (kg)
                </Text>
                <TextInput
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="65"
                  keyboardType="decimal-pad"
                  style={{
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 15,
                    color: '#1f2937'
                  }}
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Activity Level */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                Mức độ hoạt động
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <TouchableOpacity
                    key={level}
                    onPress={() => setActivityLevel(level)}
                    style={{
                      flex: 1,
                      paddingVertical: 14,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: activityLevel === level ? '#10b981' : '#e5e7eb',
                      backgroundColor: activityLevel === level ? '#d1fae5' : 'white',
                    }}
                  >
                    <Text
                      style={{
                        textAlign: 'center',
                        fontWeight: '600',
                        color: activityLevel === level ? '#047857' : '#6b7280',
                        fontSize: 14
                      }}
                    >
                      {level === 'low' ? 'Ít' : level === 'medium' ? 'Trung bình' : 'Cao'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Allergies */}
            <View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                Dị ứng thực phẩm
              </Text>
              <TextInput
                value={allergies}
                onChangeText={setAllergies}
                placeholder="VD: Sữa, Đậu phộng, Hải sản (cách nhau bởi dấu phẩy)"
                multiline
                numberOfLines={3}
                style={{
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  borderRadius: 12,
                  padding: 16,
                  fontSize: 15,
                  color: '#1f2937',
                  textAlignVertical: 'top'
                }}
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          {/* Section: Thành viên gia đình */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937' }}>
                👨‍👩‍👧‍👦 Thành viên gia đình ({members.length})
              </Text>
              <TouchableOpacity
                onPress={addMember}
                style={{
                  backgroundColor: '#10b981',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: 'white', fontWeight: '600', fontSize: 13 }}>+ Thêm</Text>
              </TouchableOpacity>
            </View>

            {members.length === 0 ? (
              <View style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 24,
                alignItems: 'center',
                borderWidth: 2,
                borderStyle: 'dashed',
                borderColor: '#e5e7eb'
              }}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>👥</Text>
                <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center' }}>
                  Chưa có thành viên nào. Nhấn "Thêm" để thêm thành viên gia đình
                </Text>
              </View>
            ) : (
              members.map((member, index) => (
                <View
                  key={member.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937' }}>
                      Thành viên #{index + 1}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeMember(member.id)}
                      style={{
                        backgroundColor: '#fef2f2',
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 8,
                      }}
                    >
                      <Text style={{ color: '#dc2626', fontWeight: '600', fontSize: 13 }}>Xóa</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Name */}
                  <View style={{ flexDirection: 'row', marginBottom: 12, gap: 12 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 }}>
                        Họ <Text style={{ color: '#ef4444' }}>*</Text>
                      </Text>
                      <TextInput
                        value={member.last_name}
                        onChangeText={(val) => updateMember(member.id, 'last_name', val)}
                        placeholder="Nguyễn Văn"
                        style={{
                          backgroundColor: '#f9fafb',
                          borderWidth: 1,
                          borderColor: '#e5e7eb',
                          borderRadius: 8,
                          padding: 12,
                          fontSize: 14,
                          color: '#1f2937'
                        }}
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 }}>
                        Tên <Text style={{ color: '#ef4444' }}>*</Text>
                      </Text>
                      <TextInput
                        value={member.first_name}
                        onChangeText={(val) => updateMember(member.id, 'first_name', val)}
                        placeholder="An"
                        style={{
                          backgroundColor: '#f9fafb',
                          borderWidth: 1,
                          borderColor: '#e5e7eb',
                          borderRadius: 8,
                          padding: 12,
                          fontSize: 14,
                          color: '#1f2937'
                        }}
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                  </View>

                  {/* Age, Height, Weight */}
                  <View style={{ flexDirection: 'row', marginBottom: 12, gap: 8 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 }}>
                        Tuổi
                      </Text>
                      <TextInput
                        value={member.age}
                        onChangeText={(val) => updateMember(member.id, 'age', val)}
                        placeholder="30"
                        keyboardType="number-pad"
                        style={{
                          backgroundColor: '#f9fafb',
                          borderWidth: 1,
                          borderColor: '#e5e7eb',
                          borderRadius: 8,
                          padding: 12,
                          fontSize: 14,
                          color: '#1f2937'
                        }}
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 }}>
                        Cao (cm)
                      </Text>
                      <TextInput
                        value={member.height}
                        onChangeText={(val) => updateMember(member.id, 'height', val)}
                        placeholder="165"
                        keyboardType="decimal-pad"
                        style={{
                          backgroundColor: '#f9fafb',
                          borderWidth: 1,
                          borderColor: '#e5e7eb',
                          borderRadius: 8,
                          padding: 12,
                          fontSize: 14,
                          color: '#1f2937'
                        }}
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 }}>
                        Nặng (kg)
                      </Text>
                      <TextInput
                        value={member.weight}
                        onChangeText={(val) => updateMember(member.id, 'weight', val)}
                        placeholder="55"
                        keyboardType="decimal-pad"
                        style={{
                          backgroundColor: '#f9fafb',
                          borderWidth: 1,
                          borderColor: '#e5e7eb',
                          borderRadius: 8,
                          padding: 12,
                          fontSize: 14,
                          color: '#1f2937'
                        }}
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                  </View>

                  {/* Activity */}
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 }}>
                      Hoạt động
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      {(['low', 'medium', 'high'] as const).map((level) => (
                        <TouchableOpacity
                          key={level}
                          onPress={() => updateMember(member.id, 'activity_level', level)}
                          style={{
                            flex: 1,
                            paddingVertical: 10,
                            borderRadius: 8,
                            borderWidth: 2,
                            borderColor: member.activity_level === level ? '#10b981' : '#e5e7eb',
                            backgroundColor: member.activity_level === level ? '#d1fae5' : '#f9fafb',
                          }}
                        >
                          <Text
                            style={{
                              textAlign: 'center',
                              fontWeight: '600',
                              color: member.activity_level === level ? '#047857' : '#6b7280',
                              fontSize: 12
                            }}
                          >
                            {level === 'low' ? 'Ít' : level === 'medium' ? 'TB' : 'Cao'}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Allergies */}
                  <View>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 }}>
                      Dị ứng
                    </Text>
                    <TextInput
                      value={member.allergies}
                      onChangeText={(val) => updateMember(member.id, 'allergies', val)}
                      placeholder="VD: Sữa, Đậu phộng"
                      style={{
                        backgroundColor: '#f9fafb',
                        borderWidth: 1,
                        borderColor: '#e5e7eb',
                        borderRadius: 8,
                        padding: 12,
                        fontSize: 14,
                        color: '#1f2937'
                      }}
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={{
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingHorizontal: 24,
          paddingVertical: 16,
          gap: 12
        }}>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? '#9ca3af' : '#10b981',
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                Lưu hồ sơ
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSkip}
            disabled={isLoading}
            style={{
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#6b7280', fontWeight: '600', fontSize: 16 }}>
              Bỏ qua
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
