import { apiRequest, API_ENDPOINTS } from './api';

export interface BackendAddress {
  _id?: string;
  type?: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export const addressService = {
  list: async (): Promise<{ addresses: BackendAddress[] }> => {
    return apiRequest(API_ENDPOINTS.WEBSITE.ADDRESSES.LIST);
  },
  add: async (address: BackendAddress): Promise<{ message: string; customer: any }> => {
    return apiRequest(API_ENDPOINTS.WEBSITE.ADDRESSES.ADD, {
      method: 'POST',
      body: JSON.stringify(address),
    });
  },
  update: async (addressId: string, address: Partial<BackendAddress>): Promise<{ message: string; customer: any }> => {
    return apiRequest(API_ENDPOINTS.WEBSITE.ADDRESSES.UPDATE(addressId), {
      method: 'PUT',
      body: JSON.stringify(address),
    });
  },
  remove: async (addressId: string): Promise<{ message: string; customer: any }> => {
    return apiRequest(API_ENDPOINTS.WEBSITE.ADDRESSES.DELETE(addressId), {
      method: 'DELETE',
    });
  },
  setDefault: async (addressId: string): Promise<{ message: string; customer: any }> => {
    return apiRequest(API_ENDPOINTS.WEBSITE.ADDRESSES.SET_DEFAULT(addressId), {
      method: 'PATCH',
    });
  },
};