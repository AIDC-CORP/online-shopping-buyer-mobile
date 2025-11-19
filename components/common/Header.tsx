
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
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
        <View style={{ position: 'relative' }}>
            {/* Main header background */}
            <View style={{ backgroundColor: '#10b981', paddingTop: 42, paddingBottom: 1, paddingHorizontal: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View>
                            <Text style={{ fontSize: 12, color: '#ffffff', opacity: 0.9 }}>{title}</Text>
                            {isShowUser && <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff', marginTop: 2 }}>{user.name}</Text>}
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={onPressBell || (() => console.log('Bell icon pressed'))} style={{ marginRight: 16 }}>
                            <BellIcon color="white" />
                        </TouchableOpacity>
                        {rightView}
                    </View>
                </View>
            </View>
            
            {/* Wavy bottom border using SVG */}
            <View style={{ height: 40, overflow: 'hidden', backgroundColor: 'transparent' }}>
                <Svg height="40" width="100%" viewBox="0 0 1440 80" preserveAspectRatio="none">
                    <Path
                        d="M0,40 C240,65 480,65 720,40 C960,15 1200,15 1440,40 L1440,0 L0,0 Z"
                        fill="#10b981"
                    />
                </Svg>
            </View>
        </View>
    );
};

export default Header;
