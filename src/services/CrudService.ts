
import { CrudOperations, StorageAdapter, StorageAdapterConfig, StorageAdapterFactory, PaginatedResponse } from "@/types/crud";
import { authService } from './authService';

/**
 * Serviço CRUD genérico que utiliza o adaptador de armazenamento adequado
 */
export class CrudService<T extends Record<string, any>> implements CrudOperations<T> {
  private adapter: StorageAdapter<T>;
  private adapterType: string;

  constructor(
    factory: StorageAdapterFactory,
    config: StorageAdapterConfig
  ) {
    this.adapter = factory.createAdapter<T>(config);
    this.adapterType = factory.getCurrentStorageType();
  }

  private getAuthHeaders(): HeadersInit {
    const token = authService.getToken();
    return token ? {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  }

  async getAll(page?: number, limit?: number): Promise<PaginatedResponse<T>> {
    if (this.adapterType === 'apiRest') {
      const headers = this.getAuthHeaders();
      return this.adapter.getAll(page, limit, headers);
    }
    
    return this.adapter.getAll(page, limit);
  }

  async getById(id: string): Promise<T | null> {

    if (this.adapterType === 'apiRest') {
      const headers = this.getAuthHeaders();
      return this.adapter.getById(id, headers);
    }
    
    return this.adapter.getById(id);
  }

  async create(item: Omit<T, 'id'>): Promise<T | null> {

    if (this.adapterType === 'apiRest') {
      const headers = this.getAuthHeaders();
      return this.adapter.create(item, headers);
    }
    
    return this.adapter.create(item);
  }

  async update(id: string, item: Partial<T>): Promise<T | null> {

    if (this.adapterType === 'apiRest') {
      const headers = this.getAuthHeaders();
      return this.adapter.update(id, item, headers);
    }
    
    return this.adapter.update(id, item);
  }

  async delete(id: string): Promise<boolean> {

    if (this.adapterType === 'apiRest') {
      const headers = this.getAuthHeaders();
      return this.adapter.delete(id, headers);
    }
    
    return this.adapter.delete(id);
  }
}

// Factory function to create CRUD services
export const createCrudService = <T extends Record<string, any>>(
  factory: StorageAdapterFactory,
  config: StorageAdapterConfig
): CrudOperations<T> => {
  const service = new CrudService<T>(factory, config);
  
  return {
    getAll: (page?: number, limit?: number) => service.getAll(page, limit),
    getById: (id: string) => service.getById(id),
    create: (item: Omit<T, 'id'>) => service.create(item),
    update: (id: string, item: Partial<T>) => service.update(id, item),
    delete: (id: string) => service.delete(id)
  };
};
