
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { BellIcon } from '../icons/Icons';


interface HeaderProps {
    title?: string;
    isShowUser?: boolean;
    isHasBackButton?: boolean;
    onPressBack?: () => void;
    rightView?: React.ReactNode;
    onPressBell?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title = 'Xin chào', isShowUser = true, isHasBackButton, onPressBack, rightView, onPressBell }) => {
    const { user } = useAppContext();

    if (!user) return null;

    return (
        <View style={{
            backgroundColor: '#10b981',
            paddingTop: 48,
            paddingBottom: 16,
            paddingHorizontal: 16,
            borderBottomLeftRadius: 40,
        }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* {isHasBackButton && (
                        <TouchableOpacity onPress={onPressBack} style={{ marginRight: 16 }}>
                            <ArrowLeftIcon color="white" />
                        </TouchableOpacity>
                    )} */}
                    <View>
                        <Text style={{ fontSize: 12, color: '#ffffff' }}>{title}</Text>
                        {isShowUser && <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#ffffff' }}>{user.name}</Text>}
                    </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity onPress={onPressBell || (() => console.log('Bell icon pressed'))} style={{ marginRight: 16 }}>
                        <BellIcon color="white" />
                    </TouchableOpacity>
                    {rightView}
                </View>
            </View>
        </View>
    );
};

export default Header;
