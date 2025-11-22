import { useState, useEffect } from 'react';
import { Order } from '../../../types';
import OrderService from '../../../services/order/OrderService';

export const useOrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const response = await OrderService.getOrders({
          page: 1,
          page_limit: 50,
        });
        
        // Transform backend order format to frontend format
        const transformedOrders: Order[] = response.data.map((order: any) => {
          // Map backend status to frontend status
          let frontendStatus: 'completed' | 'delivering' | 'cancelled' = 'delivering';
          if (order.status === 'PAID' || order.status === 'DELIVERED') {
            frontendStatus = 'completed';
          } else if (order.status === 'CANCELLED') {
            frontendStatus = 'cancelled';
          }
          
          return {
            id: order.order_id,
            date: new Date(order.created_at).toISOString().split('T')[0],
            status: frontendStatus,
            items: order.items_snapshot?.map((item: any) => ({
              product: {
                id: item.product_id || '',
                name: item.product_name || 'Unknown Product',
                imageUrl: item.image_url || '',
                price: item.price || 0,
                store: '',
                category: '',
              },
              quantity: item.quantity || 1,
            })) || [],
            total: order.total_price || 0,
          };
        });
        
        setOrders(transformedOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, []);

  return {
    orders,
    isLoading,
  };
};