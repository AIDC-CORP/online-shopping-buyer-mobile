
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
import { ChatMessage } from '../../../types';
import { SparklesIcon, MenuIcon, PlusIcon, TrashIcon } from '../../../components/icons/Icons';
import { useChatbot } from '../hooks/useChatbot';

const ChatbotScreen: React.FC = () => {
  const {
    conversations,
    currentConversation,
    currentConversationId,
    messages,
    input,
    setInput,
    isLoading,
    flatListRef,
    handleSend,
    createNewConversation,
    switchConversation,
    deleteConversation,
    updateConversationTitle,
    user
  } = useChatbot();

  const [sidebarVisible, setSidebarVisible] = useState(false);

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

  const handleDeleteConversation = (conversationId: string) => {
    Alert.alert(
      'Xóa cuộc trò chuyện',
      'Bạn có chắc muốn xóa cuộc trò chuyện này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa', style: 'destructive', onPress: () => deleteConversation(conversationId) },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('vi-VN', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 175 : 175}
    >
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#ffffff' }}>
        {/* Sidebar */}
        {sidebarVisible && (
          <View style={{
            width: 280,
            backgroundColor: '#f8fafc',
            borderRightWidth: 1,
            borderRightColor: '#e2e8f0',
            flexDirection: 'column'
          }}>
            {/* Sidebar Header */}
            <View style={{
              paddingHorizontal: 16,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#e2e8f0',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937' }}>Lịch sử trò chuyện</Text>
              <TouchableOpacity
                onPress={createNewConversation}
                style={{
                  padding: 8,
                  backgroundColor: '#059669',
                  borderRadius: 6,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <PlusIcon size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Conversations List */}
            <ScrollView style={{ flex: 1 }}>
              {conversations.map((conversation) => (
                <TouchableOpacity
                  key={conversation.id}
                  onPress={() => {
                    switchConversation(conversation.id);
                    setSidebarVisible(false);
                  }}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f1f5f9',
                    backgroundColor: conversation.id === currentConversationId ? '#e0f2fe' : 'transparent'
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: conversation.id === currentConversationId ? '600' : '400',
                          color: '#1f2937',
                          marginBottom: 4
                        }}
                        numberOfLines={1}
                      >
                        {conversation.title}
                      </Text>
                      <Text style={{ fontSize: 12, color: '#64748b' }}>
                        {formatDate(conversation.updatedAt)}
                      </Text>
                    </View>
                    {conversations.length > 1 && (
                      <TouchableOpacity
                        onPress={() => handleDeleteConversation(conversation.id)}
                        style={{ padding: 4, marginLeft: 8 }}
                      >
                        <TrashIcon size={14} color="#ef4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Main Chat Area */}
        <View style={{ flex: 1, marginHorizontal: sidebarVisible ? 0 : 16, marginVertical: 8, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, overflow: 'hidden' }}>
          {/* Chat Header */}
          <View style={{
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => setSidebarVisible(!sidebarVisible)}
                style={{ padding: 8, marginRight: 8 }}
              >
                <MenuIcon size={20} color="#6b7280" />
              </TouchableOpacity>
              <SparklesIcon size={24} color="#34d399"/>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginLeft: 8 }}>Trợ lý AI</Text>
            </View>
            {currentConversation && (
              <Text style={{ fontSize: 12, color: '#64748b' }}>
                {currentConversation.title}
              </Text>
            )}
          </View>

          {/* Messages */}
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
                      {item.sender === 'bot' && <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#ffffff', fontSize: 12, fontWeight: 'bold' }}>AI</Text></View>}
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
                      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#10b981', alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#ffffff', fontSize: 12, fontWeight: 'bold' }}>AI</Text></View>
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

          {/* Input Area */}
          <View style={{ paddingHorizontal: 8, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#e5e7eb', backgroundColor: '#f3f4f6' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TextInput
                  value={input}
                  onChangeText={setInput}
                  placeholder="Hỏi tôi bất cứ điều gì..."
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
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatbotScreen;
