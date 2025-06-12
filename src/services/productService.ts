import api from './api';

export interface Product {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  currentPrice: number;
  dynamicPrice?: number;
  stock: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  image: string;
  imageType: 'upload' | 'url';
  brand?: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  visitCount: number;
  userVisits?: number;
  priceAdjustment?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  inStock?: boolean;
  featured?: boolean;
  sort?: 'name' | 'price-low' | 'price-high' | 'newest' | 'rating';
}

export const productService = {
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  async getProduct(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const response = await api.get('/products/featured/list');
    return response.data;
  },

  async createProduct(productData: FormData): Promise<Product> {
    const response = await api.post('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.product;
  },

  async updateProduct(id: string, productData: FormData): Promise<Product> {
    const response = await api.put(`/products/${id}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.product;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  }
};