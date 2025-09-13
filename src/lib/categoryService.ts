import { apiClient } from './api';
import { toast } from 'react-toastify';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: {
    _id: string;
    name: string;
    slug: string;
  };
  isActive: boolean;
  sortOrder: number;
  count?: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  parentCategory?: string;
  isActive?: boolean;
  sortOrder?: number;
  metaTitle?: string;
  metaDescription?: string;
  image?: File;
}

class CategoryService {
  private baseURL = '/categories';

  // Get all categories
  async getCategories(): Promise<Category[]> {
    try {
      const data = await apiClient.get<Category[]>(this.baseURL);
      // Normalize to array to avoid runtime errors when API returns unexpected shape
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to fetch categories');
      throw error;
    }
  }

  // Get category by ID
  async getCategoryById(id: string): Promise<Category> {
    try {
      const data = await apiClient.get<Category>(`${this.baseURL}/${id}`);
      return data;
    } catch (error: any) {
      console.error('Failed to fetch category:', error);
      toast.error('Failed to fetch category');
      throw error;
    }
  }

  // Get category by slug
  async getCategoryBySlug(slug: string): Promise<Category> {
    try {
      const data = await apiClient.get<Category>(`${this.baseURL}/slug/${slug}`);
      return data;
    } catch (error: any) {
      console.error('Failed to fetch category:', error);
      toast.error('Failed to fetch category');
      throw error;
    }
  }

  // Get categories for dropdown (active only)
  async getCategoriesForDropdown(): Promise<Pick<Category, '_id' | 'name' | 'slug'>[]> {
    try {
      const data = await apiClient.get<Pick<Category, '_id' | 'name' | 'slug'>[]>(`${this.baseURL}/dropdown`);
      // Normalize to array
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      console.error('Failed to fetch categories for dropdown:', error);
      return [];
    }
  }

  // Create new category
  async createCategory(data: CategoryFormData): Promise<Category> {
    try {
      const formData = new FormData();
      
      // Append text fields
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (data.parentCategory) formData.append('parentCategory', data.parentCategory);
      if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
      if (data.sortOrder !== undefined) formData.append('sortOrder', data.sortOrder.toString());
      if (data.metaTitle) formData.append('metaTitle', data.metaTitle);
      if (data.metaDescription) formData.append('metaDescription', data.metaDescription);
      
      // Append image file if provided
      if (data.image) {
        formData.append('image', data.image);
      }

      const created = await apiClient.upload<Category>(this.baseURL, formData);

      toast.success('Category created successfully');
      return created;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to create category';
      console.error('Failed to create category:', error);
      toast.error(errorMessage);
      throw error;
    }
  }

  // Update category
  async updateCategory(id: string, data: CategoryFormData): Promise<Category> {
    try {
      const formData = new FormData();
      
      // Append text fields
      formData.append('name', data.name);
      if (data.description !== undefined) formData.append('description', data.description);
      if (data.parentCategory !== undefined) formData.append('parentCategory', data.parentCategory || '');
      if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
      if (data.sortOrder !== undefined) formData.append('sortOrder', data.sortOrder.toString());
      if (data.metaTitle !== undefined) formData.append('metaTitle', data.metaTitle);
      if (data.metaDescription !== undefined) formData.append('metaDescription', data.metaDescription);
      
      // Append image file if provided
      if (data.image) {
        formData.append('image', data.image);
      }

      const updated = await apiClient.uploadPut<Category>(`${this.baseURL}/${id}`, formData);

      toast.success('Category updated successfully');
      return updated;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update category';
      console.error('Failed to update category:', error);
      toast.error(errorMessage);
      throw error;
    }
  }

  // Delete category
  async deleteCategory(id: string): Promise<void> {
    try {
      await apiClient.delete<void>(`${this.baseURL}/${id}`);
      toast.success('Category deleted successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to delete category';
      console.error('Failed to delete category:', error);
      toast.error(errorMessage);
      throw error;
    }
  }
}

export const categoryService = new CategoryService();