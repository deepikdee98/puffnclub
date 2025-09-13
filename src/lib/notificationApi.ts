import api from './api';

export interface Notification {
  id: string;
  type: 'order' | 'payment' | 'stock' | 'system' | 'info';
  title: string;
  message: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
  timestamp: string;
  relatedId?: string;
  relatedModel?: string;
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  filter?: 'all' | 'read' | 'unread';
  type?: 'all' | 'order' | 'payment' | 'stock' | 'system' | 'info';
  priority?: 'all' | 'high' | 'medium' | 'low';
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface NotificationResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    unreadCount: number;
  };
}

export interface NotificationStats {
  success: boolean;
  data: {
    overview: {
      total: number;
      unread: number;
      high: number;
      medium: number;
      low: number;
    };
    byType: Array<{
      _id: string;
      count: number;
      unread: number;
    }>;
  };
}

class NotificationAPI {
  private baseUrl = '/notifications';

  // Get all notifications with filters
  async getNotifications(filters: NotificationFilters = {}): Promise<NotificationResponse> {
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
      console.error('Get notifications error:', error);
      throw error;
    }
  }

  // Get notification statistics
  async getNotificationStats(): Promise<NotificationStats> {
    try {
      const response = await api.get(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error) {
      console.error('Get notification stats error:', error);
      throw error;
    }
  }

  // Create new notification
  async createNotification(data: {
    type: string;
    title: string;
    message: string;
    priority?: string;
    actionUrl?: string;
    relatedId?: string;
    relatedModel?: string;
  }): Promise<{ success: boolean; data: Notification }> {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(id: string): Promise<{ success: boolean; data: Notification }> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}/read`);
      return response.data;
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<{ success: boolean; data: { modifiedCount: number } }> {
    try {
      const response = await api.put(`${this.baseUrl}/read-all`);
      return response.data;
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      throw error;
    }
  }

  // Delete notification
  async deleteNotification(id: string): Promise<{ success: boolean }> {
    try {
      const response = await api.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  }

  // Get unread count (helper method)
  async getUnreadCount(): Promise<number> {
    try {
      const response = await this.getNotifications({ filter: 'unread', limit: 1 });
      return response.data.unreadCount;
    } catch (error) {
      console.error('Get unread count error:', error);
      return 0;
    }
  }
}

export const notificationApi = new NotificationAPI();