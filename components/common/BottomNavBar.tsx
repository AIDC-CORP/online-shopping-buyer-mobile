
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Screen } from '../../types';
import { HomeIcon, ListBulletIcon, UserCircleIcon, ChatBubbleLeftRightIcon, ShoppingCartIcon } from '../icons/Icons';
import { useAppContext } from '../../context/AppContext';

interface BottomNavBarProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

const NavItem: React.FC<{
  IconComponent: React.ComponentType<{ color?: string; size?: number }>;
  label: string;
  isActive: boolean;
  onClick: () => void;
  badgeCount?: number;
}> = ({ IconComponent, label, isActive, onClick, badgeCount }) => (
  <TouchableOpacity
    onPress={onClick}
    style={{
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 5,
      paddingBottom: 5,
      backgroundColor: isActive ? '#f0fdf4' : 'transparent',
      borderTopWidth: isActive ? 3 : 0,
      borderTopColor: isActive ? '#059669' : 'transparent',
      borderRadius: isActive ? 12 : 0,
    }}
  >
    <View style={{ position: 'relative' }}>
      <View style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: isActive ? '#d1fae5' : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <IconComponent color={isActive ? '#059669' : '#9ca3af'} size={isActive ? 26 : 24} />
      </View>
      {badgeCount && badgeCount > 0 ? (
        <View style={{
          position: 'absolute',
          top: -6,
          right: -8,
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 24,
          paddingHorizontal: 6,
          paddingVertical: 2,
          backgroundColor: '#ef4444',
          borderRadius: 12,
          borderWidth: 2,
          borderColor: '#ffffff',
        }}>
          <Text style={{ 
            fontSize: 11, 
            fontWeight: '700', 
            color: '#ffffff',
            textAlign: 'center',
          }}>
            {badgeCount}
          </Text>
        </View>
      ) : null}
    </View>
    <Text style={{ 
      marginTop: 6, 
      fontSize: 11, 
      fontWeight: isActive ? '600' : '500',
      color: isActive ? '#059669' : '#9ca3af',
      textAlign: 'center',
    }}>
      {label}
    </Text>
  </TouchableOpacity>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeScreen, setActiveScreen }) => {
  const { cart } = useAppContext();
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const navItems = [
    { screen: Screen.Shopping, label: 'Trang chủ', IconComponent: HomeIcon },
    { screen: Screen.Orders, label: 'Đơn hàng', IconComponent: ListBulletIcon },
    { screen: Screen.Cart, label: 'Giỏ hàng', IconComponent: ShoppingCartIcon, badgeCount: cartItemCount },
    { screen: Screen.Chat, label: 'Hỗ trợ', IconComponent: ChatBubbleLeftRightIcon },
    { screen: Screen.Profile, label: 'Tài khoản', IconComponent: UserCircleIcon },
  ];

  return (
    <View style={{
      backgroundColor: '#ffffff',
      borderTopWidth: 1,
      borderTopColor: '#e5e7eb',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 20,
      paddingTop: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 8,
    }}>
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-around',
        paddingHorizontal: 4,
      }}>
        {navItems.map((item) => (
          <NavItem
            key={item.screen}
            IconComponent={item.IconComponent}
            label={item.label}
            isActive={activeScreen === item.screen}
            onClick={() => setActiveScreen(item.screen)}
            badgeCount={item.badgeCount}
          />
        ))}
      </View>
    </View>
  );
};

export default BottomNavBar;
