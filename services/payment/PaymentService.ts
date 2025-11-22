/**
 * Payment Service - Buyer App
 * Handles payment operations with backend API
 */

import { httpClient } from '../auth/config';

const PAYMENT_BASE_URL = process.env.EXPO_PUBLIC_PAYMENT_URL || 'http://192.168.1.4:8205';
const API_PREFIX = '/api/v1/online-shopping/public';

export type PaymentMethod = 'MOMO' | 'VNPAY' | 'STRIPE' | 'COD' | 'BANK_TRANSFER';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface Payment {
  id: string;
  user_id: string;
  order_id: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  transaction_id?: string;
  payment_url?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface CreatePaymentRequest {
  order_id: string;
  amount: number;
  payment_method: PaymentMethod;
  return_url?: string;
}

export interface CreatePaymentResponse {
  payment: Payment;
  payment_url?: string;
  qr_code?: string;
  message: string;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  type: 'TOP_UP' | 'PAYMENT' | 'REFUND' | 'WITHDRAWAL';
  amount: number;
  balance_after: number;
  description: string;
  order_id?: string;
  payment_id?: string;
  created_at: string;
}

export interface PaginatedTransactionsResponse {
  data: WalletTransaction[];
  total: number;
  page: number;
  page_limit: number;
  total_pages: number;
}

export interface WalletBalance {
  user_id: string;
  balance: number;
  updated_at: string;
}

export interface TopUpRequest {
  amount: number;
  payment_method: PaymentMethod;
}

class PaymentService {
  private static instance: PaymentService;

  private constructor() {}

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  /**
   * Create payment for order
   */
  async createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    try {
      console.log('[PaymentService] Creating payment:', request);
      const response = await httpClient.post(
        `${PAYMENT_BASE_URL}${API_PREFIX}/payments`,
        request
      );
      console.log('[PaymentService] Payment created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[PaymentService] Failed to create payment:', error);
      throw new Error(error.response?.data?.detail || 'Failed to create payment');
    }
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId: string): Promise<Payment> {
    try {
      console.log('[PaymentService] Getting payment by ID:', paymentId);
      const response = await httpClient.get(
        `${PAYMENT_BASE_URL}${API_PREFIX}/payments/${paymentId}`
      );
      console.log('[PaymentService] Payment found:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[PaymentService] Failed to get payment by ID:', error);
      if (error.response?.status === 404) {
        throw new Error('Payment not found');
      }
      throw new Error(error.response?.data?.detail || 'Failed to get payment');
    }
  }

  /**
   * Get payment by order ID
   */
  async getPaymentByOrderId(orderId: string): Promise<Payment> {
    try {
      console.log('[PaymentService] Getting payment by order ID:', orderId);
      const response = await httpClient.get(
        `${PAYMENT_BASE_URL}${API_PREFIX}/payments/order/${orderId}`
      );
      console.log('[PaymentService] Payment found:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[PaymentService] Failed to get payment by order ID:', error);
      throw new Error(error.response?.data?.detail || 'Failed to get payment');
    }
  }

  /**
   * Get wallet balance
   */
  async getWalletBalance(): Promise<WalletBalance> {
    try {
      console.log('[PaymentService] Getting wallet balance');
      const response = await httpClient.get(
        `${PAYMENT_BASE_URL}${API_PREFIX}/wallet/balance`
      );
      console.log('[PaymentService] Wallet balance:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[PaymentService] Failed to get wallet balance:', error);
      throw new Error(error.response?.data?.detail || 'Failed to get wallet balance');
    }
  }

  /**
   * Get wallet transactions history
   */
  async getWalletTransactions(params: {
    page?: number;
    page_limit?: number;
    type?: WalletTransaction['type'];
  } = {}): Promise<PaginatedTransactionsResponse> {
    try {
      const { page = 1, page_limit = 20, type } = params;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        page_limit: page_limit.toString(),
      });

      if (type) {
        queryParams.append('type', type);
      }

      console.log('[PaymentService] Getting wallet transactions');
      const response = await httpClient.get(
        `${PAYMENT_BASE_URL}${API_PREFIX}/wallet/transactions?${queryParams.toString()}`
      );
      console.log('[PaymentService] Transactions fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[PaymentService] Failed to get transactions:', error);
      throw new Error(error.response?.data?.detail || 'Failed to get transactions');
    }
  }

  /**
   * Top up wallet
   */
  async topUpWallet(request: TopUpRequest): Promise<CreatePaymentResponse> {
    try {
      console.log('[PaymentService] Topping up wallet:', request);
      const response = await httpClient.post(
        `${PAYMENT_BASE_URL}${API_PREFIX}/wallet/top-up`,
        request
      );
      console.log('[PaymentService] Top-up successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[PaymentService] Failed to top up wallet:', error);
      throw new Error(error.response?.data?.detail || 'Failed to top up wallet');
    }
  }

  /**
   * Verify payment status (for webhook/callback)
   */
  async verifyPayment(paymentId: string): Promise<Payment> {
    try {
      console.log('[PaymentService] Verifying payment:', paymentId);
      const response = await httpClient.post(
        `${PAYMENT_BASE_URL}${API_PREFIX}/payments/${paymentId}/verify`
      );
      console.log('[PaymentService] Payment verified:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[PaymentService] Failed to verify payment:', error);
      throw new Error(error.response?.data?.detail || 'Failed to verify payment');
    }
  }

  /**
   * Request refund
   */
  async requestRefund(paymentId: string, reason?: string): Promise<{
    success: boolean;
    message: string;
    refund_amount?: number;
  }> {
    try {
      console.log('[PaymentService] Requesting refund:', paymentId, reason);
      const response = await httpClient.post(
        `${PAYMENT_BASE_URL}${API_PREFIX}/payments/${paymentId}/refund`,
        { reason }
      );
      console.log('[PaymentService] Refund requested:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[PaymentService] Failed to request refund:', error);
      throw new Error(error.response?.data?.detail || 'Failed to request refund');
    }
  }
}

export default PaymentService.getInstance();
