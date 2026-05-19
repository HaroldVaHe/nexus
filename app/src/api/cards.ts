import { CONFIG } from '@/utils/config';

export interface SavedCard {
  id: string;
  brand: string;
  last_four: string;
  exp_month: number;
  exp_year: number;
  cardholder_name: string;
  is_default: boolean;
  created_at: string;
}

interface CreateCardPayload {
  brand: string;
  last_four: string;
  exp_month: number;
  exp_year: number;
  cardholder_name: string;
  is_default?: boolean;
}

interface UpdateCardPayload {
  exp_month?: number;
  exp_year?: number;
  cardholder_name?: string;
  is_default?: boolean;
}

class CardsApi {
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

  async getMyCards(token: string): Promise<SavedCard[]> {
    return this.request<SavedCard[]>('/cards', token);
  }

  async createCard(token: string, payload: CreateCardPayload): Promise<SavedCard> {
    return this.request<SavedCard>('/cards', token, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateCard(token: string, id: string, payload: UpdateCardPayload): Promise<SavedCard> {
    return this.request<SavedCard>(`/cards/${id}`, token, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteCard(token: string, id: string): Promise<void> {
    await this.request<void>(`/cards/${id}`, token, { method: 'DELETE' });
  }
}

export const cardsApi = new CardsApi();
