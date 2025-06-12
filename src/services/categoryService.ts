import api from './api';

export interface Category {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data;
  },

  async getCategory(id: string): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  async getCategoryProducts(id: string, page = 1, limit = 12) {
    const response = await api.get(`/categories/${id}/products?page=${page}&limit=${limit}`);
    return response.data;
  },

  async createCategory(categoryData: { name: string; description?: string }): Promise<Category> {
    const response = await api.post('/categories', categoryData);
    return response.data.category;
  },

  async updateCategory(id: string, categoryData: { name?: string; description?: string }): Promise<Category> {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data.category;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  }
};