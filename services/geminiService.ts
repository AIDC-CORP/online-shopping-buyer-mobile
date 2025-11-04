import { User, ChatMessage } from '../types';

// Mock data for UI development - all Gemini API calls removed
console.log("Using mock AI data for UI development");

const MOCK_MEAL_PLAN = {
  meals: [
    {
      name: "Bữa sáng",
      dish: "Cơm trắng với trứng chiên và rau muống",
      ingredients: ["Gạo trắng", "Trứng gà", "Rau muống", "Dầu ăn", "Mắm tôm"],
    },
    {
      name: "Bữa trưa",
      dish: "Canh chua cá kèo với dứa",
      ingredients: ["Cá kèo", "Dứa", "Cà chua", "Giá đỗ", "Rau ngò", "Gia vị"],
    },
    {
      name: "Bữa tối",
      dish: "Gà xào sả ớt với cơm",
      ingredients: ["Gà", "Sả", "Ớt", "Tỏi", "Hành", "Gạo", "Nước mắm"],
    },
  ],
};

const MOCK_CHATBOT_RESPONSES = [
  "Xin chào! 👋 Tôi là trợ lý AI của AI Fresh. Tôi có thể giúp bạn về dinh dưỡng, công thức nấu ăn, và sử dụng ứng dụng này. Bạn cần gì không?",
  "Đó là một câu hỏi tuyệt vời! 🤔 Bạn nên ăn nhiều rau xanh, protein và hạn chế đường. Tôi có thể gợi ý món ăn nếu bạn muốn.",
  "Tôi hiểu rồi! 💡 Hãy kiểm tra các sản phẩm tươi mới trong phần 'Mua sắm' của ứng dụng. Chúng tôi có những lựa chọn tốt nhất cho bạn.",
  "Bạn có thể xem lịch sử đơn hàng của mình trong tab 'Đơn hàng'. Tất cả các đơn hàng đều được lưu lại để tiện theo dõi.",
  "Tuyệt vời! 🎉 Nếu bạn cần bất kỳ trợ giúp nào khác, hãy cứ hỏi tôi. Tôi luôn ở đây để hỗ trợ bạn!",
];

export const generateMealPlan = async (user: User): Promise<any> => {
  // Simulate API delay for more realistic UI behavior
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_MEAL_PLAN;
};

export const getChatbotResponse = async (history: ChatMessage[]): Promise<string> => {
  // Simulate API delay for more realistic UI behavior
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return random mock response
  const randomIndex = Math.floor(Math.random() * MOCK_CHATBOT_RESPONSES.length);
  return MOCK_CHATBOT_RESPONSES[randomIndex];
};
