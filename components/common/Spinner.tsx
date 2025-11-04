
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

const Spinner: React.FC<{ size?: 'small' | 'large' }> = ({ size = 'large' }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
      <ActivityIndicator size={size} color="#10b981" />
    </View>
  );
};

export default Spinner;
