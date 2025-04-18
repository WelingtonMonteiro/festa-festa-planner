
import { CrudOperations, StorageAdapter, StorageAdapterConfig, StorageAdapterFactory } from "@/types/crud";

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
    console.log(`CrudService criado com adaptador tipo: ${this.adapterType}`);
  }

  async getAll(): Promise<T[]> {
    console.log(`CrudService.getAll() chamado com adaptador: ${this.adapterType}`);
    return this.adapter.getAll();
  }

  async getById(id: string): Promise<T | null> {
    console.log(`CrudService.getById(${id}) chamado com adaptador: ${this.adapterType}`);
    return this.adapter.getById(id);
  }

  async create(item: Omit<T, 'id'>): Promise<T | null> {
    console.log(`CrudService.create() chamado com adaptador: ${this.adapterType}`, item);
    return this.adapter.create(item);
  }

  async update(id: string, item: Partial<T>): Promise<T | null> {
    console.log(`CrudService.update(${id}) chamado com adaptador: ${this.adapterType}`, item);
    return this.adapter.update(id, item);
  }

  async delete(id: string): Promise<boolean> {
    console.log(`CrudService.delete(${id}) chamado com adaptador: ${this.adapterType}`);
    return this.adapter.delete(id);
  }
}

// Factory function para criar serviços CRUD
export const createCrudService = <T extends Record<string, any>>(
  factory: StorageAdapterFactory,
  config: StorageAdapterConfig
): CrudOperations<T> => {
  const service = new CrudService<T>(factory, config);
  
  // Retornar os métodos do serviço explicitamente para garantir que eles sejam acessíveis
  return {
    getAll: () => service.getAll(),
    getById: (id: string) => service.getById(id),
    create: (item: Omit<T, 'id'>) => service.create(item),
    update: (id: string, item: Partial<T>) => service.update(id, item),
    delete: (id: string) => service.delete(id)
  };
};
