export interface ChatMessage {
  id: string;
  senderId: string;
  senderType: 'customer' | 'seller';
  text: string;
  attachments?: ChatAttachment[];
  timestamp: string;
}

export interface ChatAttachment {
  type: 'image' | 'file';
  url: string;
}

export interface ChatConversation {
  id: string;
  sellerId: string;
  lastMessage: string | null;
  unreadCount: number;
  timestamp: string;
  status: 'active' | 'archived';
}

export interface SendMessageRequest {
  text: string;
  attachments?: ChatAttachment[];
}

export interface WSMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'customer' | 'seller';
  text: string;
  attachments?: ChatAttachment[];
  timestamp: string;
}
