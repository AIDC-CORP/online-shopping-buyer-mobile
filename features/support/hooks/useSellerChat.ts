import { useState, useRef, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { ChatMessage } from '../../../types';
import { useAppContext } from '../../../context/AppContext';
import ChatService from '../../../services/chat/ChatService';
import AuthService from '../../../services/auth/AuthService';
import { ChatMessage as APIChatMessage } from '../../../services/chat/types';

// Hardcoded seller ID for testing - replace with dynamic seller selection later
const DEFAULT_SELLER_ID = '3fd0dfa3-bbd8-4fc3-99ea-4f77fd9a1b22'; // Current logged in seller

export const useSellerChat = () => {
  const { user } = useAppContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const flatListRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize: Start conversation and load messages
  useEffect(() => {
    const initChat = async () => {
      try {
        setIsLoading(true);
        
        // Start/get conversation with seller
        const conversation = await ChatService.startConversation(DEFAULT_SELLER_ID);
        setConversationId(conversation.id);

        // Load existing messages
        const apiMessages = await ChatService.getMessages(conversation.id);
        console.log('[Buyer] API messages:', apiMessages);
        
        // Convert API messages to local format
        const formattedMessages: ChatMessage[] = apiMessages.map((msg: APIChatMessage) => {
          const sender = msg.senderType === 'customer' ? 'user' : 'bot';
          console.log(`[Buyer] Mapping message ${msg.id}: senderType=${msg.senderType} → sender=${sender}`);
          return {
            id: msg.id,
            text: msg.text,
            sender,
          };
        });
        
        console.log('[Buyer] Formatted messages:', formattedMessages);
        setMessages(formattedMessages);

        // Setup WebSocket
        const token = await AuthService.getToken();
        if (token) {
          const ws = ChatService.createWebSocket(conversation.id, token);
          
          ws.onopen = () => {
            console.log('WebSocket connected');
          };

          ws.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              console.log('[Buyer WebSocket] Received message:', data);
              
              // Only add messages from seller (not our own echoed messages)
              if ((data.type === 'message' || data.id) && data.senderType === 'seller') {
                const newMessage: ChatMessage = {
                  id: data.id || Date.now().toString(),
                  text: data.text || data.content,
                  sender: 'bot', // Messages from seller
                };
                console.log('[Buyer WebSocket] Adding seller message:', newMessage);
                setMessages(prev => [...prev, newMessage]);
              }
            } catch (error) {
              console.error('Error parsing WebSocket message:', error);
            }
          };

          ws.onerror = (error) => {
            console.error('WebSocket error:', error);
          };

          ws.onclose = () => {
            console.log('WebSocket disconnected');
          };

          wsRef.current = ws;
        }
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        Alert.alert('Lỗi', 'Không thể kết nối chat với seller. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };

    initChat();

    // Cleanup WebSocket on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleSend = useCallback(async () => {
    if (input.trim() === '' || isLoading || !conversationId || !wsRef.current) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      // Send via WebSocket
      ChatService.sendWebSocketMessage(wsRef.current, {
        type: 'message',
        text: input,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('Lỗi', 'Không thể gửi tin nhắn. Vui lòng thử lại.');
      // Remove the message if send failed
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    }
  }, [input, isLoading, conversationId]);

  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  return {
    messages,
    input,
    setInput,
    isLoading,
    flatListRef,
    handleSend,
    user,
  };
};