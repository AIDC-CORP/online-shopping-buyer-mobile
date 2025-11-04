import { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../../../types';
import { getChatbotResponse } from '../../../services/geminiService';
import { useAppContext } from '../../../context/AppContext';

export const useChatbot = () => {
  const { user } = useAppContext();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', text: `Chào ${user?.name}! Tôi là trợ lý AI Fresh. Tôi có thể giúp gì cho bạn hôm nay?`, sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<any>(null);

  const handleSend = useCallback(async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await getChatbotResponse(updatedHistory);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to get chatbot response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.',
        sender: 'bot',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

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