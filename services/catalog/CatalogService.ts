/**
 * Catalog Service - Buyer App
 * Handles product/catalog operations
 */

import { httpClient } from '../auth/config';

const CATALOG_BASE_URL = process.env.EXPO_PUBLIC_CATALOG_URL || 'http://192.168.1.4:8115';
const API_PREFIX = '/api/v1/online-shopping/public';

export type ProductCategory = 
  | 'RAU_CU_QUA'
  | 'THIT_CA_TRUNG'
  | 'THUC_PHAM_CHE_BIEN'
  | 'DO_UONG'
  | 'GIA_VI_DAU_AN'
  | 'DO_KHO'
  | 'DO_DONG_LANH'
  | 'TRAI_CAY'
  | 'BANH_KEO'
  | 'DO_AN_NHANH'
  | 'OTHER';

export type ProductUnit = 
  | 'KG'
  | 'GRAM'
  | 'TUI'
  | 'BO'
  | 'HOP'
  | 'CHAI'
  | 'LON'
  | 'GOI'
  | 'THUNG'
  | 'CAI'
  | 'KHAY'
  | 'LIT';

export type ProductStatus = 
  | 'IN_STOCK'
  | 'OUT_OF_STOCK'
  | 'LOW_STOCK'
  | 'DISCONTINUED';

export interface Product {
  id: string;
  store_id: string;
  product_name: string;
  description?: string;
  price: number;
  quantity: number;
  category: string;
  image_urls?: string[];
  unit: string;
  status: string;
  import_date?: string;
  expiration_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductsByStore {
  store_id: string;
  store_name?: string;
  products: Product[];
  total_products: number;
}

export interface PaginatedProductsResponse {
  data: ProductsByStore[];
  total_stores: number;
  page: number;
  page_limit: number;
  total_pages: number;
}

export interface PaginatedProductsByStoreResponse {
  data: Product[];
  total: number;
  page: number;
  page_limit: number;
  total_pages: number;
}

class CatalogService {
  private static instance: CatalogService;

  private constructor() {}

  static getInstance(): CatalogService {
    if (!CatalogService.instance) {
      CatalogService.instance = new CatalogService();
    }
    return CatalogService.instance;
  }

  /**
   * Get all products from all stores with pagination, search, and sort
   */
  async getAllProducts(params: {
    page?: number;
    page_limit?: number;
    product_name?: string;
    sort_by_price?: 'increase' | 'decrease';
  } = {}): Promise<PaginatedProductsResponse> {
    try {
      const { page = 1, page_limit = 10, product_name, sort_by_price } = params;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        page_limit: page_limit.toString(),
      });

      if (product_name) {
        queryParams.append('product_name', product_name);
      }

      if (sort_by_price) {
        queryParams.append('sort_by_price', sort_by_price);
      }

      console.log('[CatalogService] Getting all products with params:', queryParams.toString());
      const response = await httpClient.get(
        `${CATALOG_BASE_URL}${API_PREFIX}/catalog/products?${queryParams.toString()}`
      );
      console.log('[CatalogService] Raw response:', response.data);
      
      // Transform backend response: { stores: { [store_id]: Product[] } } 
      // to frontend format: { data: ProductsByStore[] }
      const backendData = response.data;
      const storesData: ProductsByStore[] = [];
      
      if (backendData.stores) {
        Object.entries(backendData.stores).forEach(([storeId, products]: [string, any]) => {
          storesData.push({
            store_id: storeId,
            products: Array.isArray(products) ? products : [],
            total_products: Array.isArray(products) ? products.length : 0,
          });
        });
      }
      
      const transformedData: PaginatedProductsResponse = {
        data: storesData,
        total_stores: storesData.length,
        page: backendData.page || page,
        page_limit: backendData.page_limit || page_limit,
        total_pages: backendData.total_pages || 1,
      };
      
      console.log('[CatalogService] Transformed data:', transformedData);
      return transformedData;
    } catch (error: any) {
      console.error('[CatalogService] Failed to get all products:', error);
      throw new Error(error.response?.data?.detail || 'Failed to get products');
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(productId: string): Promise<Product> {
    try {
      console.log('[CatalogService] Getting product by ID:', productId);
      const response = await httpClient.get(
        `${CATALOG_BASE_URL}${API_PREFIX}/catalog/product/${productId}`
      );
      console.log('[CatalogService] Product found:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[CatalogService] Failed to get product by ID:', error);
      if (error.response?.status === 404) {
        throw new Error('Product not found');
      }
      throw new Error(error.response?.data?.detail || 'Failed to get product');
    }
  }

  /**
   * Get products by store ID with pagination
   */
  async getProductsByStoreId(
    storeId: string,
    params: {
      page?: number;
      page_limit?: number;
    } = {}
  ): Promise<PaginatedProductsByStoreResponse> {
    try {
      const { page = 1, page_limit = 10 } = params;
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        page_limit: page_limit.toString(),
      });

      console.log('[CatalogService] Getting products by store ID:', storeId);
      const response = await httpClient.get(
        `${CATALOG_BASE_URL}${API_PREFIX}/catalog/products/${storeId}?${queryParams.toString()}`
      );
      console.log('[CatalogService] Store products found:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('[CatalogService] Failed to get products by store ID:', error);
      throw new Error(error.response?.data?.detail || 'Failed to get store products');
    }
  }

  /**
   * Search products by name
   */
  async searchProducts(
    searchTerm: string,
    params: {
      page?: number;
      page_limit?: number;
      sort_by_price?: 'increase' | 'decrease';
    } = {}
  ): Promise<PaginatedProductsResponse> {
    return this.getAllProducts({
      ...params,
      product_name: searchTerm,
    });
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(
    category: ProductCategory,
    params: {
      page?: number;
      page_limit?: number;
      sort_by_price?: 'increase' | 'decrease';
    } = {}
  ): Promise<Product[]> {
    try {
      const response = await this.getAllProducts(params);
      
      // Filter products by category from all stores
      const filteredProducts: Product[] = [];
      response.data.forEach((storeData) => {
        const categoryProducts = storeData.products.filter(
          (product) => product.category === category
        );
        filteredProducts.push(...categoryProducts);
      });

      return filteredProducts;
    } catch (error: any) {
      console.error('[CatalogService] Failed to get products by category:', error);
      throw new Error('Failed to get products by category');
    }
  }
}

export default CatalogService.getInstance();
