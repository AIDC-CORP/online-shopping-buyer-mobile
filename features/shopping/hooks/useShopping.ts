import { useState, useEffect, useCallback } from 'react';
import { Product } from '../../../types';
import { fetchProducts } from '../../../services/api/mockApiService';

export enum ShoppingMode {
  AI,
  Manual,
}

export const useShopping = () => {
  const [mode, setMode] = useState<ShoppingMode>(ShoppingMode.AI);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
    if (mode === ShoppingMode.Manual) {
      loadProducts(searchTerm);
    }
  }, [mode]);

  const handleSearch = () => {
    loadProducts(searchTerm);
  };

  return {
    mode,
    setMode,
    products,
    isLoading,
    searchTerm,
    setSearchTerm,
    loadProducts,
    handleSearch,
  };
};