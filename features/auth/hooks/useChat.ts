import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatService from '../../services/chat/ChatService';
import { ChatMessage, SendMessageRequest, WSMessage } from '../../services/chat/types';

export function useChat(conversationId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ChatService.getMessages(conversationId);
      setMessages(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to load messages');
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  // Initialize WebSocket
  const connectWebSocket = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found');
        return;
      }

      const ws = ChatService.createWebSocket(conversationId, token);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const wsMessage: WSMessage = JSON.parse(event.data);
          const newMessage: ChatMessage = {
            id: wsMessage.id,
            senderId: wsMessage.senderId,
            senderType: wsMessage.senderType,
            text: wsMessage.text,
            attachments: wsMessage.attachments,
            timestamp: wsMessage.timestamp,
          };
          setMessages((prev) => [...prev, newMessage]);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
      };
    } catch (err) {
      console.error('Error connecting WebSocket:', err);
    }
  }, [conversationId]);

  // Send message
  const sendMessage = useCallback(async (text: string, attachments?: any[]) => {
    if (!text.trim() && !attachments?.length) return;

    try {
      setSending(true);
      const message: SendMessageRequest = {
        text: text.trim(),
        attachments,
      };

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        ChatService.sendWebSocketMessage(wsRef.current, message);
      } else {
        throw new Error('WebSocket not connected');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  }, []);

  // Initialize
  useEffect(() => {
    fetchMessages();
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [fetchMessages, connectWebSocket]);

  return {
    messages,
    loading,
    error,
    sending,
    sendMessage,
    refetch: fetchMessages,
  };
}
