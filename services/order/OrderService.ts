/**
 * Order Service - Buyer App
 * Handles order operations with backend API
 */

import { httpClient } from '../auth/config';

const ORDER_BASE_URL = process.env.EXPO_PUBLIC_ORDER_URL || 'http://192.168.1.4:8203';
const API_PREFIX = '/api/v1/online-shopping/public';

export type OrderStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  sub_total: number;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  shipping_fee: number;
  discount_amount: number;
  final_amount: number;
  status: OrderStatus;
  shipping_address: string;
  payment_method: string;
  payment_status: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedOrdersResponse {
  data: Order[];
  total: number;
  page: number;
  page_limit: number;
  total_pages: number;
}

export interface CreateOrderRequest {
  shipping_address: string;
  payment_method: string;
  voucher_code?: string;
  note?: string;
}

export interface CreateOrderResponse {
  order: Order;
  payment_url?: string;
  message: string;
}

class OrderService {
  private static instance: OrderService;

  private constructor() {}

  static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  /**
   * Get all orders for current user with pagination
   */
  async getOrders(params: {
    page?: number;
    page_limit?: number;
    status?: OrderStatus;
  } = {}): Promise<PaginatedOrdersResponse> {
    try {
      const { page = 1, page_limit = 10, status } = params;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        page_limit: page_limit.toString(),
      });

      if (status) {
        queryParams.append('status', status);
      }

      console.log('[OrderService] Getting orders with params:', queryParams.toString());
      const response = await httpClient.get(
        `${ORDER_BASE_URL}${API_PREFIX}/orders/list-orders?${queryParams.toString()}`
      );
      console.log('[OrderService] Orders fetched:', response.data);
      
      // Transform backend response
      const backendData = response.data;
      return {
        data: backendData.data || [],
        total: backendData.pagination?.total_items || 0,
        page: backendData.pagination?.current_page || page,
        page_limit: backendData.pagination?.limit || page_limit,
        total_pages: backendData.pagination?.total_pages || 1,
      };
    } catch (error: any) {
      console.error('[OrderService] Failed to get orders:', error);
      throw new Error(error.response?.data?.detail || 'Failed to get orders');
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string): Promise<Order> {
    try {
      console.log('[OrderService] Getting order by ID:', orderId);
      const response = await httpClient.get(
        `${ORDER_BASE_URL}${API_PREFIX}/orders/order-details/${orderId}`
      );
      console.log('[OrderService] Order found:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[OrderService] Failed to get order by ID:', error);
      if (error.response?.status === 404) {
        throw new Error('Order not found');
      }
      throw new Error(error.response?.data?.detail || 'Failed to get order');
    }
  }

  /**
   * Create new order (checkout)
   */
  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      console.log('[OrderService] Creating order:', request);
      const response = await httpClient.post(
        `${ORDER_BASE_URL}${API_PREFIX}/orders/create-order`,
        request
      );
      console.log('[OrderService] Order created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[OrderService] Failed to create order:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to create order';
      throw new Error(errorMessage);
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    try {
      console.log('[OrderService] Cancelling order:', orderId, reason);
      const response = await httpClient.patch(
        `${ORDER_BASE_URL}${API_PREFIX}/orders/${orderId}/cancel`,
        { reason }
      );
      console.log('[OrderService] Order cancelled:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[OrderService] Failed to cancel order:', error);
      throw new Error(error.response?.data?.detail || 'Failed to cancel order');
    }
  }

  /**
   * Re-order (create new order from existing order)
   */
  async reorder(orderId: string): Promise<CreateOrderResponse> {
    try {
      console.log('[OrderService] Re-ordering:', orderId);
      const response = await httpClient.post(
        `${ORDER_BASE_URL}${API_PREFIX}/orders/${orderId}/reorder`
      );
      console.log('[OrderService] Re-order created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[OrderService] Failed to re-order:', error);
      throw new Error(error.response?.data?.detail || 'Failed to re-order');
    }
  }

  /**
   * Track order status
   */
  async trackOrder(orderId: string): Promise<{
    order: Order;
    tracking_history: Array<{
      status: OrderStatus;
      timestamp: string;
      note?: string;
    }>;
  }> {
    try {
      console.log('[OrderService] Tracking order:', orderId);
      const response = await httpClient.get(
        `${ORDER_BASE_URL}${API_PREFIX}/orders/${orderId}/tracking`
      );
      console.log('[OrderService] Order tracking info:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[OrderService] Failed to track order:', error);
      throw new Error(error.response?.data?.detail || 'Failed to track order');
    }
  }
}

export default OrderService.getInstance();
