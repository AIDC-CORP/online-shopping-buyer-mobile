import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../../../types';
import { fetchProducts } from '../../../services/api/mockApiService';

export enum ShoppingMode {
  AI,
  Manual,
}

const SHOPPING_MODE_KEY = '@shopping_mode';

export const useShopping = () => {
  const [mode, setMode] = useState<ShoppingMode>(ShoppingMode.AI);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingMode, setIsLoadingMode] = useState(true);

  // Load saved mode on mount
  useEffect(() => {
    const loadSavedMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(SHOPPING_MODE_KEY);
        if (savedMode !== null) {
          setMode(parseInt(savedMode) as ShoppingMode);
        }
      } catch (error) {
        console.error('Failed to load shopping mode:', error);
      } finally {
        setIsLoadingMode(false);
      }
    };
    loadSavedMode();
  }, []);

  // Save mode whenever it changes
  const handleSetMode = useCallback(async (newMode: ShoppingMode) => {
    setMode(newMode);
    try {
      await AsyncStorage.setItem(SHOPPING_MODE_KEY, newMode.toString());
    } catch (error) {
      console.error('Failed to save shopping mode:', error);
    }
  }, []);

  const loadProducts = useCallback(async (currentSearchTerm: string) => {
    setIsLoading(true);
    try {
      const fetchedProducts = await fetchProducts(currentSearchTerm);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mode === ShoppingMode.Manual && !isLoadingMode) {
      loadProducts(searchTerm);
    }
  }, [mode, isLoadingMode]);

  const handleSearch = () => {
    loadProducts(searchTerm);
  };

  return {
    mode,
    setMode: handleSetMode,
    products,
    isLoading,
    searchTerm,
    setSearchTerm,
    loadProducts,
    handleSearch,
    isLoadingMode,
  };
};