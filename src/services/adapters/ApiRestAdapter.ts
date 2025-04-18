
import { ApiRestAdapterConfig, StorageAdapter } from "@/types/crud";
import { toast } from "sonner";

export class ApiRestAdapter<T extends Record<string, any>> implements StorageAdapter<T> {
  private apiUrl: string;
  private endpoint: string;
  private baseUrl: string;

  constructor(config: ApiRestAdapterConfig) {
    this.apiUrl = config.apiUrl;
    this.endpoint = config.endpoint;
    this.baseUrl = `${this.apiUrl}/${this.endpoint}`;
  }

  async getAll(): Promise<T[]> {
    try {
      const response = await fetch(this.baseUrl);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data as T[];
    } catch (error) {
      console.error(`Falha ao buscar dados da API (${this.endpoint}):`, error);
      toast.error(`Falha ao carregar dados de ${this.endpoint}`);
      return [];
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Erro ao buscar item: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error(`Falha ao buscar item da API (${this.endpoint}):`, error);
      toast.error(`Falha ao buscar dado de ${this.endpoint}`);
      return null;
    }
  }

  async create(item: Omit<T, 'id'>): Promise<T | null> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao criar item: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error(`Falha ao criar item na API (${this.endpoint}):`, error);
      toast.error(`Falha ao criar item em ${this.endpoint}`);
      return null;
    }
  }

  async update(id: string, item: Partial<T>): Promise<T | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao atualizar item: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error(`Falha ao atualizar item na API (${this.endpoint}):`, error);
      toast.error(`Falha ao atualizar item em ${this.endpoint}`);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao excluir item: ${response.statusText}`);
      }
      
      return true;
    } catch (error) {
      console.error(`Falha ao excluir item da API (${this.endpoint}):`, error);
      toast.error(`Falha ao remover item de ${this.endpoint}`);
      return false;
    }
  }
}
