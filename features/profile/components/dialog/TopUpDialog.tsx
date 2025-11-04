import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { useAppContext } from '../../../context/AppContext';

interface TopUpDialogProps {
  visible: boolean;
  onClose: () => void;
}

const TopUpDialog: React.FC<TopUpDialogProps> = ({ visible, onClose }) => {
  const { addToWallet } = useAppContext();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'momo' | 'card' | 'bank'>('momo');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    { id: 'momo', name: 'Ví MoMo', icon: '📱' },
    { id: 'card', name: 'Thẻ tín dụng', icon: '💳' },
    { id: 'bank', name: 'Chuyển khoản', icon: '🏦' },
  ] as const;

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000];

  const handleTopUp = async () => {
    const numAmount = parseInt(amount.replace(/[^\d]/g, ''));
    if (!numAmount || numAmount < 10000) {
      Alert.alert('Lỗi', 'Vui lòng nhập số tiền hợp lệ (tối thiểu 10,000 VND)');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const methodName = paymentMethods.find(m => m.id === selectedMethod)?.name || 'Unknown';
      addToWallet(numAmount, `Nạp tiền qua ${methodName}`);

      // Close modal first, then show success message
      setAmount('');
      onClose();

      // Show success message after modal closes
      setTimeout(() => {
        Alert.alert('Thành công', `Đã nạp ${numAmount.toLocaleString('vi-VN')} VND vào ví`);
      }, 300);
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi nạp tiền. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrencyInput = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    return numericValue ? parseInt(numericValue).toLocaleString('vi-VN') : '';
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
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>Nạp tiền vào ví</Text>
          <TouchableOpacity
            onPress={onClose}
            style={{ padding: 8 }}
          >
            <Text style={{ fontSize: 18, color: '#6b7280' }}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 12 }}>Chọn phương thức thanh toán</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelectedMethod(method.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                marginBottom: 8,
                backgroundColor: selectedMethod === method.id ? '#dbeafe' : '#ffffff',
                borderRadius: 8,
                borderWidth: selectedMethod === method.id ? 2 : 1,
                borderColor: selectedMethod === method.id ? '#3b82f6' : '#e5e7eb',
              }}
            >
              <Text style={{ fontSize: 20, marginRight: 12 }}>{method.icon}</Text>
              <Text style={{ fontSize: 16, color: '#1f2937' }}>{method.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 12 }}>Số tiền nạp</Text>

          <TextInput
            value={amount}
            onChangeText={(value) => setAmount(formatCurrencyInput(value))}
            placeholder="Nhập số tiền (VNĐ)"
            keyboardType="numeric"
            style={{
              padding: 16,
              backgroundColor: '#ffffff',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#d1d5db',
              fontSize: 16,
              marginBottom: 16,
            }}
          />

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                onPress={() => setAmount(quickAmount.toLocaleString('vi-VN'))}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor: '#f3f4f6',
                  borderRadius: 9999,
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                }}
              >
                <Text style={{ color: '#374151', fontSize: 14, fontWeight: '500' }}>
                  {quickAmount.toLocaleString('vi-VN')}đ
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleTopUp}
          disabled={isProcessing || !amount}
          style={{
            width: '100%',
            paddingHorizontal: 16,
            paddingVertical: 16,
            backgroundColor: isProcessing || !amount ? '#9ca3af' : '#10b981',
            borderRadius: 8,
            alignItems: 'center',
            marginTop: 'auto',
          }}
        >
          <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: '600', fontSize: 16 }}>
            {isProcessing ? 'Đang xử lý...' : 'Xác nhận nạp tiền'}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default TopUpDialog;