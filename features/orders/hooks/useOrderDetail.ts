import { useCallback } from 'react';
import { Alert } from 'react-native';
import { Order } from '../../../types';
import { useAppContext } from '../../../context/AppContext';

export const useOrderDetail = (order: Order) => {
  const { addToCart } = useAppContext();

  const handleBuyAgain = useCallback(() => {
    order.items.forEach(item => {
      addToCart(item.product, item.quantity);
    });
    Alert.alert('Thành công', 'Các sản phẩm đã được thêm vào giỏ hàng!');
  }, [order.items, addToCart]);

  return {
    handleBuyAgain,
  };
};;