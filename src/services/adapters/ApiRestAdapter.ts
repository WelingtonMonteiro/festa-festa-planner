
import { StorageAdapter } from '@/types/crud';
import { toast } from 'sonner';

export class ApiRestAdapter<T extends Record<string, any>> implements StorageAdapter<T> {
  constructor(
    private apiUrl: string,
    private endpoint: string
  ) {}

  private async handleResponse(response: Response) {
    if (!response.ok) {
      if (response.status === 401) {
        toast.error('Sessão expirada. Por favor, faça login novamente.');
        // You might want to trigger a logout here
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getAll(page: number = 1, limit: number = 10, headers?: HeadersInit) {
    try {
      const response = await fetch(
        `${this.apiUrl}/${this.endpoint}?page=${page}&limit=${limit}`,
        { headers }
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async getById(id: string, headers?: HeadersInit) {
    try {
      const response = await fetch(
        `${this.apiUrl}/${this.endpoint}/${id}`,
        { headers }
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching item:', error);
      throw error;
    }
  }

  async create(item: Omit<T, 'id'>, headers?: HeadersInit) {
    try {
      const response = await fetch(
        `${this.apiUrl}/${this.endpoint}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(item)
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  }

  async update(id: string, item: Partial<T>, headers?: HeadersInit) {
    try {
      const response = await fetch(
        `${this.apiUrl}/${this.endpoint}/${id}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(item)
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }

  async delete(id: string, headers?: HeadersInit) {
    try {
      const response = await fetch(
        `${this.apiUrl}/${this.endpoint}/${id}`,
        {
          method: 'DELETE',
          headers
        }
      );
      return this.handleResponse(response).then(() => true);
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }
}
