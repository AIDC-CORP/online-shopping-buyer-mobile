import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { ChatMessage } from '../../../types';
import { UserCircleIcon } from '../../../components/icons/Icons';
import { useSellerChat } from '../hooks/useSellerChat';

const SellerChatScreen: React.FC = () => {
  const { messages, input, setInput, isLoading, flatListRef, handleSend, user } = useSellerChat();

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });
    return () => {
      showListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={{ flex: 1, backgroundColor: '#ffffff', marginHorizontal: 16, marginVertical: 8, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', flexDirection: 'row', alignItems: 'center' }}>
            <UserCircleIcon size={24} color="#059669"/>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginLeft: 8 }}>Chat với Seller</Text>
        </View>

        <ScrollView
            ref={flatListRef}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: 8 }}
        >
            {messages.map((item) => (
                <View key={item.id} style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  gap: 8,
                  marginVertical: 8,
                  justifyContent: item.sender === 'user' ? 'flex-end' : 'flex-start',
                  paddingHorizontal: 16,
                }}>
                    {item.sender === 'bot' && <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#059669', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#ffffff', fontSize: 12, fontWeight: 'bold' }}>NV</Text></View>}
                    <View style={{
                      maxWidth: '80%',
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 16,
                      backgroundColor: item.sender === 'user' ? '#059669' : '#e5e7eb',
                      borderBottomRightRadius: item.sender === 'user' ? 0 : 16,
                      borderBottomLeftRadius: item.sender === 'user' ? 16 : 0,
                    }}>
                        <Text style={{ color: item.sender === 'user' ? '#ffffff' : '#1f2937' }}>{item.text}</Text>
                    </View>
                    {item.sender === 'user' && <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#d1d5db', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#4b5563', fontSize: 12, fontWeight: 'bold' }}>{user?.name.charAt(0)}</Text></View>}
                </View>
            ))}
            {isLoading && (
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginVertical: 8, justifyContent: 'flex-start', paddingHorizontal: 16 }}>
                    <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#059669', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#ffffff', fontSize: 12, fontWeight: 'bold' }}>NV</Text></View>
                    <View style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, backgroundColor: '#e5e7eb' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <View style={{ width: 8, height: 8, backgroundColor: '#6b7280', borderRadius: 4 }} />
                            <View style={{ width: 8, height: 8, backgroundColor: '#6b7280', borderRadius: 4 }} />
                            <View style={{ width: 8, height: 8, backgroundColor: '#6b7280', borderRadius: 4 }} />
                        </View>
                    </View>
                </View>
            )}
        </ScrollView>

        <View style={{ paddingHorizontal: 8, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#e5e7eb', backgroundColor: '#f3f4f6' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Nhập tin nhắn của bạn..."
                placeholderTextColor="#9ca3af"
                editable={!isLoading}
                onSubmitEditing={handleSend}
                style={{
                  flex: 1,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 9999,
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                }}
            />
            <TouchableOpacity
                onPress={handleSend}
                disabled={isLoading || input.trim() === ''}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  backgroundColor: isLoading || input.trim() === '' ? '#a7f3d0' : '#059669',
                  borderRadius: 9999,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
            >
                <Text style={{ color: '#ffffff', fontWeight: '600' }}>➤</Text>
            </TouchableOpacity>
            </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SellerChatScreen;