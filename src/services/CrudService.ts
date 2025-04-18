
import { CrudOperations, StorageAdapter, StorageAdapterConfig, StorageAdapterFactory } from "@/types/crud";

/**
 * Serviço CRUD genérico que utiliza o adaptador de armazenamento adequado
 */
export class CrudService<T extends Record<string, any>> implements CrudOperations<T> {
  private adapter: StorageAdapter<T>;

  constructor(
    factory: StorageAdapterFactory,
    config: StorageAdapterConfig
  ) {
    this.adapter = factory.createAdapter<T>(config);
  }

  async getAll(): Promise<T[]> {
    return this.adapter.getAll();
  }

  async getById(id: string): Promise<T | null> {
    return this.adapter.getById(id);
  }

  async create(item: Omit<T, 'id'>): Promise<T | null> {
    return this.adapter.create(item);
  }

  async update(id: string, item: Partial<T>): Promise<T | null> {
    return this.adapter.update(id, item);
  }

  async delete(id: string): Promise<boolean> {
    return this.adapter.delete(id);
  }
}

// Factory function para criar serviços CRUD
export const createCrudService = <T extends Record<string, any>>(
  factory: StorageAdapterFactory,
  config: StorageAdapterConfig
): CrudOperations<T> => {
  return new CrudService<T>(factory, config);
};
