/**
 * Cart Service - Buyer App
 * Handles cart operations with backend API
 */

import { httpClient } from '../auth/config';

const CART_BASE_URL = process.env.EXPO_PUBLIC_CART_URL || 'http://192.168.1.4:8117';
const API_PREFIX = '/api/v1/online-shopping/public';

export interface CartItem {
  id: string; // product_id
  name: string;
  imageUrl: string;
  price: number;
  store_id: string;
  storeName: string;
  category: string;
  quantity: number;
  sub_price: number; // price * quantity
}

export interface CartResponse {
  items: { [key: string]: CartItem }; // { "item1": {...}, "item2": {...} }
  totalPrice: number;
  shippingFee: number;
  totalPayment: number;
}

export interface AddToCartRequest {
  product_id: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface DeleteCartItemsRequest {
  product_ids: string[];
}

export interface DeleteCartItemsResponse {
  deleted_count: number;
  deleted_ids: string[];
  not_found_ids: string[];
}

class CartService {
  private static instance: CartService;

  private constructor() {}

  static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }

  /**
   * Get cart with all items
   */
  async getCart(): Promise<CartResponse> {
    try {
      console.log('[CartService] Getting cart');
      const response = await httpClient.get(
        `${CART_BASE_URL}${API_PREFIX}/cart/`
      );
      console.log('[CartService] Cart fetched:', response.data);
      
      // Transform backend response format
      const backendData = response.data;
      const items: { [key: string]: CartItem } = {};
      
      // Backend returns { stores: { store_id: { store_id, store_name, items: [...] } } }
      // Transform to { items: { product_id: CartItem } }
      if (backendData.stores) {
        Object.entries(backendData.stores).forEach(([storeId, store]: [string, any]) => {
          if (store.items && Array.isArray(store.items)) {
            store.items.forEach((item: any) => {
              items[item.id] = {
                id: item.id,
                name: item.name || 'Unknown Product',
                imageUrl: item.imageUrl || '',
                price: item.price || 0,
                store_id: store.store_id || storeId,
                storeName: store.store_name || 'Unknown Store',
                category: item.category || '',
                quantity: item.quantity || 1,
                sub_price: item.sub_price || (item.price * item.quantity),
              };
            });
          }
        });
      }
      
      return {
        items,
        totalPrice: backendData.totalPrice || 0,
        shippingFee: backendData.shippingFee || 0,
        totalPayment: backendData.totalPayment || 0,
      };
    } catch (error: any) {
      console.error('[CartService] Failed to get cart:', error);
      throw new Error(error.response?.data?.detail || 'Failed to get cart');
    }
  }

  /**
   * Add item to cart
   */
  async addToCart(request: AddToCartRequest): Promise<CartItem> {
    try {
      console.log('[CartService] Adding item to cart:', request);
      const response = await httpClient.post(
        `${CART_BASE_URL}${API_PREFIX}/cart/items`,
        request
      );
      console.log('[CartService] Item added:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[CartService] Failed to add item to cart:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to add item to cart';
      throw new Error(errorMessage);
    }
  }

  /**
   * Update cart item quantity
   */
  async updateItemQuantity(
    productId: string,
    request: UpdateCartItemRequest
  ): Promise<CartItem> {
    try {
      console.log('[CartService] Updating item quantity:', productId, request);
      const response = await httpClient.patch(
        `${CART_BASE_URL}${API_PREFIX}/cart/items/${productId}`,
        request
      );
      console.log('[CartService] Item updated:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[CartService] Failed to update item quantity:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to update item quantity';
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete items from cart
   */
  async deleteItems(request: DeleteCartItemsRequest): Promise<DeleteCartItemsResponse> {
    try {
      console.log('[CartService] Deleting items from cart:', request);
      const response = await httpClient.delete(
        `${CART_BASE_URL}${API_PREFIX}/cart/items`,
        { data: request }
      );
      console.log('[CartService] Items deleted:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[CartService] Failed to delete items from cart:', error);
      throw new Error(error.response?.data?.detail || 'Failed to delete items from cart');
    }
  }

  /**
   * Clear entire cart (delete all items)
   */
  async clearCart(): Promise<void> {
    try {
      console.log('[CartService] Clearing cart');
      // First get all items
      const cart = await this.getCart();
      const productIds = Object.keys(cart.items);
      
      if (productIds.length === 0) {
        console.log('[CartService] Cart is already empty');
        return;
      }

      // Delete all items
      await this.deleteItems({ product_ids: productIds });
      console.log('[CartService] Cart cleared');
    } catch (error: any) {
      console.error('[CartService] Failed to clear cart:', error);
      throw new Error('Failed to clear cart');
    }
  }
}

export default CartService.getInstance();
