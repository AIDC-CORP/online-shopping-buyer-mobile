
import React from 'react';
import { FlatList, View, Text } from 'react-native';
import ProductCard from './ProductCard';
import { ProductListProps } from '../index';

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  if (products.length === 0) {
    return <Text style={{ textAlign: 'center', color: '#6b7280' }}>Không tìm thấy sản phẩm.</Text>;
  }

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <View style={{ width: '50%', padding: 8 }}>
            <ProductCard product={item} />
        </View>
      )}
      keyExtractor={item => item.id}
      numColumns={2}
      scrollEnabled={false}
    />
  );
};

export default ProductList;
