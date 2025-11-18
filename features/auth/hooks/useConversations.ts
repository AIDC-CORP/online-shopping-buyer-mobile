import { useState, useEffect, useCallback } from 'react';
import ChatService from '../../services/chat/ChatService';
import { ChatConversation } from '../../services/chat/types';

export function useConversations() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ChatService.getConversations();
      setConversations(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to load conversations');
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    loading,
    error,
    refetch: fetchConversations,
  };
}
