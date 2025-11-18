import httpClient from '../auth/config/httpClient';
import { ChatConversation, ChatMessage, SendMessageRequest } from './types';

const CHAT_BASE_URL = process.env.EXPO_PUBLIC_CHAT_URL || 'http://192.168.1.4:8119';
const API_PREFIX = '/api/v1/online-shopping/public';

class ChatService {
  /**
   * Get all conversations for the current buyer/customer
   */
  async getConversations(): Promise<ChatConversation[]> {
    try {
      const response = await httpClient.get<ChatConversation[]>(
        `${CHAT_BASE_URL}${API_PREFIX}/buyer/chat/conversations`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      throw error;
    }
  }

  /**
   * Get messages for a specific conversation
   */
  async getMessages(conversationId: string, limit = 50, offset = 0): Promise<ChatMessage[]> {
    try {
      const response = await httpClient.get<ChatMessage[]>(
        `${CHAT_BASE_URL}${API_PREFIX}/buyer/chat/conversations/${conversationId}/messages`,
        {
          params: { limit, offset }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      throw error;
    }
  }

  /**
   * Create WebSocket connection for real-time chat
   */
  createWebSocket(conversationId: string, token: string): WebSocket {
    const wsUrl = `ws://${CHAT_BASE_URL.replace(/^https?:\/\//, '')}${API_PREFIX}/buyer/chat/conversations/${conversationId}?token=${token}`;
    return new WebSocket(wsUrl);
  }

  /**
   * Send message via WebSocket
   */
  sendWebSocketMessage(ws: WebSocket, message: SendMessageRequest): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      throw new Error('WebSocket is not connected');
    }
  }
}

export default new ChatService();
