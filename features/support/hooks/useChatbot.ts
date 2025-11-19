import { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, ChatConversation } from '../../../types';
import { useAppContext } from '../../../context/AppContext';

export const useChatbot = () => {
  const { user } = useAppContext();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<any>(null);

  // Initialize with a default conversation if none exists
  useEffect(() => {
    if (conversations.length === 0) {
      const defaultConversation: ChatConversation = {
        id: 'default',
        title: 'Cuộc trò chuyện mới',
        messages: [
          { id: '1', text: `Chào ${user?.name}! Tôi là trợ lý AI Fresh. Tôi có thể giúp gì cho bạn hôm nay?`, sender: 'bot' }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setConversations([defaultConversation]);
      setCurrentConversationId('default');
    }
  }, [conversations.length, user?.name]);

  const currentConversation = conversations.find(conv => conv.id === currentConversationId);
  const messages = currentConversation?.messages || [];

  const createNewConversation = useCallback(() => {
    const newConversation: ChatConversation = {
      id: Date.now().toString(),
      title: 'Cuộc trò chuyện mới',
      messages: [
        { id: '1', text: `Chào ${user?.name}! Tôi là trợ lý AI Fresh. Tôi có thể giúp gì cho bạn hôm nay?`, sender: 'bot' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
  }, [user?.name]);

  const switchConversation = useCallback((conversationId: string) => {
    setCurrentConversationId(conversationId);
  }, []);

  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => {
      const filtered = prev.filter(conv => conv.id !== conversationId);
      if (conversationId === currentConversationId) {
        // If deleting current conversation, switch to the first available one
        const nextConversation = filtered[0];
        setCurrentConversationId(nextConversation?.id || null);
      }
      return filtered;
    });
  }, [currentConversationId]);

  const updateConversationTitle = useCallback((conversationId: string, title: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, title, updatedAt: new Date().toISOString() } : conv
    ));
  }, []);

  const handleSend = useCallback(async () => {
    if (input.trim() === '' || isLoading || !currentConversation) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };

    const updatedMessages = [...currentConversation.messages, userMessage];
    const updatedConversation = {
      ...currentConversation,
      messages: updatedMessages,
      updatedAt: new Date().toISOString(),
      title: currentConversation.title === 'Cuộc trò chuyện mới' && currentConversation.messages.length === 1
        ? input.length > 50 ? input.substring(0, 50) + '...' : input
        : currentConversation.title
    };

    setConversations(prev => prev.map(conv =>
      conv.id === currentConversationId ? updatedConversation : conv
    ));

    setInput('');
    setIsLoading(true);

    // Simulate API delay and return mock response
    setTimeout(() => {
      const MOCK_CHATBOT_RESPONSES = [
        "Xin chào! 👋 Tôi là trợ lý AI của AI Fresh. Tôi có thể giúp bạn về dinh dưỡng, công thức nấu ăn, và sử dụng ứng dụng này. Bạn cần gì không?",
        "Đó là một câu hỏi tuyệt vời! 🤔 Bạn nên ăn nhiều rau xanh, protein và hạn chế đường. Tôi có thể gợi ý món ăn nếu bạn muốn.",
        "Tôi hiểu rồi! 💡 Hãy kiểm tra các sản phẩm tươi mới trong phần 'Mua sắm' của ứng dụng. Chúng tôi có những lựa chọn tốt nhất cho bạn.",
        "Bạn có thể xem lịch sử đơn hàng của mình trong tab 'Đơn hàng'. Tất cả các đơn hàng đều được lưu lại để tiện theo dõi.",
        "Tuyệt vời! 🎉 Nếu bạn cần bất kỳ trợ giúp nào khác, hãy cứ hỏi tôi. Tôi luôn ở đây để hỗ trợ bạn!",
      ];
      
      const randomIndex = Math.floor(Math.random() * MOCK_CHATBOT_RESPONSES.length);
      const botResponse = MOCK_CHATBOT_RESPONSES[randomIndex];
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
      };
      
      const finalMessages = [...updatedMessages, botMessage];
      const finalConversation = {
        ...updatedConversation,
        messages: finalMessages,
        updatedAt: new Date().toISOString(),
      };

      setConversations(prev => prev.map(conv =>
        conv.id === currentConversationId ? finalConversation : conv
      ));
      
      setIsLoading(false);
    }, 800);
  }, [input, isLoading, currentConversation, currentConversationId]);

  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  return {
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
    user,
  };
};