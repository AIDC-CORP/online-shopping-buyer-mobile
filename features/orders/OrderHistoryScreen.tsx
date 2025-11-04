
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Order, OrderStatus } from '../../types';
import { fetchOrders } from '../../services/api/mockApiService';
import Spinner from '../../components/common/Spinner';

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

interface OrderHistoryScreenProps {
  onSelectOrder: (order: Order) => void;
}

const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({ onSelectOrder }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      const fetchedOrders = await fetchOrders();
      setOrders(fetchedOrders);
      setIsLoading(false);
    };
    loadOrders();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }
  
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 24 }}>Đơn hàng của bạn</Text>
      {orders.length === 0 ? (
         <Text style={{ textAlign: 'center', color: '#6b7280', paddingVertical: 40 }}>Bạn chưa có đơn hàng nào.</Text>
      ) : (
      <View>
        {orders.map(order => {
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
  );
};

export default OrderHistoryScreen;
