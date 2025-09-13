import api from './api';

export interface MessageSender {
  name: string;
  email: string;
  type: 'customer' | 'supplier' | 'admin' | 'system';
  userId?: string;
}

export interface Message {
  id: string;
  sender: MessageSender;
  recipient?: MessageSender;
  subject: string;
  content: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'support' | 'order' | 'product' | 'general' | 'complaint';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  replyCount: number;
  replies?: Message[];
  attachments?: Array<{
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
  }>;
  relatedOrder?: string;
  relatedProduct?: string;
  tags?: string[];
}

export interface MessageFilters {
  page?: number;
  limit?: number;
  filter?: 'all' | 'read' | 'unread';
  category?: 'all' | 'support' | 'order' | 'product' | 'general' | 'complaint';
  priority?: 'all' | 'high' | 'medium' | 'low';
  status?: 'all' | 'open' | 'in_progress' | 'resolved' | 'closed';
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface MessageResponse {
  success: boolean;
  data: {
    messages: Message[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    unreadCount: number;
  };
}

export interface MessageStats {
  success: boolean;
  data: {
    overview: {
      total: number;
      unread: number;
      high: number;
      medium: number;
      low: number;
    };
    byCategory: Array<{
      _id: string;
      count: number;
      unread: number;
    }>;
    byStatus: Array<{
      _id: string;
      count: number;
    }>;
  };
}

class MessageAPI {
  private baseUrl = '/messages';

  // Get all messages with filters
  async getMessages(filters: MessageFilters = {}): Promise<MessageResponse> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`${this.baseUrl}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  }

  // Get single message with replies
  async getMessage(id: string): Promise<{ success: boolean; data: Message }> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get message error:', error);
      throw error;
    }
  }

  // Get message statistics
  async getMessageStats(): Promise<MessageStats> {
    try {
      const response = await api.get(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error) {
      console.error('Get message stats error:', error);
      throw error;
    }
  }

  // Create new message (admin to customer)
  async createMessage(data: {
    recipientEmail: string;
    recipientName?: string;
    subject: string;
    content: string;
    category?: string;
    priority?: string;
    relatedOrder?: string;
    relatedProduct?: string;
    tags?: string;
  }): Promise<{ success: boolean; data: Message }> {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Create message error:', error);
      throw error;
    }
  }

  // Reply to a message
  async replyToMessage(id: string, content: string): Promise<{ success: boolean; data: Message }> {
    try {
      const response = await api.post(`${this.baseUrl}/${id}/reply`, { content });
      return response.data;
    } catch (error) {
      console.error('Reply to message error:', error);
      throw error;
    }
  }

  // Mark message as read
  async markAsRead(id: string): Promise<{ success: boolean; data: Message }> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}/read`);
      return response.data;
    } catch (error) {
      console.error('Mark message as read error:', error);
      throw error;
    }
  }

  // Mark all messages as read
  async markAllAsRead(): Promise<{ success: boolean; data: { modifiedCount: number } }> {
    try {
      const response = await api.put(`${this.baseUrl}/read-all`);
      return response.data;
    } catch (error) {
      console.error('Mark all messages as read error:', error);
      throw error;
    }
  }

  // Update message status
  async updateMessageStatus(id: string, status: string): Promise<{ success: boolean; data: Message }> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update message status error:', error);
      throw error;
    }
  }

  // Delete message
  async deleteMessage(id: string): Promise<{ success: boolean }> {
    try {
      const response = await api.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete message error:', error);
      throw error;
    }
  }

  // Send customer message (public endpoint)
  async sendCustomerMessage(data: {
    senderName: string;
    senderEmail: string;
    subject: string;
    content: string;
    category?: string;
    priority?: string;
    relatedOrder?: string;
    relatedProduct?: string;
  }): Promise<{ success: boolean; data: { messageId: string; status: string } }> {
    try {
      const response = await api.post(`${this.baseUrl}/receive`, data);
      return response.data;
    } catch (error) {
      console.error('Send customer message error:', error);
      throw error;
    }
  }

  // Get unread count (helper method)
  async getUnreadCount(): Promise<number> {
    try {
      const response = await this.getMessages({ filter: 'unread', limit: 1 });
      return response.data.unreadCount;
    } catch (error) {
      console.error('Get unread count error:', error);
      return 0;
    }
  }
}

export const messageApi = new MessageAPI();