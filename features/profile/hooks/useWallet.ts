import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import PaymentService, { WalletTransaction, PaymentMethod } from '../../../services/payment/PaymentService';
import { useAppContext } from '../../../context/AppContext';

export const useWallet = () => {
  const { walletBalance, setWalletBalance } = useAppContext();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTopUp, setIsTopUp] = useState(false);

  // Fetch wallet balance
  const fetchBalance = useCallback(async () => {
    try {
      const response = await PaymentService.getWalletBalance();
      setWalletBalance(response.balance);
    } catch (error: any) {
      console.error('Failed to fetch wallet balance:', error);
      // Don't alert on fetch error, just log it
    }
  }, [setWalletBalance]);

  // Fetch transaction history
  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await PaymentService.getWalletTransactions({
        page: 1,
        page_limit: 50,
      });
      setTransactions(response.data);
    } catch (error: any) {
      console.error('Failed to fetch transactions:', error);
      Alert.alert('Lỗi', error.message || 'Không thể tải lịch sử giao dịch');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, [fetchBalance, fetchTransactions]);

  // Top up wallet
  const topUpWallet = useCallback(async (amount: number, paymentMethod: PaymentMethod) => {
    if (amount <= 0) {
      Alert.alert('Lỗi', 'Số tiền nạp phải lớn hơn 0');
      return { success: false };
    }

    try {
      setIsTopUp(true);
      const response = await PaymentService.topUpWallet({
        amount,
        payment_method: paymentMethod,
      });

      // If payment URL is returned, user needs to complete payment
      if (response.payment_url) {
        Alert.alert(
          'Thanh toán',
          'Bạn sẽ được chuyển đến trang thanh toán',
          [{ text: 'OK' }]
        );
        // TODO: Open payment URL in browser/webview
      } else {
        Alert.alert('Thành công', 'Nạp tiền thành công');
        await fetchBalance();
        await fetchTransactions();
      }

      return { success: true, paymentUrl: response.payment_url };
    } catch (error: any) {
      console.error('Failed to top up wallet:', error);
      Alert.alert('Lỗi', error.message || 'Không thể nạp tiền');
      return { success: false };
    } finally {
      setIsTopUp(false);
    }
  }, [fetchBalance, fetchTransactions]);

  // Format transaction for display
  const formatTransaction = (transaction: WalletTransaction) => {
    return {
      id: transaction.id,
      type: transaction.type.toLowerCase().replace('_', ' ') as 'top_up' | 'payment' | 'refund',
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.created_at,
      orderId: transaction.order_id,
    };
  };

  return {
    walletBalance,
    transactions: transactions.map(formatTransaction),
    isLoading,
    isTopUp,
    topUpWallet,
    refreshBalance: fetchBalance,
    refreshTransactions: fetchTransactions,
  };
};
