import { CONFIG } from '@/utils/config';

export interface NotificationItem {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

class NotificationsApi {
  private baseURL: string;

  constructor() {
    this.baseURL = CONFIG.API.BASE_URL;
  }

  private async request<T>(endpoint: string, token: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(errorBody.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async findAll(token: string): Promise<NotificationItem[]> {
    return this.request<NotificationItem[]>('/notifications', token);
  }

  async getUnreadCount(token: string): Promise<number> {
    return this.request<number>('/notifications/unread-count', token);
  }

  async markAsRead(token: string, id: string): Promise<NotificationItem> {
    return this.request<NotificationItem>(`/notifications/${id}/read`, token, { method: 'PUT' });
  }

  async markAllAsRead(token: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/notifications/read-all', token, { method: 'PUT' });
  }
}

export const notificationsApi = new NotificationsApi();
