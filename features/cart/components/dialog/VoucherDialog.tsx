import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, ActivityIndicator, TextInput, ScrollView, FlatList } from 'react-native';
import VoucherService, { Voucher } from '../../../../services/voucher/VoucherService';

interface VoucherDialogProps {
  visible: boolean;
  onClose: () => void;
  onSelectVoucher: (code: string) => void;
  currentVoucherCode?: string;
  orderAmount: number;
}

const VoucherDialog: React.FC<VoucherDialogProps> = ({ 
  visible, 
  onClose, 
  onSelectVoucher, 
  currentVoucherCode,
  orderAmount 
}) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [selectedCode, setSelectedCode] = useState(currentVoucherCode || '');

  useEffect(() => {
    if (visible) {
      fetchVouchers();
      setSelectedCode(currentVoucherCode || '');
    }
  }, [visible, currentVoucherCode]);

  const fetchVouchers = async () => {
    try {
      setIsLoading(true);
      const response = await VoucherService.getAvailableVouchers({ page: 1, page_limit: 50 });
      setVouchers(response.items || []); // Use items instead of data
    } catch (error: any) {
      console.error('Failed to fetch vouchers:', error);
      // Fallback to empty list instead of showing error
      // User can still enter voucher code manually
      setVouchers([]);
      
      // Only show alert if it's not a permission error
      if (error.message && !error.message.includes('403') && !error.message.includes('authenticated')) {
        Alert.alert('Lỗi', 'Không thể tải danh sách voucher');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const getVoucherDiscount = (voucher: Voucher) => {
    if (voucher.type === 'PERCENTAGE') {
      return `Giảm ${voucher.discount_value}%`;
    } else if (voucher.type === 'FIXED_AMOUNT') {
      return `Giảm ${formatCurrency(voucher.discount_value)}`;
    } else if (voucher.type === 'FREE_SHIPPING') {
      return 'Miễn phí vận chuyển';
    }
    return '';
  };

  const canUseVoucher = (voucher: Voucher) => {
    // Check if order amount meets minimum requirement
    if (voucher.min_order_amount && orderAmount < voucher.min_order_amount) {
      return false;
    }
    // Check if voucher has usage limit
    if (voucher.usage_limit && voucher.used_count >= voucher.usage_limit) {
      return false;
    }
    // Check if voucher is expired
    const now = new Date();
    const endDate = new Date(voucher.end_date);
    if (now > endDate) {
      return false;
    }
    return true;
  };

  const handleSelectVoucher = (code: string) => {
    setSelectedCode(code);
  };

  const handleApplyVoucher = () => {
    const codeToApply = selectedCode || manualCode;
    if (!codeToApply || codeToApply.trim() === '') {
      Alert.alert('Lỗi', 'Vui lòng chọn hoặc nhập mã voucher');
      return;
    }
    onSelectVoucher(codeToApply.trim());
    onClose();
  };

  const renderVoucherItem = ({ item }: { item: Voucher }) => {
    const isSelected = selectedCode === item.code;
    const canUse = canUseVoucher(item);

    return (
      <TouchableOpacity
        onPress={() => canUse && handleSelectVoucher(item.code)}
        disabled={!canUse}
        style={{
          flexDirection: 'row',
          padding: 12,
          marginBottom: 12,
          backgroundColor: isSelected ? '#dbeafe' : '#ffffff',
          borderRadius: 8,
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected ? '#3b82f6' : '#e5e7eb',
          opacity: canUse ? 1 : 0.5,
        }}
      >
        {/* Voucher Icon */}
        <View style={{
          width: 60,
          height: 60,
          backgroundColor: '#10b981',
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        }}>
          <Text style={{ fontSize: 24 }}>🎫</Text>
        </View>

        {/* Voucher Info */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4 }}>
            {item.name}
          </Text>
          <Text style={{ fontSize: 14, color: '#10b981', fontWeight: '600', marginBottom: 4 }}>
            {getVoucherDiscount(item)}
          </Text>
          {item.min_order_amount && (
            <Text style={{ fontSize: 12, color: '#6b7280' }}>
              Đơn tối thiểu: {formatCurrency(item.min_order_amount)}
            </Text>
          )}
          {item.max_discount_amount && item.type === 'PERCENTAGE' && (
            <Text style={{ fontSize: 12, color: '#6b7280' }}>
              Giảm tối đa: {formatCurrency(item.max_discount_amount)}
            </Text>
          )}
          <Text style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
            HSD: {formatDate(item.end_date)}
          </Text>
          
          {!canUse && (
            <Text style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>
              {item.min_order_amount && orderAmount < item.min_order_amount
                ? `Đơn hàng chưa đủ ${formatCurrency(item.min_order_amount)}`
                : item.usage_limit && item.used_count >= item.usage_limit
                ? 'Đã hết lượt sử dụng'
                : 'Đã hết hạn'}
            </Text>
          )}
        </View>

        {/* Selection Indicator */}
        {isSelected && (
          <View style={{ justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, color: '#3b82f6' }}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
        }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937' }}>
            Chọn Voucher
          </Text>
          <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
            <Text style={{ fontSize: 18, color: '#6b7280' }}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Manual Input Section */}
        <View style={{ padding: 16, backgroundColor: '#ffffff', marginBottom: 8 }}>
          <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>
            Nhập mã Voucher
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput
              value={manualCode}
              onChangeText={(text) => {
                setManualCode(text);
                setSelectedCode(''); // Clear selected voucher when typing
              }}
              placeholder="Nhập mã voucher..."
              style={{
                flex: 1,
                paddingHorizontal: 12,
                paddingVertical: 10,
                backgroundColor: '#f9fafb',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#d1d5db',
              }}
            />
          </View>
        </View>

        {/* Vouchers List */}
        <View style={{ flex: 1, padding: 16, paddingTop: 0 }}>
          <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 12 }}>
            Mã Voucher có sẵn
          </Text>
          
          {isLoading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#10b981" />
              <Text style={{ marginTop: 12, color: '#6b7280' }}>Đang tải voucher...</Text>
            </View>
          ) : vouchers.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>🎫</Text>
              <Text style={{ fontSize: 16, color: '#6b7280', textAlign: 'center' }}>
                Hiện chưa có voucher nào
              </Text>
              <Text style={{ fontSize: 14, color: '#9ca3af', marginTop: 4, textAlign: 'center' }}>
                Bạn có thể nhập mã voucher ở trên
              </Text>
            </View>
          ) : (
            <FlatList
              data={vouchers}
              renderItem={renderVoucherItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Apply Button */}
        <View style={{
          padding: 16,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
        }}>
          <TouchableOpacity
            onPress={handleApplyVoucher}
            style={{
              paddingVertical: 14,
              backgroundColor: '#10b981',
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 16 }}>
              Áp dụng
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default VoucherDialog;
