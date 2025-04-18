
import { LocalStorageAdapterConfig, StorageAdapter } from "@/types/crud";

export class LocalStorageAdapter<T extends { id?: string }> implements StorageAdapter<T> {
  private storageKey: string;
  private mockData: any[];
  private idField: string;

  constructor(config: LocalStorageAdapterConfig) {
    this.storageKey = config.storageKey;
    this.mockData = config.mockData || [];
    this.idField = config.idField || 'id';
  }

  async getAll(): Promise<T[]> {
    try {
      const dataStr = localStorage.getItem(this.storageKey);
      if (dataStr) {
        return JSON.parse(dataStr);
      }
      return this.mockData as T[];
    } catch (error) {
      console.error(`Error fetching data from localStorage (${this.storageKey}):`, error);
      return this.mockData as T[];
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      const items = await this.getAll();
      return items.find(item => (item as any)[this.idField] === id) || null;
    } catch (error) {
      console.error(`Error fetching item by ID from localStorage (${this.storageKey}):`, error);
      return null;
    }
  }

  async create(item: Omit<T, 'id'>): Promise<T | null> {
    try {
      const items = await this.getAll();
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

  async update(id: string, item: Partial<T>): Promise<T | null> {
    try {
      const items = await this.getAll();
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

  async delete(id: string): Promise<boolean> {
    try {
      const items = await this.getAll();
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
