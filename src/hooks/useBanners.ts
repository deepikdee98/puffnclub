import { useState, useEffect, useCallback } from 'react';
import { bannerAPI } from '@/lib/api';
import { toast } from 'react-toastify';

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  targetUrl?: string;
  image: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface BannerFormData {
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  targetUrl?: string;
  isActive: boolean;
  image?: File;
}

export interface UseBannersReturn {
  banners: Banner[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  } | null;
  
  // Actions
  fetchBanners: (params?: { status?: 'active' | 'inactive'; limit?: number; page?: number }) => Promise<void>;
  createBanner: (data: BannerFormData, onProgress?: (progress: number) => void) => Promise<Banner | null>;
  updateBanner: (id: string, data: BannerFormData, onProgress?: (progress: number) => void) => Promise<Banner | null>;
  deleteBanner: (id: string) => Promise<boolean>;
  toggleBannerStatus: (id: string) => Promise<boolean>;
  moveBanner: (id: string, direction: 'up' | 'down') => Promise<boolean>;
  reorderBanners: (banners: { id: string; order: number }[]) => Promise<boolean>;
}

export const useBanners = (): UseBannersReturn => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  } | null>(null);

  const fetchBanners = useCallback(async (params?: { 
    status?: 'active' | 'inactive'; 
    limit?: number; 
    page?: number 
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bannerAPI.getBanners(params) as unknown as {
        success?: boolean;
        data?: Banner[];
        pagination?: any;
        message?: string;
      } | Banner[];

      if (Array.isArray(response)) {
        setBanners(response);
        setPagination(null);
      } else if (response && (response as any).success) {
        setBanners(response.data || []);
        setPagination(response.pagination || null);
      } else {
        throw new Error((response as any)?.message || 'Failed to fetch banners');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch banners';
      setError(errorMessage);
      console.error('Fetch banners error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBanner = useCallback(async (
    data: BannerFormData, 
    onProgress?: (progress: number) => void
  ): Promise<Banner | null> => {
    try {
      setLoading(true);
      setError(null);

      // Create FormData
      const formData = new FormData();
      formData.append('title', data.title);
      if (data.subtitle) formData.append('subtitle', data.subtitle);
      if (data.buttonText) formData.append('buttonText', data.buttonText);
      if (data.buttonLink) formData.append('buttonLink', data.buttonLink);
      if (data.targetUrl) formData.append('targetUrl', data.targetUrl);
      formData.append('isActive', data.isActive.toString());
      
      if (data.image) {
        formData.append('image', data.image);
      }

      const response = await bannerAPI.createBanner(formData, onProgress) as unknown as {
        success?: boolean;
        data: Banner;
        message?: string;
      };
      
      if (response.success) {
        const newBanner = response.data;
        setBanners(prev => [...prev, newBanner]);
        toast.success(response.message || 'Banner created successfully!');
        return newBanner;
      } else {
        throw new Error(response.message || 'Failed to create banner');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create banner';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Create banner error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBanner = useCallback(async (
    id: string,
    data: BannerFormData,
    onProgress?: (progress: number) => void
  ): Promise<Banner | null> => {
    try {
      setLoading(true);
      setError(null);

      // Create FormData
      const formData = new FormData();
      formData.append('title', data.title);
      if (data.subtitle) formData.append('subtitle', data.subtitle);
      if (data.buttonText) formData.append('buttonText', data.buttonText);
      if (data.buttonLink) formData.append('buttonLink', data.buttonLink);
      if (data.targetUrl) formData.append('targetUrl', data.targetUrl);
      formData.append('isActive', data.isActive.toString());
      
      if (data.image) {
        formData.append('image', data.image);
      }

      const response = await bannerAPI.updateBanner(id, formData, onProgress) as unknown as {
        success?: boolean;
        data: Banner;
        message?: string;
      };
      
      if (response.success) {
        const updatedBanner = response.data;
        setBanners(prev => prev.map(banner => 
          banner._id === id ? updatedBanner : banner
        ));
        toast.success(response.message || 'Banner updated successfully!');
        return updatedBanner;
      } else {
        throw new Error(response.message || 'Failed to update banner');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update banner';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Update banner error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBanner = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await bannerAPI.deleteBanner(id) as unknown as {
        success?: boolean;
        message?: string;
      };
      
      if (response.success) {
        setBanners(prev => prev.filter(banner => banner._id !== id));
        toast.success(response.message || 'Banner deleted successfully!');
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete banner');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete banner';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Delete banner error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleBannerStatus = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);

      const response = await bannerAPI.toggleBannerStatus(id) as unknown as {
        success?: boolean;
        data: Banner;
        message?: string;
      };
      
      if (response.success) {
        const updatedBanner = response.data;
        setBanners(prev => prev.map(banner => 
          banner._id === id ? updatedBanner : banner
        ));
        toast.success(response.message || 'Banner status updated successfully!');
        return true;
      } else {
        throw new Error(response.message || 'Failed to toggle banner status');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to toggle banner status';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Toggle banner status error:', err);
      return false;
    }
  }, []);

  const moveBanner = useCallback(async (id: string, direction: 'up' | 'down'): Promise<boolean> => {
    try {
      setError(null);

      const response = await bannerAPI.moveBanner(id, direction) as unknown as {
        success?: boolean;
        data?: Banner[];
        message?: string;
      };
      
      if (response.success) {
        setBanners(response.data || []);
        toast.success(response.message || `Banner moved ${direction} successfully!`);
        return true;
      } else {
        throw new Error(response.message || `Failed to move banner ${direction}`);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || `Failed to move banner ${direction}`;
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Move banner error:', err);
      return false;
    }
  }, []);

  const reorderBanners = useCallback(async (bannerOrders: { id: string; order: number }[]): Promise<boolean> => {
    try {
      setError(null);

      const response = await bannerAPI.reorderBanners(bannerOrders) as unknown as {
        success?: boolean;
        data?: Banner[];
        message?: string;
      };
      
      if (response.success) {
        setBanners(response.data || []);
        toast.success(response.message || 'Banners reordered successfully!');
        return true;
      } else {
        throw new Error(response.message || 'Failed to reorder banners');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to reorder banners';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Reorder banners error:', err);
      return false;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  return {
    banners,
    loading,
    error,
    pagination,
    fetchBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    moveBanner,
    reorderBanners,
  };
};