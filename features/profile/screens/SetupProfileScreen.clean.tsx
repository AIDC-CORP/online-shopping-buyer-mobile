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
  StyleSheet,
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
        console.log('[SetupProfile] Creating user profile:', userProfileData);
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🎯 Thiết lập hồ sơ</Text>
          <Text style={styles.headerSubtitle}>
            Hoàn thành hồ sơ để nhận đề xuất sản phẩm phù hợp hơn
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab('user')}
            style={[styles.tab, activeTab === 'user' && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === 'user' && styles.activeTabText]}>
              👤 Hồ sơ của bạn
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('members')}
            style={[styles.tab, activeTab === 'members' && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === 'members' && styles.activeTabText]}>
              👨‍👩‍👧‍👦 Gia đình ({members.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {activeTab === 'user' ? (
              <View>
                {/* Info Card */}
                <View style={styles.infoCard}>
                  <Text style={styles.infoText}>
                    💡 Thông tin này giúp chúng tôi đề xuất sản phẩm phù hợp với sức khỏe và nhu cầu của bạn
                  </Text>
                </View>

                {/* Age */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Tuổi</Text>
                  <TextInput
                    value={age}
                    onChangeText={setAge}
                    placeholder="Nhập tuổi của bạn (VD: 25)"
                    keyboardType="number-pad"
                    style={styles.input}
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                {/* Location */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Địa chỉ</Text>
                  <TextInput
                    value={location}
                    onChangeText={setLocation}
                    placeholder="VD: Hồ Chí Minh, Hà Nội, Đà Nẵng"
                    style={styles.input}
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                {/* Height & Weight */}
                <View style={styles.row}>
                  <View style={styles.halfField}>
                    <Text style={styles.label}>Chiều cao (cm)</Text>
                    <TextInput
                      value={height}
                      onChangeText={setHeight}
                      placeholder="170"
                      keyboardType="decimal-pad"
                      style={styles.input}
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                  <View style={styles.halfField}>
                    <Text style={styles.label}>Cân nặng (kg)</Text>
                    <TextInput
                      value={weight}
                      onChangeText={setWeight}
                      placeholder="65"
                      keyboardType="decimal-pad"
                      style={styles.input}
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                </View>

                {/* Activity Level */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Mức độ hoạt động</Text>
                  <View style={styles.row}>
                    {(['low', 'medium', 'high'] as const).map((level) => (
                      <TouchableOpacity
                        key={level}
                        onPress={() => setActivityLevel(level)}
                        style={[
                          styles.activityButton,
                          activityLevel === level && styles.activityButtonActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.activityText,
                            activityLevel === level && styles.activityTextActive,
                          ]}
                        >
                          {level === 'low' ? '🛋️ Ít' : level === 'medium' ? '🚶 TB' : '🏃 Cao'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Allergies */}
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Dị ứng thực phẩm</Text>
                  <TextInput
                    value={allergies}
                    onChangeText={setAllergies}
                    placeholder="VD: Sữa, Đậu phộng, Hải sản"
                    multiline
                    numberOfLines={3}
                    style={[styles.input, styles.textArea]}
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>
            ) : (
              <View>
                {/* Info Card */}
                <View style={[styles.infoCard, { backgroundColor: '#faf5ff', borderColor: '#e9d5ff' }]}>
                  <Text style={[styles.infoText, { color: '#7c3aed' }]}>
                    👨‍👩‍👧‍👦 Thêm thông tin thành viên gia đình để nhận đề xuất cho cả nhà
                  </Text>
                </View>

                {members.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>👥</Text>
                    <Text style={styles.emptyTitle}>Chưa có thành viên nào</Text>
                    <Text style={styles.emptySubtitle}>
                      Nhấn nút "Thêm thành viên" bên dưới để bắt đầu
                    </Text>
                  </View>
                ) : (
                  members.map((member, index) => (
                    <View key={member.id} style={styles.memberCard}>
                      <View style={styles.memberHeader}>
                        <Text style={styles.memberTitle}>👤 Thành viên #{index + 1}</Text>
                        <TouchableOpacity
                          onPress={() => removeMember(member.id)}
                          style={styles.deleteButton}
                        >
                          <Text style={styles.deleteText}>🗑️ Xóa</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Name */}
                      <View style={styles.row}>
                        <View style={styles.halfField}>
                          <Text style={styles.labelSmall}>Họ *</Text>
                          <TextInput
                            value={member.last_name}
                            onChangeText={(val) => updateMember(member.id, 'last_name', val)}
                            placeholder="Nguyễn Văn"
                            style={styles.inputSmall}
                            placeholderTextColor="#9ca3af"
                          />
                        </View>
                        <View style={styles.halfField}>
                          <Text style={styles.labelSmall}>Tên *</Text>
                          <TextInput
                            value={member.first_name}
                            onChangeText={(val) => updateMember(member.id, 'first_name', val)}
                            placeholder="An"
                            style={styles.inputSmall}
                            placeholderTextColor="#9ca3af"
                          />
                        </View>
                      </View>

                      {/* Age, Height, Weight */}
                      <View style={styles.row}>
                        <View style={styles.thirdField}>
                          <Text style={styles.labelSmall}>Tuổi</Text>
                          <TextInput
                            value={member.age}
                            onChangeText={(val) => updateMember(member.id, 'age', val)}
                            placeholder="30"
                            keyboardType="number-pad"
                            style={styles.inputSmall}
                            placeholderTextColor="#9ca3af"
                          />
                        </View>
                        <View style={styles.thirdField}>
                          <Text style={styles.labelSmall}>Cao (cm)</Text>
                          <TextInput
                            value={member.height}
                            onChangeText={(val) => updateMember(member.id, 'height', val)}
                            placeholder="165"
                            keyboardType="decimal-pad"
                            style={styles.inputSmall}
                            placeholderTextColor="#9ca3af"
                          />
                        </View>
                        <View style={styles.thirdField}>
                          <Text style={styles.labelSmall}>Nặng (kg)</Text>
                          <TextInput
                            value={member.weight}
                            onChangeText={(val) => updateMember(member.id, 'weight', val)}
                            placeholder="55"
                            keyboardType="decimal-pad"
                            style={styles.inputSmall}
                            placeholderTextColor="#9ca3af"
                          />
                        </View>
                      </View>

                      {/* Activity */}
                      <View style={{ marginTop: 12 }}>
                        <Text style={styles.labelSmall}>Hoạt động</Text>
                        <View style={styles.row}>
                          {(['low', 'medium', 'high'] as const).map((level) => (
                            <TouchableOpacity
                              key={level}
                              onPress={() => updateMember(member.id, 'activity_level', level)}
                              style={[
                                styles.activityButtonSmall,
                                member.activity_level === level && styles.activityButtonActive,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.activityTextSmall,
                                  member.activity_level === level && styles.activityTextActive,
                                ]}
                              >
                                {level === 'low' ? '🛋️' : level === 'medium' ? '🚶' : '🏃'}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>

                      {/* Allergies */}
                      <View style={{ marginTop: 12 }}>
                        <Text style={styles.labelSmall}>Dị ứng</Text>
                        <TextInput
                          value={member.allergies}
                          onChangeText={(val) => updateMember(member.id, 'allergies', val)}
                          placeholder="VD: Sữa, Đậu phộng"
                          style={styles.inputSmall}
                          placeholderTextColor="#9ca3af"
                        />
                      </View>
                    </View>
                  ))
                )}

                {/* Add Member Button */}
                <TouchableOpacity onPress={addMember} style={styles.addButton}>
                  <Text style={styles.addButtonText}>➕ Thêm thành viên</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading}
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>💾 Lưu hồ sơ</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={onSkip} disabled={isLoading} style={styles.skipButton}>
            <Text style={styles.skipButtonText}>⏭️ Bỏ qua</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#d1fae5',
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#10b981',
  },
  tabText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#10b981',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#dbeafe',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  labelSmall: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  inputSmall: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  thirdField: {
    flex: 1,
  },
  activityButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  activityButtonActive: {
    borderColor: '#10b981',
    backgroundColor: '#d1fae5',
  },
  activityText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#6b7280',
  },
  activityTextActive: {
    color: '#10b981',
  },
  activityButtonSmall: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  activityTextSmall: {
    textAlign: 'center',
    fontSize: 20,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  memberCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  memberTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  deleteText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#d1fae5',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#10b981',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#10b981',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  skipButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#6b7280',
    fontWeight: '600',
    fontSize: 16,
  },
});
