
import './global.css';
import React, { useState, useCallback } from 'react';
// FIX: Removed styled HOC from nativewind as it is no longer needed. ClassName props can be used directly.
import { SafeAreaView, StatusBar, View, Platform } from 'react-native';
import { AppContextProvider } from './context/AppContext';
import LoginScreen from './features/auth/LoginScreen';
import ShoppingScreen from './features/shopping/ShoppingScreen';
import OrderHistoryScreen from './features/orders/OrderHistoryScreen';
import ProfileScreen from './features/profile/ProfileScreen';
import ChatbotScreen from './features/support/ChatbotScreen';
import BottomNavBar from './components/common/BottomNavBar';
import CartScreen from './features/cart/CartScreen';
import Header from './components/common/Header';
import OrderDetailScreen from './features/orders/OrderDetailScreen';
import { User, Order } from './types';
import { MOCK_USER } from './services/api/mockApiService';

export enum Screen {
  Shopping,
  Orders,
  Profile,
  Chat,
  Cart,
}

// FIX: Removed styled HOC.
// const StyledSafeAreaView = styled(SafeAreaView);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Shopping);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleLogin = useCallback(() => {
    setUser(MOCK_USER);
    setActiveScreen(Screen.Shopping);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
  }, []);

  const handleSelectOrder = useCallback((order: Order) => {
    setSelectedOrder(order);
  }, []);

  const handleBackFromDetail = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  const renderScreen = () => {
    if (selectedOrder) {
      return <OrderDetailScreen order={selectedOrder} onBack={handleBackFromDetail} />;
    }

    switch (activeScreen) {
      case Screen.Shopping:
        return <ShoppingScreen />;
      case Screen.Orders:
        return <OrderHistoryScreen onSelectOrder={handleSelectOrder} />;
      case Screen.Profile:
        return <ProfileScreen onLogout={handleLogout} />;
      case Screen.Chat:
        return <ChatbotScreen />;
      case Screen.Cart:
        return <CartScreen />;
      default:
        return <ShoppingScreen />;
    }
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <AppContextProvider user={user}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
        <StatusBar barStyle="light-content" backgroundColor="#10b981" />
        <Header />
        <View style={{ flex: 1, paddingTop: 96, paddingBottom: 64 }}>
           {renderScreen()}
        </View>
        <BottomNavBar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      </SafeAreaView>
    </AppContextProvider>
  );
};

export default App;
