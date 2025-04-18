
import { ApiRestAdapterConfig, StorageAdapter, PaginatedResponse } from "@/types/crud";
import { toast } from "sonner";

export class ApiRestAdapter<T extends Record<string, any>> implements StorageAdapter<T> {
  private apiUrl: string;
  private endpoint: string;
  private baseUrl: string;

  constructor(config: ApiRestAdapterConfig) {
    this.apiUrl = config.apiUrl;
    this.endpoint = config.endpoint;
    this.baseUrl = `${this.apiUrl}/${this.endpoint}`;
    console.log(`ApiRestAdapter inicializado com baseUrl: ${this.baseUrl}`);
  }

  // Função auxiliar para normalizar IDs (_id -> id) para compatibilidade
  private normalizeId(item: any): any {
    if (!item) return item;
    
    // Se for um array, normaliza cada item
    if (Array.isArray(item)) {
      return item.map(i => this.normalizeId(i));
    }
    
    // Se for um objeto único
    if (item._id && !item.id) {
      const normalized = { ...item, id: item._id };
      console.log(`ID normalizado de _id para id: ${item._id}`);
      return normalized;
    }
    
    return item;
  }

  // Função para obter o ID real (id ou _id) de um objeto
  private getActualId(item: any, id: string): string {
    if (item && item._id) {
      console.log(`Usando _id (${item._id}) em vez de id (${id})`);
      return item._id;
    }
    console.log(`Usando id padrão: ${id}`);
    return id;
  }

  async getAll(page: number = 1, limit: number = 10): Promise<PaginatedResponse<T>> {
    try {
      // Add query parameters for pagination
      const url = new URL(this.baseUrl);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', limit.toString());
      
      console.log(`Fazendo requisição GET para ${url.toString()}`);
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Dados recebidos da API:`, data);
      
      // Check if the response is already in PaginatedResponse format
      if (data && typeof data === 'object' && 'data' in data) {
        // The API already returns paginated data
        const normalizedData = this.normalizeId(data.data);
        return {
          data: normalizedData,
          total: data.total || normalizedData.length,
          page: data.page || page,
          limit: data.limit || limit
        };
      }
      
      // Normalize and return data in paginated format
      const normalizedData = this.normalizeId(data);
      return {
        data: normalizedData,
        total: normalizedData.length,
        page,
        limit
      };
    } catch (error) {
      console.error(`Falha ao buscar dados da API (${this.endpoint}):`, error);
      toast.error(`Falha ao carregar dados de ${this.endpoint}`);
      return {
        data: [],
        total: 0,
        page,
        limit
      };
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      console.log(`Fazendo requisição GET para ${this.baseUrl}/${id}`);
      const response = await fetch(`${this.baseUrl}/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Erro ao buscar item: ${response.statusText}`);
      }
      
      const data = await response.json();
      // Normaliza _id para id
      const normalizedData = this.normalizeId(data);
      return normalizedData as T;
    } catch (error) {
      console.error(`Falha ao buscar item da API (${this.endpoint}):`, error);
      toast.error(`Falha ao buscar dado de ${this.endpoint}`);
      return null;
    }
  }

  async create(item: Omit<T, 'id'>): Promise<T | null> {
    try {
      console.log(`Fazendo requisição POST para ${this.baseUrl}`, item);
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
      // Normaliza _id para id
      const normalizedData = this.normalizeId(data);
      return normalizedData as T;
    } catch (error) {
      console.error(`Falha ao criar item na API (${this.endpoint}):`, error);
      toast.error(`Falha ao criar item em ${this.endpoint}`);
      return null;
    }
  }

  async update(id: string, item: Partial<T>): Promise<T | null> {
    try {
      console.log(`Fazendo requisição PUT para ${this.baseUrl}/${id}`, item);
      
      // Primeiro obtém o objeto atual para obter o ID real (_id ou id)
      let currentItem = null;
      try {
        const currentResponse = await fetch(`${this.baseUrl}/${id}`);
        if (currentResponse.ok) {
          currentItem = await currentResponse.json();
        }
      } catch (e) {
        console.warn(`Não foi possível obter o item atual para verificar _id:`, e);
      }
      
      // Usa o ID atual (_id) se disponível
      const actualId = currentItem ? this.getActualId(currentItem, id) : id;
      
      const response = await fetch(`${this.baseUrl}/${actualId}`, {
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
      // Normaliza _id para id
      const normalizedData = this.normalizeId(data);
      return normalizedData as T;
    } catch (error) {
      console.error(`Falha ao atualizar item na API (${this.endpoint}):`, error);
      toast.error(`Falha ao atualizar item em ${this.endpoint}`);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      console.log(`Fazendo requisição DELETE para ${this.baseUrl}/${id}`);
      
      // Primeiro obtém o objeto atual para obter o ID real (_id ou id)
      let currentItem = null;
      try {
        const currentResponse = await fetch(`${this.baseUrl}/${id}`);
        if (currentResponse.ok) {
          currentItem = await currentResponse.json();
        }
      } catch (e) {
        console.warn(`Não foi possível obter o item atual para verificar _id:`, e);
      }
      
      // Usa o ID atual (_id) se disponível
      const actualId = currentItem ? this.getActualId(currentItem, id) : id;
      
      const response = await fetch(`${this.baseUrl}/${actualId}`, {
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
