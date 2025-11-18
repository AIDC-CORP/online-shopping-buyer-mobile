import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import ChatbotScreen from '../components/ChatAI';
import SellerChatScreen from '../components/ChatSeller';

type ChatType = 'ai' | 'seller';

const CHAT_TABS: Array<{ key: ChatType; label: string; icon: string }> = [
  { key: 'ai', label: 'Trợ lý AI', icon: '🤖' },
  { key: 'seller', label: 'Chat với Seller', icon: '👤' },
];

const ChatScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ChatType>('ai');

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Header with Tabs */}
      <View style={{
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
        elevation: 2,
      }}>
        <View style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}>
          {CHAT_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  marginHorizontal: 4,
                  borderRadius: 12,
                  backgroundColor: isActive ? '#d1fae5' : '#f9fafb',
                  borderWidth: isActive ? 2 : 1,
                  borderColor: isActive ? '#059669' : '#e5e7eb',
                }}>
                <Text style={{
                  fontSize: 16,
                  marginRight: 8,
                }}>
                  {tab.icon}
                </Text>
                <Text style={{
                  fontSize: 14,
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#059669' : '#6b7280',
                  textAlign: 'center',
                }}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Chat Content */}
      <View style={{ flex: 1 }}>
        {activeTab === 'ai' && <ChatbotScreen />}
        {activeTab === 'seller' && <SellerChatScreen />}
      </View>
    </View>
  );
};

export default ChatScreen;