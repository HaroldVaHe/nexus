import { CONFIG } from '@/utils/config';
import type { SabanaCoinsLedgerEntry } from '@/types';

class SabanaCoinsApi {
  private baseURL: string;

  constructor() {
    this.baseURL = CONFIG.API.BASE_URL;
  }

  private async request<T>(endpoint: string, token: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(errorBody.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getBalance(token: string): Promise<{ balance: number }> {
    return this.request<{ balance: number }>('/sabana-coins/balance', token);
  }

  async getLedger(token: string): Promise<SabanaCoinsLedgerEntry[]> {
    return this.request<SabanaCoinsLedgerEntry[]>('/sabana-coins/ledger', token);
  }
}

export const sabanaCoinsApi = new SabanaCoinsApi();
