import { apiRequest, API_ENDPOINTS } from './api';

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface FAQCategory {
  category: string;
  questions: FAQ[];
}

export interface FAQResponse {
  success: boolean;
  faqs: FAQ[];
  categories: FAQCategory[];
  message?: string;
}

class FAQService {
  /**
   * Get all FAQs
   */
  async getFAQs(): Promise<FAQResponse> {
    try {
      const response = await apiRequest<FAQResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/website/faqs`,
        {
          method: 'GET',
        }
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch FAQs');
    }
  }

  /**
   * Get FAQs by category
   */
  async getFAQsByCategory(category: string): Promise<FAQResponse> {
    try {
      const response = await apiRequest<FAQResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/website/faqs?category=${encodeURIComponent(category)}`,
        {
          method: 'GET',
        }
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch FAQs');
    }
  }

  /**
   * Search FAQs
   */
  async searchFAQs(query: string): Promise<FAQResponse> {
    try {
      const response = await apiRequest<FAQResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/website/faqs/search?q=${encodeURIComponent(query)}`,
        {
          method: 'GET',
        }
      );
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to search FAQs');
    }
  }

  /**
   * Group FAQs by category
   */
  groupFAQsByCategory(faqs: FAQ[]): FAQCategory[] {
    const grouped = faqs.reduce((acc: { [key: string]: FAQ[] }, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push(faq);
      return acc;
    }, {});

    return Object.keys(grouped).map(category => ({
      category,
      questions: grouped[category].sort((a, b) => a.order - b.order)
    }));
  }
}

export const faqService = new FAQService();