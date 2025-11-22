
import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { TrashIcon } from '../../../components/icons/Icons';
import { useCart } from '../hooks/useCart';
import CheckoutDialog from '../components/dialog/CheckoutDialog';
import VoucherDialog from '../components/dialog/VoucherDialog';

const CartScreen: React.FC = () => {
  const { cart, removeFromCart, updateCartItemQuantity, cartTotal, shippingFee, totalWithShipping, voucherCode, voucherDiscount, validateVoucher, removeVoucher, isValidatingVoucher, clearCart, isLoading, refreshCart } = useCart();
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);
  const [voucherInput, setVoucherInput] = useState('');
  const [isVoucherDialogVisible, setIsVoucherDialogVisible] = useState(false);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={{ marginTop: 16, color: '#6b7280' }}>Đang tải giỏ hàng...</Text>
      </View>
    );
  }

  if (cart.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#f9fafb' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937' }}>Giỏ hàng của bạn trống</Text>
        <Text style={{ color: '#6b7280', marginTop: 8 }}>Có vẻ như bạn chưa thêm sản phẩm nào!</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937' }}>Giỏ hàng</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={{ fontSize: 12, color: '#ef4444' }}>Xóa giỏ hàng</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ padding: 16, paddingBottom: 200 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshCart} colors={['#10b981']} />
        }
      >
        <View>
          {cart.map((item) => (
            <View key={item.id} style={{
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
              <Image 
                source={{ uri: item.imageUrl || 'https://via.placeholder.com/80' }} 
                style={{ width: 80, height: 80, borderRadius: 6 }} 
                resizeMode="cover" 
              />
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={{ fontWeight: '600', color: '#1f2937', fontSize: 16 }}>{item.name}</Text>
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{item.storeName}</Text>
                <Text style={{ fontSize: 14, color: '#10b981', marginTop: 4, fontWeight: '600' }}>
                  {item.price.toLocaleString('vi-VN')}đ
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 6 }}>
                  <TouchableOpacity
                    onPress={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                    style={{ paddingHorizontal: 12, paddingVertical: 8 }}
                  >
                    <Text style={{ fontSize: 16, color: '#1f2937', fontWeight: '600' }}>-</Text>
                  </TouchableOpacity>
                  <Text style={{ paddingHorizontal: 12, fontSize: 14, color: '#1f2937', minWidth: 40, textAlign: 'center' }}>
                    {item.quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                    style={{ paddingHorizontal: 12, paddingVertical: 8 }}
                  >
                    <Text style={{ fontSize: 16, color: '#1f2937', fontWeight: '600' }}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => removeFromCart(item.id)}
                  style={{ padding: 8, borderRadius: 9999 }}
                >
                  <TrashIcon color="#ef4444"/>
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
        {/* Voucher Section */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 8 }}>Mã giảm giá</Text>
          {voucherCode ? (
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              padding: 12, 
              backgroundColor: '#d1fae5',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#10b981',
            }}>
              <Text style={{ flex: 1, color: '#065f46', fontWeight: '600' }}>
                {voucherCode} (-{voucherDiscount.toLocaleString('vi-VN')}đ)
              </Text>
              <TouchableOpacity onPress={removeVoucher}>
                <Text style={{ color: '#ef4444', fontSize: 12, fontWeight: '600' }}>Xóa</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setIsVoucherDialogVisible(true)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 12,
                paddingVertical: 12,
                backgroundColor: '#ffffff',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#d1d5db',
              }}
            >
              <Text style={{ color: '#6b7280', fontSize: 14 }}>Chọn hoặc nhập mã Voucher</Text>
              <Text style={{ color: '#10b981', fontSize: 20 }}>›</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Price Summary */}
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 16, color: '#6b7280' }}>Tạm tính:</Text>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{cartTotal.toLocaleString('vi-VN')}đ</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 16, color: '#6b7280' }}>Phí giao hàng:</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: shippingFee === 0 ? '#10b981' : '#1f2937' }}>
              {shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')}đ`}
            </Text>
          </View>
          {voucherDiscount > 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 16, color: '#10b981' }}>Giảm giá:</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#10b981' }}>-{voucherDiscount.toLocaleString('vi-VN')}đ</Text>
            </View>
          )}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
            paddingTop: 12,
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Tổng cộng:</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#10b981' }}>{totalWithShipping.toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setIsCheckoutVisible(true)}
          style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: '#10b981',
          borderRadius: 8,
          alignItems: 'center',
        }}>
          <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 16 }}>Tiến hành thanh toán</Text>
        </TouchableOpacity>
      </View>

      <CheckoutDialog
        visible={isCheckoutVisible}
        onClose={() => setIsCheckoutVisible(false)}
        onSuccess={() => {
          // Could navigate to order confirmation or orders screen
          setIsCheckoutVisible(false);
        }}
      />

      <VoucherDialog
        visible={isVoucherDialogVisible}
        onClose={() => setIsVoucherDialogVisible(false)}
        onSelectVoucher={(code) => validateVoucher(code)}
        currentVoucherCode={voucherCode}
        orderAmount={cartTotal}
      />
    </View>
  );
};

export default CartScreen;
