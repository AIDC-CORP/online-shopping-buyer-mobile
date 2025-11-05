
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { ProfileScreenProps } from '../index';
import { useProfile } from '../hooks/useEditProfile';
import EditProfile from '../components/dialog/EditProfileDialog';
import AddProfile from '../components/dialog/AddFamilyMemberDialog';
import EditFamilyMember from '../components/dialog/EditFamilyMemberDialog';
import WalletCard from '../components/WalletCard';
import TopUpDialog from '../components/dialog/TopUpDialog';
import TransactionHistory from '../components/TransactionHistory';

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const { profile, activityLevelLabels } = useProfile();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditFamilyModalVisible, setIsEditFamilyModalVisible] = useState(false);
  const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(null);
  const [isTopUpModalVisible, setIsTopUpModalVisible] = useState(false);
  const [isTransactionHistoryVisible, setIsTransactionHistoryVisible] = useState(false);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }} contentContainerStyle={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937' }}>Hồ sơ của bạn</Text>
        <TouchableOpacity
          onPress={() => setIsEditModalVisible(true)}
          style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#dbeafe', borderRadius: 9999 }}
        >
          <Text style={{ color: '#0c4a6e', fontSize: 12, fontWeight: '600' }}>
            Chỉnh sửa
          </Text>
        </TouchableOpacity>
      </View>

      <WalletCard
        onTopUpPress={() => setIsTopUpModalVisible(true)}
        onHistoryPress={() => setIsTransactionHistoryVisible(true)}
      />

      <View style={{ paddingHorizontal: 24, paddingVertical: 24, backgroundColor: '#ffffff', borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, marginBottom: 16 }}>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Tên</Text>
          <Text style={{ fontSize: 16, color: '#1f2937' }}>{profile.name}</Text>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Tuổi</Text>
          <Text style={{ fontSize: 16, color: '#1f2937' }}>{profile.age}</Text>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Địa điểm</Text>
          <Text style={{ fontSize: 16, color: '#1f2937' }}>{profile.location}</Text>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Chiều cao</Text>
          <Text style={{ fontSize: 16, color: '#1f2937' }}>{profile.height} cm</Text>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Cân nặng</Text>
          <Text style={{ fontSize: 16, color: '#1f2937' }}>{profile.weight} kg</Text>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Mức độ hoạt động</Text>
          <Text style={{ fontSize: 16, color: '#1f2937' }}>{activityLevelLabels[profile.activityLevel]}</Text>
        </View>

        {profile.allergies.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151', marginBottom: 4 }}>Dị ứng</Text>
            <Text style={{ fontSize: 16, color: '#1f2937' }}>{profile.allergies.join(', ')}</Text>
          </View>
        )}
      </View>

      <View style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937' }}>Thành viên gia đình</Text>
          <TouchableOpacity
            onPress={() => setIsAddModalVisible(true)}
            style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#10b981', borderRadius: 9999 }}
          >
            <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '600' }}>
              Thêm thành viên
            </Text>
          </TouchableOpacity>
        </View>

        {profile.familyMembers.map((member, index) => (
          <View key={index} style={{ paddingHorizontal: 24, paddingVertical: 16, backgroundColor: '#ffffff', borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', flex: 1 }}>{member.name}</Text>
              <TouchableOpacity
                onPress={() => {
                  setEditingMemberIndex(index);
                  setIsEditFamilyModalVisible(true);
                }}
                style={{ paddingHorizontal: 12, paddingVertical: 4, backgroundColor: '#dbeafe', borderRadius: 9999 }}
              >
                <Text style={{ color: '#0c4a6e', fontSize: 12, fontWeight: '600' }}>
                  Chỉnh sửa
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 14, color: '#6b7280' }}>Tuổi: {member.age}</Text>
            <Text style={{ fontSize: 14, color: '#6b7280' }}>Địa điểm: {member.location}</Text>
            <Text style={{ fontSize: 14, color: '#6b7280' }}>Chiều cao: {member.height} cm</Text>
            <Text style={{ fontSize: 14, color: '#6b7280' }}>Cân nặng: {member.weight} kg</Text>
            <Text style={{ fontSize: 14, color: '#6b7280' }}>Mức độ hoạt động: {activityLevelLabels[member.activityLevel]}</Text>
            {member.allergies.length > 0 && <Text style={{ fontSize: 14, color: '#6b7280' }}>Dị ứng: {member.allergies.join(', ')}</Text>}
          </View>
        ))}
      </View>
      
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            'Xác nhận đăng xuất',
            'Bạn có chắc chắn muốn đăng xuất?',
            [
              {
                text: 'Hủy',
                style: 'cancel',
              },
              {
                text: 'Đăng xuất',
                style: 'destructive',
                onPress: onLogout,
              },
            ]
          );
        }}
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

      <Modal
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <EditProfile onClose={() => setIsEditModalVisible(false)} />
      </Modal>

      <Modal
        visible={isAddModalVisible}
        onRequestClose={() => setIsAddModalVisible(false)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AddProfile onClose={() => setIsAddModalVisible(false)} />
      </Modal>

      <Modal
        visible={isEditFamilyModalVisible}
        onRequestClose={() => setIsEditFamilyModalVisible(false)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {editingMemberIndex !== null && (
          <EditFamilyMember 
            onClose={() => setIsEditFamilyModalVisible(false)} 
            memberIndex={editingMemberIndex} 
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
