import { apiRequest, API_ENDPOINTS } from './api';

export interface ExchangeRequestData {
  productId: string;
  size: string;
  color: string;
  reason?: string;
}

export interface ReturnRequestData {
  productId: string;
  reason?: string;
  refundMethod?: 'original_payment' | 'store_credit' | 'wallet';
}

export interface ExchangeReturnRequest {
  _id: string;
  requestNumber: string;
  order: string;
  customer: string;
  product: any;
  orderItem: {
    productId: string;
    productName: string;
    quantity: number;
    size?: string;
    color?: string;
    price: number;
  };
  type: 'exchange' | 'return';
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'cancelled';
  exchangeDetails?: {
    requestedSize: string;
    requestedColor: string;
    reason: string;
  };
  returnDetails?: {
    reason: string;
    refundMethod: string;
  };
  reason?: string;
  refundAmount?: number;
  refundStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExchangeReturnResponse {
  success: boolean;
  message: string;
  request: ExchangeReturnRequest;
}

export interface ExchangeReturnListResponse {
  success: boolean;
  requests: ExchangeReturnRequest[];
}

export const exchangeReturnService = {
  /**
   * Submit exchange request
   * @param orderId - Order ID
   * @param data - Exchange request data
   */
  submitExchange: async (
    orderId: string,
    data: ExchangeRequestData
  ): Promise<ExchangeReturnResponse> => {
    return apiRequest<ExchangeReturnResponse>(
      API_ENDPOINTS.WEBSITE.EXCHANGE_RETURNS.EXCHANGE(orderId),
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Submit return request
   * @param orderId - Order ID
   * @param data - Return request data
   */
  submitReturn: async (
    orderId: string,
    data: ReturnRequestData
  ): Promise<ExchangeReturnResponse> => {
    return apiRequest<ExchangeReturnResponse>(
      API_ENDPOINTS.WEBSITE.EXCHANGE_RETURNS.RETURN(orderId),
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Get customer's exchange/return requests
   * @param filters - Optional filters (type, status)
   */
  getRequests: async (filters?: {
    type?: 'exchange' | 'return';
    status?: string;
  }): Promise<ExchangeReturnListResponse> => {
    const queryParams = new URLSearchParams();
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.status) queryParams.append('status', filters.status);

    const url = `${API_ENDPOINTS.WEBSITE.EXCHANGE_RETURNS.LIST}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiRequest<ExchangeReturnListResponse>(url);
  },

  /**
   * Get single exchange/return request
   * @param requestId - Request ID
   */
  getRequestById: async (requestId: string): Promise<{ success: boolean; request: ExchangeReturnRequest }> => {
    return apiRequest<{ success: boolean; request: ExchangeReturnRequest }>(
      API_ENDPOINTS.WEBSITE.EXCHANGE_RETURNS.GET_BY_ID(requestId)
    );
  },

  /**
   * Cancel exchange/return request
   * @param requestId - Request ID
   */
  cancelRequest: async (requestId: string): Promise<{ message: string; request: ExchangeReturnRequest }> => {
    return apiRequest<{ message: string; request: ExchangeReturnRequest }>(
      API_ENDPOINTS.WEBSITE.EXCHANGE_RETURNS.CANCEL(requestId),
      {
        method: 'PUT',
      }
    );
  },
};

