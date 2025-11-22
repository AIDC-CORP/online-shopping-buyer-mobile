
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import Spinner from '../../../components/common/Spinner';
import AiMenuSuggestion from '../components/AiMenuSuggestion';
import ProductList from '../components/ProductList';
import { useShopping, ShoppingMode } from '../hooks/useShopping';
import { useProducts } from '../hooks/useProducts';

const ShoppingScreen: React.FC = () => {
  const { mode, setMode, isLoadingMode } = useShopping();
  const { 
    products, 
    isLoading, 
    isLoadingMore,
    error,
    hasMore,
    loadMore, 
    refresh, 
    search, 
    sort,
    searchTerm,
    sortBy
  } = useProducts();
  
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  const handleSearch = () => {
    search(localSearchTerm);
  };

  const handleSortChange = (sortOrder: 'increase' | 'decrease' | undefined) => {
    sort(sortOrder);
  };

  // Show loading while fetching saved mode
  if (isLoadingMode) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9fafb' }}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#f9fafb' }} 
      contentContainerStyle={{ paddingHorizontal: 0, paddingVertical: 16 }}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refresh} colors={['#10b981']} />
      }
    >
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 16, paddingHorizontal: 16 }}>Lên kế hoạch bữa ăn</Text>

      <View style={{ flexDirection: 'row', backgroundColor: '#e5e7eb', borderRadius: 8, padding: 4, marginBottom: 16, marginHorizontal: 16 }}>
        <TouchableOpacity
          onPress={() => setMode(ShoppingMode.AI)}
          style={{
            flex: 1,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 6,
            backgroundColor: mode === ShoppingMode.AI ? '#ffffff' : 'transparent',
            shadowColor: mode === ShoppingMode.AI ? '#000' : 'transparent',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: mode === ShoppingMode.AI ? 2 : 0,
          }}
        >
          <Text style={{
            textAlign: 'center',
            fontWeight: '500',
            color: mode === ShoppingMode.AI ? '#047857' : '#4b5563',
          }}>
            ✨ Gợi ý từ AI
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMode(ShoppingMode.Manual)}
          style={{
            flex: 1,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 6,
            backgroundColor: mode === ShoppingMode.Manual ? '#ffffff' : 'transparent',
            shadowColor: mode === ShoppingMode.Manual ? '#000' : 'transparent',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: mode === ShoppingMode.Manual ? 2 : 0,
          }}
        >
          <Text style={{
            textAlign: 'center',
            fontWeight: '500',
            color: mode === ShoppingMode.Manual ? '#047857' : '#4b5563',
          }}>
            🛒 Tự chọn món
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        {mode === ShoppingMode.AI && <AiMenuSuggestion />}
        {mode === ShoppingMode.Manual && (
          <View>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              <TextInput
                value={localSearchTerm}
                onChangeText={setLocalSearchTerm}
                onSubmitEditing={handleSearch}
                placeholder="Tìm kiếm sản phẩm..."
                placeholderTextColor="#9ca3af"
                style={{
                  flex: 1,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  backgroundColor: '#ffffff',
                  fontSize: 14,
                  color: '#1f2937',
                }}
              />
              <TouchableOpacity
                onPress={handleSearch}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor: '#10b981',
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 14 }}>Tìm</Text>
              </TouchableOpacity>
            </View>

            {/* Sort filter */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              <TouchableOpacity
                onPress={() => handleSortChange(undefined)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: !sortBy ? '#10b981' : '#e5e7eb',
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: !sortBy ? '#ffffff' : '#6b7280', fontSize: 12, fontWeight: '600' }}>
                  Mặc định
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSortChange('increase')}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: sortBy === 'increase' ? '#10b981' : '#e5e7eb',
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: sortBy === 'increase' ? '#ffffff' : '#6b7280', fontSize: 12, fontWeight: '600' }}>
                  Giá tăng dần
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSortChange('decrease')}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  backgroundColor: sortBy === 'decrease' ? '#10b981' : '#e5e7eb',
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: sortBy === 'decrease' ? '#ffffff' : '#6b7280', fontSize: 12, fontWeight: '600' }}>
                  Giá giảm dần
                </Text>
              </TouchableOpacity>
            </View>

            {error && (
              <View style={{ padding: 16, backgroundColor: '#fee2e2', borderRadius: 8, marginBottom: 16 }}>
                <Text style={{ color: '#dc2626' }}>{error}</Text>
              </View>
            )}
            
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                <ProductList products={products} />
                {hasMore && (
                  <TouchableOpacity
                    onPress={loadMore}
                    disabled={isLoadingMore}
                    style={{
                      marginTop: 16,
                      paddingVertical: 12,
                      backgroundColor: isLoadingMore ? '#e5e7eb' : '#10b981',
                      borderRadius: 8,
                      alignItems: 'center',
                    }}
                  >
                    {isLoadingMore ? (
                      <ActivityIndicator color="#6b7280" />
                    ) : (
                      <Text style={{ color: '#ffffff', fontWeight: '600' }}>Xem thêm</Text>
                    )}
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ShoppingScreen;
