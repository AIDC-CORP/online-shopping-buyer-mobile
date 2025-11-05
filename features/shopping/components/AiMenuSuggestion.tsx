
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAppContext } from '../../../context/AppContext';
import { generateMealPlan } from '../../../services/geminiService';
import Spinner from '../../../components/common/Spinner';
import { MOCK_PRODUCTS } from '../../../services/api/mockApiService';
import { Product } from '../../../types';
import { Meal } from '../index';

const AiMenuSuggestion: React.FC = () => {
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
  }

  if (isLoading) {
    return (
      <View style={{ alignItems: 'center', paddingHorizontal: 32, paddingVertical: 32, backgroundColor: '#ffffff', borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
        <Spinner size="large"/>
        <Text style={{ marginTop: 16, color: '#6b7280' }}>Đang tạo thực đơn cho riêng bạn...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ alignItems: 'center', paddingHorizontal: 32, paddingVertical: 32, backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca', borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
        <Text style={{ color: '#b91c1c', fontWeight: '600' }}>Ôi! Đã có lỗi xảy ra.</Text>
        <Text style={{ color: '#dc2626', marginTop: 8, textAlign: 'center' }}>{error}</Text>
        <TouchableOpacity
          onPress={fetchMealPlan}
          style={{ marginTop: 16, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#059669', borderRadius: 8 }}
        >
          <Text style={{ color: '#ffffff', fontWeight: '600' }}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!mealPlan || !user) {
    return null;
  }

  return (
    <ScrollView>
      <View style={{ paddingHorizontal: 24, paddingVertical: 24, backgroundColor: '#ffffff', borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#1f2937' }}>Thực đơn hàng ngày từ AI</Text>
        <TouchableOpacity
          onPress={() => setIsSelectionExpanded(!isSelectionExpanded)}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingVertical: 8 }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#1f2937' }}>Chọn người tham gia cho từng bữa</Text>
          <Text style={{ fontSize: 18, marginLeft: 8, color: '#059669' }}>{isSelectionExpanded ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {isSelectionExpanded && (
          <View style={{ marginBottom: 24 }}>
            {mealPlan.meals.map((meal, index) => (
              <View key={`select-${index}`} style={{ marginBottom: 16, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#059669', marginBottom: 8 }}>
                  {meal.name}
                </Text>
                <View>
                  {user.familyMembers.map((member, idx) => (
                    <TouchableOpacity key={idx} onPress={() => toggleMember(index, idx)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={{ color: selectedMembers[index]?.includes(idx) ? '#059669' : '#4b5563' }}>
                        {selectedMembers[index]?.includes(idx) ? '✓ ' : '○ '} {member.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
        <TouchableOpacity
          onPress={fetchMealPlan}
          style={{ marginBottom: 24, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, backgroundColor: '#3b82f6', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}
        >
          <Text style={{ fontSize: 16, fontWeight: '500', color: '#ffffff', textAlign: 'center' }}>AI đề xuất</Text>
        </TouchableOpacity>
        {mealPlan.meals.map((meal, index) => (
          <View key={index} style={{ paddingHorizontal: 16, paddingVertical: 16, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, marginBottom: 16 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#059669', marginBottom: 4 }}>
              {meal.name}: <Text style={{ fontWeight: '600', color: '#4b5563' }}>{meal.dish}</Text>
            </Text>
            <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>Nguyên liệu:</Text>
            <View style={{ paddingLeft: 16 }}>
              {meal.ingredients.map((ing, i) => (
                <Text key={i} style={{ color: '#4b5563', marginBottom: 2 }}>• {ing}</Text>
              ))}
            </View>
          </View>
        ))}
         <TouchableOpacity
            onPress={handleAddAllToCart}
            style={{ marginTop: 24, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, backgroundColor: '#059669', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}
        >
            <Text style={{ fontSize: 16, fontWeight: '500', color: '#ffffff', textAlign: 'center' }}>Thêm tất cả vào giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AiMenuSuggestion;
