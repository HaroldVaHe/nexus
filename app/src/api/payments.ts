import { CONFIG } from '@/utils/config';

export interface CreatePreferenceResponse {
  checkout_url: string;
  sandbox_url: string;
  preference_id: string;
}

export interface VerifyPaymentResponse {
  payment_status: 'pending' | 'success' | 'failed' | 'refunded';
  paid_at: string | null;
}

class PaymentsApi {
  private baseURL: string;

  constructor() {
    this.baseURL = CONFIG.API.BASE_URL;
  }

  private async request<T>(endpoint: string, token: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
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

  async createPreference(token: string, bookingId: string): Promise<CreatePreferenceResponse> {
    return this.request<CreatePreferenceResponse>('/payments/create-preference', token, {
      method: 'POST',
      body: JSON.stringify({ booking_id: bookingId }),
    });
  }

  async verifyPayment(token: string, payload: {
    external_reference: string;
    preference_id?: string;
    collection_status?: string;
  }): Promise<VerifyPaymentResponse> {
    return this.request<VerifyPaymentResponse>('/payments/verify', token, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const paymentsApi = new PaymentsApi();
