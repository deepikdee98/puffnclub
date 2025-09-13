import { apiRequest, API_ENDPOINTS } from './api';

export interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  targetUrl: string;
  image: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface BannersResponse {
  banners: Banner[];
}

export const bannerService = {
  // Get all active banners
  getBanners: async (): Promise<BannersResponse> => {
    console.log('🚀 Fetching banners from API:', API_ENDPOINTS.WEBSITE.BANNERS);
    
    const response = await apiRequest<BannersResponse>(API_ENDPOINTS.WEBSITE.BANNERS);
    
    console.log('✅ API Response - Banners loaded:', {
      count: response.banners?.length || 0,
      banners: response.banners
    });
    
    return response;
  },
};