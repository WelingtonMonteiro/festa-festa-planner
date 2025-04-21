
import { LocalStorageAdapterConfig, StorageAdapter, PaginatedResponse } from "@/types/crud";

export class LocalStorageAdapter<T extends { id?: string }> implements StorageAdapter<T> {
  private storageKey: string;
  private mockData: any[];
  private idField: string;

  constructor(config: LocalStorageAdapterConfig) {
    this.storageKey = config.storageKey;
    this.mockData = config.mockData || [];
    this.idField = config.idField || 'id';
  }

  async getAll(page: number = 1, limit: number = 10, headers?: HeadersInit): Promise<PaginatedResponse<T>> {
    try {
      // Headers não são usados no localStorage, mas mantidos na assinatura para compatibilidade
      const dataStr = localStorage.getItem(this.storageKey);
      let allItems: T[] = [];
      
      if (dataStr) {
        allItems = JSON.parse(dataStr);
      } else {
        allItems = this.mockData as T[];
      }
      
      // Implement pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedItems = allItems.slice(startIndex, endIndex);
      
      return {
        data: paginatedItems,
        total: allItems.length,
        page,
        limit
      };
    } catch (error) {
      console.error(`Error fetching data from localStorage (${this.storageKey}):`, error);
      return {
        data: this.mockData as T[],
        total: this.mockData.length,
        page,
        limit
      };
    }
  }

  async getById(id: string, headers?: HeadersInit): Promise<T | null> {
    try {
      // Headers não são usados no localStorage, mas mantidos na assinatura para compatibilidade
      const response = await this.getAll();
      return response.data.find(item => (item as any)[this.idField] === id) || null;
    } catch (error) {
      console.error(`Error fetching item by ID from localStorage (${this.storageKey}):`, error);
      return null;
    }
  }

  async create(item: Omit<T, 'id'>, headers?: HeadersInit): Promise<T | null> {
    try {
      // Headers não são usados no localStorage, mas mantidos na assinatura para compatibilidade
      const response = await this.getAll();
      const items = response.data;
      const newItem = {
        ...item,
        id: `id_${Date.now().toString()}`, // Gera ID simples
        created_at: new Date().toISOString()
      } as unknown as T;

      const updatedItems = [...items, newItem];
      localStorage.setItem(this.storageKey, JSON.stringify(updatedItems));
      return newItem;
    } catch (error) {
      console.error(`Error creating item in localStorage (${this.storageKey}):`, error);
      return null;
    }
  }

  async update(id: string, item: Partial<T>, headers?: HeadersInit): Promise<T | null> {
    try {
      // Headers não são usados no localStorage, mas mantidos na assinatura para compatibilidade
      const response = await this.getAll();
      const items = response.data;
      let updated: T | null = null;

      const updatedItems = items.map(existingItem => {
        if ((existingItem as any)[this.idField] === id) {
          updated = { 
            ...existingItem, 
            ...item, 
            updated_at: new Date().toISOString() 
          } as T;
          return updated;
        }
        return existingItem;
      });

      if (updated) {
        localStorage.setItem(this.storageKey, JSON.stringify(updatedItems));
        return updated;
      }
      
      return null;
    } catch (error) {
      console.error(`Error updating item in localStorage (${this.storageKey}):`, error);
      return null;
    }
  }

  async delete(id: string, headers?: HeadersInit): Promise<boolean> {
    try {
      // Headers não são usados no localStorage, mas mantidos na assinatura para compatibilidade
      const response = await this.getAll();
      const items = response.data;
      const filteredItems = items.filter(item => (item as any)[this.idField] !== id);
      
      if (items.length !== filteredItems.length) {
        localStorage.setItem(this.storageKey, JSON.stringify(filteredItems));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error deleting item from localStorage (${this.storageKey}):`, error);
      return false;
    }
  }
}
