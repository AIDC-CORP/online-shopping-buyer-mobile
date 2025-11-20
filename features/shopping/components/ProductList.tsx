
import React, { useMemo } from 'react';
import { FlatList, View, Text } from 'react-native';
import ProductCard from './ProductCard';
import { Product as BackendProduct } from '../../../services/catalog/CatalogService';
import { Product } from '../../../types';
import { ProductListProps } from '../index';

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  // Flatten products from all stores and map to app Product format
  const flatProducts = useMemo(() => {
    const allProducts: Product[] = [];
    products.forEach(storeData => {
      if (storeData.products && Array.isArray(storeData.products)) {
        const mappedProducts = storeData.products.map((backendProduct: BackendProduct) => ({
          id: backendProduct.id,
          name: backendProduct.product_name,
          imageUrl: backendProduct.image_urls && backendProduct.image_urls.length > 0 
            ? backendProduct.image_urls[0] 
            : 'https://via.placeholder.com/150',
          price: backendProduct.price,
          store: storeData.store_name || storeData.store_id,
          category: backendProduct.category,
        }));
        allProducts.push(...mappedProducts);
      }
    });
    return allProducts;
  }, [products]);

  if (flatProducts.length === 0) {
    return <Text style={{ textAlign: 'center', color: '#6b7280', marginTop: 24 }}>Không tìm thấy sản phẩm.</Text>;
  }

  return (
    <FlatList
      data={flatProducts}
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
