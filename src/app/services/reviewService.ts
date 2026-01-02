import { apiRequest } from './api';

export interface Review {
  _id: string;
  rating: number;
  title: string;
  comment: string;
  reviewer: string;
  customerId?: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  date: string;
  createdAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReviews: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ReviewStatsResponse {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedPurchases: number;
}

export interface SubmitReviewData {
  rating: number;
  title: string;
  comment: string;
}

export interface SubmitReviewResponse {
  message: string;
  review: Review;
}

export const reviewService = {
  /**
   * Get reviews for a specific product
   * @param productId - The product ID
   * @param page - Page number (default: 1)
   * @param limit - Number of reviews per page (default: 10)
   * @param sortBy - Sort field (default: 'createdAt')
   * @param sortOrder - Sort order 'asc' or 'desc' (default: 'desc')
   */
  getProductReviews: async (
    productId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<ReviewsResponse> => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });

    const url = `/api/website/products/${productId}/reviews?${queryParams.toString()}`;
    return apiRequest<ReviewsResponse>(url);
  },

  /**
   * Get review statistics for a product
   * @param productId - The product ID
   */
  getProductReviewStats: async (productId: string): Promise<ReviewStatsResponse> => {
    const url = `/api/website/products/${productId}/reviews/stats`;
    return apiRequest<ReviewStatsResponse>(url);
  },

  /**
   * Submit a review for a product (requires authentication)
   * @param productId - The product ID
   * @param data - Review data (rating, title, comment)
   * @param token - Customer authentication token
   */
  submitReview: async (
    productId: string,
    data: SubmitReviewData,
    token: string
  ): Promise<SubmitReviewResponse> => {
    const url = `/api/website/products/${productId}/reviews`;
    
    return apiRequest<SubmitReviewResponse>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },
};