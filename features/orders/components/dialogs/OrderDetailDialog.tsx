
import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Order, OrderStatus, CartItem } from '../../../../types';
import { useOrderDetail } from '../../hooks/useOrderDetail';

const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + 'đ';
};

const statusMap: Record<OrderStatus, { text: string; bg: string; text_clr: string }> = {
    completed: { text: 'Giao thành công', bg: '#dcfce7', text_clr: '#166534' },
    delivering: { text: 'Đang giao', bg: '#dbeafe', text_clr: '#0c4a6e' },
    cancelled: { text: 'Đã hủy', bg: '#fee2e2', text_clr: '#7f1d1d' },
    pending: { text: 'Chờ xác nhận', bg: '#fef3c7', text_clr: '#78350f' },
    confirmed: { text: 'Đã xác nhận', bg: '#e0e7ff', text_clr: '#3730a3' },
    picking: { text: 'Đang lấy hàng', bg: '#e0f2fe', text_clr: '#164e63' },
};

interface OrderDetailDialogProps {
  visible: boolean;
  onClose: () => void;
  order: Order;
}

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({ visible, onClose, order }) => {
    const { orderDetail, isLoading, handleBuyAgain } = useOrderDetail(order);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const orderStatus = statusMap[orderDetail.status] || statusMap.pending;

    if (isLoading) {
        return (
            <Modal
                visible={visible}
                onRequestClose={onClose}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
                    <Text style={{ fontSize: 16, color: '#6b7280' }}>Đang tải...</Text>
                </View>
            </Modal>
        );
    }

    return (
        <Modal
            visible={visible}
            onRequestClose={onClose}
            animationType="slide"
            presentationStyle="pageSheet"
        >
            <View style={{ flex: 1, backgroundColor: '#f9fafb', padding: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>Chi tiết đơn hàng #{orderDetail.id}</Text>
                    <TouchableOpacity
                        onPress={onClose}
                        style={{ padding: 8 }}
                    >
                        <Text style={{ fontSize: 18, color: '#6b7280' }}>✕</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView>
                    <View style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 12,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 5,
                      paddingHorizontal: 24,
                      paddingVertical: 24,
                    }}>
                        <View style={{ marginBottom: 24 }}>
                            <Text style={{ color: '#6b7280', marginTop: 4 }}>Ngày đặt: {orderDetail.date}</Text>
                            <View style={{ marginTop: 12, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, backgroundColor: orderStatus.bg, borderRadius: 9999 }}>
                                <Text style={{ fontSize: 12, fontWeight: '600', color: orderStatus.text_clr }}>
                                    {orderStatus.text}
                                </Text>
                            </View>
                        </View>

                        <View style={{ borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 16, gap: 16 }}>
                            {orderDetail.items.map((item: CartItem, index: number) => (
                                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                                        <Image source={{ uri: item.product.imageUrl }} style={{ width: 64, height: 64, borderRadius: 8 }} resizeMode="cover" />
                                        <View>
                                            <Text style={{ fontWeight: '600', color: '#1f2937', fontSize: 16 }}>{item.product.name}</Text>
                                            <Text style={{ fontSize: 12, color: '#6b7280' }}>Số lượng: {item.quantity}</Text>
                                        </View>
                                    </View>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#1f2937' }}>{formatCurrency(item.product.price * item.quantity)}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={{ borderTopWidth: 1, borderTopColor: '#e5e7eb', marginTop: 16, paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937' }}>Tổng cộng</Text>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#059669' }}>{formatCurrency(orderDetail.total)}</Text>
                        </View>

                        {orderDetail.status === 'completed' && (
                            <View style={{ marginTop: 16 }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 }}>Đánh giá đơn hàng</Text>
                                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                                    {[1,2,3,4,5].map(star => (
                                        <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                            <Text style={{ fontSize: 24, color: star <= rating ? '#fbbf24' : '#d1d5db' }}>★</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <TextInput
                                    style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 8, marginBottom: 16 }}
                                    placeholder="Nhập bình luận của bạn..."
                                    value={comment}
                                    onChangeText={setComment}
                                    multiline
                                />
                                <TouchableOpacity
                                    style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#10b981', borderRadius: 8, alignItems: 'center' }}
                                    onPress={() => {/* handle submit */}}
                                >
                                    <Text style={{ color: '#ffffff', fontWeight: '600' }}>Gửi đánh giá</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                         <TouchableOpacity
                            onPress={handleBuyAgain}
                            style={{
                              marginTop: 16,
                              paddingHorizontal: 16,
                              paddingVertical: 12,
                              backgroundColor: '#10b981',
                              borderRadius: 8,
                              shadowColor: '#000',
                              shadowOffset: { width: 0, height: 1 },
                              shadowOpacity: 0.05,
                              shadowRadius: 2,
                              elevation: 1,
                              alignItems: 'center',
                            }}
                        >
                            <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 16 }}>Mua lại</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

export default OrderDetailDialog;
