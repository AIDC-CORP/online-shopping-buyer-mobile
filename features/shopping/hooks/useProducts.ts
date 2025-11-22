import { useState, useEffect, useCallback } from 'react';
import CatalogService, { Product, ProductsByStore } from '../../../services/catalog/CatalogService';

export const useProducts = () => {
  const [products, setProducts] = useState<ProductsByStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'increase' | 'decrease' | undefined>();

  const fetchProducts = useCallback(async (pageNum: number, reset: boolean = false) => {
    try {
      if (reset) {
        setIsLoading(true);
        setProducts([]);
      } else {
        setIsLoadingMore(true);
      }

      const response = await CatalogService.getAllProducts({
        page: pageNum,
        page_limit: 10,
        product_name: searchTerm || undefined,
        sort_by_price: sortBy,
      });

      if (reset) {
        setProducts(response.data);
      } else {
        setProducts((prev) => [...prev, ...response.data]);
      }

      setHasMore(pageNum < response.total_pages);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [searchTerm, sortBy]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage, false);
    }
  }, [page, isLoadingMore, hasMore, fetchProducts]);

  const refresh = useCallback(() => {
    setPage(1);
    fetchProducts(1, true);
  }, [fetchProducts]);

  const search = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(1);
  }, []);

  const sort = useCallback((sortOrder: 'increase' | 'decrease' | undefined) => {
    setSortBy(sortOrder);
    setPage(1);
  }, []);

  useEffect(() => {
    fetchProducts(1, true);
  }, [searchTerm, sortBy]);

  return {
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
    sortBy,
  };
};
