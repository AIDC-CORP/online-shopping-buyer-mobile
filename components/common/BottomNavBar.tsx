
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Screen } from '../../App';
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
      paddingTop: 8,
      paddingBottom: 4,
    }}
  >
    <View style={{ position: 'relative' }}>
      <View>
        <IconComponent color={isActive ? '#059669' : '#6b7280'} size={24} />
      </View>
      {badgeCount && badgeCount > 0 ? (
        <View style={{
          position: 'absolute',
          top: -4,
          right: -14,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 6,
          paddingVertical: 2,
          backgroundColor: '#dc2626',
          borderRadius: 9999,
        }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#ffffff' }}>
            {badgeCount}
          </Text>
        </View>
      ) : null}
    </View>
    <Text style={{ marginTop: 4, fontSize: 10, color: isActive ? '#059669' : '#6b7280' }}>{label}</Text>
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
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 5,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
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
