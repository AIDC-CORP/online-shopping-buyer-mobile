
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useAppContext } from '../../../context/AppContext';
import { ProductCardProps } from '../index';

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useAppContext();

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
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }}>{product.name}</Text>
                <Text style={{ fontSize: 12, color: '#6b7280' }}>{product.store}</Text>
            </View>
            <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#059669' }}>{product.price.toLocaleString('vi-VN')}đ</Text>
                <TouchableOpacity
                    onPress={() => addToCart(product)}
                    style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#d1fae5', borderRadius: 9999 }}
                >
                    <Text style={{ color: '#065f46', fontSize: 12, fontWeight: '600' }}>Thêm</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );
};

export default ProductCard;
