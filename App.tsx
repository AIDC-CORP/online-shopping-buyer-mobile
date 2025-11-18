
import './global.css';
import React, { useState, useCallback } from 'react';
// FIX: Removed styled HOC from nativewind as it is no longer needed. ClassName props can be used directly.
import { StatusBar, View, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppContextProvider } from './context/AppContext';
import LoginScreen from './features/auth/screens/LoginScreen';
import ShoppingScreen from './features/shopping/screens/ShoppingScreen';
import OrderHistoryScreen from './features/orders/screens/OrderHistoryScreen';
import ProfileScreen from './features/profile/screens/ProfileScreen';
import ChatScreen from './features/support/screens/ChatScreen';
import BottomNavBar from './components/common/BottomNavBar';
import CartScreen from './features/cart/screens/CartScreen';
import Header from './components/common/Header';
import OrderDetailDialog from './features/orders/components/dialogs/OrderDetailDialog';
import { NotificationsDialog } from './features/notifications';
import { User, Order, Screen } from './types';
import { MOCK_USER } from './services/api/mockApiService';

// FIX: Removed styled HOC.
// const StyledSafeAreaView = styled(SafeAreaView);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Shopping);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

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

  const handleShowNotifications = useCallback(() => {
    setShowNotifications(true);
  }, []);

  const handleCloseNotifications = useCallback(() => {
    setShowNotifications(false);
  }, []);

  const renderScreen = () => {
    if (selectedOrder) {
      return <OrderDetailDialog visible={!!selectedOrder} order={selectedOrder} onClose={handleBackFromDetail} />;
    }

    switch (activeScreen) {
      case Screen.Shopping:
        return <ShoppingScreen />;
      case Screen.Orders:
        return <OrderHistoryScreen onSelectOrder={handleSelectOrder} />;
      case Screen.Profile:
        return <ProfileScreen onLogout={handleLogout} />;
      case Screen.Chat:
        return <ChatScreen />;
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
    <SafeAreaProvider>
      <AppContextProvider user={user}>
        <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
          <StatusBar barStyle="light-content" backgroundColor="#10b981" translucent={true} />
          <Header onPressBell={handleShowNotifications} />
          <View style={{ flex: 1, overflow: 'hidden' }}>
             {renderScreen()}
          </View>
          <BottomNavBar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
          <NotificationsDialog visible={showNotifications} onClose={handleCloseNotifications} />
        </View>
      </AppContextProvider>
    </SafeAreaProvider>
  );
};

export default App;
