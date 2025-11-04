import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import { useCart } from '../../hooks/useCart';

interface CheckoutDialogProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({ visible, onClose, onSuccess }) => {
  const { totalWithShipping, checkoutWithWallet, isCheckingOut, walletBalance } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<'wallet' | 'cod' | 'card'>('wallet');

  const paymentMethods = [
    {
      id: 'wallet' as const,
      name: 'Ví điện tử',
      icon: '💰',
      description: `Số dư: ${walletBalance.toLocaleString('vi-VN')}đ`,
      available: walletBalance >= totalWithShipping,
    },
    {
      id: 'cod' as const,
      name: 'Thanh toán khi nhận hàng',
      icon: '🚚',
      description: 'Thanh toán bằng tiền mặt khi nhận hàng',
      available: true,
    },
    {
      id: 'card' as const,
      name: 'Thẻ tín dụng/ghi nợ',
      icon: '💳',
      description: 'Thanh toán bằng thẻ',
      available: true,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleCheckout = async () => {
    if (selectedMethod === 'wallet') {
      const orderId = `DH${Date.now()}`;
      const result = await checkoutWithWallet(orderId);

      if (result.success) {
        Alert.alert('Thành công', result.message, [
          { text: 'OK', onPress: () => {
            onSuccess();
            onClose();
          }}
        ]);
      } else {
        Alert.alert('Lỗi', result.message);
      }
    } else {
      // For COD and card payments, just show a success message for now
      // In a real app, this would integrate with payment gateways
      Alert.alert('Thông báo', `Tính năng thanh toán bằng ${paymentMethods.find(m => m.id === selectedMethod)?.name} đang được phát triển.`, [
        { text: 'OK' }
      ]);
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={{ flex: 1, backgroundColor: '#f9fafb', padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>Thanh toán</Text>
          <TouchableOpacity
            onPress={onClose}
            style={{ padding: 8 }}
          >
            <Text style={{ fontSize: 18, color: '#6b7280' }}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 8, marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 8 }}>
            Tổng tiền thanh toán
          </Text>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#059669' }}>
            {formatCurrency(totalWithShipping)}
          </Text>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 16 }}>
            Chọn phương thức thanh toán
          </Text>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => method.available && setSelectedMethod(method.id)}
              disabled={!method.available}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                marginBottom: 8,
                backgroundColor: selectedMethod === method.id ? '#dbeafe' : '#ffffff',
                borderRadius: 8,
                borderWidth: selectedMethod === method.id ? 2 : 1,
                borderColor: selectedMethod === method.id ? '#3b82f6' : '#e5e7eb',
                opacity: method.available ? 1 : 0.5,
              }}
            >
              <Text style={{ fontSize: 24, marginRight: 12 }}>{method.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }}>
                  {method.name}
                </Text>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>
                  {method.description}
                </Text>
                {!method.available && method.id === 'wallet' && (
                  <Text style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>
                    Số dư không đủ
                  </Text>
                )}
              </View>
              {selectedMethod === method.id && (
                <Text style={{ fontSize: 18, color: '#3b82f6' }}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleCheckout}
          disabled={isCheckingOut}
          style={{
            width: '100%',
            paddingHorizontal: 16,
            paddingVertical: 16,
            backgroundColor: isCheckingOut ? '#9ca3af' : '#10b981',
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 'auto',
          }}
        >
          {isCheckingOut ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: '600', fontSize: 16 }}>
              {selectedMethod === 'wallet' ? 'Thanh toán bằng ví' :
               selectedMethod === 'cod' ? 'Đặt hàng (thanh toán khi nhận)' :
               'Thanh toán bằng thẻ'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CheckoutDialog;