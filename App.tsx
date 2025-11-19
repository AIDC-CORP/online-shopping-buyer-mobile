
import './global.css';
import React, { useState, useCallback } from 'react';
// FIX: Removed styled HOC from nativewind as it is no longer needed. ClassName props can be used directly.
import { StatusBar, View, Platform, Text, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppContextProvider } from './context/AppContext';
import LoginScreen from './features/auth/screens/LoginScreen';
import ShoppingScreen from './features/shopping/screens/ShoppingScreen';
import OrderHistoryScreen from './features/orders/screens/OrderHistoryScreen';
import ProfileScreen from './features/profile/screens/ProfileScreen';
import SetupProfileScreen from './features/profile/screens/SetupProfileScreen';
import ChatScreen from './features/support/screens/ChatScreen';
import BottomNavBar from './components/common/BottomNavBar';
import CartScreen from './features/cart/screens/CartScreen';
import Header from './components/common/Header';
import OrderDetailDialog from './features/orders/components/dialogs/OrderDetailDialog';
import { NotificationsDialog } from './features/notifications';
import { User, Order, Screen } from './types';
import { MOCK_USER } from './services/api/mockApiService';
import ProfileService from './services/profile/ProfileService';
import AuthService from './services/auth/AuthService';

// FIX: Removed styled HOC.
// const StyledSafeAreaView = styled(SafeAreaView);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Shopping);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(false);

  const checkProfileExists = async () => {
    try {
      setCheckingProfile(true);
      const profile = await ProfileService.getUserProfile();
      
      if (!profile) {
        // Profile doesn't exist (404), show setup screen
        console.log('[App] No profile found, showing setup screen');
        setNeedsProfileSetup(true);
      } else {
        // Profile exists, check if it's actually filled out
        // Consider profile incomplete if age, location, and health are all missing/null
        const hasBasicInfo = profile.age || profile.location;
        const hasHealthInfo = profile.health && (profile.health.height || profile.health.weight);
        
        if (!hasBasicInfo && !hasHealthInfo) {
          console.log('[App] Profile exists but not filled out, showing setup screen');
          setNeedsProfileSetup(true);
        } else {
          console.log('[App] Profile complete, going to Shopping');
          setNeedsProfileSetup(false);
          setActiveScreen(Screen.Shopping);
        }
      }
    } catch (error) {
      console.error('[App] Error checking profile:', error);
      // On network/server error, allow user to continue without profile
      // This allows app to work even if profile service is down
      setNeedsProfileSetup(false);
      setActiveScreen(Screen.Shopping);
    } finally {
      setCheckingProfile(false);
    }
  };

  const handleLogin = useCallback(async () => {
    // Get authenticated user from AuthService
    const authUser = AuthService.getCurrentUser();
    
    if (authUser) {
      setUser(authUser as any); // Convert to app User type
      await checkProfileExists();
    } else {
      // Fallback to mock user for development
      setUser(MOCK_USER);
      setActiveScreen(Screen.Shopping);
    }
  }, []);

  const handleProfileSetupComplete = useCallback(() => {
    setNeedsProfileSetup(false);
    setActiveScreen(Screen.Shopping);
  }, []);

  const handleProfileSetupSkip = useCallback(() => {
    setNeedsProfileSetup(false);
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

  // Show loading while checking profile
  if (checkingProfile) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={{ marginTop: 12, color: '#6b7280' }}>Đang kiểm tra hồ sơ...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // Show setup profile screen if needed
  if (needsProfileSetup) {
    return (
      <SafeAreaProvider>
        <SetupProfileScreen
          onComplete={handleProfileSetupComplete}
          onSkip={handleProfileSetupSkip}
        />
      </SafeAreaProvider>
    );
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
