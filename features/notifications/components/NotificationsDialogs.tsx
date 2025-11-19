import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { Notification } from '../../../types';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationsDialogProps } from '../index';

const NotificationsDialog: React.FC<NotificationsDialogProps> = ({ visible, onClose }) => {
  const { notifications, loading, handleMarkAsRead } = useNotifications(visible);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order_update':
        return '📦';
      case 'promotion':
        return '🎉';
      case 'system':
        return '⚙️';
      case 'reminder':
        return '🔔';
      default:
        return '📢';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Vừa xong';
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ngày trước`;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginRight: 8 }}>
              Thông báo
            </Text>
            {unreadCount > 0 && (
              <View style={{ backgroundColor: '#ef4444', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 }}>
                <Text style={{ fontSize: 12, color: '#ffffff', fontWeight: '600' }}>
                  {unreadCount}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={{ padding: 8 }}
          >
            <Text style={{ fontSize: 18, color: '#6b7280' }}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, padding: 16 }}>
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
              <ActivityIndicator size="large" color="#10b981" />
              <Text style={{ marginTop: 16, color: '#6b7280' }}>Đang tải thông báo...</Text>
            </View>
          ) : notifications.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>🔔</Text>
              <Text style={{ fontSize: 18, color: '#6b7280', textAlign: 'center' }}>
                Chưa có thông báo nào
              </Text>
            </View>
          ) : (
            notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                onPress={() => !notification.isRead && handleMarkAsRead(notification.id)}
                style={{
                  backgroundColor: notification.isRead ? '#ffffff' : '#eff6ff',
                  padding: 16,
                  borderRadius: 8,
                  marginBottom: 12,
                  borderWidth: notification.isRead ? 1 : 2,
                  borderColor: notification.isRead ? '#e5e7eb' : '#3b82f6',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 24, marginRight: 12 }}>
                    {getNotificationIcon(notification.type)}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', flex: 1, marginRight: 8 }}>
                        {notification.title}
                      </Text>
                      {!notification.isRead && (
                        <View style={{ width: 8, height: 8, backgroundColor: '#3b82f6', borderRadius: 4 }} />
                      )}
                    </View>
                    <Text style={{ fontSize: 14, color: '#4b5563', marginBottom: 8, lineHeight: 20 }}>
                      {notification.message}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#9ca3af' }}>
                      {formatDate(notification.date)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default NotificationsDialog;
