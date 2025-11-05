
import React from 'react';
import { View, Text } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { UserCircleIcon } from '../icons/Icons';

const Header: React.FC = () => {
    const { user } = useAppContext();

    if (!user) return null;

    return (
        <View style={{
            backgroundColor: '#10b981',
            paddingTop: 48,
            paddingBottom: 16,
            paddingHorizontal: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                    <Text style={{ fontSize: 12, color: '#ffffff' }}>Xin chào,</Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#ffffff' }}>{user.name}</Text>
                </View>
                <UserCircleIcon color="white" />
            </View>
        </View>
    );
};

export default Header;
