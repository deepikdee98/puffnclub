import { apiRequest, API_ENDPOINTS } from './api';

export interface ShippingRateItem {
  productId: string;
  quantity: number;
  price: number;
  weight?: number;
}

export interface ShippingRatesRequest {
  deliveryPincode: string;
  items: ShippingRateItem[];
  pickupPincode?: string;
}

export interface ShippingOption {
  courierId: number;
  courierName: string;
  rate: number;
  estimatedDeliveryDays: number;
  description: string;
  codAvailable: boolean;
  pickupAvailable: boolean;
  deliveryBoyContact?: string;
  trackingAvailable: boolean;
  weightCases?: any;
}

export interface ShippingRatesResponse {
  success: boolean;
  shippingOptions: ShippingOption[];
  serviceability: {
    available: boolean;
    pickupPincode: string;
    deliveryPincode: string;
    totalWeight: number;
    totalValue: number;
  };
}

export interface ServiceabilityResponse {
  success: boolean;
  serviceable: boolean;
  data: any;
  message?: string;
}

export const shippingService = {
  /**
   * Get shipping rates for a delivery pincode
   * @param data - Shipping rates request data
   * @returns Shipping rates response with available courier options
   */
  getShippingRates: async (data: ShippingRatesRequest): Promise<ShippingRatesResponse> => {
    return apiRequest<ShippingRatesResponse>(
      API_ENDPOINTS.WEBSITE.SHIPPING.GET_RATES,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Check serviceability for a pincode
   * @param pincode - Delivery pincode to check
   * @param pickupPincode - Optional pickup pincode (defaults to store pincode)
   * @param weight - Optional weight in kg (defaults to 1)
   * @returns Serviceability response
   */
  checkServiceability: async (
    pincode: string,
    pickupPincode?: string,
    weight: number = 1
  ): Promise<ServiceabilityResponse> => {
    const url = API_ENDPOINTS.WEBSITE.SHIPPING.CHECK_SERVICEABILITY(pincode);
    const queryParams = new URLSearchParams();
    
    if (pickupPincode) {
      queryParams.append('pickupPincode', pickupPincode);
    }
    if (weight !== 1) {
      queryParams.append('weight', weight.toString());
    }
    
    const fullUrl = queryParams.toString() ? `${url}?${queryParams.toString()}` : url;
    return apiRequest<ServiceabilityResponse>(fullUrl);
  },
};

