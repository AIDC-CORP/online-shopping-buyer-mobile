
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { ProfileScreenProps } from '../index';
import { useAppContext } from '../../../context/AppContext';
import ProfileService from '../../../services/profile/ProfileService';
import type { UserProfile, MemberProfile } from '../../../services/profile/ProfileService';
import EditProfile from '../components/dialog/EditProfileDialog';
import AddProfile from '../components/dialog/AddFamilyMemberDialog';
import EditFamilyMember from '../components/dialog/EditFamilyMemberDialog';
import WalletCard from '../components/WalletCard';
import TopUpDialog from '../components/dialog/TopUpDialog';
import TransactionHistory from '../components/TransactionHistory';

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const { user } = useAppContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditFamilyModalVisible, setIsEditFamilyModalVisible] = useState(false);
  const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(null);
  const [isTopUpModalVisible, setIsTopUpModalVisible] = useState(false);
  const [isTransactionHistoryVisible, setIsTransactionHistoryVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'wallet'>('info');

  // Avatar and cover image states (using placeholder URLs for now)
  const [avatarUri] = useState('https://via.placeholder.com/100x100/10B981/FFFFFF?text=👤');
  const [coverUri] = useState('https://via.placeholder.com/400x200/10B981/FFFFFF?text=Profile');

  const activityLevelLabels = { low: 'Thấp', medium: 'Trung bình', high: 'Cao' };

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      console.log('[ProfileScreen] Fetching profile...');
      const data = await ProfileService.getUserProfile();
      console.log('[ProfileScreen] Profile data:', data);
      setProfile(data);
    } catch (error) {
      console.error('[ProfileScreen] Failed to fetch profile:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin hồ sơ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProfile();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={{ marginTop: 16, color: '#6b7280' }}>Đang tải hồ sơ...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb', padding: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 8 }}>Chưa có hồ sơ</Text>
        <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 24 }}>
          Bạn chưa thiết lập hồ sơ. Vui lòng đăng xuất và đăng nhập lại để thiết lập.
        </Text>
        <TouchableOpacity
          onPress={onLogout}
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: '#10b981',
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#ffffff', fontWeight: '600' }}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#f9fafb' }} 
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={['#10b981']} />
      }
    >
      {/* Cover Image Section */}
      <View style={{ position: 'relative', marginBottom: 60 }}>
        <Image
          source={{ uri: coverUri }}
          style={{ width: '100%', height: 180, backgroundColor: '#10b981' }}
          resizeMode="cover"
        />
        {/* Avatar positioned over cover */}
        <View style={{ position: 'absolute', bottom: -50, left: 24 }}>
          <Image
            source={{ uri: avatarUri }}
            style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#ffffff', backgroundColor: '#e5e7eb' }}
            resizeMode="cover"
          />
        </View>
        {/* Logout button in top right */}
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Xác nhận đăng xuất',
              'Bạn có chắc chắn muốn đăng xuất?',
              [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Đăng xuất', style: 'destructive', onPress: onLogout },
              ]
            );
          }}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '600' }}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* User Name and Info */}
      <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>
              {profile.first_name && profile.last_name 
                ? `${profile.first_name} ${profile.last_name}`
                : user?.name || 'Người dùng'}
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
              {user?.phone || 'Chưa có số điện thoại'}
            </Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 24, marginBottom: 24, gap: 8 }}>
        <TouchableOpacity
          onPress={() => setActiveTab('info')}
          style={{
            flex: 1,
            paddingVertical: 12,
            backgroundColor: activeTab === 'info' ? '#10b981' : '#ffffff',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: activeTab === 'info' ? '#10b981' : '#e5e7eb',
          }}
        >
          <Text style={{
            textAlign: 'center',
            fontWeight: '600',
            color: activeTab === 'info' ? '#ffffff' : '#6b7280',
          }}>
            📋 Thông tin
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('wallet')}
          style={{
            flex: 1,
            paddingVertical: 12,
            backgroundColor: activeTab === 'wallet' ? '#10b981' : '#ffffff',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: activeTab === 'wallet' ? '#10b981' : '#e5e7eb',
          }}
        >
          <Text style={{
            textAlign: 'center',
            fontWeight: '600',
            color: activeTab === 'wallet' ? '#ffffff' : '#6b7280',
          }}>
            💰 Ví
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'info' ? (
        <>
          {/* Personal Information Card */}
          <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937' }}>Thông tin cá nhân</Text>
              <TouchableOpacity
                onPress={() => setIsEditModalVisible(true)}
                style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#dbeafe', borderRadius: 9999 }}
              >
                <Text style={{ color: '#0c4a6e', fontSize: 12, fontWeight: '600' }}>Chỉnh sửa</Text>
              </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
              {profile.age && (
                <View style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, color: '#6b7280', width: 120 }}>Tuổi</Text>
                  <Text style={{ fontSize: 16, color: '#1f2937', fontWeight: '500' }}>{profile.age}</Text>
                </View>
              )}

              {profile.location && profile.location.length > 0 && (
                <View style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, color: '#6b7280', width: 120 }}>Địa điểm</Text>
                  <Text style={{ fontSize: 16, color: '#1f2937', fontWeight: '500' }}>{profile.location.join(', ')}</Text>
                </View>
              )}

              {profile.health?.height && (
                <View style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, color: '#6b7280', width: 120 }}>Chiều cao</Text>
                  <Text style={{ fontSize: 16, color: '#1f2937', fontWeight: '500' }}>{profile.health.height} cm</Text>
                </View>
              )}

              {profile.health?.weight && (
                <View style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, color: '#6b7280', width: 120 }}>Cân nặng</Text>
                  <Text style={{ fontSize: 16, color: '#1f2937', fontWeight: '500' }}>{profile.health.weight} kg</Text>
                </View>
              )}

              {profile.health?.activity_level && (
                <View style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, color: '#6b7280', width: 120 }}>Mức độ hoạt động</Text>
                  <Text style={{ fontSize: 16, color: '#1f2937', fontWeight: '500' }}>
                    {activityLevelLabels[profile.health.activity_level]}
                  </Text>
                </View>
              )}

              {profile.health?.allergies && profile.health.allergies.length > 0 && (
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontSize: 14, color: '#6b7280', width: 120 }}>Dị ứng</Text>
                  <Text style={{ fontSize: 16, color: '#ef4444', fontWeight: '500', flex: 1 }}>
                    {profile.health.allergies.join(', ')}
                  </Text>
                </View>
              )}

              {!profile.age && !profile.location && !profile.health?.height && !profile.health?.weight && (
                <Text style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center', paddingVertical: 16 }}>
                  Chưa có thông tin cá nhân. Nhấn "Chỉnh sửa" để thêm.
                </Text>
              )}
            </View>
          </View>

          {/* Family Members Section */}
          <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937' }}>
                Thành viên gia đình {profile.members && profile.members.length > 0 ? `(${profile.members.length})` : ''}
              </Text>
              <TouchableOpacity
                onPress={() => setIsAddModalVisible(true)}
                style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#10b981', borderRadius: 9999 }}
              >
                <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '600' }}>+ Thêm</Text>
              </TouchableOpacity>
            </View>

            {profile.members && profile.members.length > 0 ? (
              profile.members.map((member: MemberProfile, index: number) => (
                <TouchableOpacity
                  key={member.id}
                  activeOpacity={0.7}
                  onLongPress={() => {
                    Alert.alert(
                      'Xóa thành viên',
                      `Bạn có chắc chắn muốn xóa "${member.first_name} ${member.last_name}"?`,
                      [
                        { text: 'Hủy', style: 'cancel' },
                        {
                          text: 'Xóa',
                          style: 'destructive',
                          onPress: async () => {
                            try {
                              await ProfileService.deleteMembers([member.id]);
                              Alert.alert('Thành công', 'Đã xóa thành viên');
                              fetchProfile(); // Refresh
                            } catch (error) {
                              Alert.alert('Lỗi', 'Không thể xóa thành viên');
                            }
                          }
                        }
                      ]
                    );
                  }}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 12,
                    padding: 20,
                    marginBottom: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#1f2937', flex: 1 }}>
                      {member.first_name} {member.last_name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setEditingMemberIndex(index);
                        setIsEditFamilyModalVisible(true);
                      }}
                      style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#dbeafe', borderRadius: 9999 }}
                    >
                      <Text style={{ color: '#0c4a6e', fontSize: 12, fontWeight: '600' }}>Sửa</Text>
                    </TouchableOpacity>
                  </View>

                  {member.age && (
                    <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                      <Text style={{ fontSize: 14, color: '#6b7280', width: 100 }}>Tuổi:</Text>
                      <Text style={{ fontSize: 14, color: '#1f2937' }}>{member.age}</Text>
                    </View>
                  )}

                  {member.location && member.location.length > 0 && (
                    <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                      <Text style={{ fontSize: 14, color: '#6b7280', width: 100 }}>Địa điểm:</Text>
                      <Text style={{ fontSize: 14, color: '#1f2937' }}>{member.location.join(', ')}</Text>
                    </View>
                  )}

                  {member.health?.height && (
                    <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                      <Text style={{ fontSize: 14, color: '#6b7280', width: 100 }}>Chiều cao:</Text>
                      <Text style={{ fontSize: 14, color: '#1f2937' }}>{member.health.height} cm</Text>
                    </View>
                  )}

                  {member.health?.weight && (
                    <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                      <Text style={{ fontSize: 14, color: '#6b7280', width: 100 }}>Cân nặng:</Text>
                      <Text style={{ fontSize: 14, color: '#1f2937' }}>{member.health.weight} kg</Text>
                    </View>
                  )}

                  {member.health?.activity_level && (
                    <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                      <Text style={{ fontSize: 14, color: '#6b7280', width: 100 }}>Hoạt động:</Text>
                      <Text style={{ fontSize: 14, color: '#1f2937' }}>
                        {activityLevelLabels[member.health.activity_level]}
                      </Text>
                    </View>
                  )}

                  {member.health?.allergies && member.health.allergies.length > 0 && (
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ fontSize: 14, color: '#6b7280', width: 100 }}>Dị ứng:</Text>
                      <Text style={{ fontSize: 14, color: '#ef4444', flex: 1 }}>
                        {member.health.allergies.join(', ')}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: 32, alignItems: 'center' }}>
                <Text style={{ fontSize: 40, marginBottom: 12 }}>👨‍👩‍👧‍👦</Text>
                <Text style={{ fontSize: 16, color: '#1f2937', fontWeight: '600', marginBottom: 8 }}>
                  Chưa có thành viên gia đình
                </Text>
                <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center' }}>
                  Thêm thành viên gia đình để nhận đề xuất phù hợp hơn
                </Text>
              </View>
            )}
          </View>
        </>
      ) : (
        /* Wallet Tab */
        <View style={{ paddingHorizontal: 24 }}>
          <WalletCard
            onTopUpPress={() => setIsTopUpModalVisible(true)}
            onHistoryPress={() => setIsTransactionHistoryVisible(true)}
          />
        </View>
      )}

      <Modal
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <EditProfile onClose={() => {
          setIsEditModalVisible(false);
          fetchProfile(); // Refresh after edit
        }} />
      </Modal>

      <Modal
        visible={isAddModalVisible}
        onRequestClose={() => setIsAddModalVisible(false)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AddProfile onClose={() => {
          setIsAddModalVisible(false);
          fetchProfile(); // Refresh after add
        }} />
      </Modal>

      <Modal
        visible={isEditFamilyModalVisible}
        onRequestClose={() => setIsEditFamilyModalVisible(false)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {editingMemberIndex !== null && profile?.members && profile.members[editingMemberIndex] && (
          <EditFamilyMember 
            onClose={() => {
              setIsEditFamilyModalVisible(false);
              setEditingMemberIndex(null);
              fetchProfile(); // Refresh after edit
            }} 
            member={profile.members[editingMemberIndex]} 
          />
        )}
      </Modal>

      <TopUpDialog
        visible={isTopUpModalVisible}
        onClose={() => setIsTopUpModalVisible(false)}
      />

      <Modal
        visible={isTransactionHistoryVisible}
        onRequestClose={() => setIsTransactionHistoryVisible(false)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <TransactionHistory onClose={() => setIsTransactionHistoryVisible(false)} />
      </Modal>
    </ScrollView>
  );
};

export default ProfileScreen;
