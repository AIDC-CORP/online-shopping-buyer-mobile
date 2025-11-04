import { useAppContext } from '../../../context/AppContext';
import { useState } from 'react';

export const useCart = () => {
  const { cart, removeFromCart, updateCartItemQuantity, cartTotal, clearCart, deductFromWallet, walletBalance } = useAppContext();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const shippingFee = 20000;
  const totalWithShipping = cartTotal + shippingFee;

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartItemQuantity(productId, quantity);
    }
  };

  const checkoutWithWallet = async (orderId: string): Promise<{ success: boolean; message: string }> => {
    if (walletBalance < totalWithShipping) {
      return { success: false, message: 'Số dư ví không đủ để thanh toán đơn hàng này' };
    }

    setIsCheckingOut(true);
    try {
      const success = deductFromWallet(totalWithShipping, orderId);
      if (success) {
        clearCart();
        return { success: true, message: 'Thanh toán thành công bằng ví điện tử' };
      } else {
        return { success: false, message: 'Có lỗi xảy ra khi thanh toán' };
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  return {
    cart,
    cartTotal,
    shippingFee,
    totalWithShipping,
    removeFromCart,
    updateCartItemQuantity: handleQuantityChange,
    clearCart,
    checkoutWithWallet,
    isCheckingOut,
    walletBalance,
  };
};