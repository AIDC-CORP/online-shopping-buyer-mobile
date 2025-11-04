import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppContext } from '../../../context/AppContext';

interface WalletCardProps {
  onTopUpPress: () => void;
  onHistoryPress: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({ onTopUpPress, onHistoryPress }) => {
  const { walletBalance } = useAppContext();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <View style={{ paddingHorizontal: 24, paddingVertical: 24, backgroundColor: '#ffffff', borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, marginBottom: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937' }}>Ví điện tử</Text>
        <TouchableOpacity
          onPress={onHistoryPress}
          style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#f3f4f6', borderRadius: 9999 }}
        >
          <Text style={{ color: '#6b7280', fontSize: 12, fontWeight: '500' }}>Lịch sử</Text>
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>Số dư hiện tại</Text>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#059669' }}>{formatCurrency(walletBalance)}</Text>
      </View>

      <TouchableOpacity
        onPress={onTopUpPress}
        style={{ width: '100%', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#10b981', borderRadius: 8, alignItems: 'center' }}
      >
        <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: '600', fontSize: 16 }}>Nạp tiền</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WalletCard;