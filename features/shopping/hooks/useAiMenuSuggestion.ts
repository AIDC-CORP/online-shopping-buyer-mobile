
import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAppContext } from '../../../context/AppContext';
import { generateMealPlan } from '../../../services/geminiService';
import { MOCK_PRODUCTS } from '../../../services/api/mockApiService';
import { Product } from '../../../types';
import { Meal } from '../index';

export const useAiMenuSuggestion = () => {
  const { user, addToCart } = useAppContext();
  const [mealPlan, setMealPlan] = useState<{ meals: Meal[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<Record<number, number[]>>({});
  const [isSelectionExpanded, setIsSelectionExpanded] = useState(false);

  const fetchMealPlan = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const plan = await generateMealPlan(user);
      setMealPlan(plan);
      const defaultSelected: Record<number, number[]> = {};
      plan.meals.forEach((meal: Meal, index: number) => {
        defaultSelected[index] = user.familyMembers.map((_, idx: number) => idx);
      });
      setSelectedMembers(defaultSelected);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi không xác định.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const toggleMember = (mealIndex: number, memberId: number) => {
    setSelectedMembers(prev => {
      const current = prev[mealIndex] || [];
      if (current.includes(memberId)) {
        return { ...prev, [mealIndex]: current.filter(id => id !== memberId) };
      } else {
        return { ...prev, [mealIndex]: [...current, memberId] };
      }
    });
  };

  useEffect(() => {
    fetchMealPlan();
  }, [fetchMealPlan]);

  const handleAddAllToCart = () => {
    if (!mealPlan) return;

    const ingredientCounts: Record<string, number> = {};
    mealPlan.meals.forEach((meal, index) => {
      const selectedCount = selectedMembers[index]?.length || 0;
      if (selectedCount > 0) {
        meal.ingredients.forEach(ing => {
          ingredientCounts[ing] = (ingredientCounts[ing] || 0) + selectedCount;
        });
      }
    });

    Object.entries(ingredientCounts).forEach(([ingredientName, count]) => {
      const productToAdd = MOCK_PRODUCTS.find((p: Product) => p.name.toLowerCase().includes(ingredientName.toLowerCase()));
      if (productToAdd) {
        addToCart(productToAdd, count);
      }
    });
    Alert.alert('Thành công', 'Đã thêm các nguyên liệu gợi ý vào giỏ hàng!');
  };

  return {
    user,
    mealPlan,
    isLoading,
    error,
    selectedMembers,
    isSelectionExpanded,
    setIsSelectionExpanded,
    fetchMealPlan,
    toggleMember,
    handleAddAllToCart,
  };
};
