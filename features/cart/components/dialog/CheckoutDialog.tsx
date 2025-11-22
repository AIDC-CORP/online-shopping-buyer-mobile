import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import { useCart } from '../../hooks/useCart';
import { CheckoutDialogProps } from '../..';
import OrderService from '../../../../services/order/OrderService';

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({ visible, onClose, onSuccess }) => {
  const { totalWithShipping, voucherCode, clearCart, isCheckingOut, walletBalance } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<'wallet' | 'cod' | 'card'>('cod');
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

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
    // Validate shipping info
    if (!recipientName || !phone || !address) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    if (phone.length < 10) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ');
      return;
    }

    try {
      setIsCreatingOrder(true);

      // Create order via OrderService
      const orderData = {
        shipping_address: {
          recipient_name: recipientName,
          phone: phone,
          address: address,
        },
        payment_method: selectedMethod === 'cod' ? 'COD' : selectedMethod === 'card' ? 'BANK_TRANSFER' : 'WALLET',
        payment_token: selectedMethod === 'card' ? 'mock_card_token_123' : selectedMethod === 'wallet' ? 'mock_wallet_token_456' : undefined,
        voucher_code: voucherCode || undefined,
      };

      console.log('[CheckoutDialog] Creating order:', orderData);
      const result = await OrderService.createOrder(orderData);

      console.log('[CheckoutDialog] Order created:', result);
      
      // Clear cart after successful order
      await clearCart();

      Alert.alert('Thành công', `Đặt hàng thành công! Mã đơn hàng: ${result.order_id}`, [
        { 
          text: 'OK', 
          onPress: () => {
            onSuccess();
            onClose();
          }
        }
      ]);
    } catch (error: any) {
      console.error('[CheckoutDialog] Failed to create order:', error);
      Alert.alert('Lỗi', error.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        <View style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>Thanh toán</Text>
            <TouchableOpacity
              onPress={onClose}
              style={{ padding: 8 }}
            >
              <Text style={{ fontSize: 18, color: '#6b7280' }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Shipping Address Section */}
          <View style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 12 }}>
              Thông tin giao hàng
            </Text>
            <TextInput
              value={recipientName}
              onChangeText={setRecipientName}
              placeholder="Tên người nhận"
              style={{
                paddingHorizontal: 12,
                paddingVertical: 10,
                backgroundColor: '#f9fafb',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#d1d5db',
                marginBottom: 12,
              }}
            />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
              style={{
                paddingHorizontal: 12,
                paddingVertical: 10,
                backgroundColor: '#f9fafb',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#d1d5db',
                marginBottom: 12,
              }}
            />
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Địa chỉ giao hàng"
              multiline
              numberOfLines={3}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 10,
                backgroundColor: '#f9fafb',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#d1d5db',
                textAlignVertical: 'top',
              }}
            />
          </View>

          <View style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
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
            disabled={isCreatingOrder}
            style={{
              width: '100%',
              paddingHorizontal: 16,
              paddingVertical: 16,
              backgroundColor: isCreatingOrder ? '#9ca3af' : '#10b981',
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 32,
            }}
          >
            {isCreatingOrder ? (
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
      </ScrollView>
    </Modal>
  );
};

export default CheckoutDialog;