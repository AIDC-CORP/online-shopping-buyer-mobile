
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { User, CartItem, Product, WalletTransaction } from '../types';

interface AppContextType {
  user: User | null;
  setUser: (user: User) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  walletTransactions: WalletTransaction[];
  addToWallet: (amount: number, description?: string) => void;
  deductFromWallet: (amount: number, orderId?: string) => boolean;
  walletBalance: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
  user: User;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children, user: initialUser }) => {
  const [user, setUser] = useState<User>(initialUser);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  }, []);

  const updateCartItemQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const addToWallet = useCallback((amount: number, description: string = 'Nạp tiền vào ví') => {
    const transaction: WalletTransaction = {
      id: `txn-${Date.now()}`,
      type: 'top_up',
      amount,
      description,
      date: new Date().toISOString(),
    };
    setWalletTransactions(prev => [transaction, ...prev]);
    setUser(prevUser => prevUser ? { ...prevUser, walletBalance: prevUser.walletBalance + amount } : prevUser);
  }, []);

  const deductFromWallet = useCallback((amount: number, orderId?: string): boolean => {
    if (!user || user.walletBalance < amount) {
      return false;
    }
    const transaction: WalletTransaction = {
      id: `txn-${Date.now()}`,
      type: 'payment',
      amount: -amount,
      description: `Thanh toán đơn hàng ${orderId || ''}`,
      date: new Date().toISOString(),
      orderId,
    };
    setWalletTransactions(prev => [transaction, ...prev]);
    setUser(prevUser => prevUser ? { ...prevUser, walletBalance: prevUser.walletBalance - amount } : prevUser);
    return true;
  }, [user]);

  const walletBalance = user?.walletBalance || 0;

  const value = {
    user,
    setUser,
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    cartTotal,
    walletTransactions,
    addToWallet,
    deductFromWallet,
    walletBalance,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};
