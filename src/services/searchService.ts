import api from './api';
import { Product } from './productService';

export interface SearchSuggestions {
  products: Array<{
    type: 'product';
    value: string;
    id: string;
  }>;
  categories: Array<{
    type: 'category';
    value: string;
    id: string;
  }>;
  brands: Array<{
    type: 'brand';
    value: string;
  }>;
}

export interface AdvancedSearchFilters {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface AdvancedSearchResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    priceRange: {
      minPrice: number;
      maxPrice: number;
    };
    brands: string[];
  };
}

export const searchService = {
  async searchProducts(query: string, limit = 10): Promise<Product[]> {
    const response = await api.get(`/search/products?q=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data;
  },

  async getSuggestions(query: string, limit = 8): Promise<SearchSuggestions> {
    const response = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data;
  },

  async advancedSearch(filters: AdvancedSearchFilters): Promise<AdvancedSearchResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/search/advanced?${params.toString()}`);
    return response.data;
  }
};