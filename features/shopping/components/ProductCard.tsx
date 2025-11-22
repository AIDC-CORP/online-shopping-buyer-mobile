
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAppContext } from '../../../context/AppContext';
import { ProductCardProps } from '../index';

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(product);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <View style={{
      backgroundColor: '#ffffff',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
      overflow: 'hidden',
      flex: 1,
    }}>
        <Image source={{ uri: product.imageUrl }} style={{ width: '100%', height: 128 }} resizeMode="cover"/>
        <View style={{ padding: 12, flex: 1, justifyContent: 'space-between' }}>
            <View>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }} numberOfLines={2}>{product.name}</Text>
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }} numberOfLines={1}>{product.store}</Text>
            </View>
            <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#059669' }}>{product.price.toLocaleString('vi-VN')}đ</Text>
                <TouchableOpacity
                    onPress={handleAddToCart}
                    disabled={isAdding}
                    style={{ 
                      paddingHorizontal: 16, 
                      paddingVertical: 8, 
                      backgroundColor: isAdding ? '#d1fae5' : '#10b981', 
                      borderRadius: 9999,
                      minWidth: 70,
                      alignItems: 'center',
                    }}
                >
                    {isAdding ? (
                      <ActivityIndicator size="small" color="#065f46" />
                    ) : (
                      <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '600' }}>Thêm</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );
};

export default ProductCard;
