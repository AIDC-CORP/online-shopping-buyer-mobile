
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Order, OrderStatus } from '../../../types';
import Spinner from '../../../components/common/Spinner';
import { OrderHistoryScreenProps } from '../index';
import { useOrderHistory } from '../hooks/useOrderHistory';

const getStatusInfo = (status: OrderStatus) => {
  switch (status) {
    case 'completed': return { text: 'Giao thành công', bg: '#dcfce7', textClr: '#166534' };
    case 'delivering': return { text: 'Đang giao', bg: '#dbeafe', textClr: '#0c4a6e' };
    case 'cancelled': return { text: 'Đã hủy', bg: '#fee2e2', textClr: '#7f1d1d' };
    case 'pending': return { text: 'Chờ xác nhận', bg: '#fef3c7', textClr: '#78350f' };
    case 'confirmed': return { text: 'Đã xác nhận', bg: '#e0e7ff', textClr: '#3730a3' };
    case 'picking': return { text: 'Đang lấy hàng', bg: '#e0f2fe', textClr: '#164e63' };
    default: return { text: 'Không rõ', bg: '#f3f4f6', textClr: '#374151' };
  }
};

const STATUS_TABS: Array<{ key: string; label: string; value: OrderStatus | 'all' }> = [
  { key: 'all', label: 'Tất cả', value: 'all' },
  { key: 'pending', label: 'Chờ xác nhận', value: 'pending' },
  { key: 'confirmed', label: 'Đã xác nhận', value: 'confirmed' },
  { key: 'picking', label: 'Đang lấy hàng', value: 'picking' },
  { key: 'delivering', label: 'Đang giao', value: 'delivering' },
  { key: 'completed', label: 'Giao thành công', value: 'completed' },
  { key: 'cancelled', label: 'Đã hủy', value: 'cancelled' },
];

const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({ onSelectOrder }) => {
  const { orders, isLoading } = useOrderHistory();
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');

  // Filter orders based on active tab
  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') {
      return orders;
    }
    return orders.filter(order => order.status === activeTab);
  }, [orders, activeTab]);

  if (isLoading) {
    return <Spinner />;
  }
  
  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 0 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 16 }}>Đơn hàng của bạn</Text>
      </View>

      {/* Status Tabs */}
      <View style={{ backgroundColor: '#f9fafb', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 12 }}>
          {STATUS_TABS.map((tab, idx) => {
            const isActive = activeTab === tab.value;
            const count = tab.value === 'all'
              ? orders.length
              : orders.filter(o => o.status === tab.value).length;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.value)}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  marginRight: 12,
                  borderBottomWidth: isActive ? 2 : 0,
                  borderBottomColor: isActive ? '#ef4444' : 'transparent',
                  alignItems: 'center',
                }}>
                <Text style={{
                  fontSize: 12,
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? '#ef4444' : '#6b7280',
                  textAlign: 'center',
                }}>
                  {tab.label}
                </Text>
                <Text style={{
                  fontSize: 10,
                  color: isActive ? '#ef4444' : '#9ca3af',
                  marginTop: 2,
                  textAlign: 'center',
                }}>
                  {count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView
        style={{ flex: 1, backgroundColor: '#f9fafb' }}
        contentContainerStyle={{ paddingHorizontal: 6, paddingBottom: 6 }}>
        {filteredOrders.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#6b7280', paddingVertical: 40 }}>
            {activeTab === 'all' ? 'Bạn chưa có đơn hàng nào.' : `Không có đơn hàng ${STATUS_TABS.find(t => t.value === activeTab)?.label.toLowerCase()}.`}
          </Text>
        ) : (
          <View>
            {filteredOrders.map(order => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <TouchableOpacity 
                  key={order.id} 
                  onPress={() => onSelectOrder(order)}
                  style={{
                    backgroundColor: '#ffffff',
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    borderRadius: 8,
                    marginBottom: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                  }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View>
                      <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#1f2937' }}>Đơn hàng #{order.id}</Text>
                      <Text style={{ fontSize: 12, color: '#6b7280' }}>{new Date(order.date).toLocaleDateString('vi-VN')}</Text>
                    </View>
                    <View style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999, backgroundColor: statusInfo.bg }}>
                      <Text style={{ fontSize: 11, fontWeight: '600', color: statusInfo.textClr }}>
                        {statusInfo.text}
                      </Text>
                    </View>
                  </View>
                  <View style={{ marginTop: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 8 }}>
                    <Text style={{ fontWeight: '600' }}>Tổng cộng: {order.total.toLocaleString('vi-VN')}đ</Text>
                    <View style={{ flexDirection: 'row', marginTop: 8, marginLeft: -8 }}>
                      {order.items.slice(0, 4).map((item, index) => (
                          <Image key={index} source={{uri: item.product.imageUrl}} style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#ffffff', marginLeft: -8 }} resizeMode="cover"/>
                      ))}
                      {order.items.length > 4 && 
                        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#e5e7eb', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#ffffff', marginLeft: -8 }}>
                            <Text style={{ fontSize: 11, fontWeight: '600' }}>+{order.items.length - 4}</Text>
                        </View>
                      }
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default OrderHistoryScreen;
