/**
 * Voucher Service - Buyer App
 * Handles voucher/promotion operations with backend API
 */

import { httpClient } from '../auth/config';

const VOUCHER_BASE_URL = process.env.EXPO_PUBLIC_VOUCHER_URL || 'http://192.168.1.4:8201';
const API_PREFIX = '/api/v1/online-shopping/public/public'; // Note: /public appears twice because root_path + router prefix

export type VoucherType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
export type VoucherStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED';

export interface Voucher {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: VoucherType;
  discount_value: number; // Percentage (0-100) or Fixed amount
  max_discount_amount?: number; // Max discount for percentage type
  min_order_amount?: number; // Minimum order to use voucher
  usage_limit?: number; // Total usage limit
  used_count: number;
  start_date: string;
  end_date: string;
  status: VoucherStatus;
  applicable_products?: string[]; // Product IDs
  applicable_categories?: string[]; // Category names
  created_at: string;
  updated_at: string;
}

export interface PaginatedVouchersResponse {
  items: Voucher[]; // Backend returns 'items' not 'data'
  total: number;
  page: number;
  page_limit: number;
  total_pages: number;
}

export interface ValidateVoucherRequest {
  code: string;
  order_amount: number;
  product_ids?: string[];
}

export interface ValidateVoucherResponse {
  valid: boolean;
  voucher?: Voucher;
  discount_amount?: number;
  final_amount?: number;
  message?: string;
}

export interface ApplyVoucherRequest {
  code: string;
  order_id: string;
}

class VoucherService {
  private static instance: VoucherService;

  private constructor() {}

  static getInstance(): VoucherService {
    if (!VoucherService.instance) {
      VoucherService.instance = new VoucherService();
    }
    return VoucherService.instance;
  }

  /**
   * Get all available vouchers for buyer
   */
  async getAvailableVouchers(params: {
    page?: number;
    page_limit?: number;
  } = {}): Promise<PaginatedVouchersResponse> {
    try {
      const { page = 1, page_limit = 20 } = params;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        page_limit: page_limit.toString(),
        status: 'ACTIVE', // Only get active vouchers
      });

      console.log('[VoucherService] Getting available vouchers');
      const response = await httpClient.get(
        `${VOUCHER_BASE_URL}${API_PREFIX}/vouchers/?${queryParams.toString()}`
      );
      console.log('[VoucherService] Vouchers fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[VoucherService] Failed to get vouchers:', error);
      
      // Handle authentication/permission errors gracefully
      if (error.response?.status === 403 || error.response?.status === 401) {
        throw new Error('Not authenticated');
      }
      
      throw new Error(error.response?.data?.detail || 'Failed to get vouchers');
    }
  }

  /**
   * Get voucher by code
   */
  async getVoucherByCode(code: string): Promise<Voucher> {
    try {
      console.log('[VoucherService] Getting voucher by code:', code);
      const response = await httpClient.get(
        `${VOUCHER_BASE_URL}${API_PREFIX}/vouchers/code/${code}`
      );
      console.log('[VoucherService] Voucher found:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[VoucherService] Failed to get voucher by code:', error);
      if (error.response?.status === 404) {
        throw new Error('Voucher not found');
      }
      throw new Error(error.response?.data?.detail || 'Failed to get voucher');
    }
  }

  /**
   * Validate voucher before applying
   */
  async validateVoucher(request: ValidateVoucherRequest): Promise<ValidateVoucherResponse> {
    try {
      console.log('[VoucherService] Validating voucher:', request);
      const response = await httpClient.post(
        `${VOUCHER_BASE_URL}${API_PREFIX}/vouchers/validate`,
        request
      );
      console.log('[VoucherService] Voucher validation result:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[VoucherService] Failed to validate voucher:', error);
      throw new Error(error.response?.data?.detail || 'Failed to validate voucher');
    }
  }

  /**
   * Apply voucher to order
   */
  async applyVoucher(request: ApplyVoucherRequest): Promise<{
    success: boolean;
    message: string;
    discount_amount?: number;
  }> {
    try {
      console.log('[VoucherService] Applying voucher:', request);
      const response = await httpClient.post(
        `${VOUCHER_BASE_URL}${API_PREFIX}/vouchers/apply`,
        request
      );
      console.log('[VoucherService] Voucher applied:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[VoucherService] Failed to apply voucher:', error);
      throw new Error(error.response?.data?.detail || 'Failed to apply voucher');
    }
  }

  /**
   * Get my vouchers (vouchers I've claimed/used)
   */
  async getMyVouchers(): Promise<Voucher[]> {
    try {
      console.log('[VoucherService] Getting my vouchers');
      const response = await httpClient.get(
        `${VOUCHER_BASE_URL}${API_PREFIX}/vouchers/my-vouchers`
      );
      console.log('[VoucherService] My vouchers fetched:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[VoucherService] Failed to get my vouchers:', error);
      throw new Error(error.response?.data?.detail || 'Failed to get my vouchers');
    }
  }

  /**
   * Claim voucher (add to my collection)
   */
  async claimVoucher(voucherCode: string): Promise<{
    success: boolean;
    message: string;
    voucher?: Voucher;
  }> {
    try {
      console.log('[VoucherService] Claiming voucher:', voucherCode);
      const response = await httpClient.post(
        `${VOUCHER_BASE_URL}${API_PREFIX}/vouchers/claim`,
        { code: voucherCode }
      );
      console.log('[VoucherService] Voucher claimed:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[VoucherService] Failed to claim voucher:', error);
      throw new Error(error.response?.data?.detail || 'Failed to claim voucher');
    }
  }
}

export default VoucherService.getInstance();
