import { useAppContext } from '../../../context/AppContext';

export const useCart = () => {
  const { cart, removeFromCart, updateCartItemQuantity, cartTotal, clearCart } = useAppContext();

  const shippingFee = 20000;
  const totalWithShipping = cartTotal + shippingFee;

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartItemQuantity(productId, quantity);
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
  };
};