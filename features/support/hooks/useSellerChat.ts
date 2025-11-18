import { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../../../types';
import { useAppContext } from '../../../context/AppContext';

export const useSellerChat = () => {
  const { user } = useAppContext();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', text: `Chào ${user?.name}! Tôi là nhân viên hỗ trợ. Tôi có thể giúp gì cho bạn về đơn hàng hoặc sản phẩm?`, sender: 'bot' }
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

    // Simulate seller response delay
    setTimeout(() => {
      const sellerResponses = [
        'Cảm ơn bạn đã liên hệ. Tôi sẽ kiểm tra đơn hàng của bạn ngay.',
        'Sản phẩm này hiện đang có sẵn. Bạn muốn đặt hàng với số lượng bao nhiêu?',
        'Chúng tôi có chương trình khuyến mãi đặc biệt cho sản phẩm này. Bạn có muốn biết thêm chi tiết không?',
        'Đơn hàng của bạn đang được xử lý. Thời gian giao hàng dự kiến là 2-3 ngày.',
        'Xin lỗi về sự bất tiện này. Chúng tôi sẽ xử lý vấn đề của bạn trong vòng 24 giờ.',
      ];

      const randomResponse = sellerResponses[Math.floor(Math.random() * sellerResponses.length)];

      const sellerMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'bot',
      };
      setMessages(prev => [...prev, sellerMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
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