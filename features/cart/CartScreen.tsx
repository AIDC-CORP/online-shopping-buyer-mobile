
import React from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import { TrashIcon } from '../../components/icons/Icons';

const CartScreen: React.FC = () => {
  const { cart, removeFromCart, updateCartItemQuantity, cartTotal, clearCart } = useAppContext();

  if (cart.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937' }}>Giỏ hàng của bạn trống</Text>
        <Text style={{ color: '#6b7280', marginTop: 8 }}>Có vẻ như bạn chưa thêm sản phẩm nào!</Text>
      </View>
    );
  }

  const shippingFee = 20000;

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937' }}>Giỏ hàng</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={{ fontSize: 12, color: '#ef4444' }}>Xóa giỏ hàng</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 200 }}>
        <View>
          {cart.map(({ product, quantity }) => (
            <View key={product.id} style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              padding: 16,
              borderRadius: 8,
              marginBottom: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}>
              <Image source={{ uri: product.imageUrl }} style={{ width: 80, height: 80, borderRadius: 6 }} resizeMode="cover" />
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={{ fontWeight: '600', color: '#1f2937', fontSize: 16 }}>{product.name}</Text>
                <Text style={{ fontSize: 12, color: '#6b7280' }}>{product.price.toLocaleString('vi-VN')}đ</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TextInput
                  keyboardType="number-pad"
                  value={String(quantity)}
                  onChangeText={(text) => updateCartItemQuantity(product.id, parseInt(text, 10) || 1)}
                  style={{
                    width: 48,
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 6,
                    textAlign: 'center',
                    fontSize: 14,
                    color: '#1f2937',
                  }}
                />
                <TouchableOpacity
                  onPress={() => removeFromCart(product.id)}
                  style={{ padding: 8, borderRadius: 9999 }}
                >
                  <TrashIcon color="#6b7280"/>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
      }}>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 16, color: '#6b7280' }}>Tạm tính:</Text>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{cartTotal.toLocaleString('vi-VN')}đ</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, color: '#6b7280' }}>Phí giao hàng:</Text>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{shippingFee.toLocaleString('vi-VN')}đ</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
            paddingTop: 12,
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Tổng cộng:</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{(cartTotal + shippingFee).toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>
        <TouchableOpacity style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: '#10b981',
          borderRadius: 8,
          alignItems: 'center',
        }}>
          <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 16 }}>Tiến hành thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;
