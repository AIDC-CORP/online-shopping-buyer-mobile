import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAppContext } from '../../../context/AppContext';
import { WalletTransaction } from '../../../types';

interface TransactionHistoryProps {
  onClose: () => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ onClose }) => {
  const { walletTransactions } = useAppContext();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: WalletTransaction['type']) => {
    switch (type) {
      case 'top_up':
        return '💰';
      case 'payment':
        return '🛒';
      case 'refund':
        return '↩️';
      default:
        return '💳';
    }
  };

  const getTransactionColor = (type: WalletTransaction['type']) => {
    switch (type) {
      case 'top_up':
        return '#059669';
      case 'payment':
        return '#dc2626';
      case 'refund':
        return '#0891b2';
      default:
        return '#6b7280';
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937' }}>Lịch sử giao dịch</Text>
        <TouchableOpacity
          onPress={onClose}
          style={{ padding: 8 }}
        >
          <Text style={{ fontSize: 18, color: '#6b7280' }}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {walletTransactions.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 48 }}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>📊</Text>
            <Text style={{ fontSize: 18, color: '#6b7280', textAlign: 'center' }}>
              Chưa có giao dịch nào
            </Text>
            <Text style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center', marginTop: 8 }}>
              Các giao dịch nạp tiền và thanh toán sẽ hiển thị ở đây
            </Text>
          </View>
        ) : (
          walletTransactions.map((transaction) => (
            <View
              key={transaction.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                backgroundColor: '#ffffff',
                borderRadius: 8,
                marginBottom: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#f3f4f6',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Text style={{ fontSize: 18 }}>{getTransactionIcon(transaction.type)}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1f2937', marginBottom: 2 }}>
                  {transaction.description}
                </Text>
                <Text style={{ fontSize: 12, color: '#6b7280' }}>
                  {formatDate(transaction.date)}
                </Text>
                {transaction.orderId && (
                  <Text style={{ fontSize: 12, color: '#0891b2' }}>
                    Đơn hàng: {transaction.orderId}
                  </Text>
                )}
              </View>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: getTransactionColor(transaction.type),
                }}
              >
                {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default TransactionHistory;