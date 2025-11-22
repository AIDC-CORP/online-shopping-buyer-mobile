import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { Order } from '../../../types';
import { useAppContext } from '../../../context/AppContext';
import OrderService from '../../../services/order/OrderService';

export const useOrderDetail = (order: Order) => {
  const { addToCart } = useAppContext();
  const [orderDetail, setOrderDetail] = useState<Order>(order);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch full order details from API
  useEffect(() => {
    const fetchOrderDetail = async () => {
      // If order already has items, no need to fetch
      if (order.items && order.items.length > 0) {
        return;
      }

      try {
        setIsLoading(true);
        const response = await OrderService.getOrderById(order.id);
        
        // Transform response to Order format
        const detailedOrder: Order = {
          id: response.order_id,
          date: new Date(response.created_at).toISOString().split('T')[0],
          status: response.status === 'PAID' || response.status === 'DELIVERED' 
            ? 'completed' 
            : response.status === 'CANCELLED' 
            ? 'cancelled' 
            : 'delivering',
          items: response.items_snapshot?.map((item: any) => ({
            product: {
              id: item.product_id || '',
              name: item.name_at_purchase || 'Unknown Product',
              imageUrl: item.image_url || '',
              price: item.price_at_purchase || 0,
              store: '',
              category: '',
            },
            quantity: item.quantity || 1,
          })) || [],
          total: response.total_price || 0,
        };
        
        setOrderDetail(detailedOrder);
      } catch (error) {
        console.error('Failed to fetch order detail:', error);
        Alert.alert('Lỗi', 'Không thể tải chi tiết đơn hàng');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetail();
  }, [order.id]);

  const handleBuyAgain = useCallback(() => {
    orderDetail.items.forEach(item => {
      addToCart(item.product, item.quantity);
    });
    Alert.alert('Thành công', 'Các sản phẩm đã được thêm vào giỏ hàng!');
  }, [orderDetail.items, addToCart]);

  return {
    orderDetail,
    isLoading,
    handleBuyAgain,
  };
};