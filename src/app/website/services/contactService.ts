import { apiRequest, API_ENDPOINTS } from './api';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface NewsletterSubscriptionData {
  email: string;
  firstName?: string;
  lastName?: string;
}

export const contactService = {
  // Submit contact form
  submitContactForm: async (data: ContactFormData): Promise<{ message: string; contactId: string }> => {
    return apiRequest<{ message: string; contactId: string }>(
      API_ENDPOINTS.WEBSITE.CONTACT,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  // Subscribe to newsletter
  subscribeNewsletter: async (data: NewsletterSubscriptionData): Promise<{ message: string; subscription: any }> => {
    return apiRequest<{ message: string; subscription: any }>(
      API_ENDPOINTS.WEBSITE.NEWSLETTER_SUBSCRIBE,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },
};