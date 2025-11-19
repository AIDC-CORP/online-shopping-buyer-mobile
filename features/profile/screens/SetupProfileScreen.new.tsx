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
  location: string;
  height: string;
  weight: string;
  activity_level: 'low' | 'medium' | 'high';
  allergies: string;
}

export default function SetupProfileScreen({ onComplete, onSkip }: SetupProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<'user' | 'members'>('user');
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
      location: '',
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

      // Validate user profile data
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
        userProfileData.location = location;
      }

      // Health info
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

      // Create user profile if has data
      if (Object.keys(userProfileData).length > 0) {
        console.log('[SetupProfile] Creating user profile:', userProfileData);
        await ProfileService.createUserProfile(userProfileData);
      }

      // Create family members if any
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

            if (m.location) {
              memberData.location = m.location;
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
          await ProfileService.createMembers(membersData);
        }
      }

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
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="bg-green-600 px-4 py-6">
          <Text className="text-2xl font-bold text-white">🎯 Thiết lập hồ sơ</Text>
          <Text className="text-sm text-green-100 mt-2">
            Hoàn thành hồ sơ để nhận đề xuất sản phẩm phù hợp hơn với bạn
          </Text>
        </View>

        {/* Tabs */}
        <View className="flex-row bg-white border-b border-gray-200">
          <TouchableOpacity
            onPress={() => setActiveTab('user')}
            className={`flex-1 py-4 ${activeTab === 'user' ? 'border-b-2 border-green-600' : ''}`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === 'user' ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              👤 Hồ sơ của bạn
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('members')}
            className={`flex-1 py-4 ${activeTab === 'members' ? 'border-b-2 border-green-600' : ''}`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === 'members' ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              👨‍👩‍👧‍👦 Gia đình ({members.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
          <View className="px-4 py-6">
            {activeTab === 'user' ? (
              <View className="space-y-5">
                {/* Info Card */}
                <View className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                  <Text className="text-sm text-blue-800">
                    💡 Thông tin này giúp chúng tôi đề xuất sản phẩm phù hợp với sức khỏe và nhu cầu của bạn
                  </Text>
                </View>

                {/* Age */}
                <View>
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Tuổi</Text>
                  <TextInput
                    value={age}
                    onChangeText={setAge}
                    placeholder="Nhập tuổi của bạn (VD: 25)"
                    keyboardType="number-pad"
                    className="bg-white border border-gray-300 rounded-lg px-4 py-3.5 text-base text-gray-900"
                  />
                </View>

                {/* Location */}
                <View>
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Địa chỉ</Text>
                  <TextInput
                    value={location}
                    onChangeText={setLocation}
                    placeholder="VD: Hồ Chí Minh, Hà Nội, Đà Nẵng"
                    className="bg-white border border-gray-300 rounded-lg px-4 py-3.5 text-base text-gray-900"
                  />
                </View>

                {/* Height & Weight */}
                <View className="flex-row space-x-3">
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">Chiều cao (cm)</Text>
                    <TextInput
                      value={height}
                      onChangeText={setHeight}
                      placeholder="170"
                      keyboardType="decimal-pad"
                      className="bg-white border border-gray-300 rounded-lg px-4 py-3.5 text-base text-gray-900"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">Cân nặng (kg)</Text>
                    <TextInput
                      value={weight}
                      onChangeText={setWeight}
                      placeholder="65"
                      keyboardType="decimal-pad"
                      className="bg-white border border-gray-300 rounded-lg px-4 py-3.5 text-base text-gray-900"
                    />
                  </View>
                </View>

                {/* Activity Level */}
                <View>
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Mức độ hoạt động</Text>
                  <View className="flex-row space-x-2">
                    {(['low', 'medium', 'high'] as const).map((level) => (
                      <TouchableOpacity
                        key={level}
                        onPress={() => setActivityLevel(level)}
                        className={`flex-1 py-3.5 rounded-lg border-2 ${
                          activityLevel === level
                            ? 'bg-green-50 border-green-600'
                            : 'bg-white border-gray-300'
                        }`}
                      >
                        <Text
                          className={`text-center font-semibold ${
                            activityLevel === level ? 'text-green-600' : 'text-gray-600'
                          }`}
                        >
                          {level === 'low' ? '🛋️ Ít' : level === 'medium' ? '🚶 Trung bình' : '🏃 Cao'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Allergies */}
                <View>
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Dị ứng thực phẩm</Text>
                  <TextInput
                    value={allergies}
                    onChangeText={setAllergies}
                    placeholder="VD: Sữa, Đậu phộng, Hải sản (cách nhau bởi dấu phẩy)"
                    multiline
                    numberOfLines={3}
                    className="bg-white border border-gray-300 rounded-lg px-4 py-3.5 text-base text-gray-900"
                    style={{ textAlignVertical: 'top' }}
                  />
                </View>
              </View>
            ) : (
              <View className="space-y-5">
                {/* Info Card */}
                <View className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3">
                  <Text className="text-sm text-purple-800">
                    👨‍👩‍👧‍👦 Thêm thông tin thành viên gia đình để nhận đề xuất sản phẩm phù hợp cho cả nhà
                  </Text>
                </View>

                {members.length === 0 ? (
                  <View className="bg-white rounded-lg p-8 items-center border border-dashed border-gray-300">
                    <Text className="text-6xl mb-3">👥</Text>
                    <Text className="text-gray-500 text-center mb-2 font-medium">
                      Chưa có thành viên nào
                    </Text>
                    <Text className="text-gray-400 text-sm text-center">
                      Nhấn nút "Thêm thành viên" bên dưới để bắt đầu
                    </Text>
                  </View>
                ) : (
                  members.map((member, index) => (
                    <View key={member.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold text-gray-900">
                          👤 Thành viên #{index + 1}
                        </Text>
                        <TouchableOpacity
                          onPress={() => removeMember(member.id)}
                          className="bg-red-50 px-3 py-1.5 rounded-lg border border-red-200"
                        >
                          <Text className="text-red-600 text-sm font-semibold">🗑️ Xóa</Text>
                        </TouchableOpacity>
                      </View>

                      <View className="space-y-4">
                        {/* Name Fields */}
                        <View className="flex-row space-x-3">
                          <View className="flex-1">
                            <Text className="text-sm font-semibold text-gray-700 mb-2">Họ *</Text>
                            <TextInput
                              value={member.last_name}
                              onChangeText={(val) => updateMember(member.id, 'last_name', val)}
                              placeholder="Nguyễn Văn"
                              className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                            />
                          </View>
                          <View className="flex-1">
                            <Text className="text-sm font-semibold text-gray-700 mb-2">Tên *</Text>
                            <TextInput
                              value={member.first_name}
                              onChangeText={(val) => updateMember(member.id, 'first_name', val)}
                              placeholder="An"
                              className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                            />
                          </View>
                        </View>

                        {/* Age & Height & Weight */}
                        <View className="flex-row space-x-2">
                          <View className="flex-1">
                            <Text className="text-sm font-semibold text-gray-700 mb-2">Tuổi</Text>
                            <TextInput
                              value={member.age}
                              onChangeText={(val) => updateMember(member.id, 'age', val)}
                              placeholder="30"
                              keyboardType="number-pad"
                              className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900"
                            />
                          </View>
                          <View className="flex-1">
                            <Text className="text-sm font-semibold text-gray-700 mb-2">Cao (cm)</Text>
                            <TextInput
                              value={member.height}
                              onChangeText={(val) => updateMember(member.id, 'height', val)}
                              placeholder="165"
                              keyboardType="decimal-pad"
                              className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900"
                            />
                          </View>
                          <View className="flex-1">
                            <Text className="text-sm font-semibold text-gray-700 mb-2">Nặng (kg)</Text>
                            <TextInput
                              value={member.weight}
                              onChangeText={(val) => updateMember(member.id, 'weight', val)}
                              placeholder="55"
                              keyboardType="decimal-pad"
                              className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900"
                            />
                          </View>
                        </View>

                        {/* Activity Level */}
                        <View>
                          <Text className="text-sm font-semibold text-gray-700 mb-2">Hoạt động</Text>
                          <View className="flex-row space-x-2">
                            {(['low', 'medium', 'high'] as const).map((level) => (
                              <TouchableOpacity
                                key={level}
                                onPress={() => updateMember(member.id, 'activity_level', level)}
                                className={`flex-1 py-2.5 rounded-lg border-2 ${
                                  member.activity_level === level
                                    ? 'bg-green-50 border-green-600'
                                    : 'bg-gray-50 border-gray-300'
                                }`}
                              >
                                <Text
                                  className={`text-center text-sm font-semibold ${
                                    member.activity_level === level
                                      ? 'text-green-600'
                                      : 'text-gray-600'
                                  }`}
                                >
                                  {level === 'low' ? '🛋️ Ít' : level === 'medium' ? '🚶 TB' : '🏃 Cao'}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>

                        {/* Allergies */}
                        <View>
                          <Text className="text-sm font-semibold text-gray-700 mb-2">Dị ứng</Text>
                          <TextInput
                            value={member.allergies}
                            onChangeText={(val) => updateMember(member.id, 'allergies', val)}
                            placeholder="VD: Sữa, Đậu phộng"
                            className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                          />
                        </View>
                      </View>
                    </View>
                  ))
                )}

                {/* Add Member Button */}
                <TouchableOpacity
                  onPress={addMember}
                  className="bg-green-50 border-2 border-dashed border-green-600 rounded-lg py-4 items-center"
                >
                  <Text className="text-green-600 font-bold text-base">➕ Thêm thành viên</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View className="bg-white border-t border-gray-200 px-4 py-4 space-y-3">
          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading}
            className={`rounded-lg py-4 items-center ${
              isLoading ? 'bg-gray-400' : 'bg-green-600'
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-base">💾 Lưu hồ sơ</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={onSkip}
            disabled={isLoading}
            className="border border-gray-300 rounded-lg py-4 items-center"
          >
            <Text className="text-gray-600 font-semibold text-base">⏭️ Bỏ qua</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
