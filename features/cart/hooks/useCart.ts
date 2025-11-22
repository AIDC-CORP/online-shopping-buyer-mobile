import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import CartService, { CartItem, CartResponse } from '../../../services/cart/CartService';
import VoucherService, { ValidateVoucherResponse } from '../../../services/voucher/VoucherService';
import { useAppContext } from '../../../context/AppContext';

export const useCart = () => {
  const { walletBalance, deductFromWallet } = useAppContext();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [totalWithShipping, setTotalWithShipping] = useState(0);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);

  // Fetch cart from API
  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: CartResponse = await CartService.getCart();
      
      // Convert items object to array
      const cartItems = Object.values(response.items);
      setCart(cartItems);
      setCartTotal(response.totalPrice);
      setShippingFee(response.shippingFee);
      setTotalWithShipping(response.totalPayment);
    } catch (error: any) {
      console.error('Failed to fetch cart:', error);
      Alert.alert('Lỗi', error.message || 'Không thể tải giỏ hàng');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Remove item from cart
  const removeFromCart = useCallback(async (productId: string) => {
    try {
      await CartService.deleteItems({ product_ids: [productId] });
      await fetchCart(); // Refresh cart
    } catch (error: any) {
      console.error('Failed to remove item:', error);
      Alert.alert('Lỗi', error.message || 'Không thể xóa sản phẩm');
    }
  }, [fetchCart]);

  // Update cart item quantity (không reload trang, chỉ update local state)
  const updateCartItemQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await removeFromCart(productId);
      return;
    }

    try {
      // Optimistic update: update local state trước
      const updatedCart = cart.map(item => 
        item.id === productId ? { ...item, quantity, sub_price: item.price * quantity } : item
      );
      setCart(updatedCart);
      
      // Tính lại tổng tiền
      const newTotal = updatedCart.reduce((sum, item) => sum + item.sub_price, 0);
      setCartTotal(newTotal);
      setTotalWithShipping(newTotal + shippingFee - voucherDiscount);
      
      // Update backend
      await CartService.updateItemQuantity(productId, { quantity });
    } catch (error: any) {
      console.error('Failed to update quantity:', error);
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật số lượng');
      // Rollback bằng cách fetch lại
      await fetchCart();
    }
  }, [cart, fetchCart, removeFromCart, shippingFee, voucherDiscount]);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    try {
      await CartService.clearCart();
      await fetchCart(); // Refresh cart
    } catch (error: any) {
      console.error('Failed to clear cart:', error);
      Alert.alert('Lỗi', error.message || 'Không thể xóa giỏ hàng');
    }
  }, [fetchCart]);

  // Checkout with wallet
  const checkoutWithWallet = async (orderId: string): Promise<{ success: boolean; message: string }> => {
    if (walletBalance < totalWithShipping) {
      return { success: false, message: 'Số dư ví không đủ để thanh toán đơn hàng này' };
    }

    setIsCheckingOut(true);
    try {
      const success = deductFromWallet(totalWithShipping, orderId);
      if (success) {
        await clearCart();
        return { success: true, message: 'Thanh toán thành công bằng ví điện tử' };
      } else {
        return { success: false, message: 'Có lỗi xảy ra khi thanh toán' };
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Validate voucher
  const validateVoucher = useCallback(async (code: string) => {
    if (!code || code.trim() === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập mã voucher');
      return;
    }

    try {
      setIsValidatingVoucher(true);
      const productIds = cart.map(item => item.id);
      
      const result: ValidateVoucherResponse = await VoucherService.validateVoucher({
        code: code.trim(),
        order_amount: cartTotal,
        product_ids: productIds,
      });

      if (result.valid && result.discount_amount) {
        setVoucherCode(code.trim());
        setVoucherDiscount(result.discount_amount);
        setTotalWithShipping(cartTotal + shippingFee - result.discount_amount);
        Alert.alert('Thành công', `Áp dụng voucher thành công! Giảm ${result.discount_amount.toLocaleString('vi-VN')}đ`);
      } else {
        Alert.alert('Lỗi', result.message || 'Voucher không hợp lệ');
      }
    } catch (error: any) {
      console.error('Failed to validate voucher:', error);
      Alert.alert('Lỗi', error.message || 'Không thể áp dụng voucher');
    } finally {
      setIsValidatingVoucher(false);
    }
  }, [cart, cartTotal, shippingFee]);

  // Remove voucher
  const removeVoucher = useCallback(() => {
    setVoucherCode('');
    setVoucherDiscount(0);
    setTotalWithShipping(cartTotal + shippingFee);
  }, [cartTotal, shippingFee]);

  return {
    cart,
    cartTotal,
    shippingFee,
    totalWithShipping,
    voucherCode,
    voucherDiscount,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    checkoutWithWallet,
    validateVoucher,
    removeVoucher,
    isCheckingOut,
    isLoading,
    isValidatingVoucher,
    walletBalance,
    refreshCart: fetchCart,
  };
};